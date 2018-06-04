/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { register } from 'najs-binding'
import { NajsEloquent } from '../../constants'
import { Event } from './../Event'

const DEFAULT_SOFT_DELETES: NajsEloquent.Model.ISoftDeletesSetting = {
  deletedAt: 'deleted_at',
  overrideMethods: false
}

export class ModelSoftDeletes implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelSoftDeletes
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelSoftDeletes
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['hasSoftDeletes'] = ModelSoftDeletes.hasSoftDeletes
    prototype['getSoftDeletesSetting'] = ModelSoftDeletes.getSoftDeletesSetting
    prototype['trashed'] = ModelSoftDeletes.trashed
    prototype['forceDelete'] = ModelSoftDeletes.forceDelete
    prototype['restore'] = ModelSoftDeletes.restore
  }

  static hasSoftDeletes: NajsEloquent.Model.ModelMethod<boolean> = function() {
    return this.hasSetting('softDeletes')
  }

  static getSoftDeletesSetting: NajsEloquent.Model.ModelMethod<NajsEloquent.Model.ISoftDeletesSetting> = function() {
    return this.getSettingWithDefaultForTrueValue('softDeletes', DEFAULT_SOFT_DELETES)
  }

  static trashed: NajsEloquent.Model.ModelMethod<boolean> = function() {
    if (!this.hasSoftDeletes()) {
      return false
    }
    return this['driver'].isSoftDeleted()
  }

  static forceDelete: NajsEloquent.Model.ModelMethod<Promise<boolean>> = function() {
    this.fire(Event.Deleting, [])
    const result = this['driver'].delete(false)
    this.fire(Event.Deleted, [])

    return result
  }

  static restore: NajsEloquent.Model.ModelMethod<Promise<boolean>> = function() {
    this.fire(Event.Restoring, [])
    const result = this['driver'].restore()
    this.fire(Event.Restored, [])

    return result
  }

  static get DefaultSetting() {
    return DEFAULT_SOFT_DELETES
  }
}
register(ModelSoftDeletes)
