/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelTimestamps.ts" />
import Model = NajsEloquent.Model.ModelInternal

export const TimestampsPublicApi: NajsEloquent.Model.IModelTimestamps = {
  touch(this: Model) {
    this.driver.getTimestampsFeature().touch(this)

    return this
  }
}
