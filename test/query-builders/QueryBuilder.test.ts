import 'jest'
import { QueryBuilder } from '../../lib/query-builders/QueryBuilder'
import { Query } from '../../lib/query-builders/mixin/Query'
import { ConditionQuery } from '../../lib/query-builders/mixin/ConditionQuery'
import { ExecuteQuery } from '../../lib/query-builders/mixin/ExecuteQuery'
import { AdvancedQuery } from '../../lib/query-builders/mixin/AdvancedQuery'
import { RelationQuery } from '../../lib/query-builders/mixin/RelationQuery'

describe('QueryBuilder', function() {
  describe('constructor()', function() {
    it('sets handler in params to handler property', function() {
      const handler = {}
      const queryBuilder = new QueryBuilder(handler as any)
      expect(queryBuilder['handler'] === handler).toBe(true)
    })
  })

  describe('mixin:Query', function() {
    it('applies mixin Query to its prototype', function() {
      const prototype = QueryBuilder.prototype
      for (const name in Query) {
        expect(prototype[name] === Query[name]).toBe(true)
      }
    })
  })

  describe('mixin:ConditionQuery', function() {
    it('applies mixin ConditionQuery to its prototype', function() {
      const prototype = QueryBuilder.prototype
      for (const name in ConditionQuery) {
        expect(prototype[name] === ConditionQuery[name]).toBe(true)
      }
    })
  })

  describe('mixin:ExecuteQuery', function() {
    it('applies mixin ExecuteQuery to its prototype', function() {
      const prototype = QueryBuilder.prototype
      for (const name in ExecuteQuery) {
        expect(prototype[name] === ExecuteQuery[name]).toBe(true)
      }
    })
  })

  describe('mixin:AdvancedQuery', function() {
    it('applies mixin AdvancedQuery to its prototype', function() {
      const prototype = QueryBuilder.prototype
      for (const name in AdvancedQuery) {
        expect(prototype[name] === AdvancedQuery[name]).toBe(true)
      }
    })
  })

  describe('mixin:RelationQuery', function() {
    it('applies mixin RelationQuery to its prototype', function() {
      const prototype = QueryBuilder.prototype
      for (const name in RelationQuery) {
        expect(prototype[name] === RelationQuery[name]).toBe(true)
      }
    })
  })
})
