"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
class FakeDriver {
    createStaticMethods() { }
}
FakeDriver.className = 'FakeDriver';
describe('DriverProvider', function () {
    describe('.register()', function () {
        it('registers class to ClassRegistry by using najs-binding if the driver is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const chainable = EloquentDriverProviderFacade_1.EloquentDriverProvider.register(FakeDriver, 'fake');
            expect(chainable === EloquentDriverProviderFacade_1.EloquentDriverProvider).toBe(true);
            expect(registerSpy.calledWith(FakeDriver)).toBe(true);
            expect(NajsBinding.ClassRegistry.has(FakeDriver.className)).toBe(true);
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['drivers']['fake']).toEqual({
                driverClassName: 'FakeDriver',
                isDefault: false
            });
            EloquentDriverProviderFacade_1.EloquentDriverProvider.register(FakeDriver, 'fake', true);
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['drivers']['fake']).toEqual({
                driverClassName: 'FakeDriver',
                isDefault: true
            });
            registerSpy.restore();
        });
        it('registers class to ClassRegistry by using najs-binding if the driver is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            EloquentDriverProviderFacade_1.EloquentDriverProvider.register('FakeDriver', 'fake');
            expect(registerSpy.calledWith(FakeDriver)).toBe(false);
            registerSpy.restore();
        });
    });
    describe('protected .findDefaultDriver()', function () {
        it('returns a empty string if there is no drivers registered', function () {
            EloquentDriverProviderFacade_1.EloquentDriverProvider['drivers'] = {};
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['findDefaultDriver']()).toEqual('');
        });
        it('returns a the first driver if there is no item with isDefault = true', function () {
            EloquentDriverProviderFacade_1.EloquentDriverProvider['drivers'] = {
                'test-1': {
                    driverClassName: 'Test1',
                    isDefault: false
                },
                'test-2': {
                    driverClassName: 'Test2',
                    isDefault: false
                }
            };
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['findDefaultDriver']()).toEqual('Test1');
        });
        it('returns a driver with isDefault = true', function () {
            EloquentDriverProviderFacade_1.EloquentDriverProvider['drivers'] = {
                'test-1': {
                    driverClassName: 'Test1',
                    isDefault: false
                },
                fake: {
                    driverClassName: 'FakeDriver',
                    isDefault: true
                },
                'test-2': {
                    driverClassName: 'Test2',
                    isDefault: false
                }
            };
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['findDefaultDriver']()).toEqual('FakeDriver');
        });
    });
    describe('protected .createDriver()', function () {
        it('calls "najs-binding".make() to create an instance of driver, model is passed in param', function () {
            const model = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.callsFake(() => ({
                createStaticMethods() { }
            }));
            EloquentDriverProviderFacade_1.EloquentDriverProvider['createDriver'](model, 'DriverClass');
            expect(makeStub.calledWith('DriverClass', [model]));
            makeStub.restore();
        });
    });
    describe('.findDriverClassName()', function () {
        it('returns .findDefaultDriver() if there is no binding of model', function () {
            const findDefaultDriverSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'findDefaultDriver');
            EloquentDriverProviderFacade_1.EloquentDriverProvider.findDriverClassName('not-bind-yet');
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider.findDriverClassName('not-bind-yet')).toEqual('FakeDriver');
            expect(findDefaultDriverSpy.called).toBe(true);
            findDefaultDriverSpy.restore();
        });
        it('returns .findDefaultDriver() if driver of model is not exists', function () {
            const findDefaultDriverSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'findDefaultDriver');
            EloquentDriverProviderFacade_1.EloquentDriverProvider.bind('bound-but-not-found', 'not-found');
            EloquentDriverProviderFacade_1.EloquentDriverProvider.findDriverClassName('bound-but-not-found');
            expect(findDefaultDriverSpy.called).toBe(true);
            findDefaultDriverSpy.restore();
        });
        it('returns driverClassName if has binding and driver exists', function () {
            const findDefaultDriverSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'findDefaultDriver');
            EloquentDriverProviderFacade_1.EloquentDriverProvider.bind('model', 'fake');
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider.findDriverClassName('model')).toEqual('FakeDriver');
            expect(findDefaultDriverSpy.called).toBe(false);
            findDefaultDriverSpy.restore();
        });
    });
    describe('.bind()', function () {
        it('simply assigns driver and model to private binding variable', function () {
            EloquentDriverProviderFacade_1.EloquentDriverProvider['binding'] = {};
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['binding']).toEqual({});
            const chainable = EloquentDriverProviderFacade_1.EloquentDriverProvider.bind('model', 'driver');
            expect(chainable === EloquentDriverProviderFacade_1.EloquentDriverProvider).toBe(true);
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['binding']).toEqual({ model: 'driver' });
            EloquentDriverProviderFacade_1.EloquentDriverProvider.bind('model', 'driver-override');
            expect(EloquentDriverProviderFacade_1.EloquentDriverProvider['binding']).toEqual({ model: 'driver-override' });
        });
    });
    describe('.create()', function () {
        it('creates a driver instance with class name provided by .findDriverClassName()', function () {
            const createDriverSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'createDriver');
            const findDriverClassNameSpy = Sinon.spy(EloquentDriverProviderFacade_1.EloquentDriverProvider, 'findDriverClassName');
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            const instance = EloquentDriverProviderFacade_1.EloquentDriverProvider.create(model);
            expect(findDriverClassNameSpy.calledWith(model)).toBe(true);
            expect(createDriverSpy.calledWith(model, 'FakeDriver')).toBe(true);
            expect(instance).toBeInstanceOf(FakeDriver);
            findDriverClassNameSpy.restore();
            createDriverSpy.restore();
        });
    });
});
