/// <reference types="najs-event" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IEventFeature.ts" />

import { EventEmitterFactory } from 'najs-event'
import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { EventPublicApi } from './mixin/EventPublicApi'
import { NajsEloquent } from '../constants'

export class EventFeature extends FeatureBase implements NajsEloquent.Feature.IEventFeature {
  getPublicApi(): object {
    return EventPublicApi
  }

  getFeatureName(): string {
    return 'Event'
  }

  getClassName(): string {
    return NajsEloquent.Feature.EventFeature
  }

  async fire(model: NajsEloquent.Model.IModel, eventName: string, args: any): Promise<void> {
    await this.getEventEmitter(model).emit(eventName, args)

    return this.getGlobalEventEmitter(model).emit(eventName, model, args)
  }

  getEventEmitter(model: NajsEloquent.Model.IModel): Najs.Contracts.Event.AsyncEventEmitter {
    const internalModel = this.useInternalOf(model)
    if (!internalModel.internalData.eventEmitter) {
      internalModel.internalData.eventEmitter = EventEmitterFactory.create(true)
    }
    return internalModel.internalData.eventEmitter
  }

  getGlobalEventEmitter(model: NajsEloquent.Model.IModel): Najs.Contracts.Event.AsyncEventEmitter {
    return model.getDriver().getGlobalEventEmitter()
  }
}
register(EventFeature, NajsEloquent.Feature.EventFeature)
