/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { NajsEloquent } from '../../constants'
import { register } from 'najs-binding'

const EVENT_EMITTER_FUNCTIONS = {
  addListener: true,
  on: true,
  once: true,
  prependListener: true,
  prependOnceListener: true,
  removeListener: true,
  removeAllListeners: true,
  setMaxListeners: true,
  getMaxListeners: false,
  listeners: false,
  emit: false,
  eventNames: false,
  listenerCount: false
}

export class ModelEvent implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelEvent
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelEvent
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['fire'] = ModelEvent.fire
    for (const functionName in EVENT_EMITTER_FUNCTIONS) {
      prototype[functionName] = function() {
        if (typeof this['eventEmitter'] === 'undefined') {
          this['eventEmitter'] = this['driver'].getEventEmitter(false)
        }
        const result = this['eventEmitter'][functionName](...arguments)
        if (EVENT_EMITTER_FUNCTIONS[functionName]) {
          return this
        }
        return result
      }
    }
  }

  static fire: NajsEloquent.Model.ModelMethod<any> = function(eventName: string, args: any[]) {
    this.emit(eventName, ...args)

    // this['driver'].getEventEmitter(true).emit(eventName, this, ...args)

    return this
  }
}
register(ModelEvent)
