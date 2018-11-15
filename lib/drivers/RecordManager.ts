/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRecordExecutor.ts" />

import { flatten } from 'lodash'
import { register } from 'najs-binding'
import { RecordManagerBase } from './RecordManagerBase'
import { Record } from './Record'
import { NajsEloquent } from '../constants'

export class RecordManager<T extends Record> extends RecordManagerBase<T> {
  getClassName(): string {
    return NajsEloquent.Feature.RecordManager
  }

  initialize(model: NajsEloquent.Model.ModelInternal<Record>, isGuarded: boolean, data?: T | object): void {
    if (data instanceof Record) {
      model.attributes = data
      return
    }

    if (typeof data !== 'object') {
      model.attributes = new Record()
      return
    }

    if (!isGuarded) {
      model.attributes = new Record(data as object)
      return
    }

    model.attributes = new Record()
    model
      .getDriver()
      .getFillableFeature()
      .fill(model, data)
  }

  getAttribute(model: NajsEloquent.Model.ModelInternal<Record>, key: string): any {
    return model.attributes.getAttribute(key)
  }

  setAttribute<T>(model: NajsEloquent.Model.ModelInternal<Record>, key: string, value: T): boolean {
    return model.attributes.setAttribute(key, value)
  }

  hasAttribute(model: NajsEloquent.Model.IModel, key: string): boolean {
    return true
  }

  getPrimaryKeyName(model: NajsEloquent.Model.IModel): string {
    return model
      .getDriver()
      .getSettingFeature()
      .getSettingProperty(model, 'primaryKey', 'id')
  }

  toObject(model: NajsEloquent.Model.ModelInternal<Record>): object {
    return model.attributes.toObject()
  }

  markModified(model: NajsEloquent.Model.ModelInternal<Record>, keys: ArrayLike<Array<string | string[]>>): void {
    const attributes = flatten(flatten(keys))
    for (const attribute of attributes) {
      model.attributes.markModified(attribute)
    }
  }

  isModified(model: NajsEloquent.Model.ModelInternal<Record>, keys: ArrayLike<Array<string | string[]>>): boolean {
    const attributes = flatten(flatten(keys))
    const modified = model.attributes.getModified()
    for (const attribute of attributes) {
      if (modified.indexOf(attribute) === -1) {
        return false
      }
    }
    return true
  }

  getModified(model: NajsEloquent.Model.ModelInternal<Record>): string[] {
    return model.attributes.getModified()
  }

  isNew(model: NajsEloquent.Model.ModelInternal<Record>): boolean {
    return !this.getPrimaryKey(model)
  }
}
register(RecordManager, NajsEloquent.Feature.RecordManager)
