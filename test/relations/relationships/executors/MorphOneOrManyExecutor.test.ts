import 'jest'
import * as Sinon from 'sinon'
import { MorphOneOrManyExecutor } from '../../../../lib/relations/relationships/executors/MorphOneOrManyExecutor'
import { HasOneExecutor } from '../../../../lib/relations/relationships/executors/HasOneExecutor'

describe('MorphOneOrManyExecutor', function() {
  it('implemented Decorator pattern, implements IHasOneOrManyExecutor and decorates HasOneOrManyExecutor', function() {
    const decoratedExecutor: any = {}
    const executor = new MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Value')
    expect(executor).toBeInstanceOf(MorphOneOrManyExecutor)
  })

  describe('.setCollector()', function() {
    it('adds condition for "targetMorphTypeName" then calls and returns decoratedExecutor.setCollector()', function() {
      const dataBucket: any = {}
      const targetModel: any = {}
      const collector: any = {
        filterBy() {}
      }

      const filterBySpy = Sinon.spy(collector, 'filterBy')

      const conditions: any[] = ['a', 'b', 'c']
      const reader: any = {
        toComparable(value: any) {
          return value
        }
      }

      const decoratedExecutor = new HasOneExecutor(dataBucket, targetModel)

      const executor = new MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Test')
      const decoratedSetCollectorSpy = Sinon.spy(decoratedExecutor, 'setCollector')
      expect(executor.setCollector(collector, conditions, reader) === executor).toBe(true)

      expect(
        decoratedSetCollectorSpy.calledWith(
          collector,
          [{ field: 'test', operator: '=', value: 'Test', reader: reader }, 'a', 'b', 'c'],
          reader
        )
      ).toBe(true)

      const filterConditions = filterBySpy.lastCall.args[0]
      expect(filterConditions).toEqual({
        $and: [{ field: 'test', operator: '=', value: 'Test', reader: reader }, 'a', 'b', 'c']
      })
    })
  })

  describe('.setQuery()', function() {
    it('adds condition for "targetMorphTypeName" then calls and returns super.setQuery()', function() {
      const dataBucket: any = {}
      const targetModel: any = {}
      const query: any = {
        where() {}
      }

      const whereSpy = Sinon.spy(query, 'where')

      const decoratedExecutor = new HasOneExecutor(dataBucket, targetModel)

      const executor = new MorphOneOrManyExecutor(decoratedExecutor, 'test', 'Test')

      const decoratedSetQuerySpy = Sinon.spy(decoratedExecutor, 'setQuery')

      expect(executor.setQuery(query) === executor).toBe(true)
      expect(whereSpy.calledWith('test', 'Test')).toBe(true)
      expect(decoratedSetQuerySpy.calledWith(query)).toBe(true)
    })
  })

  describe('.executeCollector()', function() {
    it('simply calls and returns the decoratedExecutor.executeCollector()', function() {
      const decorated: any = {
        executeCollector() {
          return 'anything'
        }
      }
      const executor = new MorphOneOrManyExecutor(decorated, 'test', 'Test')
      const spy = Sinon.spy(decorated, 'executeCollector')
      expect(executor.executeCollector()).toEqual('anything')
      expect(spy.called).toBe(true)
    })
  })

  describe('.getEmptyValue()', function() {
    it('simply calls and returns the decoratedExecutor.getEmptyValue()', function() {
      const decorated: any = {
        getEmptyValue() {
          return 'anything'
        }
      }
      const executor = new MorphOneOrManyExecutor(decorated, 'test', 'Test')
      const spy = Sinon.spy(decorated, 'getEmptyValue')
      expect(executor.getEmptyValue()).toEqual('anything')
      expect(spy.called).toBe(true)
    })
  })

  describe('.executeQuery()', function() {
    it('simply calls and returns the decoratedExecutor.executeQuery()', function() {
      const decorated: any = {
        executeQuery() {
          return 'anything'
        }
      }
      const executor = new MorphOneOrManyExecutor(decorated, 'test', 'Test')
      const spy = Sinon.spy(decorated, 'executeQuery')
      expect(executor.executeQuery()).toEqual('anything')
      expect(spy.called).toBe(true)
    })
  })
})
