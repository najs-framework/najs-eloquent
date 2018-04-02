"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationProxy = {
    get(target, key) {
        if (!target.loaded) {
            // show warning that the Relation is not loaded
        }
    }
};
