"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../lib/providers/DriverManager");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const Eloquent_1 = require("../../lib/model/Eloquent");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const EloquentMetadata_1 = require("../../lib/model/EloquentMetadata");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy');
class Model extends Eloquent_1.Eloquent {
    getClassName() {
        return 'Model';
    }
}
najs_binding_1.register(Model);
function update_model_setting(property, value) {
    Model[property] = value;
    EloquentMetadata_1.EloquentMetadata.get(new Model(), false);
}
describe('Eloquent', function () {
    describe('constructor()', function () {
        it('always creates driver via EloquentDriverProvider.create()', function () {
            const createSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'create');
            new Model();
            expect(createSpy.called).toBe(true);
            expect(createSpy.lastCall.args[0]).toBeInstanceOf(Model);
            createSpy.restore();
        });
        it('calls driver.initialize(), assigns attributes = driver.getRecords() and returns Proxy', function () {
            const fakeDriver = {
                record: undefined,
                initialize(data) {
                    this.record = {};
                },
                getRecord() {
                    return this.record;
                },
                getReservedNames() {
                    return [];
                },
                getDriverProxyMethods() {
                    return [];
                },
                getQueryProxyMethods() {
                    return [];
                }
            };
            const initializeSpy = Sinon.spy(fakeDriver, 'initialize');
            const createStub = Sinon.stub(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'create');
            createStub.returns(fakeDriver);
            const model = new Model();
            expect(initializeSpy.calledWith()).toBe(true);
            expect(model['attributes']).toEqual({});
            expect(model['attributes'] === fakeDriver.record).toBe(true);
            const test = {};
            new Model(test);
            expect(initializeSpy.calledWith(test)).toBe(true);
            createStub.restore();
        });
        it('has a hidden params "do-not-initialize" which never calls driver.initialize() and returns Proxy', function () {
            const fakeDriver = {
                record: undefined,
                initialize(data) {
                    this.record = {};
                },
                getRecord() {
                    return this.record;
                },
                getReservedNames() {
                    return [];
                },
                getDriverProxyMethods() {
                    return [];
                },
                getQueryProxyMethods() {
                    return [];
                }
            };
            const initializeSpy = Sinon.spy(fakeDriver, 'initialize');
            const createStub = Sinon.stub(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'create');
            createStub.returns(fakeDriver);
            const model = new Model('do-not-initialize');
            expect(initializeSpy.calledWith()).toBe(false);
            expect(model['attributes']).toBeUndefined();
            createStub.restore();
        });
    });
    const forwardToDriverMethods = {
        getAttribute: 'getAttribute',
        setAttribute: 'setAttribute',
        toObject: 'toObject',
        toJSON: 'toJSON',
        toJson: 'toJSON'
    };
    for (const name in forwardToDriverMethods) {
        describe('.' + name + '()', function () {
            it('forward to .driver.' + forwardToDriverMethods[name] + '() and returns result', function () {
                const model = new Model();
                const stub = Sinon.stub(model['driver'], forwardToDriverMethods[name]);
                stub.returns('anything');
                expect(model[name]()).toEqual('anything');
                expect(stub.calledWith());
                expect(model[name]('test')).toEqual('anything');
                expect(stub.calledWith('test'));
                expect(model[name]('a', 'b')).toEqual('anything');
                expect(stub.calledWith('a', 'b'));
                stub.restore();
            });
        });
    }
    describe('.getGuarded()', function () {
        it('returns ["*"] by default even the guarded property is not set', function () {
            const model = new Model();
            expect(model.getGuarded()).toEqual(['*']);
        });
    });
    describe('.isGuarded()', function () {
        it('guards all attributes by default', function () {
            const model = new Model();
            expect(model.isGuarded('first_name')).toBe(true);
        });
        it('checks attribute in guarded property if it was set', function () {
            const model = new Model();
            update_model_setting('guarded', ['password']);
            expect(model.isGuarded('first_name')).toBe(false);
            expect(model.isGuarded('last_name')).toBe(false);
            expect(model.isGuarded('password')).toBe(true);
        });
    });
    describe('.getFillable()', function () {
        it('returns [] by default even the fillable property is not set', function () {
            const model = new Model();
            expect(model.getFillable()).toEqual([]);
        });
    });
    describe('.isFillable()', function () {
        it('returns false if fillable is not defined', function () {
            const model = new Model();
            update_model_setting('fillable', []);
            update_model_setting('guarded', ['*']);
            expect(model.isFillable('first_name')).toBe(false);
            expect(model.isFillable('last_name')).toBe(false);
        });
        it('returns true if the key is in fillable', function () {
            const model = new Model();
            update_model_setting('fillable', ['first_name']);
            expect(model.isFillable('first_name')).toBe(true);
            expect(model.isFillable('last_name')).toBe(false);
        });
        it('returns false if the key is guarded', function () {
            const model = new Model();
            update_model_setting('fillable', ['last_name']);
            update_model_setting('guarded', ['first_name']);
            expect(model.isFillable('first_name')).toBe(false);
            expect(model.isFillable('last_name')).toBe(true);
        });
        it('returns true if fillable not defined, not in guarded, not known properties and not start by _', function () {
            const model = new Model();
            update_model_setting('fillable', []);
            update_model_setting('guarded', ['password']);
            expect(model.isFillable('not_defined')).toBe(true);
            expect(model.isFillable('driver')).toBe(false);
            expect(model.isFillable('_private')).toBe(false);
        });
        it('always checks in fillable before guarded', function () {
            const model = new Model();
            update_model_setting('fillable', ['first_name']);
            update_model_setting('guarded', ['first_name']);
            expect(model.isFillable('first_name')).toBe(true);
            expect(model.isFillable('last_name')).toBe(false);
        });
    });
    describe('.fill()', function () {
        it('fills data which if isFillable(key) returns true', function () {
            const model = new Model();
            update_model_setting('fillable', ['first_name']);
            model.fill({
                first_name: 'john',
                last_name: 'doe',
                not_fillable: 'anything'
            });
            expect(model.getAttribute('first_name')).toEqual('john');
            expect(model.toObject()).toEqual({ first_name: 'john' });
        });
        it('calls setAttribute() to assign fillable attribute', function () {
            const model = new Model();
            update_model_setting('fillable', ['first_name']);
            model.fill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(model.toJSON()).toEqual({ first_name: 'john' });
        });
        it('could fill any attributes by default except start with _', function () {
            const model = new Model();
            update_model_setting('fillable', []);
            update_model_setting('guarded', []);
            model.fill({
                not_config: 'filled',
                _test: 'will not filled'
            });
            expect(model.toJSON()).toEqual({ not_config: 'filled' });
        });
    });
    describe('.forceFill()', function () {
        it('fills data even they are not fillable', function () {
            const model = new Model();
            update_model_setting('fillable', ['first_name']);
            update_model_setting('guarded', ['last_name']);
            model.forceFill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(model.getAttribute('first_name')).toEqual('john');
            expect(model.getAttribute('last_name')).toEqual('doe');
            expect(model.toObject()).toEqual({ first_name: 'john', last_name: 'doe' });
        });
        it('calls setAttribute() to assign fillable attribute', function () {
            const model = new Model();
            model.forceFill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(model.toObject()).toEqual({ first_name: 'john', last_name: 'doe' });
        });
    });
    describe('.newInstance(data)', function () {
        it('creates new instance of Eloquent based by passing data', function () {
            const model = new Model();
            const copy = model.newInstance({ first_name: 'john' });
            expect(copy).toBeInstanceOf(Model);
            expect(copy === model.newInstance()).toBe(false);
            expect(copy.toObject()).toEqual({ first_name: 'john' });
        });
    });
    describe('.newCollection(data)', function () {
        it('create new instance of Eloquent based by passing data', function () {
            const model = new Model();
            const collection = model.newCollection([{ first_name: 'john' }]);
            expect(collection.items[0]).toBeInstanceOf(Model);
            expect(collection.all().map(item => item.toObject())).toEqual([{ first_name: 'john' }]);
        });
    });
});
