import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilderBase } from '../../lib/query-builders/QueryBuilderBase'

describe('QueryBuilderBase', function() {
  describe('constructor()', function() {
    it('inits isUsed = false, primaryKeyName = passed value or id and convention from .getQueryConvention()', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      expect(query['primaryKeyName']).toEqual('id')
      expect(query['isUsed']).toBe(false)
      expect(query['convention'] === QueryBuilderBase.DefaultConvention).toBe(true)
    })
  })

  describe('static DefaultConvention', function() {
    describe('.formatFieldName()', function() {
      it('returns the param', function() {
        expect(QueryBuilderBase.DefaultConvention.formatFieldName('test')).toEqual('test')
      })
    })

    describe('.getNullValueFor()', function() {
      it('returns null', function() {
        expect(QueryBuilderBase.DefaultConvention.getNullValueFor('test')).toBeNull()
      })
    })
  })

  describe('.queryName()', function() {
    it('is chain-able, and simply sets provided value to "name"', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      expect(query['isUsed']).toBe(false)
      expect(query.queryName('test')).toEqual(query)
      expect(query['isUsed']).toBe(false)
    })
  })

  describe('.setLogGroup()', function() {
    it('is chain-able, and simply sets provided value to "logGroup"', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      expect(query['isUsed']).toBe(false)
      expect(query.setLogGroup('test')).toEqual(query)
      expect(query['isUsed']).toBe(false)
      expect(query['logGroup']).toEqual('test')
    })
  })

  describe('.getPrimaryKeyName()', function() {
    it('calls and returns convention.formatFieldName(this.primaryKeyName) by default', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      query['primaryKeyName'] = 'test'
      const formatFieldNameSpy = Sinon.spy(query['convention'], <any>'formatFieldName')
      expect(query.getPrimaryKeyName()).toEqual('test')
      expect(formatFieldNameSpy.calledWith('test')).toBe(true)
    })
  })

  describe('.orderByAsc()', function() {
    it('is chain-able', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      query.orderBy = function() {
        this.isUsed = true
        return this
      }
      expect(query['isUsed']).toBe(false)
      expect(query.orderByAsc('a')).toEqual(query)
      expect(query['isUsed']).toBe(true)
    })

    it('calls .orderBy with direction = asc', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      query.orderBy = function() {
        this.args = arguments
      }
      query.orderByAsc('a')
      expect(query['args'][0]).toEqual('a')
      expect(query['args'][1]).toEqual('asc')
    })
  })

  describe('.orderByDesc()', function() {
    it('is chain-able', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      query.orderBy = function() {
        this.isUsed = true
        return this
      }
      expect(query['isUsed']).toBe(false)
      expect(query.orderByDesc('a')).toEqual(query)
      expect(query['isUsed']).toBe(true)
    })

    it('calls .orderBy with direction = desc', function() {
      const query = Reflect.construct(QueryBuilderBase, [])
      query.orderBy = function() {
        this.args = arguments
      }
      query.orderByDesc('a')
      expect(query['args'][0]).toEqual('a')
      expect(query['args'][1]).toEqual('desc')
    })
  })
})
