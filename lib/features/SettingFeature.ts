/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/ISettingFeature.ts" />

import { register } from 'najs-binding'
import { flatten } from 'lodash'
import { SettingType } from '../util/SettingType'
import { ClassSetting } from '../util/ClassSetting'
import { array_unique } from '../util/functions'
import { NajsEloquent } from '../constants'
import { FeatureBase } from './FeatureBase'

export class SettingFeature extends FeatureBase implements NajsEloquent.Feature.ISettingFeature {
  getPublicApi() {
    return undefined
  }

  getFeatureName(): string {
    return 'Setting'
  }

  getClassName(): string {
    return NajsEloquent.Feature.SettingFeature
  }

  getClassSetting(model: NajsEloquent.Model.IModel): NajsEloquent.Util.IClassSetting {
    const internalModel = this.useInternalOf(model)
    if (!internalModel.internalData.classSettings) {
      internalModel.internalData.classSettings = ClassSetting.of(model)
    }

    return internalModel.internalData.classSettings
  }

  getSettingProperty<T>(model: NajsEloquent.Model.IModel, property: string, defaultValue: T): T {
    return this.getClassSetting(model).read(property, function(staticVersion?: any, sampleVersion?: any) {
      if (staticVersion) {
        return staticVersion
      }
      return typeof sampleVersion !== 'undefined' ? sampleVersion : defaultValue
    })
  }

  hasSetting(model: NajsEloquent.Model.IModel, property: string): boolean {
    return !!this.getSettingProperty(model, property, false)
  }

  getSettingWithDefaultForTrueValue<T>(model: NajsEloquent.Model.IModel, property: string, defaultValue: T): T {
    const value = this.getSettingProperty<any | boolean>(model, property, defaultValue)
    return value === true ? defaultValue : value
  }

  getArrayUniqueSetting(model: NajsEloquent.Model.IModel, property: string, defaultValue: string[]): string[] {
    return this.getClassSetting(model).read(property, SettingType.arrayUnique([], defaultValue))
  }

  pushToUniqueArraySetting(model: NajsEloquent.Model.IModel, property: string, args: ArrayLike<any>): void {
    const setting: string[] = model[property] || []
    model[property] = array_unique(setting, flatten(args))
  }

  isInWhiteList(
    model: NajsEloquent.Model.IModel,
    keyList: ArrayLike<any>,
    whiteList: string[],
    blackList: string[]
  ): boolean {
    const keys = flatten(keyList)
    for (const key of keys) {
      if (!this.isKeyInWhiteList(model, key, whiteList, blackList)) {
        return false
      }
    }
    return true
  }

  isKeyInWhiteList(model: NajsEloquent.Model.IModel, key: string, whiteList: string[], blackList: string[]): boolean {
    if (whiteList.length > 0 && whiteList.indexOf(key) !== -1) {
      return true
    }

    if (this.isKeyInBlackList(model, key, blackList)) {
      return false
    }

    const knownAttributes: string[] = model
      .getDriver()
      .getRecordManager()
      .getKnownAttributes(model)

    return whiteList.length === 0 && knownAttributes.indexOf(key) === -1 && key.indexOf('_') !== 0
  }

  isInBlackList(model: NajsEloquent.Model.IModel, list: ArrayLike<any>, blackList: string[]): boolean {
    if (blackList.length === 1 && blackList[0] === '*') {
      return true
    }
    const keys = flatten(list)
    for (const key of keys) {
      if (blackList.indexOf(key) === -1) {
        return false
      }
    }
    return true
  }

  isKeyInBlackList(model: NajsEloquent.Model.IModel, key: any, blackList: string[]): boolean {
    return (blackList.length === 1 && blackList[0] === '*') || blackList.indexOf(key) !== -1
  }
}
register(SettingFeature, NajsEloquent.Feature.SettingFeature)
