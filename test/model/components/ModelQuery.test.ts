import 'jest'
import * as Sinon from 'sinon'
import { ModelQuery } from '../../../lib/model/components/ModelQuery'
import { Eloquent } from '../../../lib/model/Eloquent'
import { Model } from '../../../lib/model/Model'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Eloquent/ModelQuery', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelQuery" as class name', function() {
        const query = new ModelQuery()
        expect(query.getClassName()).toEqual('NajsEloquent.Model.Component.ModelQuery')
      })
    })

    describe('.extend()', function() {
      it('assigns newQuery to prototype which return driver.newQuery()', function() {
        const prototype = {}
        const query = new ModelQuery()
        query.extend(prototype, [], <any>{})
        expect(prototype['newQuery'] === ModelQuery.newQuery).toBe(true)
      })

      for (const name of ModelQuery.ForwardToQueryBuilderMethods) {
        it('calls .forwardToQueryBuilder() with name = "' + name + '"', function() {
          const forwardToQueryBuilderStub = Sinon.stub(ModelQuery, 'forwardToQueryBuilder')
          forwardToQueryBuilderStub.returns('forward-to-' + name)
          const prototype = {}
          const query = new ModelQuery()
          query.extend(prototype, [], <any>{})
          expect(prototype[name] === 'forward-to-' + name).toBe(true)
          forwardToQueryBuilderStub.restore()
        })
      }
    })

    describe('ForwardToQueryBuilderMethods', function() {
      it('contains started query functions', function() {
        expect(ModelQuery.ForwardToQueryBuilderMethods.sort()).toEqual(
          [
            'queryName',
            'setLogGroup',
            'select',
            'limit',
            'orderBy',
            'orderByAsc',
            'orderByDesc',
            'where',
            'whereNot',
            'whereIn',
            'whereNotIn',
            'whereNull',
            'whereNotNull',
            'whereBetween',
            'whereNotBetween',
            'withTrashed',
            'onlyTrashed',
            'first',
            'find',
            'get',
            'all',
            'count',
            'pluck',
            'findById',
            'findOrFail',
            'firstOrFail'
          ].sort()
        )
      })
    })
  })

  describe('Integration', function() {
    it('is not available for class which extends from Model<T>', function() {
      class Test extends Model {}

      for (const name of ModelQuery.ForwardToQueryBuilderMethods) {
        expect(typeof Test.prototype[name] !== 'function').toBe(true)
      }
    })

    class User extends Eloquent {
      static className = 'User'
    }

    it('is available for class which extends from Eloquent<T>', function() {
      for (const name of ModelQuery.ForwardToQueryBuilderMethods) {
        expect(typeof User.prototype[name] === 'function').toBe(true)
      }
    })

    it('forwards .newQuery() to driver.newQuery()', function() {
      const driver = {
        newQuery() {
          return 'anything'
        }
      }

      const user = new User()
      user['driver'] = <any>driver
      expect(user.newQuery()).toEqual('anything')
    })

    for (const name of ModelQuery.ForwardToQueryBuilderMethods) {
      it('forwards all params to driver.newQuery().' + name + '()', function() {
        const target = function() {
          return 'anything-' + Array.from(arguments).join('-')
        }
        const targetSpy = Sinon.spy(target)
        const driver = {
          newQuery() {
            return {
              [name]: targetSpy
            }
          }
        }

        const user = new User()
        user['driver'] = <any>driver

        expect(user[name]('a')).toEqual('anything-a')
        expect(targetSpy.calledWith('a')).toBe(true)
        expect(user[name]('a', 'b')).toEqual('anything-a-b')
        expect(targetSpy.calledWith('a', 'b')).toBe(true)
        expect(user[name](['a', 'b', 'c'])).toEqual('anything-a,b,c')
        expect(targetSpy.calledWith(['a', 'b', 'c'])).toBe(true)
      })
    }
  })
})
