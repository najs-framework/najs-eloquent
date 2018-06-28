/// <reference types="najs-event" />

import { Record } from '../../model/Record'
import { DriverBase } from './DriverBase'

export class RecordBaseDriver extends DriverBase<Record> {
  protected attributes: Record
  protected queryLogGroup: string
  protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting
  protected timestampsSetting?: NajsEloquent.Model.ITimestampsSetting

  constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting) {
    super()
    this.modelName = model.getModelName()
    this.queryLogGroup = 'all'
    if (model.hasSoftDeletes()) {
      this.softDeletesSetting = model.getSoftDeletesSetting()
    }
    if (model.hasTimestamps()) {
      this.timestampsSetting = model.getTimestampsSetting()
    }
  }

  initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void {
    if (data instanceof Record) {
      this.attributes = data
      return
    }

    if (typeof data === 'object') {
      if (isGuarded) {
        this.attributes = new Record()
        model.fill(data)
      } else {
        this.attributes = new Record(data)
      }
    } else {
      this.attributes = new Record()
    }
  }

  shouldBeProxied(key: string): boolean {
    return key !== 'options'
  }

  hasAttribute(name: string): boolean {
    return true
  }

  getAttribute<T>(name: string): T {
    return this.attributes.getAttribute(name)
  }

  setAttribute<T>(name: string, value: T): boolean {
    return this.attributes.setAttribute(name, value)
  }

  toObject(): Object {
    return this.attributes.toObject()
  }

  markModified(name: string): void {
    this.attributes.markModified(name)
  }

  isModified(name: string): boolean {
    return this.attributes.getModified().indexOf(name) !== -1
  }

  getModified(): string[] {
    return this.attributes.getModified()
  }
}
