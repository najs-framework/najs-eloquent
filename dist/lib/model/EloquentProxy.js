"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentMetadata_1 = require("./EloquentMetadata");
exports.GET_FORWARD_TO_DRIVER_FUNCTIONS = ['is', 'getId', 'setId', 'newQuery'];
exports.GET_QUERY_FUNCTIONS = ['where', 'orWhere'];
exports.EloquentProxy = {
    get(target, key, value) {
        if (exports.GET_FORWARD_TO_DRIVER_FUNCTIONS.indexOf(key) !== -1) {
            return target['driver'][key].bind(target['driver']);
        }
        if (exports.GET_QUERY_FUNCTIONS.indexOf(key) !== -1) {
            return target['driver'].newQuery()[key];
        }
        if (EloquentMetadata_1.EloquentMetadata.get(target).hasAttribute(key)) {
        }
        return target[key];
    },
    set(target, key, value) {
        if (EloquentMetadata_1.EloquentMetadata.get(target).hasAttribute(key)) {
        }
        target[key] = value;
        return true;
    }
};
