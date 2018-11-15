/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelEvent.ts" />
import Model = NajsEloquent.Model.ModelInternal

export const EventPublicApi: NajsEloquent.Model.IModelEvent = {
  fire(this: Model, eventName: string, args: any): Promise<void> {
    return this.driver.getEventFeature().fire(this, eventName, args)
  },

  emit(this: Model, eventName: string, eventData?: any, serial?: boolean): Promise<void> {
    return this.driver
      .getEventFeature()
      .getEventEmitter(this)
      .emit(eventName, eventData, serial)
  },

  on(this: Model, eventName: string, listener: Function) {
    this.driver
      .getEventFeature()
      .getEventEmitter(this)
      .on(eventName, listener)

    return this
  },

  off(this: Model, eventName: string, listener: Function) {
    this.driver
      .getEventFeature()
      .getEventEmitter(this)
      .off(eventName, listener)

    return this
  },

  once(this: Model, eventName: string, listener: Function) {
    this.driver
      .getEventFeature()
      .getEventEmitter(this)
      .once(eventName, listener)

    return this
  }
}
