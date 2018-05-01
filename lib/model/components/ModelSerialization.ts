/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'

export class ModelSerialization implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelSerialization
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelSerialization
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['getVisible'] = ModelSerialization.getVisible
    prototype['getHidden'] = ModelSerialization.getHidden
    prototype['markVisible'] = ModelSerialization.markVisible
    prototype['markHidden'] = ModelSerialization.markHidden
    prototype['isVisible'] = ModelSerialization.isVisible
    prototype['isHidden'] = ModelSerialization.isHidden
    prototype['toObject'] = ModelSerialization.toObject
    prototype['toJSON'] = ModelSerialization.toJSON
    prototype['toJson'] = ModelSerialization.toJSON
  }

  static getVisible: NajsEloquent.Model.ModelMethod<string[]> = function() {
    return this.getArrayUniqueSetting('visible', [])
  }

  static getHidden: NajsEloquent.Model.ModelMethod<string[]> = function() {
    return this.getArrayUniqueSetting('hidden', [])
  }

  static markVisible: NajsEloquent.Model.ModelMethod<string[], any> = function() {
    return this.pushToUniqueArraySetting('visible', arguments)
  }

  static markHidden: NajsEloquent.Model.ModelMethod<string[], any> = function() {
    return this.pushToUniqueArraySetting('hidden', arguments)
  }

  static isVisible: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this.isInWhiteList(arguments, this.getVisible(), this.getHidden())
  }

  static isHidden: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this.isInBlackList(arguments, this.getHidden())
  }

  static toObject: NajsEloquent.Model.ModelMethod<Object> = function() {
    return this['driver'].toObject()
  }

  static toJSON: NajsEloquent.Model.ModelMethod<Object> = function() {
    const data = this.toObject(),
      visible = this.getVisible(),
      hidden = this.getHidden()

    return Object.getOwnPropertyNames(data).reduce((memo, name) => {
      if (this.isKeyInWhiteList(name, visible, hidden)) {
        memo[name] = data[name]
      }
      return memo
    }, {})
  }
}
register(ModelSerialization)
