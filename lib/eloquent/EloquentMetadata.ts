import { IEloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from '../interfaces/IEloquentMetadata'
import { EloquentBase } from './EloquentBase'

const DEFAULT_TIMESTAMPS: EloquentTimestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const DEFAULT_SOFT_DELETES: EloquentSoftDelete = {
  deletedAt: 'deleted_at',
  overrideMethods: false
}

export const EloquentMetadata: IEloquentMetadata = {
  getSettingProperty<T extends any>(eloquent: any, property: string, defaultValue: T): T {
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
  },

  fillable(eloquent: EloquentBase | typeof EloquentBase): string[] {
    return this.getSettingProperty<string[]>(<any>eloquent, 'fillable', [])
  },

  guarded(eloquent: EloquentBase | typeof EloquentBase): string[] {
    return this.getSettingProperty<string[]>(<any>eloquent, 'guarded', ['*'])
  },

  timestamps(
    eloquent: EloquentBase | typeof EloquentBase,
    defaultValue: EloquentTimestamps = DEFAULT_TIMESTAMPS
  ): EloquentTimestamps {
    return this.getSettingProperty<EloquentTimestamps>(<any>eloquent, 'timestamps', defaultValue)
  },

  softDeletes(
    eloquent: EloquentBase | typeof EloquentBase,
    defaultValue: EloquentSoftDelete = DEFAULT_SOFT_DELETES
  ): EloquentSoftDelete {
    return this.getSettingProperty<EloquentSoftDelete>(<any>eloquent, 'softDeletes', defaultValue)
  }
}
