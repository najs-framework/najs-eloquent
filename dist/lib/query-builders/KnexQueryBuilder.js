"use strict";
/// <reference path="interfaces/ISoftDeleteQuery.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
class KnexQueryBuilder {
    constructor(softDelete) {
        this.softDelete = softDelete;
    }
    select() {
        // Knex({})('test').from()
        // const instance = Knex({})
        // instance.select(instance.raw(''))
    }
}
exports.KnexQueryBuilder = KnexQueryBuilder;
