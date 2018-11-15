import 'jest'
import { make } from 'najs-binding'
import { MemoryQueryBuilder } from '../../../lib/drivers/memory/MemoryQueryBuilder'
import { MemoryQueryBuilderFactory } from '../../../lib/drivers/memory/MemoryQueryBuilderFactory'

describe('MemoryQueryBuilderFactory', function() {
  it('implements IAutoload and register with singleton option = true', function() {
    const a = make<MemoryQueryBuilderFactory>(MemoryQueryBuilderFactory.className)
    const b = make<MemoryQueryBuilderFactory>(MemoryQueryBuilderFactory.className)
    expect(a.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory')
    expect(a === b).toBe(true)
  })

  describe('.make()', function() {
    it('creates new instance of MemoryQueryBuilder', function() {
      const model: any = {
        getModelName() {
          return 'Model'
        },
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const factory = make<MemoryQueryBuilderFactory>(MemoryQueryBuilderFactory.className)
      const qb1 = factory.make(model)
      const qb2 = factory.make(model)
      expect(qb1).toBeInstanceOf(MemoryQueryBuilder)
      expect(qb1 === qb2).toBe(false)
    })
  })
})
