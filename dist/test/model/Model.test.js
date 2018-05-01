"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Model_1 = require("../../lib/model/Model");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const collect_js_1 = require("collect.js");
EloquentDriverProviderFacade_1.EloquentDriverProviderFacade.register(DummyDriver_1.DummyDriver, 'dummy', true);
class User extends Model_1.Model {
}
User.className = 'User';
describe('NajsEloquent', function () {
    describe('.getRecordName()', function () {
        it('returns this.driver.getRecordName()', function () {
            const model = new User();
            const getRecordNameStub = Sinon.stub(model['driver'], 'getRecordName');
            getRecordNameStub.returns('anything');
            expect(model.getRecordName()).toEqual('anything');
            expect(getRecordNameStub.called).toBe(true);
        });
    });
    describe('.is()', function () {
        it('returns true if that is the same instance or both primaryKeys have the same "string" format', function () {
            const a = new User();
            a.setPrimaryKey(1);
            const b = new User();
            b.setPrimaryKey('1');
            const c = new User();
            c.setPrimaryKey('1     ');
            expect(a.is(a)).toBe(true);
            expect(c.is(c)).toBe(true);
            expect(b.is(b)).toBe(true);
            expect(a.is(b)).toBe(true);
            expect(a.is(c)).toBe(false);
        });
    });
    it('test Collection reference of collect.js library (use for Relation)', function () {
        const a = { name: 'a', index: 0, id: 10 };
        const b = { name: 'b', index: 1, id: 11 };
        const c = { name: 'c', index: 2, id: 12 };
        const d = { name: 'd', index: 3, id: 13 };
        const array = [a, b, c, d];
        const collection = collect_js_1.default(array);
        expect(collection.first() === a).toBe(true);
        expect(collection.last() === d).toBe(true);
        const keyed = collection.keyBy('id');
        expect(keyed.get('10') === a).toBe(true);
        const filtered = collection.filter(function (item) {
            return item.index < 2;
        });
        expect(filtered.first() === a).toBe(true);
        expect(filtered.last() === b).toBe(true);
    });
});
