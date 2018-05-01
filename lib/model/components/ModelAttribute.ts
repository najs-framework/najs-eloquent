/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'

export class ModelAttribute implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelAttribute
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelAttribute
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['getAttribute'] = ModelAttribute.getAttribute
    prototype['setAttribute'] = ModelAttribute.setAttribute
    prototype['getPrimaryKey'] = ModelAttribute.getPrimaryKey
    prototype['setPrimaryKey'] = ModelAttribute.setPrimaryKey
    prototype['getPrimaryKeyName'] = ModelAttribute.getPrimaryKeyName
  }

  static getAttribute(this: NajsEloquent.Model.IModel<any>, key: string): any {
    return this['driver'].getAttribute(key)
  }

  static setAttribute(this: NajsEloquent.Model.IModel<any>, key: string, value: any) {
    this['driver'].setAttribute(key, value)

    return this
  }

  static getPrimaryKey(this: NajsEloquent.Model.IModel<any>): any {
    return this['driver'].getAttribute(this.getPrimaryKeyName())
  }

  static setPrimaryKey(this: NajsEloquent.Model.IModel<any>, id: any) {
    this['driver'].setAttribute(this.getPrimaryKeyName(), id)

    return this
  }

  static getPrimaryKeyName(this: NajsEloquent.Model.IModel<any>): string {
    return this['driver'].getPrimaryKeyName()
  }
}
register(ModelAttribute)
