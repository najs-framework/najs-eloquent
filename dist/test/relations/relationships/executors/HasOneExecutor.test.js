"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const HasOneExecutor_1 = require("../../../../lib/relations/relationships/executors/HasOneExecutor");
const HasOneOrManyExecutor_1 = require("../../../../lib/relations/relationships/executors/HasOneOrManyExecutor");
describe('HasOneExecutor', function () {
    it('extends HasOneOrManyExecutor', function () {
        const dataBucket = {};
        const targetModel = {};
        const executor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
        expect(executor).toBeInstanceOf(HasOneOrManyExecutor_1.HasOneOrManyExecutor);
    });
    describe('.executeCollector()', function () {
        it('calls collector.limit(1) then exec() and returns undefined if there is no result', function () {
            const collector = {
                filterBy() { },
                limit() { },
                exec() { }
            };
            const limitSpy = Sinon.spy(collector, 'limit');
            const execStub = Sinon.stub(collector, 'exec');
            execStub.returns([]);
            const dataBucket = {};
            const targetModel = {};
            const executor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            expect(executor.setCollector(collector, [], {}).executeCollector()).toBeUndefined();
            expect(limitSpy.calledWith(1)).toBe(true);
            expect(execStub.calledWith()).toBe(true);
        });
        it('calls collector.limit(1) then exec(), then create a Model by DataBucket.makeModel() with the first item of result', function () {
            const collector = {
                filterBy() { },
                limit() { },
                exec() { }
            };
            const limitSpy = Sinon.spy(collector, 'limit');
            const execStub = Sinon.stub(collector, 'exec');
            const itemOne = {};
            const itemTwo = {};
            execStub.returns([itemOne, itemTwo]);
            const dataBucket = {
                makeModel(target, data) {
                    return data;
                }
            };
            const targetModel = {};
            const executor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            const spy = Sinon.spy(dataBucket, 'makeModel');
            expect(executor.setCollector(collector, [], {}).executeCollector() === itemOne).toBe(true);
            expect(limitSpy.calledWith(1)).toBe(true);
            expect(execStub.calledWith()).toBe(true);
            expect(spy.calledWith(targetModel, itemOne)).toBe(true);
        });
    });
    describe('.executeQuery()', function () {
        it('simply calls and returns query.get()', async function () {
            const dataBucket = {};
            const targetModel = {};
            const executor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            const query = {
                async first() {
                    return 'anything';
                }
            };
            expect(await executor.setQuery(query).executeQuery()).toBe('anything');
        });
    });
    describe('.getEmptyValue()', function () {
        it('returns undefined', function () {
            const dataBucket = {};
            const targetModel = {};
            const executor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            expect(executor.getEmptyValue()).toBeUndefined();
        });
    });
});
