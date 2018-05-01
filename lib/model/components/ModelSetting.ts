/// <reference path="../interfaces/IModel.ts" />

import { SettingType } from '../../util/SettingType'
import { ClassSetting } from '../../util/ClassSetting'
import { NajsEloquent } from '../../constants'
import { array_unique } from '../../util/functions'
import { flatten } from 'lodash'
import { register } from 'najs-binding'

export class ModelSetting implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelSetting
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelSetting
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['getClassSetting'] = ModelSetting.getClassSetting
    prototype['getSettingProperty'] = ModelSetting.getSettingProperty
    prototype['hasSetting'] = ModelSetting.hasSetting
    prototype['getSettingWithDefaultForTrueValue'] = ModelSetting.getSettingWithDefaultForTrueValue
    prototype['getArrayUniqueSetting'] = ModelSetting.getArrayUniqueSetting
    prototype['pushToUniqueArraySetting'] = ModelSetting.pushToUniqueArraySetting
    prototype['isInWhiteList'] = ModelSetting.isInWhiteList
    prototype['isKeyInWhiteList'] = ModelSetting.isKeyInWhiteList
    prototype['isInBlackList'] = ModelSetting.isInBlackList
    prototype['isKeyInBlackList'] = ModelSetting.isKeyInBlackList
  }

  static getSettingProperty: NajsEloquent.Model.ModelMethod<any> = function(property: string, defaultValue: any) {
    return this.getClassSetting().read(property, function(staticVersion?: any, sampleVersion?: any) {
      if (staticVersion) {
        return staticVersion
      }
      return sampleVersion ? sampleVersion : defaultValue
    })
  }

  static hasSetting: NajsEloquent.Model.ModelMethod<any> = function(property: string): any {
    return !!this.getSettingProperty(property, false)
  }

  static getSettingWithDefaultForTrueValue: NajsEloquent.Model.ModelMethod<any> = function(
    property: string,
    defaultValue: any
  ): any {
    const value = this.getSettingProperty<any | boolean>(property, false)
    if (value === true) {
      return defaultValue
    }
    return value || defaultValue
  }

  static getClassSetting: NajsEloquent.Model.ModelMethod<ClassSetting> = function() {
    if (!this.settings) {
      this.settings = ClassSetting.of(this)
    }
    return this.settings
  }

  static getArrayUniqueSetting: NajsEloquent.Model.ModelMethod<string[]> = function(
    property: string,
    defaultValue: string[]
  ): string[] {
    return this.getClassSetting().read(property, SettingType.arrayUnique([], defaultValue))
  }

  static pushToUniqueArraySetting: NajsEloquent.Model.ModelMethod<any> = function(
    property: string,
    args: ArrayLike<any>
  ) {
    const setting: string[] = this[property] || []
    this[property] = array_unique(setting, flatten(args))
    return this
  }

  static isInWhiteList: NajsEloquent.Model.ModelMethod<boolean> = function(
    list: ArrayLike<any>,
    whiteList: string[],
    blackList: string[]
  ) {
    const keys = flatten(list)
    for (const key of keys) {
      if (!this.isKeyInWhiteList(key, whiteList, blackList)) {
        return false
      }
    }
    return true
  }

  static isKeyInWhiteList: NajsEloquent.Model.ModelMethod<boolean> = function(
    key: string,
    whiteList: string[],
    blackList: string[]
  ) {
    if (whiteList.length > 0 && whiteList.indexOf(key) !== -1) {
      return true
    }

    if (this.isKeyInBlackList(key, blackList)) {
      return false
    }

    return whiteList.length === 0 && this['knownAttributes'].indexOf(key) === -1 && key.indexOf('_') !== 0
  }

  static isInBlackList: NajsEloquent.Model.ModelMethod<boolean> = function(list: ArrayLike<any>, blackList: string[]) {
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

  static isKeyInBlackList: NajsEloquent.Model.ModelMethod<boolean> = function(key: string, blackList: string[]) {
    return (blackList.length === 1 && blackList[0] === '*') || blackList.indexOf(key) !== -1
  }
}
register(ModelSetting)
