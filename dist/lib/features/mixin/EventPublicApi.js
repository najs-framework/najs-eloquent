"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPublicApi = {
    fire(eventName, args) {
        return this.driver.getEventFeature().fire(this, eventName, args);
    },
    emit(eventName, eventData, serial) {
        return this.driver
            .getEventFeature()
            .getEventEmitter(this)
            .emit(eventName, eventData, serial);
    },
    on(eventName, listener) {
        this.driver
            .getEventFeature()
            .getEventEmitter(this)
            .on(eventName, listener);
        return this;
    },
    off(eventName, listener) {
        this.driver
            .getEventFeature()
            .getEventEmitter(this)
            .off(eventName, listener);
        return this;
    },
    once(eventName, listener) {
        this.driver
            .getEventFeature()
            .getEventEmitter(this)
            .once(eventName, listener);
        return this;
    }
};
