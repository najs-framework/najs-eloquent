"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const KnexQueryLog_1 = require("../../lib/query-builders/KnexQueryLog");
const QueryLogFacade_1 = require("../../lib/facades/global/QueryLogFacade");
const najs_facade_1 = require("najs-facade");
describe('KnexQueryLog', function () {
    it('implements Autoload under name "NajsEloquent.QueryBuilder.KnexQueryLog"', function () {
        const log = new KnexQueryLog_1.KnexQueryLog();
        expect(log.getClassName()).toEqual('NajsEloquent.QueryBuilder.KnexQueryLog');
    });
    describe('constructor()', function () {
        it('can be initialized with data or not', function () {
            const log = new KnexQueryLog_1.KnexQueryLog();
            expect(log['data']).toEqual({});
            const data = {};
            const logWithData = new KnexQueryLog_1.KnexQueryLog(data);
            expect(logWithData['data'] === data).toBe(true);
        });
    });
    describe('.name()', function () {
        it('simply assigns name to this.data', function () {
            const log = new KnexQueryLog_1.KnexQueryLog();
            expect(log['data']).toEqual({});
            expect(log.name('test') === log).toBe(true);
            expect(log['data']).toEqual({ name: 'test' });
        });
    });
    describe('.sql()', function () {
        it('simply assigns sql to this.data', function () {
            const log = new KnexQueryLog_1.KnexQueryLog();
            expect(log['data']).toEqual({});
            expect(log.sql('test') === log).toBe(true);
            expect(log['data']).toEqual({ sql: 'test' });
        });
    });
    describe('.end()', function () {
        it('pushes this.data to QueryLogFacade', function () {
            const data = {};
            QueryLogFacade_1.QueryLogFacade.createMock()
                .expects('push')
                .calledWith(data);
            const log = new KnexQueryLog_1.KnexQueryLog(data);
            log.end();
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('.log()', function () {
        it('sets name by using .name() if the queryBuilder has name', function () {
            const log = new KnexQueryLog_1.KnexQueryLog();
            log.log({ name: 'test' });
            expect(log['data']).toEqual({ name: 'test' });
        });
        it('calls knexQueryBuilder.toQuery() and sets to data by using .sql() if the queryBuilder has knexQueryBuilder', function () {
            const queryBuilder = {
                knexQueryBuilder: {
                    toQuery: function () {
                        return 'select * from test';
                    }
                }
            };
            const log = new KnexQueryLog_1.KnexQueryLog();
            log.log(queryBuilder);
            expect(log['data']).toEqual({ sql: 'select * from test' });
        });
        it('can be log name and sql at the same time', function () {
            const queryBuilder = {
                name: 'test',
                knexQueryBuilder: {
                    toQuery: function () {
                        return 'select * from test';
                    }
                }
            };
            const log = new KnexQueryLog_1.KnexQueryLog();
            log.log(queryBuilder);
            expect(log['data']).toEqual({ name: 'test', sql: 'select * from test' });
        });
    });
});
