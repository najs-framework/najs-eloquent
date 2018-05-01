import 'jest'
import * as Sinon from 'sinon'
import { EloquentProxy } from '../../lib/model/EloquentProxy'

describe('EloquentProxy', function() {
  describe('.shouldProxy()', function() {
    it('always return false if the given key is Symbol', function() {
      expect(EloquentProxy.shouldProxy({}, Symbol.for('anything'))).toEqual(false)
    })

    it('returns false if the key is defined in "target.knownAttributes"', function() {
      const target = {
        knownAttributes: ['a', 'b'],
        driver: {
          shouldBeProxied() {
            return true
          }
        }
      }
      expect(EloquentProxy.shouldProxy(target, 'a')).toEqual(false)
      expect(EloquentProxy.shouldProxy(target, 'b')).toEqual(false)
      expect(EloquentProxy.shouldProxy(target, 'B')).toEqual(true)
      expect(EloquentProxy.shouldProxy(target, 'c')).toEqual(true)
    })

    it('returns false if the "target.driver.shouldBeProxied()" returns false', function() {
      const target = {
        knownAttributes: ['a', 'b'],
        driver: {
          shouldBeProxied(key: string) {
            if (key === 'c') {
              return false
            }
            return true
          }
        }
      }
      expect(EloquentProxy.shouldProxy(target, 'a')).toEqual(false)
      expect(EloquentProxy.shouldProxy(target, 'b')).toEqual(false)
      expect(EloquentProxy.shouldProxy(target, 'B')).toEqual(true)
      expect(EloquentProxy.shouldProxy(target, 'c')).toEqual(false)
    })
  })

  describe('.get()', function() {
    it('simply get the value of target with given key if the .shouldProxy() returns false', function() {
      const target = { test: 'value' }
      const shouldProxyStub = Sinon.stub(EloquentProxy, 'shouldProxy')
      shouldProxyStub.returns(false)
      expect(EloquentProxy.get(target, 'test')).toEqual('value')
      expect(EloquentProxy.get(target, 'not_found')).toBeUndefined()
      shouldProxyStub.restore()
    })

    it('passes all params to driver.proxify() if .shouldProxy() return true', function() {
      const driver = {
        proxify() {
          return 'anything'
        }
      }
      const target = {
        driver: driver
      }
      const proxifySpy = Sinon.spy(driver, 'proxify')
      const shouldProxyStub = Sinon.stub(EloquentProxy, 'shouldProxy')
      shouldProxyStub.returns(true)
      expect(EloquentProxy.get(target, 'test')).toEqual('anything')
      expect(proxifySpy.calledWith('get', target, 'test'))
      shouldProxyStub.restore()
    })
  })

  describe('.set()', function() {
    it('simply assign the value to target with given key if the .shouldProxy() returns false', function() {
      const target = {}
      const shouldProxyStub = Sinon.stub(EloquentProxy, 'shouldProxy')
      shouldProxyStub.returns(false)
      EloquentProxy.set(target, 'test', 'value')
      expect(target).toEqual({ test: 'value' })
      shouldProxyStub.restore()
    })

    it('passes all params to driver.proxify() if .shouldProxy() return true', function() {
      const driver = {
        proxify() {
          return 'anything'
        }
      }
      const target = {
        driver: driver
      }
      const proxifySpy = Sinon.spy(driver, 'proxify')
      const shouldProxyStub = Sinon.stub(EloquentProxy, 'shouldProxy')
      shouldProxyStub.returns(true)
      expect(EloquentProxy.set(target, 'test', 'value')).toEqual('anything')
      expect(proxifySpy.calledWith('set', target, 'test', 'value'))
      shouldProxyStub.restore()
    })
  })
})
