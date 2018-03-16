"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentMetadata_1 = require("./EloquentMetadata");
exports.EloquentProxy = {
    get(target, key, value) {
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
