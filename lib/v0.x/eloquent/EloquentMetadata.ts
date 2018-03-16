import { EloquentBase } from './EloquentBase'

const DEFAULT_TIMESTAMPS: EloquentTimestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const DEFAULT_SOFT_DELETES: EloquentSoftDelete = {
  deletedAt: 'deleted_at',
  overrideMethods: false
}

export type EloquentTimestamps = { createdAt: string; updatedAt: string }

export type EloquentSoftDelete = {
  deletedAt: string
  overrideMethods: boolean | 'all' | string[]
}

export class EloquentMetadata {
  static getSettingProperty<T extends any>(eloquent: EloquentBase, property: string, defaultValue: T): T
  static getSettingProperty<T extends any>(eloquent: typeof EloquentBase, property: string, defaultValue: T): T
  static getSettingProperty<T extends any>(eloquent: any, property: string, defaultValue: T): T {
    if (eloquent instanceof EloquentBase) {
      const definition = Object.getPrototypeOf(eloquent).constructor
      if (definition[property]) {
        return definition[property]
      }
      return eloquent[property] ? eloquent[property] : defaultValue
    }

    if (eloquent[property]) {
      return eloquent[property]
    }
    const instance = Reflect.construct(eloquent, [])
    return instance[property] ? instance[property] : defaultValue
  }

  static fillable(eloquent: EloquentBase): string[]
  static fillable(eloquent: typeof EloquentBase): string[]
  static fillable(eloquent: EloquentBase | typeof EloquentBase): string[] {
    return this.getSettingProperty<string[]>(<any>eloquent, 'fillable', [])
  }

  static guarded(eloquent: EloquentBase): string[]
  static guarded(eloquent: typeof EloquentBase): string[]
  static guarded(eloquent: EloquentBase | typeof EloquentBase): string[] {
    return this.getSettingProperty<string[]>(<any>eloquent, 'guarded', ['*'])
  }

  private static hasSetting(eloquent: EloquentBase | typeof EloquentBase, property: string): boolean {
    const value = this.getSettingProperty<EloquentTimestamps | boolean>(<any>eloquent, property, false)
    return value !== false
  }

  private static getSettingWithTrueValue(
    eloquent: EloquentBase | typeof EloquentBase,
    property: string,
    defaultValue: any
  ): any {
    const value = this.getSettingProperty<EloquentTimestamps | boolean>(<any>eloquent, property, false)
    if (value === true) {
      return defaultValue
    }
    return value || defaultValue
  }

  static hasTimestamps(eloquent: EloquentBase): boolean
  static hasTimestamps(eloquent: typeof EloquentBase): boolean
  static hasTimestamps(eloquent: EloquentBase | typeof EloquentBase): boolean {
    return this.hasSetting(eloquent, 'timestamps')
  }

  static timestamps(eloquent: EloquentBase): EloquentTimestamps
  static timestamps(eloquent: typeof EloquentBase): EloquentTimestamps
  static timestamps(eloquent: EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps
  static timestamps(eloquent: typeof EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps
  static timestamps(
    eloquent: EloquentBase | typeof EloquentBase,
    defaultValue: EloquentTimestamps = DEFAULT_TIMESTAMPS
  ): EloquentTimestamps {
    return this.getSettingWithTrueValue(eloquent, 'timestamps', defaultValue)
  }

  static hasSoftDeletes(eloquent: EloquentBase): boolean
  static hasSoftDeletes(eloquent: typeof EloquentBase): boolean
  static hasSoftDeletes(eloquent: EloquentBase | typeof EloquentBase): boolean {
    return this.hasSetting(eloquent, 'softDeletes')
  }

  static softDeletes(eloquent: EloquentBase): EloquentSoftDelete
  static softDeletes(eloquent: typeof EloquentBase): EloquentSoftDelete
  static softDeletes(eloquent: EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete
  static softDeletes(eloquent: typeof EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete
  static softDeletes(
    eloquent: EloquentBase | typeof EloquentBase,
    defaultValue: EloquentSoftDelete = DEFAULT_SOFT_DELETES
  ): EloquentSoftDelete {
    return this.getSettingWithTrueValue(eloquent, 'softDeletes', defaultValue)
  }
}
