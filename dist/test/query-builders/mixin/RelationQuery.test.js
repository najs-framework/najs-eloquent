"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RelationQuery_1 = require("../../../lib/query-builders/mixin/RelationQuery");
describe('RelationQuery', function () {
    describe('.with()', function () {
        it('flattens argument and calls handler.setEagerRelations() then returns this', function () {
            const queryBuilder = {
                handler: {
                    setEagerRelations() { }
                }
            };
            const spy = Sinon.spy(queryBuilder.handler, 'setEagerRelations');
            expect(RelationQuery_1.RelationQuery.with.apply(queryBuilder, ['a', ['b', 'c'], 'd']) === queryBuilder).toBe(true);
            expect(spy.calledWith(['a', 'b', 'c', 'd'])).toBe(true);
        });
    });
});
