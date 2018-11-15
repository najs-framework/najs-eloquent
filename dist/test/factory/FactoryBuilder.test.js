"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const Utils = require("../../lib/util/factory");
const collect_js_1 = require("collect.js");
const FactoryBuilder_1 = require("../../lib/factory/FactoryBuilder");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
const Model_1 = require("../../lib/model/Model");
DriverProviderFacade_1.DriverProvider.register(MemoryDriver_1.MemoryDriver, 'memory', true);
class TestModel extends Model_1.Model {
    getClassName() {
        return 'TestModel';
    }
}
NajsBinding.register(TestModel);
describe('FactoryBuilder', function () {
    describe('constructor()', function () {
        it('simply creates new instance and assign parameters to member variables', function () {
            const faker = {};
            const definitions = {};
            const states = {};
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', definitions, states, faker);
            expect(builder['className']).toEqual('Class');
            expect(builder['name']).toEqual('name');
            expect(builder['definitions'] === definitions).toBe(true);
            expect(builder['definedStates'] === states).toBe(true);
            expect(builder['faker'] === faker).toBe(true);
            expect(builder['amount']).toBeUndefined();
            expect(builder['activeStates']).toBeUndefined();
        });
    });
    describe('.getClassName()', function () {
        it('implements Autoload under name "NajsEloquent.Factory.FactoryBuilder"', function () {
            const faker = {};
            const definitions = {};
            const states = {};
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', definitions, states, faker);
            expect(builder.getClassName()).toEqual('NajsEloquent.Factory.FactoryBuilder');
        });
    });
    describe('.times()', function () {
        it('assigns param to "amount"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            expect(builder['amount']).toBeUndefined();
            builder.times(-1);
            expect(builder['amount']).toEqual(-1);
            builder.times(0);
            expect(builder['amount']).toEqual(0);
            builder.times(1);
            expect(builder['amount']).toEqual(1);
            builder.times(10);
            expect(builder['amount']).toEqual(10);
        });
    });
    describe('.states()', function () {
        it('flatten params and assign to "activeStates"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            expect(builder['activeStates']).toBeUndefined();
            builder['activeStates'] = [];
            builder.states('test');
            expect(builder['activeStates']).toEqual(['test']);
            builder['activeStates'] = [];
            builder.states('a', 'b');
            expect(builder['activeStates']).toEqual(['a', 'b']);
            builder['activeStates'] = [];
            builder.states(['a', 'b', 'c']);
            expect(builder['activeStates']).toEqual(['a', 'b', 'c']);
            builder['activeStates'] = [];
            builder.states(['a', 'b'], ['c', 'd']);
            expect(builder['activeStates']).toEqual(['a', 'b', 'c', 'd']);
            builder['activeStates'] = [];
            builder
                .states('a', 'b')
                .states(['c'])
                .states(['d', 'e']);
            expect(builder['activeStates']).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });
    describe('.create()', function () {
        it('calls .make() and if the result is instance of Eloquent, it calls .save() and returns result', async function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeStub = Sinon.stub(builder, 'make');
            const model = new TestModel();
            model['save'] = Sinon.spy(function () { });
            makeStub.returns(model);
            const valueOne = await builder.create();
            expect(valueOne === model).toBe(true);
            expect(makeStub.calledWith()).toBe(true);
            expect(model['save']['callCount']).toEqual(1);
            const params = {};
            const valueTwo = await builder.create(params);
            expect(valueTwo === model).toBe(true);
            expect(makeStub.calledWith(params)).toBe(true);
            expect(model['save']['callCount']).toEqual(2);
        });
        it('calls .make() and loop all model in Collection, calls .save() and returns result', async function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeStub = Sinon.stub(builder, 'make');
            const model = new TestModel();
            model['save'] = Sinon.spy(function () { });
            makeStub.returns(collect_js_1.default([model, model]));
            const valueOne = await builder.create();
            expect(valueOne).toEqual({ items: [model, model] });
            expect(makeStub.calledWith()).toBe(true);
            expect(model['save']['callCount']).toEqual(2);
            const params = {};
            const valueTwo = await builder.create(params);
            expect(valueTwo).toEqual({ items: [model, model] });
            expect(makeStub.calledWith(params)).toBe(true);
            expect(model['save']['callCount']).toEqual(4);
        });
    });
    describe('.make()', function () {
        it('simply calls .makeModelInstance() and returns result if there is no "amount"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeModelInstanceStub = Sinon.stub(builder, 'makeModelInstance');
            makeModelInstanceStub.returns('anything');
            expect(builder.make()).toEqual('anything');
            expect(makeModelInstanceStub.calledWith()).toBe(true);
            const params = {};
            expect(builder.make(params)).toEqual('anything');
            expect(makeModelInstanceStub.calledWith(params)).toBe(true);
        });
        it('calls make_collection() with empty array if "amount" < 1', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const makeCollectionSpy = Sinon.spy(Utils, 'make_collection');
            expect(builder
                .times(0)
                .make()
                .count()).toEqual(0);
            expect(makeCollectionSpy.calledWith([])).toBe(true);
            makeCollectionSpy.restore();
        });
        it('maps and create data using range() then calls make_collection() and mapped by .makeModelInstance()', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const makeCollectionSpy = Sinon.spy(Utils, 'make_collection');
            const makeModelInstanceStub = Sinon.stub(builder, 'makeModelInstance');
            makeModelInstanceStub.returns('anything');
            const attributes = {};
            expect(builder
                .times(3)
                .make(attributes)
                .count()).toEqual(3);
            expect(makeModelInstanceStub.getCall(0).calledWith(attributes)).toBe(true);
            expect(makeModelInstanceStub.getCall(1).calledWith(attributes)).toBe(true);
            expect(makeModelInstanceStub.getCall(2).calledWith(attributes)).toBe(true);
            expect(makeModelInstanceStub.callCount).toEqual(3);
            expect(makeCollectionSpy.calledWith([0, 1, 2])).toBe(true);
            makeCollectionSpy.restore();
        });
    });
    describe('.raw()', function () {
        it('simply calls .getRawAttributes() and returns result if there is no "amount"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const getRawAttributesStub = Sinon.stub(builder, 'getRawAttributes');
            getRawAttributesStub.returns('anything');
            expect(builder.raw()).toEqual('anything');
            expect(getRawAttributesStub.calledWith()).toBe(true);
            const params = {};
            expect(builder.raw(params)).toEqual('anything');
            expect(getRawAttributesStub.calledWith(params)).toBe(true);
        });
        it('returns empty collection if "amount" < 1', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            expect(builder
                .times(0)
                .raw()
                .count()).toEqual(0);
        });
        it('returns a Collection which wraps .getRawAttributes() result n times', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const getRawAttributesStub = Sinon.stub(builder, 'getRawAttributes');
            getRawAttributesStub.returns('anything');
            builder.times(3);
            expect(builder.raw()).toEqual({ items: ['anything', 'anything', 'anything'] });
            expect(getRawAttributesStub.callCount).toEqual(3);
        });
    });
    describe('.makeModelInstance()', function () {
        it('calls .make() to create instance of model with 2 params, 1st from .getRawAttribute(), 2nd is isGuarded always = false', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const getRawAttributesStub = Sinon.stub(builder, 'getRawAttributes');
            getRawAttributesStub.returns('anything');
            const firstInstance = builder.makeModelInstance();
            expect(firstInstance).toBeInstanceOf(TestModel);
            expect(firstInstance).toBeInstanceOf(Model_1.Model);
            expect(getRawAttributesStub.calledWith()).toBe(true);
            expect(makeSpy.calledWith('TestModel', ['anything', false])).toBe(true);
            const attributes = {};
            const secondInstance = builder.makeModelInstance(attributes);
            expect(secondInstance).toBeInstanceOf(Model_1.Model);
            expect(getRawAttributesStub.calledWith(attributes)).toBe(true);
            expect(makeSpy.calledWith('TestModel', ['anything', false])).toBe(true);
            makeSpy.restore();
        });
    });
    describe('protected .getRawAttributes()', function () {
        it('throws an exception if definition not defined in "definitions"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            try {
                builder.getRawAttributes({});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Unable to locate factory with name [name] [TestModel].');
                return;
            }
            expect('should not reach here').toEqual('hmm');
        });
        it('throws an exception if definition is not a function', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {
                Model: {
                    name: 'invalid'
                }
            }, {}, {});
            try {
                builder.getRawAttributes({});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Unable to locate factory with name [name] [TestModel].');
                return;
            }
            expect('should not reach here').toEqual('hmm');
        });
        it('calls definition to get definition value, then call .applyStates() and .triggerReferenceAttributes()', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {
                TestModel: {
                    name: function (faker, attributes) {
                        return {
                            a: 1,
                            b: 2
                        };
                    }
                }
            }, {}, {});
            const applyStatesSpy = Sinon.spy(builder, 'applyStates');
            const triggerReferenceAttributesSpy = Sinon.spy(builder, 'triggerReferenceAttributes');
            const result = builder.getRawAttributes();
            expect(result).toEqual({ a: 1, b: 2 });
            expect(applyStatesSpy.called).toBe(true);
            expect(triggerReferenceAttributesSpy.called).toBe(true);
        });
    });
    describe('.applyStates()', function () {
        it('returns definition if there is no "activeStates"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const definition = {};
            expect(builder.applyStates(definition, {}) === definition).toBe(true);
        });
        it('loops all activeState and throw an exception if not defined in "definedState"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            try {
                builder.states('test').applyStates({}, {});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Unable to locate [test] state for [TestModel].');
                return;
            }
            expect('should not reach here').toEqual('hmm');
        });
        it('loops all "activeState" and throw an exception if stateDefinition is not a function', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {
                Model: {
                    test: 'wrong type'
                }
            }, {});
            try {
                builder.states('test').applyStates({}, {});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Unable to locate [test] state for [TestModel].');
                return;
            }
            expect('should not reach here').toEqual('hmm');
        });
        it('loops all "activeState" and call state definition, then merge the result to definition', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {
                TestModel: {
                    test: function (faker, attributes) {
                        return {
                            a: 1,
                            b: 2,
                            c: attributes['c']
                        };
                    }
                }
            }, {});
            const definition = { a: 10 };
            builder.states('test');
            expect(builder.applyStates(definition, { c: 'test' }) === definition).toBe(true);
            expect(definition).toEqual({ a: 1, b: 2, c: 'test' });
        });
    });
    describe('protected .triggerReferenceAttributes()', function () {
        it('calls a function and reassign value if the property of attribute is a function', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const attributes = {
                a: 1,
                b: 2,
                c: function (attr) {
                    return attr['a'] + attr['b'];
                },
                d: function () {
                    return 'string';
                }
            };
            expect(builder.triggerReferenceAttributes(attributes)).toEqual({ a: 1, b: 2, c: 3, d: 'string' });
        });
        it('calls .getPrimaryKey() and reassign value if the property of attribute is an instance of Model', function () {
            const model = new TestModel();
            model.setPrimaryKey('test');
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const attributes = {
                a: 1,
                b: 2,
                c: model
            };
            expect(builder.triggerReferenceAttributes(attributes)).toEqual({ a: 1, b: 2, c: 'test' });
        });
        it('works if the property is a function with returns an instance of Model', function () {
            const model = new TestModel();
            model.setPrimaryKey('test');
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const attributes = {
                a: 1,
                b: 2,
                c: function () {
                    return model;
                }
            };
            expect(builder.triggerReferenceAttributes(attributes)).toEqual({ a: 1, b: 2, c: 'test' });
        });
        it('works with nested object', function () {
            const model = new TestModel();
            model.setPrimaryKey('test');
            const builder = new FactoryBuilder_1.FactoryBuilder('TestModel', 'name', {}, {}, {});
            const attributes = {
                a: 10,
                b: 20,
                child: {
                    a: 1,
                    b: 2,
                    c: function (attr) {
                        return attr['a'] + attr['b'];
                    },
                    d: model,
                    e: function () {
                        return model;
                    }
                },
                level0: {
                    level1: {
                        level2: {
                            a: function () {
                                return 'multi';
                            }
                        }
                    }
                }
            };
            expect(builder.triggerReferenceAttributes(attributes)).toEqual({
                a: 10,
                b: 20,
                child: { a: 1, b: 2, c: 3, d: 'test', e: 'test' },
                level0: {
                    level1: {
                        level2: {
                            a: 'multi'
                        }
                    }
                }
            });
        });
    });
});
