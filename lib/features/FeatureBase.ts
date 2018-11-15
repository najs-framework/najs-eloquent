/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ISettingFeature.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />
/// <reference path="../definitions/features/IRecordManager.ts" />
/// <reference path="../definitions/features/ISerializationFeature.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.ts" />
/// <reference path="../definitions/features/IRelationFeature.ts" />

export abstract class FeatureBase {
  abstract getPublicApi(): object | undefined

  attachPublicApi(prototype: object, bases: object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    const publicApi = this.getPublicApi()
    if (publicApi) {
      Object.assign(prototype, publicApi)
    }
  }

  useInternalOf(model: NajsEloquent.Model.IModel): NajsEloquent.Model.ModelInternal {
    return model as NajsEloquent.Model.ModelInternal
  }

  useSettingFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISettingFeature {
    return model.getDriver().getSettingFeature()
  }

  useRecordManagerOf<T>(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IRecordManager<T> {
    return model.getDriver<T>().getRecordManager()
  }

  useFillableFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IFillableFeature {
    return model.getDriver().getFillableFeature()
  }

  useSerializationFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISerializationFeature {
    return model.getDriver().getSerializationFeature()
  }

  useTimestampsFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ITimestampsFeature {
    return model.getDriver().getTimestampsFeature()
  }

  useSoftDeletesFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISoftDeletesFeature {
    return model.getDriver().getSoftDeletesFeature()
  }

  useRelationFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IRelationFeature {
    return model.getDriver().getRelationFeature()
  }
}
