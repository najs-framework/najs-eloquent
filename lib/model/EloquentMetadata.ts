import { Eloquent } from './Eloquent'
import { make } from 'najs-binding'

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
  protected definition: typeof Eloquent
  protected model: Eloquent
  protected knownAttributes: string[]

  private constructor(model: Eloquent) {
    this.model = model
    this.definition = Object.getPrototypeOf(model).constructor
    this.knownAttributes = []
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

  protected getSettingProperty<T extends any>(property: string, defaultValue: T): T {
    if (this.definition[property]) {
      return this.definition[property]
    }
    return this.model[property] ? this.model[property] : defaultValue
  }

  protected hasSetting(property: string): boolean {
    const value = this.getSettingProperty(property, false)
    return value !== false
  }

  protected getSettingWithTrueValue(property: string, defaultValue: any): any {
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
    return this.getSettingWithTrueValue('timestamps', defaultValue)
  }

  hasSoftDeletes(): boolean {
    return this.hasSetting('timestamps')
  }

  softDeletes(defaultValue: EloquentSoftDelete = DEFAULT_SOFT_DELETES): EloquentSoftDelete {
    return this.getSettingWithTrueValue('softDeletes', defaultValue)
  }

  hasAttribute(name: string | Symbol) {
    if (typeof name === 'symbol') {
      return false
    }
    return this.knownAttributes.indexOf(name as string) === -1
  }
}
