import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'

class FakeDriver {
  static className = 'FakeDriver'

  createStaticMethods() {}
}

describe('DriverProvider', function() {
  describe('.register()', function() {
    it('registers class to ClassRegistry by using najs-binding if the driver is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      const chainable = EloquentDriverProvider.register(FakeDriver, 'fake')

      expect(chainable === EloquentDriverProvider).toBe(true)
      expect(registerSpy.calledWith(FakeDriver)).toBe(true)
      expect(NajsBinding.ClassRegistry.has(FakeDriver.className)).toBe(true)
      expect(EloquentDriverProvider['drivers']['fake']).toEqual({
        driverClassName: 'FakeDriver',
        isDefault: false
      })

      EloquentDriverProvider.register(FakeDriver, 'fake', true)
      expect(EloquentDriverProvider['drivers']['fake']).toEqual({
        driverClassName: 'FakeDriver',
        isDefault: true
      })

      registerSpy.restore()
    })

    it('registers class to ClassRegistry by using najs-binding if the driver is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      EloquentDriverProvider.register('FakeDriver', 'fake')
      expect(registerSpy.calledWith(FakeDriver)).toBe(false)

      registerSpy.restore()
    })
  })

  describe('protected .findDefaultDriver()', function() {
    it('returns a empty string if there is no drivers registered', function() {
      EloquentDriverProvider['drivers'] = {}

      expect(EloquentDriverProvider['findDefaultDriver']()).toEqual('')
    })

    it('returns a the first driver if there is no item with isDefault = true', function() {
      EloquentDriverProvider['drivers'] = {
        'test-1': {
          driverClassName: 'Test1',
          isDefault: false
        },
        'test-2': {
          driverClassName: 'Test2',
          isDefault: false
        }
      }

      expect(EloquentDriverProvider['findDefaultDriver']()).toEqual('Test1')
    })

    it('returns a driver with isDefault = true', function() {
      EloquentDriverProvider['drivers'] = {
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
      }

      expect(EloquentDriverProvider['findDefaultDriver']()).toEqual('FakeDriver')
    })
  })

  describe('protected .createDriver()', function() {
    it('calls "najs-binding".make() to create an instance of driver, model is passed in param', function() {
      const model = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.callsFake(() => ({
        createStaticMethods() {}
      }))

      EloquentDriverProvider['createDriver'](model, 'DriverClass')
      expect(makeStub.calledWith('DriverClass', [model]))
      makeStub.restore()
    })
  })

  describe('.findDriverClassName()', function() {
    it('returns .findDefaultDriver() if there is no binding of model', function() {
      const findDefaultDriverSpy = Sinon.spy(EloquentDriverProvider, <any>'findDefaultDriver')
      EloquentDriverProvider.findDriverClassName('not-bind-yet')
      expect(EloquentDriverProvider.findDriverClassName('not-bind-yet')).toEqual('FakeDriver')
      expect(findDefaultDriverSpy.called).toBe(true)
      findDefaultDriverSpy.restore()
    })

    it('returns .findDefaultDriver() if driver of model is not exists', function() {
      const findDefaultDriverSpy = Sinon.spy(EloquentDriverProvider, <any>'findDefaultDriver')
      EloquentDriverProvider.bind('bound-but-not-found', 'not-found')
      EloquentDriverProvider.findDriverClassName('bound-but-not-found')
      expect(findDefaultDriverSpy.called).toBe(true)
      findDefaultDriverSpy.restore()
    })

    it('returns driverClassName if has binding and driver exists', function() {
      const findDefaultDriverSpy = Sinon.spy(EloquentDriverProvider, <any>'findDefaultDriver')
      EloquentDriverProvider.bind('model', 'fake')
      expect(EloquentDriverProvider.findDriverClassName('model')).toEqual('FakeDriver')
      expect(findDefaultDriverSpy.called).toBe(false)
      findDefaultDriverSpy.restore()
    })
  })

  describe('.bind()', function() {
    it('simply assigns driver and model to private binding variable', function() {
      EloquentDriverProvider['binding'] = {}
      expect(EloquentDriverProvider['binding']).toEqual({})

      const chainable = EloquentDriverProvider.bind('model', 'driver')

      expect(chainable === EloquentDriverProvider).toBe(true)
      expect(EloquentDriverProvider['binding']).toEqual({ model: 'driver' })

      EloquentDriverProvider.bind('model', 'driver-override')
      expect(EloquentDriverProvider['binding']).toEqual({ model: 'driver-override' })
    })
  })

  describe('.create()', function() {
    it('creates a driver instance with class name provided by .findDriverClassName()', function() {
      const createDriverSpy = Sinon.spy(EloquentDriverProvider, <any>'createDriver')
      const findDriverClassNameSpy = Sinon.spy(EloquentDriverProvider, 'findDriverClassName')
      class Model {
        static className = 'Test'
      }
      const model = new Model()
      const instance = EloquentDriverProvider.create(<any>model)

      expect(findDriverClassNameSpy.calledWith(model)).toBe(true)
      expect(createDriverSpy.calledWith(model, 'FakeDriver')).toBe(true)
      expect(instance).toBeInstanceOf(FakeDriver)

      findDriverClassNameSpy.restore()
      createDriverSpy.restore()
    })
  })
})
