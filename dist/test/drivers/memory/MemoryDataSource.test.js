"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const bson_1 = require("bson");
const Record_1 = require("../../../lib/drivers/Record");
const MemoryDataSource_1 = require("../../../lib/drivers/memory/MemoryDataSource");
const RecordDataSourceBase_1 = require("../../../lib/drivers/RecordDataSourceBase");
describe('MemoryDataSource', function () {
    const model = {
        getModelName() {
            return 'test';
        },
        getPrimaryKeyName() {
            return 'id';
        }
    };
    it('extends RecordDataSourceBase and implement Autoload under name "NajsEloquent.Driver.Memory.MemoryDataSource"', function () {
        const ds = new MemoryDataSource_1.MemoryDataSource(model);
        expect(ds).toBeInstanceOf(RecordDataSourceBase_1.RecordDataSourceBase);
        expect(ds.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryDataSource');
    });
    describe('.createPrimaryKeyIfNeeded()', function () {
        it('returns the primary key if the record already had one', function () {
            const record = new Record_1.Record({ id: '1' });
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            expect(ds.createPrimaryKeyIfNeeded(record)).toEqual('1');
        });
        it('creates new objectId and assign to record in case the record does not have primary key', function () {
            const record = new Record_1.Record();
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            const pk = ds.createPrimaryKeyIfNeeded(record);
            expect(bson_1.ObjectId.isValid(pk)).toBe(true);
            expect(record.getAttribute('id')).toEqual(pk);
        });
    });
    describe('.read()', function () {
        it('does nothing, simply return true', async function () {
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            expect(await ds.read()).toBe(true);
        });
    });
    describe('.write()', function () {
        it('does nothing, simply return true', async function () {
            const ds = new MemoryDataSource_1.MemoryDataSource(model);
            expect(await ds.write()).toBe(true);
        });
    });
});
