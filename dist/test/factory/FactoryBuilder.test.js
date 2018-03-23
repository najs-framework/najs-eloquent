"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const collect_js_1 = require("collect.js");
const najs_binding_1 = require("najs-binding");
const FactoryBuilder_1 = require("../../lib/factory/FactoryBuilder");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const Eloquent_1 = require("../../lib/model/Eloquent");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
class Model extends Eloquent_1.Eloquent {
    getClassName() {
        return 'Model';
    }
}
najs_binding_1.register(Model);
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
        it('flatten param to "activeStates"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            expect(builder['activeStates']).toBeUndefined();
            builder.states('test');
            expect(builder['activeStates']).toEqual(['test']);
            builder.states('a', 'b');
            expect(builder['activeStates']).toEqual(['a', 'b']);
            builder.states(['a', 'b', 'c']);
            expect(builder['activeStates']).toEqual(['a', 'b', 'c']);
            builder.states(['a', 'b'], ['c', 'd']);
            expect(builder['activeStates']).toEqual(['a', 'b', 'c', 'd']);
        });
    });
    describe('.create()', function () {
        it('calls .make() and if the result is instance of Eloquent, it calls .save() and returns result', async function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeStub = Sinon.stub(builder, 'make');
            const model = new Model();
            model['save'] = Sinon.spy(function () { });
            makeStub.returns(model);
            const valueOne = await builder.create();
            expect(valueOne === model).toBe(true);
            expect(makeStub.calledWith()).toBe(true);
            expect(model['save'].callCount).toEqual(1);
            const params = {};
            const valueTwo = await builder.create(params);
            expect(valueTwo === model).toBe(true);
            expect(makeStub.calledWith(params)).toBe(true);
            expect(model['save'].callCount).toEqual(2);
        });
        it('calls .make() and loop all model in Collection, calls .save() and returns result', async function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeStub = Sinon.stub(builder, 'make');
            const model = new Model();
            model['save'] = Sinon.spy(function () { });
            makeStub.returns(collect_js_1.default([model, model]));
            const valueOne = await builder.create();
            expect(valueOne).toEqual({ items: [model, model] });
            expect(makeStub.calledWith()).toBe(true);
            expect(model['save'].callCount).toEqual(2);
            const params = {};
            const valueTwo = await builder.create(params);
            expect(valueTwo).toEqual({ items: [model, model] });
            expect(makeStub.calledWith(params)).toBe(true);
            expect(model['save'].callCount).toEqual(4);
        });
    });
    describe('.make()', function () {
        it('simply calls .makeInstance() and returns result if there is no "amount"', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Class', 'name', {}, {}, {});
            const makeInstanceStub = Sinon.stub(builder, 'makeInstance');
            makeInstanceStub.returns('anything');
            expect(builder.make()).toEqual('anything');
            expect(makeInstanceStub.calledWith()).toBe(true);
            const params = {};
            expect(builder.make(params)).toEqual('anything');
            expect(makeInstanceStub.calledWith(params)).toBe(true);
        });
        it('calls .make().newCollection() with empty array if "amount" < 1', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Model', 'name', {}, {}, {});
            const newCollectionSpy = Sinon.spy(Model.prototype, 'newCollection');
            builder.times(0);
            expect(builder.make().count()).toEqual(0);
            expect(newCollectionSpy.calledWith([])).toBe(true);
            newCollectionSpy.restore();
        });
        it('calls .make().newCollection() with .makeInstance() result n times', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Model', 'name', {}, {}, {});
            const newCollectionSpy = Sinon.spy(Model.prototype, 'newCollection');
            const makeInstanceStub = Sinon.stub(builder, 'makeInstance');
            makeInstanceStub.returns('anything');
            builder.times(3);
            expect(builder.make().count()).toEqual(3);
            expect(makeInstanceStub.callCount).toEqual(3);
            expect(newCollectionSpy.calledWith(['anything', 'anything', 'anything'])).toBe(true);
            newCollectionSpy.restore();
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
            builder.times(0);
            expect(builder.raw().count()).toEqual(0);
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
    describe('protected .makeInstance()', function () {
        it('does something', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Model', 'name', {}, {}, {});
            builder['makeInstance']();
        });
    });
    describe('protected .getRawAttributes()', function () {
        it('does something', function () {
            const builder = new FactoryBuilder_1.FactoryBuilder('Model', 'name', {}, {}, {});
            builder['getRawAttributes']();
        });
    });
});
