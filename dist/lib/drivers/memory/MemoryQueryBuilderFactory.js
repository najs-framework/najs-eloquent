"use strict";
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilderFactory.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const MemoryQueryBuilder_1 = require("./MemoryQueryBuilder");
const MemoryQueryBuilderHandler_1 = require("./MemoryQueryBuilderHandler");
class MemoryQueryBuilderFactory {
    getClassName() {
        return constants_1.NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory;
    }
    make(model) {
        return new MemoryQueryBuilder_1.MemoryQueryBuilder(new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(model));
    }
}
MemoryQueryBuilderFactory.className = constants_1.NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory;
exports.MemoryQueryBuilderFactory = MemoryQueryBuilderFactory;
najs_binding_1.register(MemoryQueryBuilderFactory, constants_1.NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory, true, true);
