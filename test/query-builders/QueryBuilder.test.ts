import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilder } from '../../lib/query-builders/QueryBuilder'

describe('QueryBuilder', function() {
  describe('select()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query.select('a')).toEqual(query)
    })

    it('calls _flatten_and_assign_to() and assign to "selectedFields"', function() {
      const query = new QueryBuilder()
      const flattenSpy = Sinon.spy(query, <any>'_flatten_and_assign_to')
      query.select('a')
      expect(flattenSpy.calledWith('selectedFields', ['a'])).toBe(true)

      query.select('a', 'b')
      expect(flattenSpy.calledWith('selectedFields', ['a', 'b'])).toBe(true)

      query.select(['a', 'b'])
      expect(flattenSpy.calledWith('selectedFields', [['a', 'b']])).toBe(true)

      query.select('a', 'b', ['c', 'd'])
      expect(flattenSpy.calledWith('selectedFields', ['a', 'b', ['c', 'd']])).toBe(true)
    })
  })

  describe('distinct()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query.distinct('a')).toEqual(query)
    })

    it('calls _flatten_and_assign_to() and assign to "distinctFields"', function() {
      const query = new QueryBuilder()
      const flattenSpy = Sinon.spy(query, <any>'_flatten_and_assign_to')
      query.distinct('a', 'b', ['c', 'd'])
      expect(flattenSpy.calledWith('distinctFields', ['a', 'b', ['c', 'd']])).toBe(true)
    })
  })

  describe('orderBy()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a')).toEqual(query)
    })

    it('has default direction is ASC', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a').ordering).toEqual({ a: 'asc' })
    })

    it('can set direction to DESC', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a', 'desc').ordering).toEqual({ a: 'desc' })
    })

    it('overrides if fields already exists', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a', 'asc').ordering).toEqual({ a: 'asc' })
      expect(query.orderBy('a', 'desc').ordering).toEqual({ a: 'desc' })
      expect(query.orderBy('b').ordering).toEqual({ a: 'desc', b: 'asc' })
    })
  })

  describe('orderByAsc()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query.orderByAsc('a')).toEqual(query)
    })

    it('overrides if fields already exists', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a', 'desc').ordering).toEqual({ a: 'desc' })
      expect(query.orderByAsc('a').ordering).toEqual({ a: 'asc' })
    })
  })

  describe('orderByDesc()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query.orderByDesc('a')).toEqual(query)
    })

    it('overrides if fields already exists', function() {
      const query = new QueryBuilder()
      expect(query.orderBy('a', 'asc').ordering).toEqual({ a: 'asc' })
      expect(query.orderByDesc('a').ordering).toEqual({ a: 'desc' })
    })
  })

  describe('limit()', function() {
    it('is chain-able, and has init value is undefined', function() {
      const query = new QueryBuilder()
      expect(query.limitNumber).toBeUndefined()
      expect(query.limit(10)).toEqual(query)
      expect(query.limitNumber).toEqual(10)
    })
  })

  describe('_flatten_and_assign_to()', function() {
    it('is chain-able', function() {
      const query = new QueryBuilder()
      expect(query['_flatten_and_assign_to']('a', ['b'])).toEqual(query)
    })

    it('converts an Array<string|string[]> to string and assign to any name', function() {
      const query = new QueryBuilder()
      query['_flatten_and_assign_to']('result', ['1'])
      expect(query['result']).toEqual(['1'])
      query['_flatten_and_assign_to']('result', ['1', '2', '3'])
      expect(query['result']).toEqual(['1', '2', '3'])
      query['_flatten_and_assign_to']('result', [['1', '2', '3']])
      expect(query['result']).toEqual(['1', '2', '3'])
      query['_flatten_and_assign_to']('result', ['1', ['2', '3', '4'], ['5', '6'], '7'])
      expect(query['result']).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })

    it('removes duplicated items', function() {
      const query = new QueryBuilder()
      query['_flatten_and_assign_to']('result', [['1'], ['2', '3'], '4', '4', '5', '6', ['7', '2', '3'], ['2', '3']])
      expect(query['result']).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })

    it('can NOT converts an Array<string|string[][]> but no worries, Typescript will catch it', function() {
      const query = new QueryBuilder()
      query['_flatten_and_assign_to']('result', <any>[[['1', '2']], '3'])
      expect(query['result']).toEqual([['1', '2'], '3'])
    })
  })

  describe('where()', function() {
    it('is chain-able, and has init value is undefined', function() {
      const query = new QueryBuilder()
      expect(query.where('a', 0)).toEqual(query)

      query.where('b', 1)
      query.where(function() {
        this.where('c', 2)
      })
      console.log(query.conditions)
      // for (const subquery of query.condition.queries) {
      //   console.log(subquery)
      // }
    })
  })
})
