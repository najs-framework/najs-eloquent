"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const najs_binding_1 = require("najs-binding");
const Model_1 = require("../../lib/model/Model");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
DriverProviderFacade_1.DriverProvider.register(MemoryDriver_1.MemoryDriver, 'memory', true);
class TestModel extends Model_1.Model {
    getClassName() {
        return 'TestModel';
    }
}
najs_binding_1.register(TestModel);
class ModelA extends Model_1.Model {
    getClassName() {
        return 'ModelA';
    }
}
najs_binding_1.register(ModelA);
class ModelB extends Model_1.Model {
    getClassName() {
        return 'ModelB';
    }
}
najs_binding_1.register(ModelB);
describe('Model', function () {
    it('should works', function () {
        const test = new TestModel();
        test.getDriver();
        test.newQuery();
        try {
            test.newQuery('test');
        }
        catch (error) { }
    });
    describe('.register()', function () {
        it('is a shortcut of NajsBinding, simply calls the NajsBinding.register()', function () {
            const spy = Sinon.spy(NajsBinding, 'register');
            function test() { }
            Model_1.Model.register(test);
            expect(spy.calledWith(test)).toBe(true);
            spy.restore();
        });
    });
    describe('Static Query Methods', function () {
        describe('.newQuery()', function () {
            it('creates an instance of Model then calls and return .newQuery()', function () {
                const newQuerySpy = Sinon.spy(Model_1.Model.prototype, 'newQuery');
                const queryA = ModelA.newQuery();
                expect(newQuerySpy.calledWith()).toBe(true);
                expect(queryA['handler'].getModel()).toBeInstanceOf(ModelA);
                newQuerySpy.resetHistory();
                const queryB = ModelB.newQuery();
                expect(newQuerySpy.calledWith()).toBe(true);
                expect(queryB['handler'].getModel()).toBeInstanceOf(ModelB);
                newQuerySpy.resetHistory();
                const queryTest = TestModel.newQuery('test');
                expect(newQuerySpy.calledWith('test')).toBe(true);
                expect(queryTest['handler'].getModel()).toBeInstanceOf(TestModel);
                newQuerySpy.resetHistory();
                newQuerySpy.restore();
            });
        });
        describe('.queryName()', function () {
            it('simply calls and returns .newQuery()', function () {
                const spy = Sinon.spy(Model_1.Model, 'newQuery');
                const queryA = ModelA.queryName('test');
                expect(queryA['handler'].getModel()).toBeInstanceOf(ModelA);
                expect(spy.calledWith('test')).toBe(true);
                spy.restore();
            });
        });
        const methods = [
            'setLogGroup',
            'select',
            'limit',
            'orderBy',
            'orderByAsc',
            'orderByDesc',
            'withTrashed',
            'onlyTrashed',
            'where',
            'whereNot',
            'whereIn',
            'whereNotIn',
            'whereNull',
            'whereNotNull',
            'whereBetween',
            'whereNotBetween',
            'get',
            'all',
            'count',
            'pluck',
            'findById',
            'findOrFail',
            'firstOrFail',
            'with'
        ];
        for (const method of methods) {
            describe(`.${method}()`, function () {
                it(`calls .newQuery() then calls .${method}() with original arguments`, function () {
                    const query = {
                        [method]: function () {
                            return 'anything';
                        }
                    };
                    const spy = Sinon.spy(query, method);
                    const stub = Sinon.stub(Model_1.Model, 'newQuery');
                    stub.returns(query);
                    expect(ModelA[method]()).toEqual('anything');
                    expect(spy.calledWith()).toBe(true);
                    spy.resetHistory();
                    expect(ModelA[method](1)).toEqual('anything');
                    expect(spy.calledWith(1)).toBe(true);
                    spy.resetHistory();
                    expect(ModelA[method](1, 2)).toEqual('anything');
                    expect(spy.calledWith(1, 2)).toBe(true);
                    spy.resetHistory();
                    expect(ModelA[method](1, 2, 3)).toEqual('anything');
                    expect(spy.calledWith(1, 2, 3)).toBe(true);
                    spy.resetHistory();
                    stub.restore();
                });
            });
        }
    });
});
