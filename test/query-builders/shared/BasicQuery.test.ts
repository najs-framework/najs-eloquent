import 'jest'
import * as Sinon from 'sinon'
import { BasicQuery } from '../../../lib/query-builders/shared/BasicQuery'
import { DefaultConvention } from '../../../lib/query-builders/shared/DefaultConvention'
import { QueryCondition } from '../../../lib/query-builders/shared/QueryCondition'

describe('BasicQuery', function() {
  const defaultConvention = new DefaultConvention()

  describe('.getConditions()', function() {
    it('loops all raw conditions and map with .toObject()', function() {
      const query = new BasicQuery(defaultConvention)
      query.where('a', 1).where('b', 2)
      expect(query.getConditions()).toEqual([
        { bool: 'and', field: 'a', operator: '=', value: 1 },
        { bool: 'and', field: 'b', operator: '=', value: 2 }
      ])
    })
  })

  describe('.getRawConditions()', function() {
    it('simply returns conditions data', function() {
      const query = new BasicQuery(defaultConvention)
      const data = {}
      query['conditions'] = <any>data
      expect(query.getRawConditions() === data).toBe(true)
    })
  })

  describe('.getLimit()', function() {
    it('simply returns limit data', function() {
      const query = new BasicQuery(defaultConvention)
      const data = {}
      query['limitNumber'] = <any>data
      expect(query.getLimit() === data).toBe(true)
    })
  })

  describe('.getOrdering()', function() {
    it('simply returns ordering data', function() {
      const query = new BasicQuery(defaultConvention)
      const data = {}
      query['ordering'] = <any>data
      expect(query.getOrdering() === data).toBe(true)
    })
  })

  describe('.getSelect()', function() {
    it('simply returns select data', function() {
      const query = new BasicQuery(defaultConvention)
      const data = {}
      query['fields']['select'] = <any>data
      expect(query.getSelect() === data).toBe(true)
    })
  })

  describe('.clearSelect()', function() {
    it('clears all select data', function() {
      const query = new BasicQuery(defaultConvention)

      query.select('1')
      expect(query.getSelect()).toEqual(['1'])

      query.select(['2'], ['3'])
      expect(query.getSelect()).toEqual(['1', '2', '3'])

      query.clearSelect()
      expect(query.getSelect()).toBeUndefined()
    })
  })

  describe('.clearOrdering()', function() {
    it('clears all ordering data', function() {
      const query = new BasicQuery(defaultConvention)
      expect(Array.from(query.orderBy('a', 'asc').getOrdering())).toEqual([['a', 'asc']])
      expect(Array.from(query.orderBy('a', 'desc').getOrdering())).toEqual([['a', 'desc']])
      expect(Array.from(query.orderBy('b').getOrdering())).toEqual([['a', 'desc'], ['b', 'asc']])

      query.clearOrdering()
      expect(Array.from(query.getOrdering().keys())).toEqual([])
    })
  })

  describe('.select()', function() {
    it('calls flattens all params and append to "fields.select"', function() {
      const query = new BasicQuery(defaultConvention)

      query.select('1')
      expect(query.getSelect()).toEqual(['1'])

      query.select(['2'], ['3'])
      expect(query.getSelect()).toEqual(['1', '2', '3'])

      query.select('4')
      expect(query.getSelect()).toEqual(['1', '2', '3', '4'])

      query.select(['5', '6'], '5', '7', '7')
      expect(query.getSelect()).toEqual(['1', '2', '3', '4', '5', '6', '7'])
    })
  })

  describe('.orderBy()', function() {
    it('has default direction is ASC', function() {
      const query = new BasicQuery(defaultConvention)
      expect(Array.from(query.orderBy('a').getOrdering())).toEqual([['a', 'asc']])
    })

    it('can set direction to DESC', function() {
      const query = new BasicQuery(defaultConvention)
      expect(Array.from(query.orderBy('a', 'desc').getOrdering())).toEqual([['a', 'desc']])
    })

    it('overrides if fields already exists', function() {
      const query = new BasicQuery(defaultConvention)
      expect(Array.from(query.orderBy('a', 'asc').getOrdering())).toEqual([['a', 'asc']])
      expect(Array.from(query.orderBy('a', 'desc').getOrdering())).toEqual([['a', 'desc']])
      expect(Array.from(query.orderBy('b').getOrdering())).toEqual([['a', 'desc'], ['b', 'asc']])
    })
  })

  describe('.limit()', function() {
    it('has init value is undefined, adds params to "limitNumber"', function() {
      const query = new BasicQuery(defaultConvention)
      expect(query.getLimit()).toBeUndefined()
      expect(query.limit(10)).toEqual(query)
      expect(query.getLimit()).toEqual(10)
    })
  })

  describe('.where()', function() {
    it('is chainable, calls QueryCondition.create() with operator "and" and put the result to "conditions"', function() {
      const stub = Sinon.stub(QueryCondition, 'create')
      stub.returns('result')

      const query = new BasicQuery(defaultConvention)
      expect(query.where('a', 'b') === query).toBe(true)

      expect(query.getRawConditions()).toEqual(['result'])
      expect(stub.calledWith(defaultConvention, 'and', 'a', 'b')).toBe(true)
      stub.resetHistory()

      query.where('a', '<>', 'b')
      expect(query.getRawConditions()).toEqual(['result', 'result'])
      expect(stub.calledWith(defaultConvention, 'and', 'a', '<>', 'b')).toBe(true)
      stub.resetHistory()

      const subQuery: any = function() {}
      query.where(subQuery)
      expect(query.getRawConditions()).toEqual(['result', 'result', 'result'])
      expect(stub.calledWith(defaultConvention, 'and', subQuery)).toBe(true)
      stub.resetHistory()

      stub.restore()
    })
  })

  describe('.orWhere()', function() {
    it('is chainable, calls QueryCondition.create() with operator "or" and put the result to "conditions"', function() {
      const stub = Sinon.stub(QueryCondition, 'create')
      stub.returns('result')

      const query = new BasicQuery(defaultConvention)
      expect(query.orWhere('a', 'b') === query).toBe(true)

      expect(query.getRawConditions()).toEqual(['result'])
      expect(stub.calledWith(defaultConvention, 'or', 'a', 'b')).toBe(true)
      stub.resetHistory()

      query.orWhere('a', '<>', 'b')
      expect(query.getRawConditions()).toEqual(['result', 'result'])
      expect(stub.calledWith(defaultConvention, 'or', 'a', '<>', 'b')).toBe(true)
      stub.resetHistory()

      const subQuery: any = function() {}
      query.orWhere(subQuery)
      expect(query.getRawConditions()).toEqual(['result', 'result', 'result'])
      expect(stub.calledWith(defaultConvention, 'or', subQuery)).toBe(true)
      stub.resetHistory()

      stub.restore()
    })
  })
})
