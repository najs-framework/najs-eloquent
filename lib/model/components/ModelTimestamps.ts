/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'

const DEFAULT_TIMESTAMPS: NajsEloquent.Model.ITimestampsSetting = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

export class ModelTimestamps implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelTimestamps
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelTimestamps
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['touch'] = ModelTimestamps.touch
    prototype['hasTimestamps'] = ModelTimestamps.hasTimestamps
    prototype['getTimestampsSetting'] = ModelTimestamps.getTimestampsSetting
  }

  static hasTimestamps: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this.hasSetting('timestamps')
  }

  static getTimestampsSetting: NajsEloquent.Model.ModelMethod<NajsEloquent.Model.ITimestampsSetting> = function() {
    return this.getSettingWithDefaultForTrueValue('timestamps', DEFAULT_TIMESTAMPS)
  }

  static touch(this: NajsEloquent.Model.IModel<any>) {
    if (this.hasTimestamps()) {
      this['driver'].markModified(this.getTimestampsSetting().updatedAt)
    }
    return this
  }

  static get DefaultSetting() {
    return DEFAULT_TIMESTAMPS
  }
}
register(ModelTimestamps)
