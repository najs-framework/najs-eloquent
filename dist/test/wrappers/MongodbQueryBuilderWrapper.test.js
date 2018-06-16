"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const QueryBuilderWrapper_1 = require("../../lib/wrappers/QueryBuilderWrapper");
const MongodbQueryBuilderWrapper_1 = require("../../lib/wrappers/MongodbQueryBuilderWrapper");
describe('MongodbQueryBuilderWrapper', function () {
    it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.MongodbQueryBuilderWrapper"', function () {
        const mongodbQueryBuilderWrapper = new MongodbQueryBuilderWrapper_1.MongodbQueryBuilderWrapper('test', 'test', {});
        expect(mongodbQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper_1.QueryBuilderWrapper);
        expect(mongodbQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.MongodbQueryBuilderWrapper');
    });
    describe('.native()', function () {
        it('calls this.queryBuilder.native() and returns the result', function () {
            const queryBuilder = {
                native() {
                    return 'anything';
                }
            };
            const nativeSpy = Sinon.spy(queryBuilder, 'native');
            const mongodbQueryBuilderWrapper = new MongodbQueryBuilderWrapper_1.MongodbQueryBuilderWrapper('test', 'test', queryBuilder);
            const handler = function () { };
            expect(mongodbQueryBuilderWrapper.native(handler)).toEqual('anything');
            expect(nativeSpy.calledWith(handler)).toBe(true);
        });
    });
});
