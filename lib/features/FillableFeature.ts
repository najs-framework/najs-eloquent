/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IFillableFeature.ts" />

import { pick } from 'lodash'
import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { FillablePublicApi } from './mixin/FillablePublicApi'
import { NajsEloquent } from '../constants'
import { override_setting_property_of_model } from '../util/functions'

export class FillableFeature extends FeatureBase implements NajsEloquent.Feature.IFillableFeature {
  getPublicApi(): object {
    return FillablePublicApi
  }

  getFeatureName(): string {
    return 'Fillable'
  }

  getClassName(): string {
    return NajsEloquent.Feature.FillableFeature
  }

  getFillable(model: NajsEloquent.Model.IModel): string[] {
    const iModel = this.useInternalOf(model)
    if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.fillable) {
      return model['fillable']!
    }
    return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'fillable', [])
  }

  setFillable(model: NajsEloquent.Model.IModel, fillable: string[]): void {
    override_setting_property_of_model(model, 'fillable', fillable)
  }

  addFillable(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): void {
    return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'fillable', keys)
  }

  isFillable(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): boolean {
    return this.useSettingFeatureOf(model).isInWhiteList(model, keys, this.getFillable(model), this.getGuarded(model))
  }

  getGuarded(model: NajsEloquent.Model.IModel): string[] {
    const iModel = this.useInternalOf(model)
    if (typeof iModel.internalData.overridden !== 'undefined' && iModel.internalData.overridden.guarded) {
      return model['guarded']!
    }
    return this.useSettingFeatureOf(model).getArrayUniqueSetting(model, 'guarded', ['*'])
  }

  setGuarded(model: NajsEloquent.Model.IModel, guarded: string[]): void {
    override_setting_property_of_model(model, 'guarded', guarded)
  }

  addGuarded(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): void {
    return this.useSettingFeatureOf(model).pushToUniqueArraySetting(model, 'guarded', keys)
  }

  isGuarded(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): boolean {
    return this.useSettingFeatureOf(model).isInBlackList(model, keys, this.getGuarded(model))
  }

  fill(model: NajsEloquent.Model.IModel, data: object): void {
    const fillable = this.getFillable(model)
    const guarded = this.getGuarded(model)

    const attributes = fillable.length > 0 ? pick(data, fillable) : data
    const settingFeature = this.useSettingFeatureOf(model)
    const recordManager = this.useRecordManagerOf(model)

    for (const key in attributes) {
      if (settingFeature.isKeyInWhiteList(model, key, fillable, guarded)) {
        recordManager.setAttribute(model, key, attributes[key])
      }
    }
  }

  forceFill(model: NajsEloquent.Model.IModel, data: object): void {
    const recordManager = model.getDriver().getRecordManager()
    for (const key in data) {
      recordManager.setAttribute(model, key, data[key])
    }
  }
}
register(FillableFeature, NajsEloquent.Feature.FillableFeature)
