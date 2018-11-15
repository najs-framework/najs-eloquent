"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const DriverProvider_1 = require("../../lib/providers/DriverProvider");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
class FakeDriver {
    createStaticMethods() { }
}
FakeDriver.className = 'FakeDriver';
describe('DriverProvider', function () {
    it('implements IAutoload under name "NajsEloquent.Provider.DriverProvider"', function () {
        const instance = new DriverProvider_1.DriverProvider();
        expect(instance.getClassName()).toEqual('NajsEloquent.Provider.DriverProvider');
    });
    describe('.register()', function () {
        it('registers class to ClassRegistry by using najs-binding if the driver is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const chainable = DriverProviderFacade_1.DriverProvider.register(FakeDriver, 'fake');
            expect(chainable === DriverProviderFacade_1.DriverProvider).toBe(true);
            expect(registerSpy.calledWith(FakeDriver)).toBe(true);
            expect(NajsBinding.ClassRegistry.has(FakeDriver.className)).toBe(true);
            expect(DriverProviderFacade_1.DriverProvider['drivers']['fake']).toEqual({
                driverClassName: 'FakeDriver',
                isDefault: false
            });
            DriverProviderFacade_1.DriverProvider.register(FakeDriver, 'fake', true);
            expect(DriverProviderFacade_1.DriverProvider['drivers']['fake']).toEqual({
                driverClassName: 'FakeDriver',
                isDefault: true
            });
            registerSpy.restore();
        });
        it('registers class to ClassRegistry by using najs-binding if the driver is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            DriverProviderFacade_1.DriverProvider.register('FakeDriver', 'fake');
            expect(registerSpy.calledWith(FakeDriver)).toBe(false);
            registerSpy.restore();
        });
    });
    describe('protected .findDefaultDriver()', function () {
        it('returns a empty string if there is no drivers registered', function () {
            DriverProviderFacade_1.DriverProvider['drivers'] = {};
            expect(DriverProviderFacade_1.DriverProvider['findDefaultDriver']()).toEqual('');
        });
        it('returns a the first driver if there is no item with isDefault = true', function () {
            DriverProviderFacade_1.DriverProvider['drivers'] = {
                'test-1': {
                    driverClassName: 'Test1',
                    isDefault: false
                },
                'test-2': {
                    driverClassName: 'Test2',
                    isDefault: false
                }
            };
            expect(DriverProviderFacade_1.DriverProvider['findDefaultDriver']()).toEqual('Test1');
        });
        it('returns a driver with isDefault = true', function () {
            DriverProviderFacade_1.DriverProvider['drivers'] = {
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
            expect(DriverProviderFacade_1.DriverProvider['findDefaultDriver']()).toEqual('FakeDriver');
        });
    });
    describe('protected .createDriver()', function () {
        it('calls "najs-binding".make() to create an instance of driver, model is passed in param', function () {
            const model = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.callsFake(() => ({
                createStaticMethods() { }
            }));
            DriverProviderFacade_1.DriverProvider['createDriver'](model, 'DriverClass');
            expect(makeStub.calledWith('DriverClass', [model]));
            makeStub.restore();
        });
        it('just create instance of driver 1 time', function () {
            const model = {};
            const driver = {};
            DriverProviderFacade_1.DriverProvider['driverInstances']['test'] = driver;
            const result = DriverProviderFacade_1.DriverProvider['createDriver'](model, 'test');
            expect(driver === result).toBe(true);
            expect(DriverProviderFacade_1.DriverProvider['createDriver'](model, 'test') === result).toBe(true);
        });
    });
    describe('.findDriverClassName()', function () {
        it('returns .findDefaultDriver() if there is no binding of model', function () {
            const findDefaultDriverSpy = Sinon.spy(DriverProviderFacade_1.DriverProvider, 'findDefaultDriver');
            DriverProviderFacade_1.DriverProvider.findDriverClassName('not-bind-yet');
            expect(DriverProviderFacade_1.DriverProvider.findDriverClassName('not-bind-yet')).toEqual('FakeDriver');
            expect(findDefaultDriverSpy.called).toBe(true);
            findDefaultDriverSpy.restore();
        });
        it('returns .findDefaultDriver() if driver of model is not exists', function () {
            const findDefaultDriverSpy = Sinon.spy(DriverProviderFacade_1.DriverProvider, 'findDefaultDriver');
            DriverProviderFacade_1.DriverProvider.bind('bound-but-not-found', 'not-found');
            DriverProviderFacade_1.DriverProvider.findDriverClassName('bound-but-not-found');
            expect(findDefaultDriverSpy.called).toBe(true);
            findDefaultDriverSpy.restore();
        });
        it('returns driverClassName if has binding and driver exists', function () {
            const findDefaultDriverSpy = Sinon.spy(DriverProviderFacade_1.DriverProvider, 'findDefaultDriver');
            DriverProviderFacade_1.DriverProvider.bind('model', 'fake');
            expect(DriverProviderFacade_1.DriverProvider.findDriverClassName('model')).toEqual('FakeDriver');
            expect(findDefaultDriverSpy.called).toBe(false);
            findDefaultDriverSpy.restore();
        });
    });
    describe('.bind()', function () {
        it('simply assigns driver and model to private binding variable', function () {
            DriverProviderFacade_1.DriverProvider['binding'] = {};
            expect(DriverProviderFacade_1.DriverProvider['binding']).toEqual({});
            const chainable = DriverProviderFacade_1.DriverProvider.bind('model', 'driver');
            expect(chainable === DriverProviderFacade_1.DriverProvider).toBe(true);
            expect(DriverProviderFacade_1.DriverProvider['binding']).toEqual({ model: 'driver' });
            DriverProviderFacade_1.DriverProvider.bind('model', 'driver-override');
            expect(DriverProviderFacade_1.DriverProvider['binding']).toEqual({ model: 'driver-override' });
        });
    });
    describe('.has()', function () {
        it('returns false if the driver is not register under any name', function () {
            class AnyDriver {
            }
            AnyDriver.className = 'AnyDriver';
            expect(DriverProviderFacade_1.DriverProvider.has(AnyDriver)).toBe(false);
        });
        it('returns true if the given driver is registered under any name', function () {
            class RegisteredDriver {
            }
            RegisteredDriver.className = 'RegisteredDriver';
            DriverProviderFacade_1.DriverProvider.register(RegisteredDriver, 'any');
            expect(DriverProviderFacade_1.DriverProvider.has(RegisteredDriver)).toBe(true);
        });
    });
    describe('.create()', function () {
        it('creates a driver instance with class name provided by .findDriverClassName()', function () {
            const createDriverSpy = Sinon.spy(DriverProviderFacade_1.DriverProvider, 'createDriver');
            const findDriverClassNameSpy = Sinon.spy(DriverProviderFacade_1.DriverProvider, 'findDriverClassName');
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            const instance = DriverProviderFacade_1.DriverProvider.create(model);
            expect(findDriverClassNameSpy.calledWith(model)).toBe(true);
            expect(createDriverSpy.calledWith(model, 'FakeDriver')).toBe(true);
            expect(instance).toBeInstanceOf(FakeDriver);
            findDriverClassNameSpy.restore();
            createDriverSpy.restore();
        });
    });
});
