"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const MemoryQueryBuilder_1 = require("../../../lib/drivers/memory/MemoryQueryBuilder");
const MemoryQueryBuilderFactory_1 = require("../../../lib/drivers/memory/MemoryQueryBuilderFactory");
describe('MemoryQueryBuilderFactory', function () {
    it('implements IAutoload and register with singleton option = true', function () {
        const a = najs_binding_1.make(MemoryQueryBuilderFactory_1.MemoryQueryBuilderFactory.className);
        const b = najs_binding_1.make(MemoryQueryBuilderFactory_1.MemoryQueryBuilderFactory.className);
        expect(a.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory');
        expect(a === b).toBe(true);
    });
    describe('.make()', function () {
        it('creates new instance of MemoryQueryBuilder', function () {
            const model = {
                getModelName() {
                    return 'Model';
                },
                getPrimaryKeyName() {
                    return 'id';
                }
            };
            const factory = najs_binding_1.make(MemoryQueryBuilderFactory_1.MemoryQueryBuilderFactory.className);
            const qb1 = factory.make(model);
            const qb2 = factory.make(model);
            expect(qb1).toBeInstanceOf(MemoryQueryBuilder_1.MemoryQueryBuilder);
            expect(qb1 === qb2).toBe(false);
        });
    });
});
