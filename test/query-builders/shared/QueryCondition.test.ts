import 'jest'
import * as Sinon from 'sinon'
import { QueryCondition } from '../../../lib/query-builders/shared/QueryCondition'
import { DefaultConvention } from '../../../lib/query-builders/shared/DefaultConvention'
import { ConditionQueryHandler } from '../../../lib/query-builders/shared/ConditionQueryHandler'

describe('QueryCondition', function() {
  const convention = new DefaultConvention()

  describe('constructor()', function() {
    it('has protected constructor, could not create an instance directly', function() {})
    it('init "isSubQuery" = false & queries = []', function() {
      const query: QueryCondition = Reflect.construct(QueryCondition, [])
      expect(query.isSubQuery).toBe(false)
      expect(query.queries).toEqual([])
    })
  })

  describe('static .create()', function() {
    it('creates new QueryCondition instance then calls .buildQuery() then returns the instance', function() {
      const spy = Sinon.spy(QueryCondition.prototype, 'buildQuery')
      const query = QueryCondition.create(convention, 'and', 'a', '=', 'b')
      expect(spy.calledWith('and', 'a', '=', 'b')).toBe(true)
      expect(query.convention === convention).toBe(true)
      expect(query).toBeInstanceOf(QueryCondition)
      spy.restore()
    })
  })

  describe('.getConditionQueryHandler()', function() {
    it('creates an ConditionQueryHandle instance with it-self and the its convention', function() {
      const query = QueryCondition.create(convention, 'and', 'a', '=', 'b')
      const handle = query.getConditionQueryHandler()
      expect(handle).toBeInstanceOf(ConditionQueryHandler)
      expect(handle['basicConditionQuery'] === query).toBe(true)
      expect(handle['convention'] === convention).toBe(true)
    })
  })

  describe('.toObject()', function() {
    it('covered by .buildQuery()', function() {})
  })

  describe('.buildQuery()', function() {
    it('build sub-query with provided 1 param', function() {
      const query = QueryCondition.create(convention, 'and', function(subQuery) {
        subQuery.where('a', 1).orWhere('b', '>', 2)
      })
      expect(query.toObject()).toEqual({
        bool: 'and',
        queries: [
          { bool: 'and', operator: '=', field: 'a', value: 1 },
          { bool: 'or', operator: '>', field: 'b', value: 2 }
        ]
      })
    })

    it('build query with default operator = if passed 2 params', function() {
      const query = QueryCondition.create(convention, 'and', 'a', 'b')
      expect(query.toObject()).toEqual({
        bool: 'and',
        operator: '=',
        field: 'a',
        value: 'b'
      })
    })

    it('build query with provided operator if passed 3 params', function() {
      const query = QueryCondition.create(convention, 'or', 'a', 'not-in', 'b')
      expect(query.toObject()).toEqual({
        bool: 'or',
        operator: 'not-in',
        field: 'a',
        value: 'b'
      })
    })

    it('build multi sub-query levels', function() {
      const query = QueryCondition.create(convention, 'and', function(subQuery) {
        subQuery.where('a', 1).orWhere(function(subQuery2) {
          subQuery2.where('b', 'in', 2).where('c', 'not-in', 3)
        })
      })
      expect(query.toObject()).toEqual({
        bool: 'and',
        queries: [
          { bool: 'and', operator: '=', field: 'a', value: 1 },
          {
            bool: 'or',
            queries: [
              { bool: 'and', operator: 'in', field: 'b', value: 2 },
              { bool: 'and', operator: 'not-in', field: 'c', value: 3 }
            ]
          }
        ]
      })
    })

    it('build multi sub-query levels with full query condition handle', function() {
      const query = QueryCondition.create(convention, 'and', function(subQuery) {
        subQuery.where('a', 1).orWhere(function(subQuery2) {
          subQuery2.whereBetween('b', [100, 1000])
        })
      })
      expect(query.toObject()).toEqual({
        bool: 'and',
        queries: [
          { bool: 'and', operator: '=', field: 'a', value: 1 },
          {
            bool: 'or',
            queries: [
              { bool: 'and', operator: '>=', field: 'b', value: 100 },
              { bool: 'and', operator: '<=', field: 'b', value: 1000 }
            ]
          }
        ]
      })
    })
  })

  describe('.buildSubQuery()', function() {
    it('covered by .buildQuery()', function() {})
  })

  describe('.where()', function() {
    it('calls .buildQuery() with bool = "and" and passes all params to it', function() {
      const spy = Sinon.spy(QueryCondition.prototype, 'buildQuery')
      const query = QueryCondition.create(convention, 'and', 'a', '=', 'b')
      spy.resetHistory()

      query.where('test', 'value')
      expect(spy.calledWith('and', 'test', 'value')).toBe(true)

      spy.resetHistory()
      query.where('test', '<>', 'value')
      expect(spy.calledWith('and', 'test', '<>', 'value')).toBe(true)

      const subQuery: any = function() {}
      query.where(subQuery)
      expect(spy.calledWith('and', subQuery)).toBe(true)

      spy.restore()
    })
  })

  describe('.orWhere()', function() {
    it('calls .buildQuery() with bool = "or" and passes all params to it', function() {
      const spy = Sinon.spy(QueryCondition.prototype, 'buildQuery')
      const query = QueryCondition.create(convention, 'and', 'a', '=', 'b')
      spy.resetHistory()

      query.orWhere('test', 'value')
      expect(spy.calledWith('or', 'test', 'value')).toBe(true)

      spy.resetHistory()
      query.orWhere('test', '<>', 'value')
      expect(spy.calledWith('or', 'test', '<>', 'value')).toBe(true)

      const subQuery: any = function() {}
      query.orWhere(subQuery)
      expect(spy.calledWith('or', subQuery)).toBe(true)

      spy.restore()
    })
  })
})
