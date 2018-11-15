"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const MorphOneOrManyExecutor_1 = require("../../../../lib/relations/relationships/executors/MorphOneOrManyExecutor");
const HasOneExecutor_1 = require("../../../../lib/relations/relationships/executors/HasOneExecutor");
describe('MorphOneOrManyExecutor', function () {
    it('implemented Decorator pattern, implements IHasOneOrManyExecutor and decorates HasOneOrManyExecutor', function () {
        const decoratedExecutor = {};
        const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Value');
        expect(executor).toBeInstanceOf(MorphOneOrManyExecutor_1.MorphOneOrManyExecutor);
    });
    describe('.setCollector()', function () {
        it('adds condition for "targetMorphTypeName" then calls and returns decoratedExecutor.setCollector()', function () {
            const dataBucket = {};
            const targetModel = {};
            const collector = {
                filterBy() { }
            };
            const filterBySpy = Sinon.spy(collector, 'filterBy');
            const conditions = ['a', 'b', 'c'];
            const reader = {
                toComparable(value) {
                    return value;
                }
            };
            const decoratedExecutor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Test');
            const decoratedSetCollectorSpy = Sinon.spy(decoratedExecutor, 'setCollector');
            expect(executor.setCollector(collector, conditions, reader) === executor).toBe(true);
            expect(decoratedSetCollectorSpy.calledWith(collector, [{ field: 'test', operator: '=', value: 'Test', reader: reader }, 'a', 'b', 'c'], reader)).toBe(true);
            const filterConditions = filterBySpy.lastCall.args[0];
            expect(filterConditions).toEqual({
                $and: [{ field: 'test', operator: '=', value: 'Test', reader: reader }, 'a', 'b', 'c']
            });
        });
    });
    describe('.setQuery()', function () {
        it('adds condition for "targetMorphTypeName" then calls and returns super.setQuery()', function () {
            const dataBucket = {};
            const targetModel = {};
            const query = {
                where() { }
            };
            const whereSpy = Sinon.spy(query, 'where');
            const decoratedExecutor = new HasOneExecutor_1.HasOneExecutor(dataBucket, targetModel);
            const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Test');
            const decoratedSetQuerySpy = Sinon.spy(decoratedExecutor, 'setQuery');
            expect(executor.setQuery(query) === executor).toBe(true);
            expect(whereSpy.calledWith('test', 'Test')).toBe(true);
            expect(decoratedSetQuerySpy.calledWith(query)).toBe(true);
        });
    });
    describe('.executeCollector()', function () {
        it('simply calls and returns the decoratedExecutor.executeCollector()', function () {
            const decorated = {
                executeCollector() {
                    return 'anything';
                }
            };
            const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decorated, 'test', 'Test');
            const spy = Sinon.spy(decorated, 'executeCollector');
            expect(executor.executeCollector()).toEqual('anything');
            expect(spy.called).toBe(true);
        });
    });
    describe('.getEmptyValue()', function () {
        it('simply calls and returns the decoratedExecutor.getEmptyValue()', function () {
            const decorated = {
                getEmptyValue() {
                    return 'anything';
                }
            };
            const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decorated, 'test', 'Test');
            const spy = Sinon.spy(decorated, 'getEmptyValue');
            expect(executor.getEmptyValue()).toEqual('anything');
            expect(spy.called).toBe(true);
        });
    });
    describe('.executeQuery()', function () {
        it('simply calls and returns the decoratedExecutor.executeQuery()', function () {
            const decorated = {
                executeQuery() {
                    return 'anything';
                }
            };
            const executor = new MorphOneOrManyExecutor_1.MorphOneOrManyExecutor(decorated, 'test', 'Test');
            const spy = Sinon.spy(decorated, 'executeQuery');
            expect(executor.executeQuery()).toEqual('anything');
            expect(spy.called).toBe(true);
        });
    });
});
