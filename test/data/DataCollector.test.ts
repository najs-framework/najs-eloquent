import 'jest'
import * as Sinon from 'sinon'
import { pick } from 'lodash'
import { DataCollector } from '../../lib/data/DataCollector'
import { DataConditionMatcher } from '../../lib/data/DataConditionMatcher'

const reader = {
  getAttribute(data: object, field: string) {
    return data[field]
  },

  pick(data: object, fields: string[]) {
    return pick(data, fields)
  },

  toComparable(value: any) {
    return value
  }
}
describe('DataCollector', function() {
  describe('Unit tests', function() {
    describe('constructor()', function() {
      it('creates an new instance of DataCollector with the dataSource and conditions = {}', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        expect(collector['dataBuffer'] === buffer).toBe(true)
      })
    })

    describe('.limit()', function() {
      it('simply assigns the given value to "limited" property', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        expect(collector['limited']).toBeUndefined()
        collector.limit(1000)
        expect(collector['limited']).toEqual(1000)
      })
    })

    describe('.select()', function() {
      it('simply assigns the given value to "selected" property', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        expect(collector['selected']).toBeUndefined()
        collector.select(['a', 'b', 'c'])
        expect(collector['selected']).toEqual(['a', 'b', 'c'])
      })
    })

    describe('.orderBy()', function() {
      it('simply assigns the given value to "sortedBy" property', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        expect(collector['sortedBy']).toBeUndefined()
        collector.orderBy([['a', 'asc'], ['b', 'desc']])
        expect(collector['sortedBy']).toEqual([['a', 'asc'], ['b', 'desc']])
      })
    })

    describe('.filterBy()', function() {
      it('simply assigns the given value to "conditions" property', function() {
        const conditions: any = {}
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        collector.filterBy(conditions)
        expect(collector['conditions'] === conditions).toBe(true)
      })
    })

    describe('.isMatch()', function() {
      it('calls and returns .isMatchAtLeastOneCondition() if the boolean operator is $or', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchAtLeastOneConditionStub = Sinon.stub(collector, 'isMatchAtLeastOneCondition')
        const isMatchAllConditionsStub = Sinon.stub(collector, 'isMatchAllConditions')

        isMatchAtLeastOneConditionStub.returns('at-least')
        isMatchAllConditionsStub.returns('all')

        const conditions = { $or: [] }
        const record = {}
        expect(collector.isMatch(record, conditions)).toEqual('at-least')
        expect(isMatchAtLeastOneConditionStub.calledWith(record, conditions['$or'])).toBe(true)
        expect(isMatchAllConditionsStub.called).toBe(false)
      })

      it('calls and returns .isMatchAllConditionsStub() if the boolean operator is $and', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchAtLeastOneConditionStub = Sinon.stub(collector, 'isMatchAtLeastOneCondition')
        const isMatchAllConditionsStub = Sinon.stub(collector, 'isMatchAllConditions')

        isMatchAtLeastOneConditionStub.returns('at-least')
        isMatchAllConditionsStub.returns('all')

        const conditions = { $and: [] }
        const record = {}
        expect(collector.isMatch(record, conditions)).toEqual('all')
        expect(isMatchAllConditionsStub.calledWith(record, conditions['$and'])).toBe(true)
        expect(isMatchAtLeastOneConditionStub.called).toBe(false)
      })

      it('simply returns false if there is no operator $or or $and', function() {
        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchAtLeastOneConditionStub = Sinon.stub(collector, 'isMatchAtLeastOneCondition')
        const isMatchAllConditionsStub = Sinon.stub(collector, 'isMatchAllConditions')

        isMatchAtLeastOneConditionStub.returns('at-least')
        isMatchAllConditionsStub.returns('all')

        const conditions = {}
        const record = {}
        expect(collector.isMatch(record, conditions)).toBe(false)
        expect(isMatchAllConditionsStub.called).toBe(false)
        expect(isMatchAtLeastOneConditionStub.called).toBe(false)
      })
    })

    describe('.isMatchAtLeastOneCondition()', function() {
      it('returns true immediately if there is any Matcher returns true', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(true)
        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const record = {}

        expect(collector.isMatchAtLeastOneCondition(record, [matcherA, matcherB])).toBe(true)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(false)
      })

      it('returns false if all Matchers return false', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(false)
        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const record = {}

        expect(collector.isMatchAtLeastOneCondition(record, [matcherA, matcherB])).toBe(false)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
      })

      it('calls .isMatch() if there is a sub conditions in the list, case 1', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)
        const matcherC = new DataConditionMatcher('c', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(false)

        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(true)

        const isMatchStubC = Sinon.stub(matcherC, 'isMatch')
        isMatchStubC.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchSpy = Sinon.spy(collector, 'isMatch')

        const record = {}

        expect(collector.isMatchAtLeastOneCondition(record, [matcherA, { $or: [matcherB, matcherC] }])).toBe(true)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchSpy.calledWith(record, { $or: [matcherB, matcherC] })).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
        expect(isMatchStubC.calledWith(record)).toBe(false)
      })

      it('calls .isMatch() if there is a sub conditions in the list, case 2', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)
        const matcherC = new DataConditionMatcher('c', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(false)

        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(false)

        const isMatchStubC = Sinon.stub(matcherC, 'isMatch')
        isMatchStubC.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchSpy = Sinon.spy(collector, 'isMatch')

        const record = {}

        expect(collector.isMatchAtLeastOneCondition(record, [matcherA, { $or: [matcherB, matcherC] }])).toBe(false)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchSpy.calledWith(record, { $or: [matcherB, matcherC] })).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
        expect(isMatchStubC.calledWith(record)).toBe(true)
      })
    })

    describe('.isMatchAllConditions()', function() {
      it('returns false immediately if there is any Matcher returns false', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(false)
        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const record = {}

        expect(collector.isMatchAllConditions(record, [matcherA, matcherB])).toBe(false)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(false)
      })

      it('returns true all Matchers return true', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(true)
        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(true)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const record = {}

        expect(collector.isMatchAllConditions(record, [matcherA, matcherB])).toBe(true)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
      })

      it('calls .isMatch() if there is a sub conditions in the list, case 1', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)
        const matcherC = new DataConditionMatcher('c', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(true)

        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(true)

        const isMatchStubC = Sinon.stub(matcherC, 'isMatch')
        isMatchStubC.returns(false)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchSpy = Sinon.spy(collector, 'isMatch')

        const record = {}

        expect(collector.isMatchAllConditions(record, [matcherA, { $and: [matcherB, matcherC] }])).toBe(false)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchSpy.calledWith(record, { $and: [matcherB, matcherC] })).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
        expect(isMatchStubC.calledWith(record)).toBe(true)
      })

      it('calls .isMatch() if there is a sub conditions in the list, case 2', function() {
        const matcherA = new DataConditionMatcher('a', '=', 1, reader)
        const matcherB = new DataConditionMatcher('b', '=', 1, reader)
        const matcherC = new DataConditionMatcher('c', '=', 1, reader)

        const isMatchStubA = Sinon.stub(matcherA, 'isMatch')
        isMatchStubA.returns(true)

        const isMatchStubB = Sinon.stub(matcherB, 'isMatch')
        isMatchStubB.returns(true)

        const isMatchStubC = Sinon.stub(matcherC, 'isMatch')
        isMatchStubC.returns(true)

        const buffer: any = {}
        const collector = new DataCollector(buffer, reader)
        const isMatchSpy = Sinon.spy(collector, 'isMatch')

        const record = {}

        expect(collector.isMatchAllConditions(record, [matcherA, { $and: [matcherB, matcherC] }])).toBe(true)
        expect(isMatchStubA.calledWith(record)).toBe(true)
        expect(isMatchSpy.calledWith(record, { $and: [matcherB, matcherC] })).toBe(true)
        expect(isMatchStubB.calledWith(record)).toBe(true)
        expect(isMatchStubC.calledWith(record)).toBe(true)
      })
    })

    describe('.exec()', function() {
      it('does not filter if there is no conditions data', function() {
        const ds: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
        const collector = new DataCollector(ds, reader)
        const result = collector.exec().map(item => item['a'])
        expect(result).toEqual([1, 2, 3, 4, 5])
      })

      it('filters dataSource by .isMatch()', function() {
        const ds: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
        const collector = new DataCollector(ds, reader)
        const matcher = new DataConditionMatcher('a', '<', 3, reader)
        collector.filterBy({ $and: [matcher] })
        const result = collector.exec().map(item => item['a'])
        expect(result).toEqual([1, 2])
      })

      it('never calls .sortLimitAndSelectItems() if there is no sortedByConfig', function() {
        const ds: any = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }]
        const collector = new DataCollector(ds, reader)
        const sortLimitAndSelectItemsSpy = Sinon.spy(collector, 'sortLimitAndSelectItems')

        const matcher = new DataConditionMatcher('a', '>=', 3, reader)
        collector.filterBy({ $and: [matcher] })
        const result = collector.exec().map(item => item['a'])
        expect(result).toEqual([3, 4, 5])
        expect(sortLimitAndSelectItemsSpy.called).toBe(false)
      })

      it('has a shortcut to limit number of records if there is no sortedBy config', function() {
        const ds: any = [{ a: 1, b: 'a' }, { a: 2, b: 'b' }, { a: 3, b: 'c' }, { a: 4, b: 'd' }, { a: 5, b: 'e' }]
        const collector = new DataCollector(ds, reader)
        const sortLimitAndSelectItemsSpy = Sinon.spy(collector, 'sortLimitAndSelectItems')

        const matcher = new DataConditionMatcher('a', '>=', 3, reader)
        collector.limit(2).filterBy({ $and: [matcher] })
        const result = collector.exec().map(item => item['a'])
        expect(result).toEqual([3, 4])
        expect(sortLimitAndSelectItemsSpy.called).toBe(false)
      })

      it('has a shortcut to limit number of records and pickFields if there is no sortedBy config', function() {
        const ds: any = [{ a: 1, b: 'a' }, { a: 2, b: 'b' }, { a: 3, b: 'c' }, { a: 4, b: 'd' }, { a: 5, b: 'e' }]
        const collector = new DataCollector(ds, reader)
        const sortLimitAndSelectItemsSpy = Sinon.spy(collector, 'sortLimitAndSelectItems')

        const matcher = new DataConditionMatcher('a', '>=', 3, reader)
        collector
          .limit(2)
          .select(['b'])
          .filterBy({ $and: [matcher] })
        const result = collector.exec()
        expect(result).toEqual([{ b: 'c' }, { b: 'd' }])
        expect(sortLimitAndSelectItemsSpy.called).toBe(false)
      })

      it('filters by .isMatch() then calls and returns .sortLimitAndSelectItems()', function() {
        const ds: any = [{ a: 1, b: 'a' }, { a: 1, b: 'b' }, { a: 1, b: 'c' }, { a: 1, b: 'd' }, { a: 1, b: 'e' }]
        const collector = new DataCollector(ds, reader)
        const sortLimitAndSelectItemsSpy = Sinon.spy(collector, 'sortLimitAndSelectItems')

        const matcher = new DataConditionMatcher('a', '=', 1, reader)
        collector
          .orderBy([['b', 'asc']])
          .filterBy({ $and: [matcher] })
          .limit(3)

        const result = collector.exec().map(item => item['b'])
        expect(result).toEqual(['a', 'b', 'c'])
        expect(sortLimitAndSelectItemsSpy.called).toBe(true)
      })
    })

    describe('.sortLimitAndSelectItems()', function() {
      it('calls records.sort() with .compare() function', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)

        const records = [{ a: 1 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 5 }]
        const compareSpy = Sinon.spy(collector, 'compare')

        collector.orderBy([['a', 'asc']])
        const result = collector.sortLimitAndSelectItems(records).map(item => item['a'])
        expect(result).toEqual([1, 2, 3, 4, 5])
        expect(compareSpy.callCount).toBeGreaterThan(0)
      })

      it('use Array.slice() to apply the limit number of records if needed', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)

        const records = [{ a: 1 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 5 }]
        collector.orderBy([['a', 'asc']])
        collector.limit(3)
        const result = collector.sortLimitAndSelectItems(records).map(item => item['a'])
        expect(result).toEqual([1, 2, 3])
      })

      it('maps and use reader.pick() if the selected is not undefined', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)

        const records = [{ a: 1 }, { a: 4 }, { a: 3 }, { a: 2 }, { a: 5 }]
        const stub = Sinon.stub(reader, 'pick')
        stub.returns('anything')

        collector
          .orderBy([['a', 'asc']])
          .limit(3)
          .select(['field'])
        const result = collector.sortLimitAndSelectItems(records)
        expect(result).toEqual(['anything', 'anything', 'anything'])
      })
    })

    describe('.compare()', function() {
      it('should works with 1 sorted by argument', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)
        const dataset = [
          {
            sortedBy: [['a', 'asc']],
            data: [
              { lhs: { a: 1 }, rhs: { a: 1 }, result: 0 },
              { lhs: { a: 0 }, rhs: { a: 1 }, result: -1 },
              { lhs: { a: 1 }, rhs: { a: 0 }, result: 1 }
            ]
          },
          {
            sortedBy: [['a', 'desc']],
            data: [
              { lhs: { a: 1 }, rhs: { a: 1 }, result: 0 },
              { lhs: { a: 0 }, rhs: { a: 1 }, result: 1 },
              { lhs: { a: 1 }, rhs: { a: 0 }, result: -1 }
            ]
          }
        ]
        for (const testCase of dataset) {
          collector.orderBy(testCase.sortedBy as Array<[string, string]>)
          for (const item of testCase.data) {
            expect(collector.compare(item.lhs, item.rhs, 0)).toEqual(item.result)
          }
        }
      })

      it('should works with 2 sorted by arguments', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)
        const dataset = [
          {
            sortedBy: [['a', 'asc'], ['b', 'asc']],
            data: [
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 0 },
              { lhs: { a: 0, b: 'b' }, rhs: { a: 1, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 0, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'a' }, rhs: { a: 1, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'a' }, result: 1 }
            ]
          },
          {
            sortedBy: [['a', 'desc'], ['b', 'asc']],
            data: [
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 0 },
              { lhs: { a: 0, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 0, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'a' }, rhs: { a: 1, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'a' }, result: 1 }
            ]
          },
          {
            sortedBy: [['a', 'asc'], ['b', 'desc']],
            data: [
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 0 },
              { lhs: { a: 0, b: 'b' }, rhs: { a: 1, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 0, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'a' }, rhs: { a: 1, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'a' }, result: -1 }
            ]
          },
          {
            sortedBy: [['a', 'desc'], ['b', 'desc']],
            data: [
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 0 },
              { lhs: { a: 0, b: 'b' }, rhs: { a: 1, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 0, b: 'b' }, result: -1 },
              { lhs: { a: 1, b: 'a' }, rhs: { a: 1, b: 'b' }, result: 1 },
              { lhs: { a: 1, b: 'b' }, rhs: { a: 1, b: 'a' }, result: -1 }
            ]
          }
        ]
        for (const testCase of dataset) {
          collector.orderBy(testCase.sortedBy as Array<[string, string]>)
          for (const item of testCase.data) {
            expect(collector.compare(item.lhs, item.rhs, 0)).toEqual(item.result)
          }
        }
      })
    })
  })

  describe('Integration tests', function() {
    describe('.sortLimitAndSelectItems()', function() {
      const dataset = [
        { id: 1, first_name: 'a', last_name: 'x', age: 30 },
        { id: 2, first_name: 'a', last_name: 'x', age: 30 },
        { id: 3, first_name: 'a', last_name: 'y', age: 20 },
        { id: 4, first_name: 'a', last_name: 'y', age: 20 },
        { id: 5, first_name: 'a', last_name: 'z', age: 10 },
        { id: 6, first_name: 'a', last_name: 'z', age: 10 },
        { id: 7, first_name: 'b', last_name: 'x', age: 30 },
        { id: 8, first_name: 'b', last_name: 'y', age: 20 },
        { id: 9, first_name: 'b', last_name: 'z', age: 10 },
        { id: 10, first_name: 'c', last_name: 'x', age: 30 },
        { id: 11, first_name: 'c', last_name: 'y', age: 20 },
        { id: 12, first_name: 'c', last_name: 'z', age: 10 }
      ]

      it('should work with 1 sortedBy argument', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)

        const records = dataset
        collector.orderBy([['first_name', 'desc']])

        const result = collector.sortLimitAndSelectItems(records).map(item => item['first_name'])
        expect(result).toEqual(['c', 'c', 'c', 'b', 'b', 'b', 'a', 'a', 'a', 'a', 'a', 'a'])
      })

      it('should work with 2 sortedBy arguments', function() {
        const ds: any = {}
        const collector = new DataCollector(ds, reader)

        const records = dataset
        collector.orderBy([['first_name', 'desc'], ['age', 'desc']])

        const result = collector.sortLimitAndSelectItems(records).map(item => item['first_name'] + '-' + item['age'])
        expect(result).toEqual([
          'c-30',
          'c-20',
          'c-10',
          'b-30',
          'b-20',
          'b-10',
          'a-30',
          'a-30',
          'a-20',
          'a-20',
          'a-10',
          'a-10'
        ])
      })
    })
  })
})
