import { make } from 'najs-binding'
import { Eloquent } from './Eloquent'
import { GET_FORWARD_TO_DRIVER_FUNCTIONS, GET_QUERY_FUNCTIONS } from './EloquentProxy'
import { isFunction, snakeCase } from 'lodash'

export type EloquentTimestamps = { createdAt: string; updatedAt: string }

export type EloquentSoftDelete = {
  deletedAt: string
  overrideMethods: boolean | 'all' | string[]
}

export type EloquentAccessors = {
  [key: string]: {
    name: string
    type: 'getter' | 'function' | string
    ref?: string
  }
}

export type EloquentMutators = {
  [key: string]: {
    name: string
    type: 'setter' | 'function' | string
    ref?: string
  }
}

const DEFAULT_TIMESTAMPS: EloquentTimestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const DEFAULT_SOFT_DELETES: EloquentSoftDelete = {
  deletedAt: 'deleted_at',
  overrideMethods: false
}

/**
 * This class contains all metadata parsing functions, such as:
 *   - fillable
 *   - guarded
 *   - timestamps
 *   - softDeletes
 *   - mutators
 *   - accessors
 * It's support cached in object to increase performance
 */
export class EloquentMetadata {
  protected model: Eloquent
  protected prototype: any
  protected definition: typeof Eloquent
  protected knownAttributes: string[]
  protected accessors: EloquentAccessors
  protected mutators: EloquentMutators

  private constructor(model: Eloquent) {
    this.model = model
    this.prototype = Object.getPrototypeOf(this.model)
    this.definition = Object.getPrototypeOf(model).constructor
    this.accessors = {}
    this.mutators = {}
    this.buildKnownAttributes()
    this.findGettersAndSetters()
    this.findAccessorsAndMutators()
  }

  protected buildKnownAttributes() {
    this.knownAttributes = Array.from(
      new Set(
        this.model['getReservedProperties']().concat(
          Object.getOwnPropertyNames(this.model),
          GET_FORWARD_TO_DRIVER_FUNCTIONS,
          GET_QUERY_FUNCTIONS,
          Object.getOwnPropertyNames(Eloquent.prototype),
          Object.getOwnPropertyNames(this.prototype)
        )
      )
    )
  }

  /**
   * Find accessors and mutators defined in getter/setter, only available for node >= 8.7
   */
  protected findGettersAndSetters() {
    const descriptors: Object = Object.getOwnPropertyDescriptors(this.prototype)
    for (const name in descriptors) {
      if (isFunction(descriptors[name].get)) {
        this.accessors[name] = {
          name: name,
          type: 'getter'
        }
      }
      if (isFunction(descriptors[name].set)) {
        this.mutators[name] = {
          name: name,
          type: 'setter'
        }
      }
    }
  }

  protected findAccessorsAndMutators() {
    const names = Object.getOwnPropertyNames(this.prototype)
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')
    names.forEach(name => {
      let match
      while ((match = regex.exec(name)) != undefined) {
        // javascript RegExp has a bug when the match has length 0
        // if (match.index === regex.lastIndex) {
        //   ++regex.lastIndex
        // }
        const property: string = snakeCase(match[2])
        const data = {
          name: property,
          type: 'function',
          ref: <string>match[0]
        }
        if (match[1] === 'get' && typeof this.accessors[property] === 'undefined') {
          this.accessors[property] = data
        }
        if (match[1] === 'set' && typeof this.mutators[property] === 'undefined') {
          this.mutators[property] = data
        }
      }
    })
  }

  getSettingProperty<T extends any>(property: string, defaultValue: T): T {
    if (this.definition[property]) {
      return this.definition[property]
    }
    return this.model[property] ? this.model[property] : defaultValue
  }

  hasSetting(property: string): boolean {
    return !!this.getSettingProperty(property, false)
  }

  getSettingWithDefaultForTrueValue(property: string, defaultValue: any): any {
    const value = this.getSettingProperty<any | boolean>(property, false)
    if (value === true) {
      return defaultValue
    }
    return value || defaultValue
  }

  fillable(): string[] {
    return this.getSettingProperty<string[]>('fillable', [])
  }

  guarded(): string[] {
    return this.getSettingProperty<string[]>('guarded', ['*'])
  }

  hasTimestamps(): boolean {
    return this.hasSetting('timestamps')
  }

  timestamps(defaultValue: EloquentTimestamps = DEFAULT_TIMESTAMPS): EloquentTimestamps {
    return this.getSettingWithDefaultForTrueValue('timestamps', defaultValue)
  }

  hasSoftDeletes(): boolean {
    return this.hasSetting('softDeletes')
  }

  softDeletes(defaultValue: EloquentSoftDelete = DEFAULT_SOFT_DELETES): EloquentSoftDelete {
    return this.getSettingWithDefaultForTrueValue('softDeletes', defaultValue)
  }

  hasAttribute(name: string | Symbol) {
    if (typeof name === 'symbol') {
      return true
    }
    return this.knownAttributes.indexOf(name as string) !== -1
  }

  /**
   * store EloquentMetadata instance with "sample" model
   */
  protected static cached: Object = {}

  /**
   * get metadata of Eloquent class, it's cached
   */
  static get(model: Eloquent): EloquentMetadata
  static get(model: Eloquent, cache: boolean): EloquentMetadata
  static get(model: Eloquent, cache: boolean = true): EloquentMetadata {
    const className = model.getClassName()
    if (!this.cached[className] || !cache) {
      this.cached[className] = new EloquentMetadata(make(className, ['do-not-initialize']))
    }
    return this.cached[className]
  }
}
