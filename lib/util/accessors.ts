/// <reference path="../definitions/model/IModel.ts" />

export function relationFeatureOf(model: NajsEloquent.Model.IModel) {
  return model.getDriver().getRelationFeature()
}
