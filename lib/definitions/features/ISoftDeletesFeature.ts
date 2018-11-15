/// <reference path="IFeature.ts" />

namespace NajsEloquent.Feature {
  export interface ISoftDeletesSetting {
    deletedAt: string
    overrideMethods: boolean | 'all' | string
  }

  export interface ISoftDeletesFeature extends IFeature {
    /**
     * Determine the model is using soft delete or not.
     *
     * @param {Model} model
     */
    hasSoftDeletes(model: Model.IModel): boolean

    /**
     * Get soft delete setting.
     *
     * Note: It's returns default soft delete even the model is not using soft delete.
     *
     * @param {Model} model
     */
    getSoftDeletesSetting(model: Model.IModel): ISoftDeletesSetting

    /**
     * Determine model is soft-deleted or not.
     *
     * @param {Model} model
     */
    trashed(model: Model.IModel): boolean

    /**
     * Delete the model even soft delete is enabled.
     *
     * @param {Model} model
     */
    forceDelete(model: Model.IModel): Promise<boolean>

    /**
     * Restore the model, only applied for model which has soft delete setting is enabled.
     *
     * @param {Model} model
     */
    restore(model: Model.IModel): Promise<boolean>
  }
}
