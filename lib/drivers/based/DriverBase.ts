/// <reference types="najs-event" />

import { EventEmitterFactory } from 'najs-event'
import { snakeCase } from 'lodash'
import { plural } from 'pluralize'

export abstract class DriverBase<T> {
  static GlobalEventEmitter: Najs.Contracts.Event.AsyncEventEmitter = EventEmitterFactory.create(true)
  protected attributes: T
  protected modelName: string
  protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter
  protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting

  abstract getAttribute(path: string): any
  abstract setAttribute(path: string, value: any): boolean

  getRecord(): T {
    return this.attributes
  }

  setRecord(value: T): void {
    this.attributes = value
  }

  proxify(type: 'get' | 'set', target: any, key: string, value?: any): any {
    if (type === 'get') {
      return this.getAttribute(key)
    }
    return this.setAttribute(key, value)
  }

  useEloquentProxy() {
    return true
  }

  formatAttributeName(name: string): string {
    return snakeCase(name)
  }

  formatRecordName(): string {
    return plural(snakeCase(this.modelName))
  }

  isSoftDeleted(): boolean {
    if (this.softDeletesSetting) {
      return this.getAttribute(this.softDeletesSetting.deletedAt) !== null
    }
    return false
  }

  getModelComponentName(): string | undefined {
    return undefined
  }

  getModelComponentOrder(components: string[]): string[] {
    return components
  }

  getEventEmitter(global: boolean) {
    if (global) {
      return DriverBase.GlobalEventEmitter
    }
    if (!this.eventEmitter) {
      this.eventEmitter = EventEmitterFactory.create(true)
    }
    return this.eventEmitter
  }
}
