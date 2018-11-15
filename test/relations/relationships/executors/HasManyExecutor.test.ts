import 'jest'
import * as Sinon from 'sinon'
import { HasOneOrManyExecutor } from '../../../../lib/relations/relationships/executors/HasOneOrManyExecutor'
import { HasManyExecutor } from '../../../../lib/relations/relationships/executors/HasManyExecutor'
import { isCollection } from '../../../../lib/util/helpers'

describe('HasManyExecutor', function() {
  it('extends HasOneOrManyExecutor', function() {
    const dataBucket: any = {}
    const targetModel: any = {}
    const executor = new HasManyExecutor(dataBucket, targetModel)
    expect(executor).toBeInstanceOf(HasOneOrManyExecutor)
  })

  describe('.executeCollector()', function() {
    it('calls collector.exec(), then create a Collection by DataBucket.makeCollection() with the result', function() {
      const collector: any = {
        filterBy() {},
        exec() {}
      }
      const execStub = Sinon.stub(collector, 'exec')

      const itemOne = {}
      const itemTwo = {}
      const result = [itemOne, itemTwo]
      execStub.returns(result)

      const dataBucket: any = {
        makeCollection(target: any, data: any) {
          return data
        }
      }
      const targetModel: any = {}
      const executor = new HasManyExecutor(dataBucket, targetModel)

      const spy = Sinon.spy(dataBucket, 'makeCollection')

      const reader: any = {
        toComparable(value: any) {
          return value
        }
      }
      expect((executor.setCollector(collector, [], reader).executeCollector() as any) === result).toBe(true)
      expect(execStub.calledWith()).toBe(true)
      expect(spy.calledWith(targetModel, [itemOne, itemTwo])).toBe(true)
    })
  })

  describe('.executeQuery()', function() {
    it('simply calls and returns query.get()', async function() {
      const dataBucket: any = {}
      const targetModel: any = {}
      const executor = new HasManyExecutor(dataBucket, targetModel)
      const query: any = {
        async get() {
          return 'anything'
        }
      }
      expect(await executor.setQuery(query).executeQuery()).toBe('anything')
    })
  })

  describe('.getEmptyValue()', function() {
    it('returns empty collection', function() {
      const dataBucket: any = {}
      const targetModel: any = {}
      const executor = new HasManyExecutor(dataBucket, targetModel)
      expect(isCollection(executor.getEmptyValue())).toBe(true)
    })
  })
})
