"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const najs_facade_1 = require("najs-facade");
const MemoryDataSourceProviderFacade_1 = require("../../lib/facades/global/MemoryDataSourceProviderFacade");
class FakeDataSource {
}
FakeDataSource.className = 'FakeDataSource';
describe('MemoryDataSourceProvider', function () {
    it('extends Facade, implements Autoload under name "NajsEloquent.Provider.MemoryDataSourceProvider"', function () {
        expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider).toBeInstanceOf(najs_facade_1.Facade);
        expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.getClassName()).toEqual('NajsEloquent.Provider.MemoryDataSourceProvider');
    });
    describe('.register()', function () {
        it('registers class to ClassRegistry by using najs-binding if the dataSource is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const chainable = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register(FakeDataSource, 'fake');
            expect(chainable === MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider).toBe(true);
            expect(registerSpy.calledWith(FakeDataSource)).toBe(true);
            expect(NajsBinding.ClassRegistry.has(FakeDataSource.className)).toBe(true);
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['dataSources']['fake']).toEqual({
                className: 'FakeDataSource',
                isDefault: false
            });
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register(FakeDataSource, 'fake', true);
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['dataSources']['fake']).toEqual({
                className: 'FakeDataSource',
                isDefault: true
            });
            registerSpy.restore();
        });
        it('registers class to ClassRegistry by using najs-binding if the dataSource is a function', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register('FakeDataSource', 'fake');
            expect(registerSpy.calledWith(FakeDataSource)).toBe(false);
            registerSpy.restore();
        });
    });
    describe('protected .findDefaultDataSourceClassName()', function () {
        it('returns a empty string if there is no dataSources registered', function () {
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['dataSources'] = {};
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('');
        });
        it('returns a the first dataSource if there is no item with isDefault = true', function () {
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['dataSources'] = {
                'test-1': {
                    className: 'Test1',
                    isDefault: false
                },
                'test-2': {
                    className: 'Test2',
                    isDefault: false
                }
            };
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('Test1');
        });
        it('returns a dataSource with isDefault = true', function () {
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['dataSources'] = {
                'test-1': {
                    className: 'Test1',
                    isDefault: false
                },
                fake: {
                    className: 'FakeDataSource',
                    isDefault: true
                },
                'test-2': {
                    className: 'Test2',
                    isDefault: false
                }
            };
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('FakeDataSource');
        });
    });
    describe('.findMemoryDataSourceClassName()', function () {
        it('returns .findDefaultDataSourceClassName() if there is no binding of model', function () {
            const spy = Sinon.spy(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider, 'findDefaultDataSourceClassName');
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.findMemoryDataSourceClassName('not-bind-yet');
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.findMemoryDataSourceClassName('not-bind-yet')).toEqual('FakeDataSource');
            expect(spy.called).toBe(true);
            spy.restore();
        });
        it('returns .findDefaultDataSourceClassName() if driver of model is not exists', function () {
            const spy = Sinon.spy(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider, 'findDefaultDataSourceClassName');
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.bind('bound-but-not-found', 'not-found');
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.findMemoryDataSourceClassName('bound-but-not-found');
            expect(spy.called).toBe(true);
            spy.restore();
        });
        it('returns driverClassName if has binding and driver exists', function () {
            const spy = Sinon.spy(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider, 'findDefaultDataSourceClassName');
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.bind('model', 'fake');
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.findMemoryDataSourceClassName('model')).toEqual('FakeDataSource');
            expect(spy.called).toBe(false);
            spy.restore();
        });
    });
    describe('.bind()', function () {
        it('simply assigns driver and model to private binding variable', function () {
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['binding'] = {};
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['binding']).toEqual({});
            const chainable = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.bind('model', 'dataSource');
            expect(chainable === MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider).toBe(true);
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['binding']).toEqual({ model: 'dataSource' });
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.bind('model', 'dataSource-override');
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider['binding']).toEqual({ model: 'dataSource-override' });
        });
    });
    describe('.has()', function () {
        it('returns false if the driver is not register under any name', function () {
            class AnyDataSource {
            }
            AnyDataSource.className = 'AnyDataSource';
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.has(AnyDataSource)).toBe(false);
        });
        it('returns true if the given driver is registered under any name', function () {
            class RegisteredDataSource {
            }
            RegisteredDataSource.className = 'RegisteredDataSource';
            MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register(RegisteredDataSource, 'any');
            expect(MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.has(RegisteredDataSource)).toBe(true);
        });
    });
    describe('.create()', function () {
        it('creates an instance of DataSource and store to cached variable by model name', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns({});
            const model = {
                getModelName() {
                    return 'Model';
                }
            };
            const instance = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.create(model);
            expect(makeStub.calledWith('FakeDataSource', [model])).toBe(true);
            const newInstance = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.create(model);
            expect(newInstance === instance).toBe(true);
        });
    });
});
