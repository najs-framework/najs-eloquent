"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const QueryBuilderWrapper_1 = require("../../lib/wrappers/QueryBuilderWrapper");
const MongooseQueryBuilderWrapper_1 = require("../../lib/wrappers/MongooseQueryBuilderWrapper");
describe('MongooseQueryBuilderWrapper', function () {
    it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.MongooseQueryBuilderWrapper"', function () {
        const mongooseQueryBuilderWrapper = new MongooseQueryBuilderWrapper_1.MongooseQueryBuilderWrapper('test', 'test', {});
        expect(mongooseQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper_1.QueryBuilderWrapper);
        expect(mongooseQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.MongooseQueryBuilderWrapper');
    });
    describe('.native()', function () {
        it('calls this.queryBuilder.native() and returns the result', function () {
            const queryBuilder = {
                native() {
                    return 'anything';
                }
            };
            const nativeSpy = Sinon.spy(queryBuilder, 'native');
            const mongooseQueryBuilderWrapper = new MongooseQueryBuilderWrapper_1.MongooseQueryBuilderWrapper('test', 'test', queryBuilder);
            const handler = function () { };
            expect(mongooseQueryBuilderWrapper.native(handler)).toEqual('anything');
            expect(nativeSpy.calledWith(handler)).toBe(true);
        });
    });
});
