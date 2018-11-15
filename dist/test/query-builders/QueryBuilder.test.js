"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const QueryBuilder_1 = require("../../lib/query-builders/QueryBuilder");
const Query_1 = require("../../lib/query-builders/mixin/Query");
const ConditionQuery_1 = require("../../lib/query-builders/mixin/ConditionQuery");
const ExecuteQuery_1 = require("../../lib/query-builders/mixin/ExecuteQuery");
const AdvancedQuery_1 = require("../../lib/query-builders/mixin/AdvancedQuery");
const RelationQuery_1 = require("../../lib/query-builders/mixin/RelationQuery");
describe('QueryBuilder', function () {
    describe('constructor()', function () {
        it('sets handler in params to handler property', function () {
            const handler = {};
            const queryBuilder = new QueryBuilder_1.QueryBuilder(handler);
            expect(queryBuilder['handler'] === handler).toBe(true);
        });
    });
    describe('mixin:Query', function () {
        it('applies mixin Query to its prototype', function () {
            const prototype = QueryBuilder_1.QueryBuilder.prototype;
            for (const name in Query_1.Query) {
                expect(prototype[name] === Query_1.Query[name]).toBe(true);
            }
        });
    });
    describe('mixin:ConditionQuery', function () {
        it('applies mixin ConditionQuery to its prototype', function () {
            const prototype = QueryBuilder_1.QueryBuilder.prototype;
            for (const name in ConditionQuery_1.ConditionQuery) {
                expect(prototype[name] === ConditionQuery_1.ConditionQuery[name]).toBe(true);
            }
        });
    });
    describe('mixin:ExecuteQuery', function () {
        it('applies mixin ExecuteQuery to its prototype', function () {
            const prototype = QueryBuilder_1.QueryBuilder.prototype;
            for (const name in ExecuteQuery_1.ExecuteQuery) {
                expect(prototype[name] === ExecuteQuery_1.ExecuteQuery[name]).toBe(true);
            }
        });
    });
    describe('mixin:AdvancedQuery', function () {
        it('applies mixin AdvancedQuery to its prototype', function () {
            const prototype = QueryBuilder_1.QueryBuilder.prototype;
            for (const name in AdvancedQuery_1.AdvancedQuery) {
                expect(prototype[name] === AdvancedQuery_1.AdvancedQuery[name]).toBe(true);
            }
        });
    });
    describe('mixin:RelationQuery', function () {
        it('applies mixin RelationQuery to its prototype', function () {
            const prototype = QueryBuilder_1.QueryBuilder.prototype;
            for (const name in RelationQuery_1.RelationQuery) {
                expect(prototype[name] === RelationQuery_1.RelationQuery[name]).toBe(true);
            }
        });
    });
});
