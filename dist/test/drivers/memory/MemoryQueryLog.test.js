"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const MemoryQueryLog_1 = require("../../../lib/drivers/memory/MemoryQueryLog");
const QueryLogBase_1 = require("../../../lib/drivers/QueryLogBase");
describe('MemoryQueryLog', function () {
    it('extends QueryLogBase', function () {
        const logger = new MemoryQueryLog_1.MemoryQueryLog();
        expect(logger).toBeInstanceOf(QueryLogBase_1.QueryLogBase);
    });
    describe('.getDefaultData()', function () {
        it('simply calls and returns .getEmptyData()', function () {
            const logger = new MemoryQueryLog_1.MemoryQueryLog();
            const stub = Sinon.stub(logger, 'getEmptyData');
            stub.returns('anything');
            expect(logger.getDefaultData()).toEqual('anything');
        });
    });
    describe('.dataSource()', function () {
        it('assigns the className of DataSource class to dataSource property', function () {
            const logger = new MemoryQueryLog_1.MemoryQueryLog();
            const dataSource = {
                getClassName() {
                    return 'anything';
                }
            };
            expect(logger.dataSource(dataSource) === logger).toBe(true);
            expect(logger['data']['dataSource']).toEqual('anything');
        });
    });
    describe('.updateRecordInfo()', function () {
        it('creates an array and add the info to data under property "records"', function () {
            const info = {};
            const logger = new MemoryQueryLog_1.MemoryQueryLog();
            expect(logger.updateRecordInfo(info) === logger).toBe(true);
            expect(logger['data']['records']).toEqual([info]);
        });
        it('push an info to array in data under property "records"', function () {
            const info1 = {};
            const info2 = {};
            const logger = new MemoryQueryLog_1.MemoryQueryLog();
            expect(logger.updateRecordInfo(info1) === logger).toBe(true);
            expect(logger.updateRecordInfo(info2) === logger).toBe(true);
            expect(logger['data']['records']).toEqual([info1, info2]);
        });
    });
});
