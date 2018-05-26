import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilderWrapper } from '../../lib/wrappers/QueryBuilderWrapper'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { NotFoundError } from '../../lib/errors/NotFoundError'
import { RelationDataBucket } from '../../lib/relations/RelationDataBucket'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

class Test extends Eloquent {
  static className = 'Test'
}
Eloquent.register(Test)

describe('QueryBuilderWrapper', function() {
  it('implements IAutoload and returns class name as "NajsEloquent.Wrapper.QueryBuilderWrapper"', function() {
    const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
    expect(queryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.QueryBuilderWrapper')
  })

  describe('protected createRelationDataBucketIfNeeded()', function() {
    it('use make() and create new RelationDataBucket if there is no bucket yet', function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const relationDataBucket = queryBuilderWrapper.createRelationDataBucketIfNeeded()
      expect(relationDataBucket['modelMap']).toEqual({ test: 'Test' })
    })

    it('re-uses relationDataBucket and always call RelationDataBucket.register() before returning', function() {
      const relationDataBucket = new RelationDataBucket()
      relationDataBucket.register('anything', 'Anything')
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{}, relationDataBucket)
      queryBuilderWrapper.createRelationDataBucketIfNeeded()
      expect(relationDataBucket['modelMap']).toEqual({ anything: 'Anything', test: 'Test' })
    })
  })

  describe('FORWARD_FUNCTIONS', function() {
    it('contains not overridden functions except AdvancedQuery function', function() {
      expect(QueryBuilderWrapper.ForwardFunctions.sort()).toEqual(
        [
          'queryName',
          'setLogGroup',
          'getPrimaryKeyName',
          'select',
          'limit',
          'orderBy',
          'orderByAsc',
          'orderByDesc',
          'where',
          'andWhere',
          'orWhere',
          'whereNot',
          'andWhereNot',
          'orWhereNot',
          'whereIn',
          'andWhereIn',
          'orWhereIn',
          'whereNotIn',
          'andWhereNotIn',
          'orWhereNotIn',
          'whereNull',
          'andWhereNull',
          'orWhereNull',
          'whereNotNull',
          'andWhereNotNull',
          'orWhereNotNull',
          'whereBetween',
          'andWhereBetween',
          'orWhereBetween',
          'whereNotBetween',
          'andWhereNotBetween',
          'orWhereNotBetween',
          'withTrashed',
          'onlyTrashed',
          'count',
          'update',
          'delete',
          'restore',
          'execute'
        ].sort()
      )
    })
  })

  for (const name of QueryBuilderWrapper.ForwardFunctions) {
    describe('.' + name + '()', function() {
      it('forwards to this.queryBuilder.' + name + '() with passed arguments', function() {
        const queryBuilder = {
          [name]: function() {
            return 'anything'
          }
        }
        const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>queryBuilder)
        const spy = Sinon.spy(queryBuilder, name)

        expect(queryBuilderWrapper[name]('a')).toEqual('anything')
        expect(spy.calledWith('a')).toBe(true)
        expect(queryBuilderWrapper[name](['a'], 'b')).toEqual('anything')
        expect(spy.calledWith(['a'], 'b')).toBe(true)
        expect(queryBuilderWrapper[name](['a', 'b', 'c'])).toEqual('anything')
        expect(spy.calledWith(['a', 'b', 'c'])).toBe(true)
      })

      it('returns itself (chainable) if the this.queryBuilder.' + name + ' is chainable', function() {
        const queryBuilder = {
          [name]: function() {
            return this
          }
        }
        const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>queryBuilder)
        expect(queryBuilderWrapper[name]('a') === queryBuilderWrapper).toBe(true)
      })
    })
  }

  describe('.first()', function() {
    it('calls this.queryBuilder.first() to the result and eagerBucket.newInstance() to create model instance', async function() {
      const queryBuilder = {
        getPrimaryKeyName() {
          return 'id'
        },
        where() {},
        async first() {
          return { a: 1, b: 2 }
        }
      }
      const firstSpy = Sinon.spy(queryBuilder, 'first')
      const whereSpy = Sinon.spy(queryBuilder, 'where')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      const result = <Test>await queryBuilderWrapper.first()
      expect(result.getAttribute('a')).toEqual(1)
      expect(result.getAttribute('b')).toEqual(2)
      expect(firstSpy.called).toBe(true)
      expect(whereSpy.called).toBe(false)
    })

    it('returns null if this.queryBuilder.first() returns null', async function() {
      const queryBuilder = {
        getPrimaryKeyName() {
          return 'id'
        },
        where() {},
        async first() {
          // tslint:disable-next-line
          return null
        }
      }
      const firstSpy = Sinon.spy(queryBuilder, 'first')
      const whereSpy = Sinon.spy(queryBuilder, 'where')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      const result = await queryBuilderWrapper.first()
      expect(result).toBeNull()
      expect(firstSpy.called).toBe(true)
      expect(whereSpy.called).toBe(false)
    })

    it('calls this.queryBuilder.where() if the id is passed', async function() {
      const queryBuilder = {
        getPrimaryKeyName() {
          return 'anything'
        },
        where() {},
        async first() {
          return { a: 1, b: 2 }
        }
      }
      const firstSpy = Sinon.spy(queryBuilder, 'first')
      const whereSpy = Sinon.spy(queryBuilder, 'where')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      const result = <Test>await queryBuilderWrapper.first('value')
      expect(result.getAttribute('a')).toEqual(1)
      expect(result.getAttribute('b')).toEqual(2)
      expect(firstSpy.called).toBe(true)
      expect(whereSpy.calledWith('anything', 'value')).toBe(true)
    })
  })

  describe('.find()', function() {
    it('is an alias of .first()', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const firstStub = Sinon.stub(queryBuilderWrapper, 'first')
      firstStub.returns('anything')

      expect(await queryBuilderWrapper.find()).toEqual('anything')
      expect(firstStub.calledWith()).toBe(true)
      expect(await queryBuilderWrapper.find('value')).toEqual('anything')
      expect(firstStub.calledWith('value')).toBe(true)
    })
  })

  describe('.get()', function() {
    it('calls this.queryBuilder.get() to get the result and model.newCollection() to create collection', async function() {
      const queryBuilder = {
        select() {},
        async get() {
          return [{ a: 1 }, { b: 2 }]
        }
      }
      const getSpy = Sinon.spy(queryBuilder, 'get')
      const selectSpy = Sinon.spy(queryBuilder, 'select')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      const result = await queryBuilderWrapper.get()
      expect(result.items[0]).toBeInstanceOf(Test)
      expect(result.items[0].getAttribute('a')).toEqual(1)
      expect(result.items[1]).toBeInstanceOf(Test)
      expect(result.items[1].getAttribute('b')).toEqual(2)
      expect(getSpy.called).toBe(true)
      expect(selectSpy.called).toBe(false)
    })

    it('calls this.queryBuilder.select() if arguments are passed', async function() {
      const queryBuilder = {
        select() {},
        async get() {
          return [{ a: 1 }, { b: 2 }]
        }
      }
      const getSpy = Sinon.spy(queryBuilder, 'get')
      const selectSpy = Sinon.spy(queryBuilder, 'select')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      await queryBuilderWrapper.get('test')
      expect(getSpy.called).toBe(true)
      expect(selectSpy.calledWith('test')).toBe(true)

      await queryBuilderWrapper.get(['a', 'b'], 'c')
      expect(getSpy.called).toBe(true)
      expect(selectSpy.calledWith(['a', 'b'], 'c')).toBe(true)
    })
  })

  describe('.all()', function() {
    it('is an alias of .get()', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const getStub = Sinon.stub(queryBuilderWrapper, 'get')
      getStub.returns('anything')

      expect(await queryBuilderWrapper.all()).toEqual('anything')
      expect(getStub.calledWith()).toBe(true)
      expect(await queryBuilderWrapper.all('1', '2', '3')).toEqual('anything')
      expect(getStub.calledWith('1', '2', '3')).toBe(true)
      expect(await queryBuilderWrapper.all('a', ['b', 'c'])).toEqual('anything')
      expect(getStub.calledWith('a', ['b', 'c'])).toBe(true)
    })
  })

  describe('.pluck()', function() {
    it('calls this.queryBuilder.select() then .get() and process the result to an Object', async function() {
      const queryBuilder = {
        getPrimaryKeyName() {
          return 'id'
        },
        select() {
          return this
        },
        async get() {
          return [{ id: '1', a: 'a1', b: 'b1' }, { id: '2', a: 'a2', b: 'b2' }]
        }
      }
      const getSpy = Sinon.spy(queryBuilder, 'get')
      const selectSpy = Sinon.spy(queryBuilder, 'select')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      expect(await queryBuilderWrapper.pluck('a')).toEqual({
        1: 'a1',
        2: 'a2'
      })
      expect(getSpy.called).toBe(true)
      expect(selectSpy.calledWith('a', 'id')).toBe(true)
    })

    it('can use the second param as indexKey', async function() {
      const queryBuilder = {
        getPrimaryKeyName() {
          return 'id'
        },
        select() {
          return this
        },
        async get() {
          return [{ id: '1', a: 'a1', b: 'b1' }, { id: '2', a: 'a2', b: 'b2' }]
        }
      }
      const getSpy = Sinon.spy(queryBuilder, 'get')
      const selectSpy = Sinon.spy(queryBuilder, 'select')

      const queryBuilderWrapper = new QueryBuilderWrapper(Test.className, 'test', <any>queryBuilder)

      expect(await queryBuilderWrapper.pluck('a', 'b')).toEqual({
        b1: 'a1',
        b2: 'a2'
      })
      expect(getSpy.called).toBe(true)
      expect(selectSpy.calledWith('a', 'b')).toBe(true)
    })
  })

  describe('.findById()', function() {
    it('is an alias of .first()', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const firstStub = Sinon.stub(queryBuilderWrapper, 'first')
      firstStub.returns('anything')

      expect(await queryBuilderWrapper.findById('value')).toEqual('anything')
      expect(firstStub.calledWith('value')).toBe(true)
    })
  })

  describe('.findOrFail()', function() {
    it('calls .find(id) and return result if not null', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const findStub = Sinon.stub(queryBuilderWrapper, 'find')
      findStub.returns('anything')

      expect(await queryBuilderWrapper.findOrFail('value')).toEqual('anything')
      expect(findStub.calledWith('value')).toBe(true)
    })

    it('calls .find(id) and throws a NotFoundError if result is null', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const findStub = Sinon.stub(queryBuilderWrapper, 'find')
      // tslint:disable-next-line
      findStub.returns(null)

      try {
        expect(await queryBuilderWrapper.findOrFail('value')).toEqual('anything')
        expect(findStub.calledWith('value')).toBe(true)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error.message).toEqual('Test is not found.')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.firstOrFail()', function() {
    it('is an alias of .findOrFail()', async function() {
      const queryBuilderWrapper = new QueryBuilderWrapper('Test', 'test', <any>{})
      const findOrFailStub = Sinon.stub(queryBuilderWrapper, 'findOrFail')
      findOrFailStub.returns('anything')

      expect(await queryBuilderWrapper.firstOrFail('value')).toEqual('anything')
      expect(findOrFailStub.calledWith('value')).toBe(true)
    })
  })
})
