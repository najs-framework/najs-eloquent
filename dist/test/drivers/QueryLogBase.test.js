"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../lib/query-log/FlipFlopQueryLog");
const QueryLogFacade_1 = require("../../lib/facades/global/QueryLogFacade");
const QueryLogBase_1 = require("../../lib/drivers/QueryLogBase");
class Logger extends QueryLogBase_1.QueryLogBase {
    getDefaultData() {
        return {
            raw: '',
            queryBuilderData: {}
        };
    }
}
describe('QueryLogBase', function () {
    beforeEach(function () {
        QueryLogFacade_1.QueryLog.clear().enable();
    });
    describe('constructor()', function () {
        it('init with empty "raw" and "queryBuilderData"', function () {
            const logger = new Logger();
            expect(logger['data']).toEqual({ raw: '', queryBuilderData: {} });
        });
    });
    describe('.name()', function () {
        it('is chainable, sets the name to data', function () {
            const logger = new Logger();
            expect(logger.name('test') === logger).toBe(true);
            expect(logger['data']).toEqual({ raw: '', queryBuilderData: {}, name: 'test' });
        });
    });
    describe('.action()', function () {
        it('is chainable, sets the action to data', function () {
            const logger = new Logger();
            expect(logger.action('test') === logger).toBe(true);
            expect(logger['data']).toEqual({ raw: '', queryBuilderData: {}, action: 'test' });
        });
    });
    describe('.raw()', function () {
        it('is chainable, appends all params to raw, if param is object it stringify param first', function () {
            const logger = new Logger();
            expect(logger.raw('1') === logger).toBe(true);
            expect(logger['data']).toEqual({ raw: '1', queryBuilderData: {} });
            logger.raw('2', { a: 1 }, '3');
            expect(logger['data']).toEqual({ raw: '12{"a":1}3', queryBuilderData: {} });
        });
    });
    describe('.end()', function () {
        it('assigns param to data under key "result", and push to QueryLog, then returns the result', function () {
            const result = {};
            const logger = new Logger();
            expect(logger.end(result) === result).toBe(true);
            expect(QueryLogFacade_1.QueryLog.pull()[0].data).toEqual({ raw: '', queryBuilderData: {}, result: result });
        });
    });
});
