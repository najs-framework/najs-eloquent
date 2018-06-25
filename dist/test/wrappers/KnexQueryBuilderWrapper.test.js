"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const QueryBuilderWrapper_1 = require("../../lib/wrappers/QueryBuilderWrapper");
const KnexQueryBuilderWrapper_1 = require("../../lib/wrappers/KnexQueryBuilderWrapper");
describe('KnexQueryBuilderWrapper', function () {
    it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.KnexQueryBuilderWrapper"', function () {
        const knexQueryBuilderWrapper = new KnexQueryBuilderWrapper_1.KnexQueryBuilderWrapper('test', 'test', {});
        expect(knexQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper_1.QueryBuilderWrapper);
        expect(knexQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.KnexQueryBuilderWrapper');
    });
    describe('.native()', function () {
        it('calls this.queryBuilder.native() and returns itself', function () {
            const queryBuilder = {
                native() {
                    return 'anything';
                }
            };
            const nativeSpy = Sinon.spy(queryBuilder, 'native');
            const knexQueryBuilderWrapper = new KnexQueryBuilderWrapper_1.KnexQueryBuilderWrapper('test', 'test', queryBuilder);
            const handler = function () { };
            expect(knexQueryBuilderWrapper.native(handler) === knexQueryBuilderWrapper).toBe(true);
            expect(nativeSpy.calledWith(handler)).toBe(true);
        });
    });
});
