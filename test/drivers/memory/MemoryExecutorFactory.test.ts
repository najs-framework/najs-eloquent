import 'jest'
import { make } from 'najs-binding'
import { MemoryExecutorFactory } from '../../../lib/drivers/memory/MemoryExecutorFactory'
import { MemoryRecordExecutor } from '../../../lib/drivers/memory/MemoryRecordExecutor'
import { MemoryQueryExecutor } from '../../../lib/drivers/memory/MemoryQueryExecutor'
import { MemoryQueryLog } from '../../../lib/drivers/memory/MemoryQueryLog'
import { MemoryDataSourceProviderFacade } from '../../../lib/facades/global/MemoryDataSourceProviderFacade'

describe('MemoryExecutorFactory', function() {
  it('implements IAutoload and register with singleton option = true', function() {
    const a = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
    const b = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
    expect(a.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryExecutorFactory')
    expect(a === b).toBe(true)
  })

  describe('.makeRecordExecutor()', function() {
    it('creates new instance of MemoryRecordExecutor with model, record, dataSource and logger', function() {
      const model: any = {}
      const record: any = {}
      const dataSource = {}
      const stub = MemoryDataSourceProviderFacade.createStub('create')
      stub.returns(dataSource)

      const factory = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
      const recordExecutor = factory.makeRecordExecutor(model, record)

      expect(recordExecutor).toBeInstanceOf(MemoryRecordExecutor)
      expect(recordExecutor['model'] === model).toBe(true)
      expect(recordExecutor['record'] === record).toBe(true)
      expect(recordExecutor['dataSource'] === dataSource).toBe(true)
      stub.restore()
    })
  })

  describe('.makeQueryExecutor()', function() {
    it('creates new instance of MemoryQueryExecutor with model, record, collection and logger', function() {
      const basicQuery: any = {}
      const model: any = {
        getRecordName() {
          return 'any'
        }
      }
      const handler: any = {
        getQueryName() {
          return 'test'
        },
        getBasicQuery() {
          return basicQuery
        },
        getModel() {
          return model
        }
      }
      const dataSource = {}
      const stub = MemoryDataSourceProviderFacade.createStub('create')
      stub.returns(dataSource)

      const factory = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
      const queryExecutor = factory.makeQueryExecutor(handler)

      expect(queryExecutor).toBeInstanceOf(MemoryQueryExecutor)
      expect(queryExecutor['queryHandler'] === handler).toBe(true)

      stub.restore()
    })
  })

  describe('.getDataSource()', function() {
    it('returns DataSource by calling MemoryDataSourceProvider.create()', function() {
      const model: any = {}
      const stub = MemoryDataSourceProviderFacade.createStub('create')
      stub.returns('anything')

      const factory = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
      expect(factory.getDataSource(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.makeLogger()', function() {
    it('simply create new MemoryQueryLog', function() {
      const factory = make<MemoryExecutorFactory>(MemoryExecutorFactory.className)
      expect(factory.makeLogger()).toBeInstanceOf(MemoryQueryLog)
    })
  })
})
