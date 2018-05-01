import 'jest'
import * as Sinon from 'sinon'
import { GenericQueryBuilder } from '../../lib/query-builders/GenericQueryBuilder'

const TestConvention = {
  formatFieldName(name: any) {
    return 'formatted:' + name
  },
  getNullValueFor(name: any) {
    return 'NULL'
  }
}

describe('GenericQueryBuilder', function() {
  describe('implements IBasicQuery', function() {
    describe('.getPrimaryKeyName()', function() {
      it('calls and returns convention.formatFieldName("id") by default', function() {
        const query = new GenericQueryBuilder()
        const formatFieldNameSpy = Sinon.spy(query['convention'], <any>'formatFieldName')
        expect(query.getPrimaryKeyName()).toEqual('id')
        expect(formatFieldNameSpy.calledWith('id')).toBe(true)
      })
    })

    describe('.queryName()', function() {
      it('is chain-able, and simply sets provided value to "name"', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.queryName('test')).toEqual(query)
        expect(query['isUsed']).toBe(false)
      })
    })

    describe('.setQueryLogGroup()', function() {
      it('is chain-able, and simply sets provided value to "logGroup"', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.setLogGroup('test')).toEqual(query)
        expect(query['isUsed']).toBe(false)
        expect(query['logGroup']).toEqual('test')
      })
    })

    describe('.select()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.select('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls flattenFieldNames() and assign to "select"', function() {
        const query = new GenericQueryBuilder()

        query.select('1')
        expect(query['fields']['select']).toEqual(['1'])

        query.select(['1', '2', '3'])
        expect(query['fields']['select']).toEqual(['1', '2', '3'])

        query.select(['1', '2', '3'], '4')
        expect(query['fields']['select']).toEqual(['1', '2', '3', '4'])

        query.select('1', ['2', '3', '4'], ['5', '6'], '5', '7', '7')
        expect(query['fields']['select']).toEqual(['1', '2', '3', '4', '5', '6', '7'])
      })
    })

    describe('.orderBy()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orderBy('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('has default direction is ASC', function() {
        const query = new GenericQueryBuilder()
        expect(query.orderBy('a')['ordering']).toEqual({ a: 'asc' })
      })

      it('can set direction to DESC', function() {
        const query = new GenericQueryBuilder()
        expect(query.orderBy('a', 'desc')['ordering']).toEqual({ a: 'desc' })
      })

      it('overrides if fields already exists', function() {
        const query = new GenericQueryBuilder()
        expect(query.orderBy('a', 'asc')['ordering']).toEqual({ a: 'asc' })
        expect(query.orderBy('a', 'desc')['ordering']).toEqual({ a: 'desc' })
        expect(query.orderBy('b')['ordering']).toEqual({ a: 'desc', b: 'asc' })
      })
    })

    describe('.orderByAsc()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orderByAsc('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('overrides if fields already exists', function() {
        const query = new GenericQueryBuilder()
        expect(query.orderBy('a', 'desc')['ordering']).toEqual({ a: 'desc' })
        expect(query.orderByAsc('a')['ordering']).toEqual({ a: 'asc' })
      })
    })

    describe('.orderByDesc()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orderByDesc('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('overrides if fields already exists', function() {
        const query = new GenericQueryBuilder()
        expect(query.orderBy('a', 'asc')['ordering']).toEqual({ a: 'asc' })
        expect(query.orderByDesc('a')['ordering']).toEqual({ a: 'desc' })
      })
    })

    describe('.limit()', function() {
      it('is chain-able, and has init value is undefined', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query['limitNumber']).toBeUndefined()
        expect(query.limit(10)).toEqual(query)
        expect(query['limitNumber']).toEqual(10)
        expect(query['isUsed']).toBe(true)
      })
    })
  })

  describe('implements IConditionQuery', function() {
    describe('.where()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.where('a', 0)).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('adds new QueryCondition instance to conditions array with operator and', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where('b', 2)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          { bool: 'and', field: 'b', operator: '=', value: 2 }
        ])
      })

      it('adds new QueryCondition instance to conditions array with operator and', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', 1).where('b', 2)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: 1 },
          { bool: 'and', field: 'formatted:b', operator: '=', value: 2 }
        ])
      })

      it('can add new QueryCondition instance with custom operator', function() {
        const query = new GenericQueryBuilder()
        query.where('a', '<', 1).where('b', '>', 2)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '<', value: 1 },
          { bool: 'and', field: 'b', operator: '>', value: 2 }
        ])
      })

      it('adds new QueryCondition instance with bool and queries if user use sub-query builder', function() {
        const query = new GenericQueryBuilder()
        query.where('first', 'condition').where(query => {
          query.where('a', 1).where('b', 2)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'first', operator: '=', value: 'condition' },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'a', operator: '=', value: 1 },
              { bool: 'and', field: 'b', operator: '=', value: 2 }
            ]
          }
        ])
      })

      it('can add subQuery multiple levels', function() {
        const query = new GenericQueryBuilder()
        query.where('first', 'condition').where(query => {
          query
            .where('a', 1)
            .where('b', 2)
            .where(query => {
              query
                .where('c', 3)
                .where('d', 4)
                .where(query => {
                  query.where('e', 5).where('f', 6)
                })
            })
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'first', operator: '=', value: 'condition' },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'a', operator: '=', value: 1 },
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              {
                bool: 'and',
                queries: [
                  { bool: 'and', field: 'c', operator: '=', value: 3 },
                  { bool: 'and', field: 'd', operator: '=', value: 4 },
                  {
                    bool: 'and',
                    queries: [
                      { bool: 'and', field: 'e', operator: '=', value: 5 },
                      { bool: 'and', field: 'f', operator: '=', value: 6 }
                    ]
                  }
                ]
              }
            ]
          }
        ])
      })
    })

    describe('.andWhere()', function() {
      it('is an alias of .where()', function() {
        const query = new GenericQueryBuilder()
        const whereStub = Sinon.stub(query, 'where')
        whereStub.returns('anything')
        expect(query.andWhere('a', 'b')).toEqual('anything')
        expect(whereStub.calledWith('a', 'b')).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhere('c', 3)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              { bool: 'and', field: 'c', operator: '=', value: 3 }
            ]
          }
        ])
      })
    })

    describe('.orWhere()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhere('a', 0)).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('adds new QueryCondition instance to conditions array with operator and', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).orWhere('b', 2)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          { bool: 'or', field: 'b', operator: '=', value: 2 }
        ])
      })

      it('adds new QueryCondition instance to conditions array with operator and', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', 1).orWhere('b', 2)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: 1 },
          { bool: 'or', field: 'formatted:b', operator: '=', value: 2 }
        ])
      })

      it('can add new QueryCondition instance with custom operator', function() {
        const query = new GenericQueryBuilder()
        query
          .where('a', '<', 1)
          .orWhere('b', '>', 2)
          .orWhere('c', '<>', 3)
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '<', value: 1 },
          { bool: 'or', field: 'b', operator: '>', value: 2 },
          { bool: 'or', field: 'c', operator: '<>', value: 3 }
        ])
      })

      it('adds new QueryCondition instance with bool and queries if user use sub-query builder', function() {
        const query = new GenericQueryBuilder()
        query.where('first', 'condition').where(query => {
          query.where('a', 1).orWhere('b', 2)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'first', operator: '=', value: 'condition' },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'a', operator: '=', value: 1 },
              { bool: 'or', field: 'b', operator: '=', value: 2 }
            ]
          }
        ])
      })

      it('can add subQuery multiple levels', function() {
        const query = new GenericQueryBuilder()
        query.where('first', 'condition').orWhere(query => {
          query
            .where('a', 1)
            .orWhere('b', 2)
            .orWhere(query => {
              query
                .where('c', 3)
                .orWhere('d', 4)
                .orWhere(query => {
                  query.where('e', 5).orWhere('f', 6)
                })
            })
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'first', operator: '=', value: 'condition' },
          {
            bool: 'or',
            queries: [
              { bool: 'and', field: 'a', operator: '=', value: 1 },
              { bool: 'or', field: 'b', operator: '=', value: 2 },
              {
                bool: 'or',
                queries: [
                  { bool: 'and', field: 'c', operator: '=', value: 3 },
                  { bool: 'or', field: 'd', operator: '=', value: 4 },
                  {
                    bool: 'or',
                    queries: [
                      { bool: 'and', field: 'e', operator: '=', value: 5 },
                      { bool: 'or', field: 'f', operator: '=', value: 6 }
                    ]
                  }
                ]
              }
            ]
          }
        ])
      })
    })

    describe('.whereNot()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereNot('a', 1)).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() with operator "<>"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        query.whereNot('a', 1)
        expect(whereSpy.calledWith('a', '<>', 1)).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "and" + operator "<>"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(query) {
          query.whereNot('b', 1)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'and', field: 'b', operator: '<>', value: 1 }]
          }
        ])
      })
    })

    describe('.andWhereNot()', function() {
      it('is an alias of .whereNot()', function() {
        const query = new GenericQueryBuilder()
        const whereNotStub = Sinon.stub(query, 'whereNot')
        whereNotStub.returns('anything')
        expect(query.andWhereNot('a', 'b')).toEqual('anything')
        expect(whereNotStub.calledWith('a', 'b')).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereNot('c', 3)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              { bool: 'and', field: 'c', operator: '<>', value: 3 }
            ]
          }
        ])
      })
    })

    describe('.orWhereNot()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereNot('a', 1)).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with operator "<>"', function() {
        const query = new GenericQueryBuilder()
        const orWhereSpy = Sinon.spy(query, 'orWhere')
        query.orWhereNot('a', 1)
        expect(orWhereSpy.calledWith('a', '<>', 1)).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "or" + operator "in"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(subQuery) {
          subQuery.orWhereNot('b', 1)
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'or', field: 'b', operator: '<>', value: 1 }]
          }
        ])
      })
    })

    describe('.whereIn()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereIn('a', [0])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() with operator "in"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        query.whereIn('a', [0])
        expect(whereSpy.calledWith('a', 'in', [0])).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "and" + operator "in"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(query) {
          query.whereIn('b', [0])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'and', field: 'b', operator: 'in', value: [0] }]
          }
        ])
      })
    })

    describe('.andWhereIn()', function() {
      it('is an alias of .whereIn()', function() {
        const query = new GenericQueryBuilder()
        const whereInStub = Sinon.stub(query, 'whereIn')
        whereInStub.returns('anything')
        expect(query.andWhereIn('a', ['b'])).toEqual('anything')
        expect(whereInStub.calledWith('a', ['b'])).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereIn('c', [3])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              { bool: 'and', field: 'c', operator: 'in', value: [3] }
            ]
          }
        ])
      })
    })

    describe('.orWhereIn()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereIn('a', [0])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with operator "in"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'orWhere')
        query.orWhereIn('a', [0])
        expect(whereSpy.calledWith('a', 'in', [0])).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "or" + operator "in"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(subQuery) {
          subQuery.orWhereIn('b', [0])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'or', field: 'b', operator: 'in', value: [0] }]
          }
        ])
      })
    })

    describe('.whereNotIn()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereNotIn('a', [0])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() with operator "not-in"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        query.whereNotIn('a', [0])
        expect(whereSpy.calledWith('a', 'not-in', [0])).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "and" + operator "not-in"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(query) {
          query.whereNotIn('b', [0])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'and', field: 'b', operator: 'not-in', value: [0] }]
          }
        ])
      })
    })

    describe('.andWhereNotIn()', function() {
      it('is an alias of .whereNotIn()', function() {
        const query = new GenericQueryBuilder()
        const whereNotInStub = Sinon.stub(query, 'whereNotIn')
        whereNotInStub.returns('anything')
        expect(query.andWhereNotIn('a', ['b'])).toEqual('anything')
        expect(whereNotInStub.calledWith('a', ['b'])).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereNotIn('c', [3])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              { bool: 'and', field: 'c', operator: 'not-in', value: [3] }
            ]
          }
        ])
      })
    })

    describe('.orWhereNotIn()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereNotIn('a', [0])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with operator "not-in"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'orWhere')
        query.orWhereNotIn('a', [0])
        expect(whereSpy.calledWith('a', 'not-in', [0])).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "or" + operator "not-in"', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(query) {
          query.orWhereNotIn('b', [0])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'or', field: 'b', operator: 'not-in', value: [0] }]
          }
        ])
      })
    })

    describe('.whereNull()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereNull('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() with operator "=" and value from "convention.getNullValueFor)"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        const getNullValueForSpy = Sinon.spy(query['convention'], <any>'getNullValueFor')
        query.whereNull('a')
        // tslint:disable-next-line
        expect(whereSpy.calledWith('a', '=', null)).toBe(true)
        expect(getNullValueForSpy.calledWith('a')).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "and" + operator "=" and value from convention', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', true).where(function(query) {
          query.whereNull('b')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'and', field: 'formatted:b', operator: '=', value: 'NULL' }]
          }
        ])
      })
    })

    describe('.andWhereNull()', function() {
      it('is an alias of .whereNull()', function() {
        const query = new GenericQueryBuilder()
        const whereNullStub = Sinon.stub(query, 'whereNull')
        whereNullStub.returns('anything')
        expect(query.andWhereNull('a')).toEqual('anything')
        expect(whereNullStub.calledWith('a')).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereNull('c')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'formatted:b', operator: '=', value: 2 },
              { bool: 'and', field: 'formatted:c', operator: '=', value: 'NULL' }
            ]
          }
        ])
      })
    })

    describe('.orWhereNull()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereNull('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with operator "=" and value from "convention.getNullValueFor()"', function() {
        const query = new GenericQueryBuilder()
        const orWhereSpy = Sinon.spy(query, 'orWhere')
        const getNullValueForSpy = Sinon.spy(query['convention'], <any>'getNullValueFor')
        query.orWhereNull('a')
        // tslint:disable-next-line
        expect(orWhereSpy.calledWith('a', '=', null)).toBe(true)
        expect(getNullValueForSpy.calledWith('a')).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "or" + operator "=" and value from convention', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', true).where(function(query) {
          query.orWhereNull('b')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'or', field: 'formatted:b', operator: '=', value: 'NULL' }]
          }
        ])
      })
    })

    describe('.whereNotNull()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereNotNull('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() with operator "<>" and value from "convention.getNullValue()"', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        const getNullValueForSpy = Sinon.spy(query['convention'], <any>'getNullValueFor')
        query.whereNotNull('a')
        // tslint:disable-next-line
        expect(whereSpy.calledWith('a', '<>', null)).toBe(true)
        expect(getNullValueForSpy.calledWith('a')).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "and" + operator "<>" and value from convention', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', true).where(function(query) {
          query.whereNotNull('b')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'and', field: 'formatted:b', operator: '<>', value: 'NULL' }]
          }
        ])
      })
    })

    describe('.andWhereNotNull()', function() {
      it('is an alias of .whereNotNull()', function() {
        const query = new GenericQueryBuilder()
        const whereNotNullStub = Sinon.stub(query, 'whereNotNull')
        whereNotNullStub.returns('anything')
        expect(query.andWhereNotNull('a')).toEqual('anything')
        expect(whereNotNullStub.calledWith('a')).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereNotNull('c')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'formatted:b', operator: '=', value: 2 },
              { bool: 'and', field: 'formatted:c', operator: '<>', value: 'NULL' }
            ]
          }
        ])
      })
    })

    describe('.orWhereNotNull()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereNotNull('a')).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with operator "<>" and value from "convention.getNullValueFor()"', function() {
        const query = new GenericQueryBuilder()
        const orWhereSpy = Sinon.spy(query, 'orWhere')
        const getNullValueForSpy = Sinon.spy(query['convention'], <any>'getNullValueFor')
        query.orWhereNotNull('a')
        // tslint:disable-next-line
        expect(orWhereSpy.calledWith('a', '<>', null)).toBe(true)
        expect(getNullValueForSpy.calledWith('a')).toBe(true)
      })

      it('calls QueryCondition.buildQuery with "or" + operator "<>" and value from convention', function() {
        const query = new GenericQueryBuilder()
        query['convention'] = TestConvention
        query.where('a', true).where(function(query) {
          query.orWhereNotNull('b')
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'formatted:a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [{ bool: 'or', field: 'formatted:b', operator: '<>', value: 'NULL' }]
          }
        ])
      })
    })

    describe('.whereBetween()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.whereBetween('a', [1, 10])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls where() twice with operator ">=" & "<="', function() {
        const query = new GenericQueryBuilder()
        const whereSpy = Sinon.spy(query, 'where')
        query.whereBetween('a', [1, 10])
        expect(whereSpy.calledTwice).toBe(true)
        expect(whereSpy.firstCall.calledWith('a', '>=', 1)).toBe(true)
        expect(whereSpy.secondCall.calledWith('a', '<=', 10)).toBe(true)
      })

      it('can be used in sub-query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(query) {
          query.whereBetween('b', [1, 10])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '>=', value: 1 },
              { bool: 'and', field: 'b', operator: '<=', value: 10 }
            ]
          }
        ])
      })
    })

    describe('.andWhereBetween()', function() {
      it('is an alias of .whereBetween()', function() {
        const query = new GenericQueryBuilder()
        const whereBetweenStub = Sinon.stub(query, 'whereBetween')
        whereBetweenStub.returns('anything')
        expect(query.andWhereBetween('a', [1, 10])).toEqual('anything')
        expect(whereBetweenStub.calledWith('a', [1, 10])).toBe(true)
      })

      it('can be used in sub query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', 1).where(function(subQuery) {
          subQuery.where('b', 2).andWhereBetween('c', [3, 30])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: 1 },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 2 },
              { bool: 'and', field: 'c', operator: '>=', value: 3 },
              { bool: 'and', field: 'c', operator: '<=', value: 30 }
            ]
          }
        ])
      })
    })

    describe('.orWhereBetween()', function() {
      it('is chain-able', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        expect(query.orWhereBetween('a', [1, 10])).toEqual(query)
        expect(query['isUsed']).toBe(true)
      })

      it('calls orWhere() with sub-query which calls .where() twice with operator ">=" & "<="', function() {
        const query = new GenericQueryBuilder()
        const orWhereSpy = Sinon.spy(query, 'orWhere')
        query.orWhereBetween('a', [1, 10])
        expect(orWhereSpy.calledOnce).toBe(true)
        expect(query['getConditions']()).toEqual([
          {
            bool: 'or',
            queries: [
              { bool: 'and', field: 'a', operator: '>=', value: 1 },
              { bool: 'and', field: 'a', operator: '<=', value: 10 }
            ]
          }
        ])
      })

      it('can be used in sub-query', function() {
        const query = new GenericQueryBuilder()
        query.where('a', true).where(function(subQuery) {
          subQuery.where('b', 1).orWhereBetween('c', [1, 10])
        })
        expect(query['getConditions']()).toEqual([
          { bool: 'and', field: 'a', operator: '=', value: true },
          {
            bool: 'and',
            queries: [
              { bool: 'and', field: 'b', operator: '=', value: 1 },
              {
                bool: 'or',
                queries: [
                  { bool: 'and', field: 'c', operator: '>=', value: 1 },
                  { bool: 'and', field: 'c', operator: '<=', value: 10 }
                ]
              }
            ]
          }
        ])
      })
    })
  })

  describe('.whereNotBetween()', function() {
    it('is chain-able', function() {
      const query = new GenericQueryBuilder()
      expect(query['isUsed']).toBe(false)
      expect(query.whereNotBetween('a', [1, 10])).toEqual(query)
      expect(query['isUsed']).toBe(true)
    })

    it('calls where() with sub-query which calls .where() + .orWhere() with operator "<" || ">"', function() {
      const query = new GenericQueryBuilder()
      const whereSpy = Sinon.spy(query, 'where')
      query.whereNotBetween('a', [1, 10]).andWhere('b', 2)
      expect(whereSpy.called).toBe(true)
      expect(query['getConditions']()).toEqual([
        {
          bool: 'and',
          queries: [
            { bool: 'and', field: 'a', operator: '<', value: 1 },
            { bool: 'or', field: 'a', operator: '>', value: 10 }
          ]
        },
        { bool: 'and', field: 'b', operator: '=', value: 2 }
      ])
    })

    it('can be used in sub-query', function() {
      const query = new GenericQueryBuilder()
      query.where('a', true).where(function(subQuery) {
        subQuery.where('b', 1).whereNotBetween('c', [1, 10])
      })
      expect(query['getConditions']()).toEqual([
        { bool: 'and', field: 'a', operator: '=', value: true },
        {
          bool: 'and',
          queries: [
            { bool: 'and', field: 'b', operator: '=', value: 1 },
            {
              bool: 'and',
              queries: [
                { bool: 'and', field: 'c', operator: '<', value: 1 },
                { bool: 'or', field: 'c', operator: '>', value: 10 }
              ]
            }
          ]
        }
      ])
    })
  })

  describe('.andWhereNotBetween()', function() {
    it('is an alias of .whereNotBetween()', function() {
      const query = new GenericQueryBuilder()
      const whereNotBetweenStub = Sinon.stub(query, 'whereNotBetween')
      whereNotBetweenStub.returns('anything')
      expect(query.andWhereNotBetween('a', [1, 10])).toEqual('anything')
      expect(whereNotBetweenStub.calledWith('a', [1, 10])).toBe(true)
    })

    it('can be used in sub query', function() {
      const query = new GenericQueryBuilder()
      query.where('a', 1).where(function(subQuery) {
        subQuery.where('b', 2).andWhereNotBetween('c', [3, 30])
      })
      expect(query['getConditions']()).toEqual([
        { bool: 'and', field: 'a', operator: '=', value: 1 },
        {
          bool: 'and',
          queries: [
            { bool: 'and', field: 'b', operator: '=', value: 2 },
            {
              bool: 'and',
              queries: [
                { bool: 'and', field: 'c', operator: '<', value: 3 },
                { bool: 'or', field: 'c', operator: '>', value: 30 }
              ]
            }
          ]
        }
      ])
    })
  })

  describe('.orWhereNotBetween()', function() {
    it('is chain-able', function() {
      const query = new GenericQueryBuilder()
      expect(query['isUsed']).toBe(false)
      expect(query.orWhereNotBetween('a', [1, 10])).toEqual(query)
      expect(query['isUsed']).toBe(true)
    })

    it('calls orWhere() with sub-query which calls .where() + .orWhere() with operator "<" || ">"', function() {
      const query = new GenericQueryBuilder()
      const whereSpy = Sinon.spy(query, 'where')
      query.where('b', 2).orWhereNotBetween('a', [1, 10])
      expect(whereSpy.called).toBe(true)
      expect(query['getConditions']()).toEqual([
        { bool: 'and', field: 'b', operator: '=', value: 2 },
        {
          bool: 'or',
          queries: [
            { bool: 'and', field: 'a', operator: '<', value: 1 },
            { bool: 'or', field: 'a', operator: '>', value: 10 }
          ]
        }
      ])
    })

    it('can be used in sub-query', function() {
      const query = new GenericQueryBuilder()
      query.where('a', true).where(function(subQuery) {
        subQuery.where('b', 1).orWhereNotBetween('c', [1, 10])
      })
      expect(query['getConditions']()).toEqual([
        { bool: 'and', field: 'a', operator: '=', value: true },
        {
          bool: 'and',
          queries: [
            { bool: 'and', field: 'b', operator: '=', value: 1 },
            {
              bool: 'or',
              queries: [
                { bool: 'and', field: 'c', operator: '<', value: 1 },
                { bool: 'or', field: 'c', operator: '>', value: 10 }
              ]
            }
          ]
        }
      ])
    })
  })

  describe('implements ISoftDeletesQuery', function() {
    it('has optional softDelete param in constructor', function() {
      const queryNoSoftDelete = new GenericQueryBuilder()
      expect(queryNoSoftDelete['softDelete']).toBeUndefined()
      expect(queryNoSoftDelete['addSoftDeleteCondition']).toBe(false)

      const query = new GenericQueryBuilder({ deletedAt: 'any' })
      expect(query['softDelete']).toEqual({ deletedAt: 'any' })
      expect(query['addSoftDeleteCondition']).toBe(true)
    })

    it('uses whereNull() in getConditions() function if SoftDelete is enabled', function() {
      const query = new GenericQueryBuilder({ deletedAt: 'any' })
      const whereNullSpy = Sinon.spy(query, 'whereNull')
      query['getConditions']()
      expect(whereNullSpy.calledWith('any')).toBe(true)
    })

    it('does not call whereNull() in getConditions() function if SoftDelete is not used', function() {
      const query = new GenericQueryBuilder()
      const whereNullSpy = Sinon.spy(query, 'whereNull')
      query['getConditions']()
      expect(whereNullSpy.notCalled).toBe(true)
    })

    describe('.withTrash()', function() {
      it('does nothing if softDelete is not enabled', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        query.withTrashed()
        expect(query['addSoftDeleteCondition']).toBe(false)
        expect(query['isUsed']).toBe(false)
      })

      it('sets addSoftDeleteCondition to false if softDelete is enabled', function() {
        const query = new GenericQueryBuilder({ deletedAt: 'any' })
        expect(query['isUsed']).toBe(false)
        query.withTrashed()
        expect(query['addSoftDeleteCondition']).toBe(false)
        expect(query['isUsed']).toBe(true)
      })
    })

    describe('.onlyTrash()', function() {
      it('does nothing if softDelete is not enabled', function() {
        const query = new GenericQueryBuilder()
        expect(query['isUsed']).toBe(false)
        query.onlyTrashed()
        expect(query['addSoftDeleteCondition']).toBe(false)
        expect(query['isUsed']).toBe(false)
      })

      it('sets addSoftDeleteCondition to false and add .whereNotNull(field) if softDelete is enabled', function() {
        const query = new GenericQueryBuilder({ deletedAt: 'any' })
        const whereNotNullSpy = Sinon.spy(query, 'whereNotNull')
        expect(query['isUsed']).toBe(false)
        query.onlyTrashed()
        expect(query['addSoftDeleteCondition']).toBe(false)
        expect(query['isUsed']).toBe(true)
        expect(whereNotNullSpy.calledWith('any')).toBe(true)
      })
    })
  })
})
