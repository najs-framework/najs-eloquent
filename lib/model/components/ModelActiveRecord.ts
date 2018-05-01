/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'

export class ModelActiveRecord implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelActiveRecord
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelActiveRecord
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['isNew'] = ModelActiveRecord.isNew
    prototype['delete'] = ModelActiveRecord.delete
    prototype['save'] = ModelActiveRecord.save
    prototype['fresh'] = ModelActiveRecord.fresh
  }

  static isNew: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this['driver'].isNew()
  }

  static delete: NajsEloquent.Model.ModelMethod<Promise<boolean>> = function() {
    return this['driver'].delete(this.hasSoftDeletes())
  }

  static save: NajsEloquent.Model.ModelMethod<any> = async function() {
    await this['driver'].save()
    return this
  }

  static fresh: NajsEloquent.Model.ModelMethod<any> = async function() {
    if (!this.isNew()) {
      return this.findById(this.getPrimaryKey())
    }
    // tslint:disable-next-line
    return null
  }
}
register(ModelActiveRecord)
