/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelSoftDeletes.ts" />
import Model = NajsEloquent.Model.ModelInternal

export const SoftDeletesPublicApi: NajsEloquent.Model.IModelSoftDeletes = {
  trashed(this: Model): boolean {
    return this.driver.getSoftDeletesFeature().trashed(this)
  },

  forceDelete(this: Model): Promise<boolean> {
    return this.driver.getSoftDeletesFeature().forceDelete(this)
  },

  restore(this: Model): Promise<boolean> {
    return this.driver.getSoftDeletesFeature().restore(this)
  }
}
