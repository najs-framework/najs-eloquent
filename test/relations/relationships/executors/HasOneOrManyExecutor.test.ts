import 'jest'
import * as Sinon from 'sinon'
import { HasOneExecutor } from '../../../../lib/relations/relationships/executors/HasOneExecutor'

describe('HasOneOrManyExecutor', function() {
  function make_executor(dataBucket: any, targetModel: any) {
    return new HasOneExecutor(dataBucket, targetModel)
  }

  describe('constructor()', function() {
    it('assigns the given dataBucket and targetModel to respective properties', function() {
      const dataBucket = {}
      const targetModel = {}
      const executor = make_executor(dataBucket, targetModel)
      expect(executor['dataBucket'] === dataBucket).toBe(true)
      expect(executor['targetModel'] === targetModel).toBe(true)
    })
  })

  describe('.setCollector()', function() {
    it('assigns given collector to property collector, then call collector.filterBy() and add conditions to it', function() {
      const collector: any = {
        filterBy() {}
      }
      const dataBucket = {}
      const targetModel = {}
      const executor = make_executor(dataBucket, targetModel)

      const filterBySpy = Sinon.spy(collector, 'filterBy')
      const conditions: any = ['a', 'b', 'c', 'd']
      expect(executor.setCollector(collector, conditions, {} as any) === executor).toBe(true)
      expect(executor['collector'] === collector).toBe(true)
      expect(filterBySpy.calledWith({ $and: conditions })).toBe(true)
    })
  })

  describe('.setQuery()', function() {
    it('assigns given query to property query, then returns itself', function() {
      const query: any = {}
      const dataBucket = {}
      const targetModel = {}
      const executor = make_executor(dataBucket, targetModel)

      expect(executor.setQuery(query) === executor).toBe(true)
      expect(executor['query'] === query).toBe(true)
    })
  })
})
