"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const najs_binding_1 = require("najs-binding");
const najs_event_1 = require("najs-event");
class ModelEvent {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelEvent;
    }
    extend(prototype, bases, driver) {
        prototype['fire'] = ModelEvent.fire;
        najs_event_1.EventEmitterFactory.wrap(prototype, function () {
            if (typeof this['eventEmitter'] === 'undefined') {
                this['eventEmitter'] = this['driver'].getEventEmitter(false);
            }
            return this['eventEmitter'];
        });
    }
}
ModelEvent.className = constants_1.NajsEloquent.Model.Component.ModelEvent;
ModelEvent.fire = async function (eventName, args) {
    await this.emit(eventName, args);
    // this['driver'].getEventEmitter(true).emit(eventName, this, ...args)
};
exports.ModelEvent = ModelEvent;
najs_binding_1.register(ModelEvent);
