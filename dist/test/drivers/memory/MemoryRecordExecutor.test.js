"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const QueryLogFacade_1 = require("../../../lib/facades/global/QueryLogFacade");
const MemoryRecordExecutor_1 = require("../../../lib/drivers/memory/MemoryRecordExecutor");
const MemoryQueryLog_1 = require("../../../lib/drivers/memory/MemoryQueryLog");
const RecordExecutorBase_1 = require("../../../lib/drivers/RecordExecutorBase");
const Record_1 = require("../../../lib/drivers/Record");
describe('MemoryRecordExecutor', function () {
    it('extends RecordExecutorBase', function () {
        const record = {};
        const model = {};
        const dataSource = {};
        const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
        expect(executor).toBeInstanceOf(RecordExecutorBase_1.RecordExecutorBase);
    });
    describe('.saveRecord()', function () {
        it('calls dataSource.add(record).write() and returns the result', async function () {
            const record = new Record_1.Record({ a: 'anything' });
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const dataSource = {
                getClassName() {
                    return 'DataSource';
                },
                add() {
                    return this;
                },
                async write() {
                    return true;
                }
            };
            const addSpy = Sinon.spy(dataSource, 'add');
            const writeSpy = Sinon.spy(dataSource, 'write');
            QueryLogFacade_1.QueryLog.enable();
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            const result = await executor.saveRecord('any');
            expect(result).toEqual({ ok: true });
            expect(addSpy.calledWith(record)).toBe(true);
            expect(writeSpy.called).toBe(true);
            const log = QueryLogFacade_1.QueryLog.pull()[0];
            expect(log.data['raw']).toEqual('DataSource.add({"a":"anything"}).write()');
            expect(log.data['action']).toEqual('Model.any()');
        });
        it('writes log but do nothing if the executeMode is disabled', async function () {
            const record = new Record_1.Record({ a: 'anything' });
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const dataSource = {
                getClassName() {
                    return 'DataSource';
                },
                add() {
                    return this;
                },
                async write() {
                    return true;
                }
            };
            const addSpy = Sinon.spy(dataSource, 'add');
            const writeSpy = Sinon.spy(dataSource, 'write');
            QueryLogFacade_1.QueryLog.enable();
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            executor.setExecuteMode('disabled');
            const result = await executor.saveRecord('any');
            expect(result).toEqual({});
            expect(addSpy.calledWith(record)).toBe(false);
            expect(writeSpy.called).toBe(false);
            const log = QueryLogFacade_1.QueryLog.pull()[0];
            expect(log.data['raw']).toEqual('DataSource.add({"a":"anything"}).write()');
            expect(log.data['action']).toEqual('Model.any()');
        });
    });
    describe('.createRecord()', function () {
        it('simply calls and returns .saveRecord()', async function () {
            const record = {};
            const model = {};
            const dataSource = {};
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            const saveRecordStub = Sinon.stub(executor, 'saveRecord');
            saveRecordStub.returns('anything');
            expect(await executor.createRecord('any-action')).toEqual('anything');
            expect(saveRecordStub.calledWith('any-action'));
        });
    });
    describe('.updateRecord()', function () {
        it('simply calls and returns .saveRecord()', async function () {
            const record = {};
            const model = {};
            const dataSource = {};
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            const saveRecordStub = Sinon.stub(executor, 'saveRecord');
            saveRecordStub.returns('anything');
            expect(await executor.updateRecord('any-action')).toEqual('anything');
            expect(saveRecordStub.calledWith('any-action'));
        });
    });
    describe('.hardDeleteRecord()', async function () {
        it('calls dataSource.remove(record).write() and returns the result', async function () {
            const record = new Record_1.Record({ a: 'anything' });
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const dataSource = {
                getClassName() {
                    return 'DataSource';
                },
                remove() {
                    return this;
                },
                async write() {
                    return true;
                }
            };
            const removeSpy = Sinon.spy(dataSource, 'remove');
            const writeSpy = Sinon.spy(dataSource, 'write');
            QueryLogFacade_1.QueryLog.enable();
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            const result = await executor.hardDeleteRecord();
            expect(result).toEqual({ ok: true });
            expect(removeSpy.calledWith(record)).toBe(true);
            expect(writeSpy.called).toBe(true);
            const log = QueryLogFacade_1.QueryLog.pull()[0];
            expect(log.data['raw']).toEqual('DataSource.remove({"a":"anything"}).write()');
            expect(log.data['action']).toEqual('Model.hardDelete()');
        });
        it('writes log but do nothing if the executeMode is disabled', async function () {
            const record = new Record_1.Record({ a: 'anything' });
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const dataSource = {
                getClassName() {
                    return 'DataSource';
                },
                remove() {
                    return this;
                },
                async write() {
                    return true;
                }
            };
            const removeSpy = Sinon.spy(dataSource, 'remove');
            const writeSpy = Sinon.spy(dataSource, 'write');
            QueryLogFacade_1.QueryLog.enable();
            const executor = new MemoryRecordExecutor_1.MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog_1.MemoryQueryLog());
            executor.setExecuteMode('disabled');
            const result = await executor.hardDeleteRecord();
            expect(result).toEqual({});
            expect(removeSpy.calledWith(record)).toBe(false);
            expect(writeSpy.called).toBe(false);
            const log = QueryLogFacade_1.QueryLog.pull()[0];
            expect(log.data['raw']).toEqual('DataSource.remove({"a":"anything"}).write()');
            expect(log.data['action']).toEqual('Model.hardDelete()');
        });
    });
});
