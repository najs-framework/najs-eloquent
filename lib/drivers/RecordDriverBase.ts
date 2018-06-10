/// <reference types="najs-event" />

import { Record } from '../model/Record'
import { snakeCase } from 'lodash'
import { plural } from 'pluralize'
import { EventEmitterFactory } from 'najs-event'

export class RecordBaseDriver {
  static GlobalEventEmitter: Najs.Contracts.Event.AsyncEventEmitter = EventEmitterFactory.create(true)

  protected attributes: Record
  protected modelName: string
  protected queryLogGroup: string
  protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting
  protected timestampsSetting?: NajsEloquent.Model.ITimestampsSetting

  protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter

  constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting) {
    this.modelName = model.getModelName()
    this.queryLogGroup = 'all'
    if (model.hasSoftDeletes()) {
      this.softDeletesSetting = model.getSoftDeletesSetting()
    }
    if (model.hasTimestamps()) {
      this.timestampsSetting = model.getTimestampsSetting()
    }
  }

  getRecord(): Record {
    return this.attributes
  }

  setRecord(value: Record): void {
    this.attributes = value
  }
  useEloquentProxy() {
    return true
  }

  shouldBeProxied(key: string): boolean {
    return key !== 'options'
  }

  proxify(type: 'get' | 'set', target: any, key: string, value?: any): any {
    if (type === 'get') {
      return this.getAttribute(key)
    }
    return this.setAttribute(key, value)
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

  formatAttributeName(name: string): string {
    return snakeCase(name)
  }

  formatRecordName(): string {
    return plural(snakeCase(this.modelName))
  }

  isSoftDeleted(): boolean {
    if (this.softDeletesSetting) {
      return this.attributes.getAttribute(this.softDeletesSetting.deletedAt) !== null
    }
    return false
  }

  getEventEmitter(global: boolean) {
    if (global) {
      return RecordBaseDriver.GlobalEventEmitter
    }
    if (!this.eventEmitter) {
      this.eventEmitter = EventEmitterFactory.create(true)
    }
    return this.eventEmitter
  }
}
