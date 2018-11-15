"use strict";
/// <reference types="najs-event" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IEventFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_event_1 = require("najs-event");
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const EventPublicApi_1 = require("./mixin/EventPublicApi");
const constants_1 = require("../constants");
class EventFeature extends FeatureBase_1.FeatureBase {
    getPublicApi() {
        return EventPublicApi_1.EventPublicApi;
    }
    getFeatureName() {
        return 'Event';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.EventFeature;
    }
    async fire(model, eventName, args) {
        await this.getEventEmitter(model).emit(eventName, args);
        return this.getGlobalEventEmitter(model).emit(eventName, model, args);
    }
    getEventEmitter(model) {
        const internalModel = this.useInternalOf(model);
        if (!internalModel.internalData.eventEmitter) {
            internalModel.internalData.eventEmitter = najs_event_1.EventEmitterFactory.create(true);
        }
        return internalModel.internalData.eventEmitter;
    }
    getGlobalEventEmitter(model) {
        return model.getDriver().getGlobalEventEmitter();
    }
}
exports.EventFeature = EventFeature;
najs_binding_1.register(EventFeature, constants_1.NajsEloquent.Feature.EventFeature);
