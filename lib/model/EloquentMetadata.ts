import { make } from 'najs-binding'
import { Eloquent } from './Eloquent'
import { EloquentAttribute } from './EloquentAttribute'

export type EloquentTimestamps = { createdAt: string; updatedAt: string }

export type EloquentSoftDelete = {
  deletedAt: string
  overrideMethods: boolean | 'all' | string[]
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
  protected attribute: EloquentAttribute

  private constructor(model: Eloquent) {
    this.model = model
    this.prototype = Object.getPrototypeOf(this.model)
    this.definition = Object.getPrototypeOf(model).constructor
    this.attribute = new EloquentAttribute(model, this.prototype)
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

  visible(): string[] {
    return this.getSettingProperty<string[]>('visible', [])
  }

  hidden(): string[] {
    return this.getSettingProperty<string[]>('hidden', [])
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
    return this.attribute.isKnownAttribute(name)
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
