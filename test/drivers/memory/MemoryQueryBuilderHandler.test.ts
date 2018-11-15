import 'jest'
import { QueryBuilderHandlerBase } from '../../../lib/query-builders/QueryBuilderHandlerBase'
import { MemoryQueryBuilderHandler } from '../../../lib/drivers/memory/MemoryQueryBuilderHandler'
import { BasicQuery } from '../../../lib/query-builders/shared/BasicQuery'
import { MemoryQueryExecutor } from '../../../lib/drivers/memory/MemoryQueryExecutor'
import { ConditionQueryHandler } from '../../../lib/query-builders/shared/ConditionQueryHandler'
import { DefaultConvention } from '../../../lib/query-builders/shared/DefaultConvention'
import { MemoryDataSourceProviderFacade } from '../../../lib/facades/global/MemoryDataSourceProviderFacade'
import { MemoryDataSource } from '../../../lib/drivers/memory/MemoryDataSource'

MemoryDataSourceProviderFacade.register(MemoryDataSource, 'memory', true)

describe('MemoryQueryBuilderHandler', function() {
  it('extends QueryBuilderHandlerBase', function() {
    const model: any = {}
    const instance = new MemoryQueryBuilderHandler(model)
    expect(instance).toBeInstanceOf(QueryBuilderHandlerBase)
  })

  describe('constructor()', function() {
    it('makes 3 instances, 1. convention = DefaultConvention', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getQueryConvention()).toBeInstanceOf(DefaultConvention)
    })

    it('makes 3 instances, 2. basicQuery = BasicQuery', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getBasicQuery()).toBeInstanceOf(BasicQuery)
    })

    it('makes 3 instances, 3. conditionQuery = ConditionQueryHandle which wrap "basicQuery"', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getConditionQuery()).toBeInstanceOf(ConditionQueryHandler)
      expect(handler.getConditionQuery()['basicConditionQuery'] === handler.getBasicQuery()).toBe(true)
    })
  })

  describe('.getBasicQuery()', function() {
    it('simply returns "basicQuery" property', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getBasicQuery() === handler['basicQuery']).toBe(true)
    })
  })

  describe('.getConditionQuery()', function() {
    it('simply returns "conditionQuery" property', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getConditionQuery() === handler['conditionQuery']).toBe(true)
    })
  })

  describe('.getQueryConvention()', function() {
    it('simply returns "convention" property', function() {
      const model: any = {}
      const handler = new MemoryQueryBuilderHandler(model)
      expect(handler.getQueryConvention() === handler['convention']).toBe(true)
    })
  })

  describe('.getQueryExecutor()', function() {
    it('creates and returns new instance of MemoryQueryExecutor', function() {
      const model: any = {
        getRecordName() {
          return 'model'
        },
        getModelName() {
          return 'model'
        },
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const handler = new MemoryQueryBuilderHandler(model)
      const executor1 = handler.getQueryExecutor()
      const executor2 = handler.getQueryExecutor()
      expect(executor1 === executor2).toBe(false)
      expect(executor1).toBeInstanceOf(MemoryQueryExecutor)
    })
  })
})
