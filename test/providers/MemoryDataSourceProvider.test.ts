import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { Facade } from 'najs-facade'
import { MemoryDataSourceProvider } from '../../lib/facades/global/MemoryDataSourceProviderFacade'

class FakeDataSource {
  static className = 'FakeDataSource'
}

describe('MemoryDataSourceProvider', function() {
  it('extends Facade, implements Autoload under name "NajsEloquent.Provider.MemoryDataSourceProvider"', function() {
    expect(MemoryDataSourceProvider).toBeInstanceOf(Facade)
    expect(MemoryDataSourceProvider.getClassName()).toEqual('NajsEloquent.Provider.MemoryDataSourceProvider')
  })

  describe('.register()', function() {
    it('registers class to ClassRegistry by using najs-binding if the dataSource is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      const chainable = MemoryDataSourceProvider.register(FakeDataSource, 'fake')

      expect(chainable === MemoryDataSourceProvider).toBe(true)
      expect(registerSpy.calledWith(FakeDataSource)).toBe(true)
      expect(NajsBinding.ClassRegistry.has(FakeDataSource.className)).toBe(true)
      expect(MemoryDataSourceProvider['dataSources']['fake']).toEqual({
        className: 'FakeDataSource',
        isDefault: false
      })

      MemoryDataSourceProvider.register(FakeDataSource, 'fake', true)
      expect(MemoryDataSourceProvider['dataSources']['fake']).toEqual({
        className: 'FakeDataSource',
        isDefault: true
      })

      registerSpy.restore()
    })

    it('registers class to ClassRegistry by using najs-binding if the dataSource is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      MemoryDataSourceProvider.register('FakeDataSource', 'fake')
      expect(registerSpy.calledWith(FakeDataSource)).toBe(false)

      registerSpy.restore()
    })
  })

  describe('protected .findDefaultDataSourceClassName()', function() {
    it('returns a empty string if there is no dataSources registered', function() {
      MemoryDataSourceProvider['dataSources'] = {}

      expect(MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('')
    })

    it('returns a the first dataSource if there is no item with isDefault = true', function() {
      MemoryDataSourceProvider['dataSources'] = {
        'test-1': {
          className: 'Test1',
          isDefault: false
        },
        'test-2': {
          className: 'Test2',
          isDefault: false
        }
      }

      expect(MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('Test1')
    })

    it('returns a dataSource with isDefault = true', function() {
      MemoryDataSourceProvider['dataSources'] = {
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
      }

      expect(MemoryDataSourceProvider['findDefaultDataSourceClassName']()).toEqual('FakeDataSource')
    })
  })

  describe('.findMemoryDataSourceClassName()', function() {
    it('returns .findDefaultDataSourceClassName() if there is no binding of model', function() {
      const spy = Sinon.spy(MemoryDataSourceProvider, <any>'findDefaultDataSourceClassName')
      MemoryDataSourceProvider.findMemoryDataSourceClassName('not-bind-yet')
      expect(MemoryDataSourceProvider.findMemoryDataSourceClassName('not-bind-yet')).toEqual('FakeDataSource')
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('returns .findDefaultDataSourceClassName() if driver of model is not exists', function() {
      const spy = Sinon.spy(MemoryDataSourceProvider, <any>'findDefaultDataSourceClassName')
      MemoryDataSourceProvider.bind('bound-but-not-found', 'not-found')
      MemoryDataSourceProvider.findMemoryDataSourceClassName('bound-but-not-found')
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('returns driverClassName if has binding and driver exists', function() {
      const spy = Sinon.spy(MemoryDataSourceProvider, <any>'findDefaultDataSourceClassName')
      MemoryDataSourceProvider.bind('model', 'fake')
      expect(MemoryDataSourceProvider.findMemoryDataSourceClassName('model')).toEqual('FakeDataSource')
      expect(spy.called).toBe(false)
      spy.restore()
    })
  })

  describe('.bind()', function() {
    it('simply assigns driver and model to private binding variable', function() {
      MemoryDataSourceProvider['binding'] = {}
      expect(MemoryDataSourceProvider['binding']).toEqual({})

      const chainable = MemoryDataSourceProvider.bind('model', 'dataSource')

      expect(chainable === MemoryDataSourceProvider).toBe(true)
      expect(MemoryDataSourceProvider['binding']).toEqual({ model: 'dataSource' })

      MemoryDataSourceProvider.bind('model', 'dataSource-override')
      expect(MemoryDataSourceProvider['binding']).toEqual({ model: 'dataSource-override' })
    })
  })

  describe('.has()', function() {
    it('returns false if the driver is not register under any name', function() {
      class AnyDataSource {
        static className = 'AnyDataSource'
      }
      expect(MemoryDataSourceProvider.has(AnyDataSource)).toBe(false)
    })

    it('returns true if the given driver is registered under any name', function() {
      class RegisteredDataSource {
        static className = 'RegisteredDataSource'
      }
      MemoryDataSourceProvider.register(RegisteredDataSource, 'any')
      expect(MemoryDataSourceProvider.has(RegisteredDataSource)).toBe(true)
    })
  })

  describe('.create()', function() {
    it('creates an instance of DataSource and store to cached variable by model name', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns({})

      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const instance = MemoryDataSourceProvider.create(model)
      expect(makeStub.calledWith('FakeDataSource', [model])).toBe(true)
      const newInstance = MemoryDataSourceProvider.create(model)
      expect(newInstance === instance).toBe(true)
    })
  })
})
