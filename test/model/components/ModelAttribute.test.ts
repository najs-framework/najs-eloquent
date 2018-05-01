import 'jest'
import * as Sinon from 'sinon'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelAttribute } from '../../../lib/model/components/ModelAttribute'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

const FUNCTIONS = ['getAttribute', 'setAttribute', 'getPrimaryKey', 'setPrimaryKey', 'getPrimaryKeyName']

describe('Model/Attribute', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelAttribute" as class name', function() {
        const attribute = new ModelAttribute()
        expect(attribute.getClassName()).toEqual('NajsEloquent.Model.Component.ModelAttribute')
      })
    })

    describe('.extend()', function() {
      it('extends the given prototype with 5 functions', function() {
        const prototype = {}
        const attribute = new ModelAttribute()
        attribute.extend(prototype, [], <any>{})
        for (const name of FUNCTIONS) {
          expect(typeof prototype[name] === 'function').toBe(true)
          expect(prototype[name] === ModelAttribute[name]).toBe(true)
        }
      })
    })
  })

  describe('Integration', function() {
    class User extends Eloquent {
      static className = 'User'
      static fillable = ['first_name', 'last_name']
    }

    describe('.setAttribute()', function() {
      it('is chainable', function() {
        const user = new User()
        expect(user.setAttribute('test', 'value') === user).toBe(true)
      })

      it('calls "driver".setAttribute()', function() {
        const user = new User()
        const setAttributeSpy = Sinon.spy(user['driver'], 'setAttribute')

        user.setAttribute('test', 'value')
        expect(setAttributeSpy.calledWith('test', 'value')).toBe(true)
        expect(user.getAttribute('test')).toEqual('value')
      })
    })

    describe('.getAttribute()', function() {
      it('calls "driver".getAttribute()', function() {
        const user = new User()
        const getAttributeSpy = Sinon.spy(user['driver'], 'getAttribute')

        user.getAttribute('test')
        expect(getAttributeSpy.calledWith('test')).toBe(true)
      })
    })

    describe('.getPrimaryKey()', function() {
      it('calls "driver".getAttribute() with .getPrimaryKeyName()', function() {
        const user = new User()
        const getAttributeSpy = Sinon.spy(user['driver'], 'getAttribute')
        const getPrimaryKeyNameStub = Sinon.stub(user, 'getPrimaryKeyName')
        getPrimaryKeyNameStub.returns('anything')

        user.getPrimaryKey()
        expect(getPrimaryKeyNameStub.calledWith()).toBe(true)
        expect(getAttributeSpy.calledWith('anything')).toBe(true)
      })
    })

    describe('.setPrimaryKey()', function() {
      it('is chainable', function() {
        const user = new User()
        expect(user.setPrimaryKey('value') === user).toBe(true)
      })

      it('calls "driver".setAttribute() with .getPrimaryKeyName() and value', function() {
        const user = new User()
        const setAttributeSpy = Sinon.spy(user['driver'], 'setAttribute')
        const getPrimaryKeyNameStub = Sinon.stub(user, 'getPrimaryKeyName')
        getPrimaryKeyNameStub.returns('anything')

        user.setPrimaryKey('value')
        expect(getPrimaryKeyNameStub.calledWith()).toBe(true)
        expect(setAttributeSpy.calledWith('anything', 'value')).toBe(true)
      })
    })

    describe('.getPrimaryKeyName()', function() {
      it('calls "driver".getPrimaryKeyName()', function() {
        const user = new User()
        const getPrimaryKeyNameStub = Sinon.stub(user['driver'], 'getPrimaryKeyName')
        getPrimaryKeyNameStub.returns('anything')

        expect(user.getPrimaryKeyName()).toEqual('anything')
        expect(getPrimaryKeyNameStub.calledWith()).toBe(true)
      })
    })

    it('should work', function() {
      const user = new User()
      user.hasAttribute('anything')
      user.hasAttribute('driver')
    })
  })
})
