"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentMetadata_1 = require("./EloquentMetadata");
exports.EloquentProxy = {
    get(target, key) {
        if (target['driver'].getDriverProxyMethods().indexOf(key) !== -1) {
            return target['driver'][key].bind(target['driver']);
        }
        if (target['driver'].getQueryProxyMethods().indexOf(key) !== -1) {
            const query = target['driver'].newQuery();
            return query[key].bind(query);
        }
        if (!EloquentMetadata_1.EloquentMetadata.get(target).hasAttribute(key)) {
            return EloquentMetadata_1.EloquentMetadata.get(target)['attribute'].getAttribute(target, key);
        }
        return target[key];
    },
    set(target, key, value) {
        if (!EloquentMetadata_1.EloquentMetadata.get(target).hasAttribute(key)) {
            return EloquentMetadata_1.EloquentMetadata.get(target)['attribute'].setAttribute(target, key, value);
        }
        target[key] = value;
        return true;
    }
};
