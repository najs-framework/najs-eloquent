import 'jest'
import { QueryBuilder } from '../../../lib/query-builders/QueryBuilder'
import { MemoryQueryBuilder } from '../../../lib/drivers/memory/MemoryQueryBuilder'
import { MemoryQueryBuilderHandler } from '../../../lib/drivers/memory/MemoryQueryBuilderHandler'
import { MemoryDataSource } from '../../../lib/drivers/memory/MemoryDataSource'
import { MemoryDataSourceProvider } from '../../../lib/facades/global/MemoryDataSourceProviderFacade'

MemoryDataSourceProvider.register(MemoryDataSource, 'memory', true)

describe('MemoryQueryBuilder', function() {
  it('extends QueryBuilder', function() {
    const model: any = {}
    const instance = new MemoryQueryBuilder(new MemoryQueryBuilderHandler(model))
    expect(instance).toBeInstanceOf(QueryBuilder)
  })
})
