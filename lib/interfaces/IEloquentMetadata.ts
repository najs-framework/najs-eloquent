import { EloquentBase } from '../eloquent/EloquentBase'

export type EloquentTimestamps = { createdAt: string; updatedAt: string }

export type EloquentSoftDelete = {
  deletedAt: string
  overrideMethods: boolean | 'all' | string[]
}

export interface IEloquentMetadata {
  getSettingProperty<T extends any>(eloquent: EloquentBase, property: string, defaultValue: T): T
  getSettingProperty<T extends any>(eloquent: typeof EloquentBase, property: string, defaultValue: T): T

  fillable(eloquent: EloquentBase): string[]
  fillable(eloquent: typeof EloquentBase): string[]

  guarded(eloquent: EloquentBase): string[]
  guarded(eloquent: typeof EloquentBase): string[]

  timestamps(eloquent: EloquentBase): EloquentTimestamps
  timestamps(eloquent: typeof EloquentBase): EloquentTimestamps
  timestamps(eloquent: EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps
  timestamps(eloquent: typeof EloquentBase, defaultValue: EloquentTimestamps): EloquentTimestamps

  softDeletes(eloquent: EloquentBase): EloquentSoftDelete
  softDeletes(eloquent: typeof EloquentBase): EloquentSoftDelete
  softDeletes(eloquent: EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete
  softDeletes(eloquent: typeof EloquentBase, defaultValue: EloquentSoftDelete): EloquentSoftDelete
}
