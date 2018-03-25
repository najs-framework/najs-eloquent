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
            expect(createSpy.lastCall.args[1]).toBe(true);
            createSpy.restore();
        });
        it('has a hidden constructor value isGuarded', function () {
            const createSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'create');
            Reflect.construct(Model, [{}, false]);
            expect(createSpy.called).toBe(true);
            expect(createSpy.lastCall.args[0]).toBeInstanceOf(Model);
            expect(createSpy.lastCall.args[1]).toBe(false);
            createSpy.restore();
        });
        it('automatically .register() model if not in ClassRegistry', function () {
            class NotRegisterYet extends Eloquent_1.Eloquent {
                getClassName() {
                    return NotRegisterYet.className;
                }
            }
            NotRegisterYet.className = 'NotRegisterYet';
            expect(najs_binding_1.ClassRegistry.has('NotRegisterYet')).toBe(false);
            new NotRegisterYet();
            expect(najs_binding_1.ClassRegistry.has('NotRegisterYet')).toBe(true);
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
    describe('.getModelName()', function () {
        it('returns .getClassName() by default', function () {
            const model = new Model();
            expect(model.getModelName()).toEqual(model.getClassName());
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
    describe('.getFillable()', function () {
        it('returns [] by default even the fillable property is not set', function () {
            const model = new Model();
            expect(model.getFillable()).toEqual([]);
        });
        it('merges temporarySettings key fillable to Metadata.fillable settings', function () {
            const model = new Model();
            model.markFillable('test', 'a', 'a', 'b');
            expect(model.getFillable()).toEqual(['test', 'a', 'b']);
        });
    });
    describe('.getGuarded()', function () {
        it('returns ["*"] by default even the guarded property is not set', function () {
            const model = new Model();
            expect(model.getGuarded()).toEqual(['*']);
        });
        it('merges temporarySettings key guarded to Metadata.guarded settings', function () {
            const model = new Model();
            model.markGuarded('test', 'a', 'a', 'b');
            expect(model.getGuarded()).toEqual(['*', 'test', 'a', 'b']);
        });
    });
    describe('.isFillable()', function () {
        it('calls .isInWhiteList() with whiteList = .getFillable(), blackList = .getGuarded()', function () {
            const model = new Model();
            const isInWhiteListStub = Sinon.stub(model, 'isInWhiteList');
            isInWhiteListStub.callsFake(() => {
                return 'anything';
            });
            const getFillableStub = Sinon.stub(model, 'getFillable');
            getFillableStub.returns('whiteList');
            const getGuardedStub = Sinon.stub(model, 'getGuarded');
            getGuardedStub.returns('blackList');
            expect(model.isFillable('key')).toEqual('anything');
            expect(isInWhiteListStub.calledWith('key', 'whiteList', 'blackList')).toBe(true);
        });
    });
    describe('.isGuarded()', function () {
        it('calls .isInBlackList() with blackList = .getGuarded()', function () {
            const model = new Model();
            const isInBlackListStub = Sinon.stub(model, 'isInBlackList');
            isInBlackListStub.callsFake(() => {
                return 'anything';
            });
            const getGuardedStub = Sinon.stub(model, 'getGuarded');
            getGuardedStub.returns('blackList');
            expect(model.isGuarded('key')).toEqual('anything');
            expect(isInBlackListStub.calledWith('key', 'blackList')).toBe(true);
        });
    });
    describe('.getVisible()', function () {
        it('returns [] by default even the visible property is not set', function () {
            const model = new Model();
            expect(model.getVisible()).toEqual([]);
        });
        it('merges temporarySettings key visible to Metadata.visible settings', function () {
            const model = new Model();
            model.markVisible('test', 'a', 'a', 'b');
            expect(model.getVisible()).toEqual(['test', 'a', 'b']);
        });
    });
    describe('.getHidden()', function () {
        it('returns [] by default even the hidden property is not set', function () {
            const model = new Model();
            expect(model.getHidden()).toEqual([]);
        });
        it('merges temporarySettings key hidden to Metadata.hidden settings', function () {
            const model = new Model();
            model.markHidden('test', 'a', 'a', 'b');
            expect(model.getHidden()).toEqual(['test', 'a', 'b']);
        });
    });
    describe('.isVisible()', function () {
        it('calls .isInWhiteList() with whiteList = .getVisible(), blackList = .getHidden()', function () {
            const model = new Model();
            const isInWhiteListStub = Sinon.stub(model, 'isInWhiteList');
            isInWhiteListStub.callsFake(() => {
                return 'anything';
            });
            const getVisibleStub = Sinon.stub(model, 'getVisible');
            getVisibleStub.returns('whiteList');
            const getHiddenStub = Sinon.stub(model, 'getHidden');
            getHiddenStub.returns('blackList');
            expect(model.isVisible('key')).toEqual('anything');
            expect(isInWhiteListStub.calledWith('key', 'whiteList', 'blackList')).toBe(true);
        });
    });
    describe('.isHidden()', function () {
        it('calls .isInBlackList() with blackList = .getHidden()', function () {
            const model = new Model();
            const isInBlackListStub = Sinon.stub(model, 'isInBlackList');
            isInBlackListStub.callsFake(() => {
                return 'anything';
            });
            const getHiddenStub = Sinon.stub(model, 'getHidden');
            getHiddenStub.returns('blackList');
            expect(model.isHidden('key')).toEqual('anything');
            expect(isInBlackListStub.calledWith('key', 'blackList')).toBe(true);
        });
    });
    describe('protected .isInWhiteList()', function () {
        it('returns false if whiteList is empty and .isInBlackList() returns false', function () {
            const model = new Model();
            expect(model['isInWhiteList']('first_name', [], ['*'])).toBe(false);
            expect(model['isInWhiteList']('first_name', [], ['first_name'])).toBe(false);
        });
        it('returns true if the key is in whiteList', function () {
            const model = new Model();
            expect(model['isInWhiteList']('first_name', ['first_name'], ['*'])).toBe(true);
            expect(model['isInWhiteList']('last_name', ['first_name'], ['*'])).toBe(false);
        });
        it('returns true key in whiteList despite it also in blackList', function () {
            const model = new Model();
            expect(model['isInWhiteList']('first_name', ['first_name'], ['first_name'])).toBe(true);
        });
        it('returns true if not in whiteList, not in blackList, not known properties and not start by _', function () {
            const model = new Model();
            expect(model['isInWhiteList']('not_defined', [], ['password'])).toBe(true);
            expect(model['isInWhiteList']('driver', [], ['password'])).toBe(false);
            expect(model['isInWhiteList']('_private', [], ['password'])).toBe(false);
        });
    });
    describe('protected .isInBlackList()', function () {
        it('returns true if blackList = [*]', function () {
            const model = new Model();
            expect(model['isInBlackList']('any', ['*'])).toBe(true);
        });
        it('returns true if blackList not equal [*] and key in blackList', function () {
            const model = new Model();
            expect(model['isInBlackList']('first_name', ['password'])).toBe(false);
            expect(model['isInBlackList']('password', ['password'])).toBe(true);
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
    const makeTemporarySettingsMethods = {
        markFillable: 'fillable',
        markGuarded: 'guarded',
        markVisible: 'visible',
        markHidden: 'hidden'
    };
    for (const name in makeTemporarySettingsMethods) {
        describe('.' + name + '()', function () {
            it('is chain-able', function () {
                const model = new Model();
                expect(model[name]('a') === model).toBe(true);
            });
            it('creates temporarySettings with key "' + makeTemporarySettingsMethods[name] + '"', function () {
                const model = new Model();
                expect(model['temporarySettings']).toBeUndefined();
                model[name]('a');
                expect(model['temporarySettings']).toEqual({ [makeTemporarySettingsMethods[name]]: ['a'] });
                model[name](['b', 'c']);
                expect(model['temporarySettings']).toEqual({ [makeTemporarySettingsMethods[name]]: ['a', 'b', 'c'] });
                model[name]('b', ['d'], 'e');
                expect(model['temporarySettings']).toEqual({ [makeTemporarySettingsMethods[name]]: ['a', 'b', 'c', 'd', 'e'] });
            });
        });
    }
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
