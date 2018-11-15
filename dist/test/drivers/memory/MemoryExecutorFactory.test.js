"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const MemoryExecutorFactory_1 = require("../../../lib/drivers/memory/MemoryExecutorFactory");
const MemoryRecordExecutor_1 = require("../../../lib/drivers/memory/MemoryRecordExecutor");
const MemoryQueryExecutor_1 = require("../../../lib/drivers/memory/MemoryQueryExecutor");
const MemoryQueryLog_1 = require("../../../lib/drivers/memory/MemoryQueryLog");
const MemoryDataSourceProviderFacade_1 = require("../../../lib/facades/global/MemoryDataSourceProviderFacade");
describe('MemoryExecutorFactory', function () {
    it('implements IAutoload and register with singleton option = true', function () {
        const a = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
        const b = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
        expect(a.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryExecutorFactory');
        expect(a === b).toBe(true);
    });
    describe('.makeRecordExecutor()', function () {
        it('creates new instance of MemoryRecordExecutor with model, record, dataSource and logger', function () {
            const model = {};
            const record = {};
            const dataSource = {};
            const stub = MemoryDataSourceProviderFacade_1.MemoryDataSourceProviderFacade.createStub('create');
            stub.returns(dataSource);
            const factory = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
            const recordExecutor = factory.makeRecordExecutor(model, record);
            expect(recordExecutor).toBeInstanceOf(MemoryRecordExecutor_1.MemoryRecordExecutor);
            expect(recordExecutor['model'] === model).toBe(true);
            expect(recordExecutor['record'] === record).toBe(true);
            expect(recordExecutor['dataSource'] === dataSource).toBe(true);
            stub.restore();
        });
    });
    describe('.makeQueryExecutor()', function () {
        it('creates new instance of MemoryQueryExecutor with model, record, collection and logger', function () {
            const basicQuery = {};
            const model = {
                getRecordName() {
                    return 'any';
                }
            };
            const handler = {
                getQueryName() {
                    return 'test';
                },
                getBasicQuery() {
                    return basicQuery;
                },
                getModel() {
                    return model;
                }
            };
            const dataSource = {};
            const stub = MemoryDataSourceProviderFacade_1.MemoryDataSourceProviderFacade.createStub('create');
            stub.returns(dataSource);
            const factory = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
            const queryExecutor = factory.makeQueryExecutor(handler);
            expect(queryExecutor).toBeInstanceOf(MemoryQueryExecutor_1.MemoryQueryExecutor);
            expect(queryExecutor['queryHandler'] === handler).toBe(true);
            stub.restore();
        });
    });
    describe('.getDataSource()', function () {
        it('returns DataSource by calling MemoryDataSourceProvider.create()', function () {
            const model = {};
            const stub = MemoryDataSourceProviderFacade_1.MemoryDataSourceProviderFacade.createStub('create');
            stub.returns('anything');
            const factory = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
            expect(factory.getDataSource(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.makeLogger()', function () {
        it('simply create new MemoryQueryLog', function () {
            const factory = najs_binding_1.make(MemoryExecutorFactory_1.MemoryExecutorFactory.className);
            expect(factory.makeLogger()).toBeInstanceOf(MemoryQueryLog_1.MemoryQueryLog);
        });
    });
});
