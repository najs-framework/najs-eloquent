import 'jest'
import * as Sinon from 'sinon'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelFillable } from '../../../lib/model/components/ModelFillable'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'
import { ModelSetting } from '../../../lib/model/components/ModelSetting'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Model/Fillable', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelFillable" as class name', function() {
        const fillable = new ModelFillable()
        expect(fillable.getClassName()).toEqual('NajsEloquent.Model.Component.ModelFillable')
      })
    })

    describe('.extend()', function() {
      it('extends the given prototype with 8 functions', function() {
        const functions = [
          'getFillable',
          'getGuarded',
          'markFillable',
          'markGuarded',
          'isFillable',
          'isGuarded',
          'fill',
          'forceFill'
        ]
        const prototype = {}
        const fillable = new ModelFillable()
        fillable.extend(prototype, [], <any>{})
        for (const name of functions) {
          expect(typeof prototype[name] === 'function').toBe(true)
          expect(prototype[name] === ModelFillable[name]).toBe(true)
        }
      })
    })

    describe('static .isFillable()', function() {
      it('uses ModelUtilities.isInWhiteList() with whiteList = .getFillable(), blackList = this.getGuarded()', function() {
        const isInWhiteListStub = Sinon.stub(ModelSetting, 'isInWhiteList')
        isInWhiteListStub.returns('anything')

        const user = {
          getFillable() {
            return 'fillable'
          },
          getGuarded() {
            return 'guarded'
          }
        }
        user['isInWhiteList'] = ModelSetting.isInWhiteList

        expect(ModelFillable.isFillable.call(user, 'test')).toEqual('anything')
        expect(isInWhiteListStub.called).toBe(true)
        expect(Array.from(isInWhiteListStub.firstCall.args[0])).toEqual(['test'])
        expect(isInWhiteListStub.firstCall.args[1]).toEqual('fillable')
        expect(isInWhiteListStub.firstCall.args[2]).toEqual('guarded')
        isInWhiteListStub.restore()
      })
    })

    describe('static .isGuarded()', function() {
      it('uses ModelUtilities.isInBlackList() with blackList = this.getGuarded()', function() {
        const isInBlackListStub = Sinon.stub(ModelSetting, 'isInBlackList')
        isInBlackListStub.returns('anything')

        const user = {
          getGuarded() {
            return 'guarded'
          }
        }
        user['isInBlackList'] = ModelSetting.isInBlackList

        expect(ModelFillable.isGuarded.call(user, 'test')).toEqual('anything')
        expect(isInBlackListStub.called).toBe(true)
        expect(Array.from(isInBlackListStub.firstCall.args[0])).toEqual(['test'])
        expect(isInBlackListStub.firstCall.args[1]).toEqual('guarded')
        isInBlackListStub.restore()
      })
    })
  })

  describe('Integration', function() {
    class User extends Eloquent {
      static className = 'User'
      static fillable = ['first_name', 'last_name']
    }

    class Post extends Eloquent {
      static className = 'Post'
      fillable = ['title', 'content']
    }

    class Token extends Eloquent {
      static className = 'Token'
      static guarded = ['token']
    }

    class Secret extends Eloquent {
      static className = 'Secret'
      guarded = ['password']
    }

    describe('.getFillable()', function() {
      it('works with both kind of settings - static or member', function() {
        const user = new User()
        expect(user.getFillable()).toEqual(['first_name', 'last_name'])

        const post = new Post()
        expect(post.getFillable()).toEqual(['title', 'content'])
      })
    })

    describe('.markFillable()', function() {
      it('is chainable.', function() {
        const user = new User()
        expect(user.markFillable('test') === user).toBe(true)
      })

      it('can use to apply a temporary setting', function() {
        const user = new User()
        user.markFillable('password')
        expect(user.getFillable()).toEqual(['first_name', 'last_name', 'password'])
        expect(user['fillable']).toEqual(['password'])
        expect(new User().getFillable()).toEqual(['first_name', 'last_name'])

        const post = new Post()
        post.markFillable('view')
        expect(post.getFillable()).toEqual(['title', 'content', 'view'])
        expect(post['fillable']).toEqual(['title', 'content', 'view'])
        expect(new Post().getFillable()).toEqual(['title', 'content'])
      })
    })

    describe('.getGuarded()', function() {
      it('has default value is ["*"]', function() {
        const user = new User()
        expect(user.getGuarded()).toEqual(['*'])

        const post = new Post()
        expect(post.getGuarded()).toEqual(['*'])
      })

      it('works with both kind of settings - static or member', function() {
        const token = new Token()
        expect(token.getGuarded()).toEqual(['token'])

        const secret = new Secret()
        expect(secret.getGuarded()).toEqual(['password'])
      })
    })

    describe('.isFillable()', function() {
      it('can be used to detect single attribute', function() {
        const user = new User()
        expect(user.isFillable('first_name')).toBe(true)
        expect(user.isFillable('not-defined')).toBe(false)
      })

      it('return true if the "fillable" setting is empty and not a knownAttributes and not start with _', function() {
        const token = new Token()
        expect(token.isFillable('anything')).toBe(true)
        expect(token.isFillable('_anything')).toBe(false)
        expect(token.isFillable('guarded')).toBe(false)
      })

      it('can be used to detect multiple attributes with AND operator', function() {
        const user = new User()
        expect(user.isFillable('first_name', 'last_name')).toBe(true)
        expect(user.isFillable(['first_name', 'last_name'])).toBe(true)
        expect(user.isFillable(['first_name', 'last_name'], 'not-found')).toBe(false)
      })
    })

    describe('.isGuarded()', function() {
      it('can be used to detect single attribute', function() {
        const user = new User()
        expect(user.isGuarded('test')).toBe(true)
        const token = new Token()
        expect(token.isGuarded('test')).toBe(false)
        expect(token.isGuarded('token')).toBe(true)
      })

      it('can be used to detect multiple attributes with AND operator', function() {
        const user = new User()
        expect(user.isGuarded('a', 'b')).toBe(true)
        const token = new Token()
        expect(token.isGuarded('token', 'test')).toBe(false)
        expect(token.markGuarded('test').isGuarded('token', 'test')).toBe(true)
      })
    })

    describe('.markGuarded()', function() {
      it('is chainable.', function() {
        const user = new User()
        expect(user.markGuarded('test') === user).toBe(true)
      })

      it('can use to apply a temporary setting', function() {
        const user = new User()
        user.markGuarded('test')
        expect(user.getGuarded()).toEqual(['test'])
        expect(new User().getGuarded()).toEqual(['*'])

        const post = new Post()
        post.markGuarded('test')
        expect(post.getGuarded()).toEqual(['test'])
        expect(new Post().getGuarded()).toEqual(['*'])

        const token = new Token()
        token.markGuarded('test')
        expect(token.getGuarded()).toEqual(['token', 'test'])
        expect(token['guarded']).toEqual(['test'])
        expect(new Token().getGuarded()).toEqual(['token'])

        const secret = new Secret()
        secret.markGuarded('test')
        expect(secret.getGuarded()).toEqual(['password', 'test'])
        expect(secret['guarded']).toEqual(['password', 'test'])
        expect(new Secret().getGuarded()).toEqual(['password'])
      })
    })

    describe('.fill()', function() {
      it('is chainable.', function() {
        const user = new User()
        expect(user.fill({}) === user).toBe(true)
      })

      it('fills the model with an array of attributes', function() {
        const userOne = new User()
        userOne.fill({ first_name: 'a', last_name: 'b', password: 'c' })
        expect(userOne['attributes']).toEqual({ first_name: 'a', last_name: 'b' })

        const userTwo = new User()
        userTwo.markFillable('password').fill({ first_name: 'a', last_name: 'b', password: 'c' })
        expect(userTwo['attributes']).toEqual({ first_name: 'a', last_name: 'b', password: 'c' })

        const token = new Token()
        token.fill({ token: 'a', b: 'b', c: 'c' })
        expect(token['attributes']).toEqual({ b: 'b', c: 'c' })
      })
    })

    describe('.forceFill()', function() {
      it('is chainable.', function() {
        const user = new User()
        expect(user.forceFill({}) === user).toBe(true)
      })

      it('fills the model with an array of attributes, force mass assignment', function() {
        const user = new User()
        user.markGuarded('a')
        user.forceFill({ a: 1, b: 2 })
        expect(user['attributes']).toEqual({ a: 1, b: 2 })
      })
    })
  })
})
