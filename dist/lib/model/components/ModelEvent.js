"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
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
};
class ModelEvent {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelEvent;
    }
    extend(prototype, bases, driver) {
        for (const functionName in EVENT_EMITTER_FUNCTIONS) {
            prototype[functionName] = function () {
                const result = this['eventEmitter'][functionName](...arguments);
                if (EVENT_EMITTER_FUNCTIONS[functionName]) {
                    return this;
                }
                return result;
            };
        }
    }
}
ModelEvent.className = constants_1.NajsEloquent.Model.Component.ModelEvent;
exports.ModelEvent = ModelEvent;
najs_binding_1.register(ModelEvent);
