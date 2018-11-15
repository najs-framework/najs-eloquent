/// <reference path="../features/ISoftDeletesFeature.ts" />

namespace NajsEloquent.Model {
  export declare class IModelSoftDeletes {
    /**
     * Soft deletes setting
     */
    protected softDeletes?: Feature.ISoftDeletesSetting | boolean
  }

  export interface IModelSoftDeletes {
    /**
     * Determine model is soft-deleted or not.
     */
    trashed(): boolean

    /**
     * Delete the model even soft delete is enabled.
     */
    forceDelete(): Promise<boolean>

    /**
     * Restore the model, only applied for model which has soft delete setting is enabled.
     */
    restore(): Promise<boolean>
  }
}
