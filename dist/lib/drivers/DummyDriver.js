"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DummyDriver {
    initialize(model, data) {
        this.model = model;
        this.model['attributes'] = data || {};
    }
    getAttribute(name) {
        return this.model['attributes'][name];
    }
    setAttribute(name, value) {
        this.model['attributes'][name] = value;
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
        return this.model['attribute'];
    }
    toJSON() {
        return this.model['attribute'];
    }
    is(model) {
        return model['attributes'] === this.model['attributes'];
    }
}
exports.DummyDriver = DummyDriver;
