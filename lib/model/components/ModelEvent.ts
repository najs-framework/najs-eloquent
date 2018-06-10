/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />

import { NajsEloquent } from '../../constants'
import { register } from 'najs-binding'
import { EventEmitterFactory } from 'najs-event'

export class ModelEvent implements Najs.Contracts.Eloquent.Component {
  static className = NajsEloquent.Model.Component.ModelEvent
  getClassName(): string {
    return NajsEloquent.Model.Component.ModelEvent
  }

  extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void {
    prototype['fire'] = ModelEvent.fire
    EventEmitterFactory.wrap(prototype, function(this: NajsEloquent.Model.IModel<any>) {
      if (typeof this['eventEmitter'] === 'undefined') {
        this['eventEmitter'] = this['driver'].getEventEmitter(false)
      }
      return this['eventEmitter']
    })
  }

  static fire: NajsEloquent.Model.ModelMethod<any> = async function(eventName: string, args: any) {
    await this.emit(eventName, args)

    // this['driver'].getEventEmitter(true).emit(eventName, this, ...args)
  }
}
register(ModelEvent)
