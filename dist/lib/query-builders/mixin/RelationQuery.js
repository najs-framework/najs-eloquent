"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.RelationQuery = {
    with(...relations) {
        this.handler.setEagerRelations(lodash_1.flatten(relations));
        return this;
    }
};
