"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const HasOneOrManyExecutor_1 = require("../../../../lib/relations/relationships/executors/HasOneOrManyExecutor");
const HasManyExecutor_1 = require("../../../../lib/relations/relationships/executors/HasManyExecutor");
const helpers_1 = require("../../../../lib/util/helpers");
describe('HasManyExecutor', function () {
    it('extends HasOneOrManyExecutor', function () {
        const dataBucket = {};
        const targetModel = {};
        const executor = new HasManyExecutor_1.HasManyExecutor(dataBucket, targetModel);
        expect(executor).toBeInstanceOf(HasOneOrManyExecutor_1.HasOneOrManyExecutor);
    });
    describe('.executeCollector()', function () {
        it('calls collector.exec(), then create a Collection by DataBucket.makeCollection() with the result', function () {
            const collector = {
                filterBy() { },
                exec() { }
            };
            const execStub = Sinon.stub(collector, 'exec');
            const itemOne = {};
            const itemTwo = {};
            const result = [itemOne, itemTwo];
            execStub.returns(result);
            const dataBucket = {
                makeCollection(target, data) {
                    return data;
                }
            };
            const targetModel = {};
            const executor = new HasManyExecutor_1.HasManyExecutor(dataBucket, targetModel);
            const spy = Sinon.spy(dataBucket, 'makeCollection');
            const reader = {
                toComparable(value) {
                    return value;
                }
            };
            expect(executor.setCollector(collector, [], reader).executeCollector() === result).toBe(true);
            expect(execStub.calledWith()).toBe(true);
            expect(spy.calledWith(targetModel, [itemOne, itemTwo])).toBe(true);
        });
    });
    describe('.executeQuery()', function () {
        it('simply calls and returns query.get()', async function () {
            const dataBucket = {};
            const targetModel = {};
            const executor = new HasManyExecutor_1.HasManyExecutor(dataBucket, targetModel);
            const query = {
                async get() {
                    return 'anything';
                }
            };
            expect(await executor.setQuery(query).executeQuery()).toBe('anything');
        });
    });
    describe('.getEmptyValue()', function () {
        it('returns empty collection', function () {
            const dataBucket = {};
            const targetModel = {};
            const executor = new HasManyExecutor_1.HasManyExecutor(dataBucket, targetModel);
            expect(helpers_1.isCollection(executor.getEmptyValue())).toBe(true);
        });
    });
});
