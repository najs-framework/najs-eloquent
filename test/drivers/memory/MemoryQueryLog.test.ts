import 'jest'
import * as Sinon from 'sinon'
import { MemoryQueryLog } from '../../../lib/drivers/memory/MemoryQueryLog'
import { QueryLogBase } from '../../../lib/drivers/QueryLogBase'

describe('MemoryQueryLog', function() {
  it('extends QueryLogBase', function() {
    const logger = new MemoryQueryLog()
    expect(logger).toBeInstanceOf(QueryLogBase)
  })

  describe('.getDefaultData()', function() {
    it('simply calls and returns .getEmptyData()', function() {
      const logger = new MemoryQueryLog()
      const stub = Sinon.stub(logger, 'getEmptyData')
      stub.returns('anything')

      expect(logger.getDefaultData()).toEqual('anything')
    })
  })

  describe('.dataSource()', function() {
    it('assigns the className of DataSource class to dataSource property', function() {
      const logger = new MemoryQueryLog()
      const dataSource: any = {
        getClassName() {
          return 'anything'
        }
      }
      expect(logger.dataSource(dataSource) === logger).toBe(true)
      expect(logger['data']['dataSource']).toEqual('anything')
    })
  })

  describe('.updateRecordInfo()', function() {
    it('creates an array and add the info to data under property "records"', function() {
      const info: any = {}
      const logger = new MemoryQueryLog()
      expect(logger.updateRecordInfo(info) === logger).toBe(true)
      expect(logger['data']['records']).toEqual([info])
    })

    it('push an info to array in data under property "records"', function() {
      const info1: any = {}
      const info2: any = {}
      const logger = new MemoryQueryLog()
      expect(logger.updateRecordInfo(info1) === logger).toBe(true)
      expect(logger.updateRecordInfo(info2) === logger).toBe(true)
      expect(logger['data']['records']).toEqual([info1, info2])
    })
  })
})
