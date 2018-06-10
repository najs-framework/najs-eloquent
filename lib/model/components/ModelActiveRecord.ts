/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { flatten } from 'lodash'
import { NajsEloquent } from '../../constants'
import { Event } from '../Event'

export class ModelActiveRecord implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelActiveRecord
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelActiveRecord
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['isNew'] = ModelActiveRecord.isNew
    prototype['isDirty'] = ModelActiveRecord.isDirty
    prototype['getDirty'] = ModelActiveRecord.getDirty
    prototype['delete'] = ModelActiveRecord.delete
    prototype['save'] = ModelActiveRecord.save
    prototype['fresh'] = ModelActiveRecord.fresh
  }

  static isNew: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this['driver'].isNew()
  }

  static isDirty: NajsEloquent.Model.ModelMethod<boolean> = function() {
    const fields = flatten(arguments)
    for (const field of fields) {
      if (!this['driver'].isModified(field)) {
        return false
      }
    }
    return true
  }

  static getDirty: NajsEloquent.Model.ModelMethod<string[]> = function() {
    return this['driver'].getModified()
  }

  static delete: NajsEloquent.Model.ModelMethod<Promise<boolean>> = async function() {
    await this.fire(Event.Deleting, [])
    const result = await this['driver'].delete(this.hasSoftDeletes())
    await this.fire(Event.Deleted, [])

    return result
  }

  static save: NajsEloquent.Model.ModelMethod<any> = async function() {
    const isCreate = this['driver'].isNew()

    await this.fire(isCreate ? Event.Creating : Event.Updating, [])
    await this.fire(Event.Saving, [])

    await this['driver'].save()

    await this.fire(isCreate ? Event.Created : Event.Updated, [])
    await this.fire(Event.Saved, [])

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
