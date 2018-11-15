import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { DriverProvider as DriverProviderClass } from '../../lib/providers/DriverProvider'
import { DriverProvider } from '../../lib/facades/global/DriverProviderFacade'

class FakeDriver {
  static className = 'FakeDriver'

  createStaticMethods() {}
}

describe('DriverProvider', function() {
  it('implements IAutoload under name "NajsEloquent.Provider.DriverProvider"', function() {
    const instance = new DriverProviderClass()
    expect(instance.getClassName()).toEqual('NajsEloquent.Provider.DriverProvider')
  })

  describe('.register()', function() {
    it('registers class to ClassRegistry by using najs-binding if the driver is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      const chainable = DriverProvider.register(FakeDriver, 'fake')

      expect(chainable === DriverProvider).toBe(true)
      expect(registerSpy.calledWith(FakeDriver)).toBe(true)
      expect(NajsBinding.ClassRegistry.has(FakeDriver.className)).toBe(true)
      expect(DriverProvider['drivers']['fake']).toEqual({
        driverClassName: 'FakeDriver',
        isDefault: false
      })

      DriverProvider.register(FakeDriver, 'fake', true)
      expect(DriverProvider['drivers']['fake']).toEqual({
        driverClassName: 'FakeDriver',
        isDefault: true
      })

      registerSpy.restore()
    })

    it('registers class to ClassRegistry by using najs-binding if the driver is a function', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      DriverProvider.register('FakeDriver', 'fake')
      expect(registerSpy.calledWith(FakeDriver)).toBe(false)

      registerSpy.restore()
    })
  })

  describe('protected .findDefaultDriver()', function() {
    it('returns a empty string if there is no drivers registered', function() {
      DriverProvider['drivers'] = {}

      expect(DriverProvider['findDefaultDriver']()).toEqual('')
    })

    it('returns a the first driver if there is no item with isDefault = true', function() {
      DriverProvider['drivers'] = {
        'test-1': {
          driverClassName: 'Test1',
          isDefault: false
        },
        'test-2': {
          driverClassName: 'Test2',
          isDefault: false
        }
      }

      expect(DriverProvider['findDefaultDriver']()).toEqual('Test1')
    })

    it('returns a driver with isDefault = true', function() {
      DriverProvider['drivers'] = {
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

      expect(DriverProvider['findDefaultDriver']()).toEqual('FakeDriver')
    })
  })

  describe('protected .createDriver()', function() {
    it('calls "najs-binding".make() to create an instance of driver, model is passed in param', function() {
      const model = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.callsFake(() => ({
        createStaticMethods() {}
      }))

      DriverProvider['createDriver'](model, 'DriverClass')
      expect(makeStub.calledWith('DriverClass', [model]))
      makeStub.restore()
    })

    it('just create instance of driver 1 time', function() {
      const model = {}
      const driver = {}
      DriverProvider['driverInstances']['test'] = driver
      const result = DriverProvider['createDriver'](model, 'test')
      expect(driver === result).toBe(true)
      expect(DriverProvider['createDriver'](model, 'test') === result).toBe(true)
    })
  })

  describe('.findDriverClassName()', function() {
    it('returns .findDefaultDriver() if there is no binding of model', function() {
      const findDefaultDriverSpy = Sinon.spy(DriverProvider, <any>'findDefaultDriver')
      DriverProvider.findDriverClassName('not-bind-yet')
      expect(DriverProvider.findDriverClassName('not-bind-yet')).toEqual('FakeDriver')
      expect(findDefaultDriverSpy.called).toBe(true)
      findDefaultDriverSpy.restore()
    })

    it('returns .findDefaultDriver() if driver of model is not exists', function() {
      const findDefaultDriverSpy = Sinon.spy(DriverProvider, <any>'findDefaultDriver')
      DriverProvider.bind('bound-but-not-found', 'not-found')
      DriverProvider.findDriverClassName('bound-but-not-found')
      expect(findDefaultDriverSpy.called).toBe(true)
      findDefaultDriverSpy.restore()
    })

    it('returns driverClassName if has binding and driver exists', function() {
      const findDefaultDriverSpy = Sinon.spy(DriverProvider, <any>'findDefaultDriver')
      DriverProvider.bind('model', 'fake')
      expect(DriverProvider.findDriverClassName('model')).toEqual('FakeDriver')
      expect(findDefaultDriverSpy.called).toBe(false)
      findDefaultDriverSpy.restore()
    })
  })

  describe('.bind()', function() {
    it('simply assigns driver and model to private binding variable', function() {
      DriverProvider['binding'] = {}
      expect(DriverProvider['binding']).toEqual({})

      const chainable = DriverProvider.bind('model', 'driver')

      expect(chainable === DriverProvider).toBe(true)
      expect(DriverProvider['binding']).toEqual({ model: 'driver' })

      DriverProvider.bind('model', 'driver-override')
      expect(DriverProvider['binding']).toEqual({ model: 'driver-override' })
    })
  })

  describe('.has()', function() {
    it('returns false if the driver is not register under any name', function() {
      class AnyDriver {
        static className = 'AnyDriver'
      }
      expect(DriverProvider.has(AnyDriver)).toBe(false)
    })

    it('returns true if the given driver is registered under any name', function() {
      class RegisteredDriver {
        static className = 'RegisteredDriver'
      }
      DriverProvider.register(RegisteredDriver, 'any')
      expect(DriverProvider.has(RegisteredDriver)).toBe(true)
    })
  })

  describe('.create()', function() {
    it('creates a driver instance with class name provided by .findDriverClassName()', function() {
      const createDriverSpy = Sinon.spy(DriverProvider, <any>'createDriver')
      const findDriverClassNameSpy = Sinon.spy(DriverProvider, 'findDriverClassName')
      class Model {
        static className = 'Test'
      }
      const model = new Model()
      const instance = DriverProvider.create(<any>model)

      expect(findDriverClassNameSpy.calledWith(model)).toBe(true)
      expect(createDriverSpy.calledWith(model, 'FakeDriver')).toBe(true)
      expect(instance).toBeInstanceOf(FakeDriver)

      findDriverClassNameSpy.restore()
      createDriverSpy.restore()
    })
  })
})
