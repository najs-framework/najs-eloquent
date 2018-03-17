"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DummyDriver {
    constructor() {
        this.attributes = {};
    }
    initialize(data) {
        this.attributes = data || {};
    }
    getAttribute(name) {
        return this.attributes[name];
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
        return true;
    }
    getId() {
        return this.getAttribute('id');
    }
    setId(id) {
        this.setAttribute('id', id);
    }
    newQuery() {
        return {};
    }
    toObject() {
        return this.attributes;
    }
    toJSON() {
        return this.attributes;
    }
    is(model) {
        return this.attributes === this.model['driver']['attributes'];
    }
}
exports.DummyDriver = DummyDriver;
