"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Record_1 = require("../../lib/drivers/Record");
const MemoryDataSource_1 = require("../../lib/drivers/memory/MemoryDataSource");
const DataBuffer_1 = require("../../lib/data/DataBuffer");
describe('RecordDataSourceBase', function () {
    const model = {
        getModelName() {
            return 'test';
        },
        getPrimaryKeyName() {
            return 'id';
        }
    };
    it('extends DataBuffer with RecordDataReader by default', function () {
        const ds = new MemoryDataSource_1.MemoryDataSource(model);
        expect(ds).toBeInstanceOf(DataBuffer_1.DataBuffer);
    });
    describe('constructor()', function () {
        it('assigns modelName and primaryKeyName to respective properties and create new buffer as a Map', function () {
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            expect(ds.getModelName()).toEqual('test');
            expect(ds.getPrimaryKeyName()).toEqual('id');
            expect(ds.getBuffer()).toBeInstanceOf(Map);
        });
    });
    describe('.add()', function () {
        it('is chainable, simply assigns the record to map with id from .getPrimaryKey()', function () {
            const record = new Record_1.Record();
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            const spy = Sinon.spy(ds, 'createPrimaryKeyIfNeeded');
            expect(ds.add(record) === ds).toBe(true);
            expect(ds.getBuffer().get(record.getAttribute('id')) === record).toBe(true);
            expect(spy.calledWith(record)).toBe(true);
        });
    });
    describe('.remove()', function () {
        it('is chainable, simply removes the record out of map with id from .getPrimaryKey()', function () {
            const record = new Record_1.Record();
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            const spy = Sinon.spy(ds, 'createPrimaryKeyIfNeeded');
            ds.add(record);
            const id = record.getAttribute('id');
            expect(ds.remove(record) === ds).toBe(true);
            expect(ds.getBuffer().get(id)).toBeUndefined();
            expect(spy.calledWith(record)).toBe(true);
        });
    });
});
