import 'jest'
import * as Sinon from 'sinon'
import { QueryLog } from '../../../lib/facades/global/QueryLogFacade'
import { MemoryRecordExecutor } from '../../../lib/drivers/memory/MemoryRecordExecutor'
import { MemoryQueryLog } from '../../../lib/drivers/memory/MemoryQueryLog'
import { RecordExecutorBase } from '../../../lib/drivers/RecordExecutorBase'
import { Record } from '../../../lib/drivers/Record'

describe('MemoryRecordExecutor', function() {
  it('extends RecordExecutorBase', function() {
    const record: any = {}
    const model: any = {}
    const dataSource: any = {}
    const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
    expect(executor).toBeInstanceOf(RecordExecutorBase)
  })

  describe('.saveRecord()', function() {
    it('calls dataSource.add(record).write() and returns the result', async function() {
      const record: any = new Record({ a: 'anything' })
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const dataSource: any = {
        getClassName() {
          return 'DataSource'
        },
        add() {
          return this
        },
        async write() {
          return true
        }
      }
      const addSpy = Sinon.spy(dataSource, 'add')
      const writeSpy = Sinon.spy(dataSource, 'write')

      QueryLog.enable()
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      const result = await executor.saveRecord('any')
      expect(result).toEqual({ ok: true })
      expect(addSpy.calledWith(record)).toBe(true)
      expect(writeSpy.called).toBe(true)
      const log = QueryLog.pull()[0]
      expect(log.data['raw']).toEqual('DataSource.add({"a":"anything"}).write()')
      expect(log.data['action']).toEqual('Model.any()')
    })

    it('writes log but do nothing if the executeMode is disabled', async function() {
      const record: any = new Record({ a: 'anything' })
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const dataSource: any = {
        getClassName() {
          return 'DataSource'
        },
        add() {
          return this
        },
        async write() {
          return true
        }
      }
      const addSpy = Sinon.spy(dataSource, 'add')
      const writeSpy = Sinon.spy(dataSource, 'write')

      QueryLog.enable()
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      executor.setExecuteMode('disabled')

      const result = await executor.saveRecord('any')
      expect(result).toEqual({})
      expect(addSpy.calledWith(record)).toBe(false)
      expect(writeSpy.called).toBe(false)
      const log = QueryLog.pull()[0]
      expect(log.data['raw']).toEqual('DataSource.add({"a":"anything"}).write()')
      expect(log.data['action']).toEqual('Model.any()')
    })
  })

  describe('.createRecord()', function() {
    it('simply calls and returns .saveRecord()', async function() {
      const record: any = {}
      const model: any = {}
      const dataSource: any = {}
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      const saveRecordStub = Sinon.stub(executor, 'saveRecord')
      saveRecordStub.returns('anything')
      expect(await executor.createRecord('any-action')).toEqual('anything')
      expect(saveRecordStub.calledWith('any-action'))
    })
  })

  describe('.updateRecord()', function() {
    it('simply calls and returns .saveRecord()', async function() {
      const record: any = {}
      const model: any = {}
      const dataSource: any = {}
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      const saveRecordStub = Sinon.stub(executor, 'saveRecord')
      saveRecordStub.returns('anything')
      expect(await executor.updateRecord('any-action')).toEqual('anything')
      expect(saveRecordStub.calledWith('any-action'))
    })
  })

  describe('.hardDeleteRecord()', async function() {
    it('calls dataSource.remove(record).write() and returns the result', async function() {
      const record: any = new Record({ a: 'anything' })
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const dataSource: any = {
        getClassName() {
          return 'DataSource'
        },
        remove() {
          return this
        },
        async write() {
          return true
        }
      }
      const removeSpy = Sinon.spy(dataSource, 'remove')
      const writeSpy = Sinon.spy(dataSource, 'write')

      QueryLog.enable()
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      const result = await executor.hardDeleteRecord()
      expect(result).toEqual({ ok: true })
      expect(removeSpy.calledWith(record)).toBe(true)
      expect(writeSpy.called).toBe(true)
      const log = QueryLog.pull()[0]
      expect(log.data['raw']).toEqual('DataSource.remove({"a":"anything"}).write()')
      expect(log.data['action']).toEqual('Model.hardDelete()')
    })

    it('writes log but do nothing if the executeMode is disabled', async function() {
      const record: any = new Record({ a: 'anything' })
      const model: any = {
        getModelName() {
          return 'Model'
        }
      }
      const dataSource: any = {
        getClassName() {
          return 'DataSource'
        },
        remove() {
          return this
        },
        async write() {
          return true
        }
      }
      const removeSpy = Sinon.spy(dataSource, 'remove')
      const writeSpy = Sinon.spy(dataSource, 'write')

      QueryLog.enable()
      const executor = new MemoryRecordExecutor(model, record, dataSource, new MemoryQueryLog())
      executor.setExecuteMode('disabled')

      const result = await executor.hardDeleteRecord()
      expect(result).toEqual({})
      expect(removeSpy.calledWith(record)).toBe(false)
      expect(writeSpy.called).toBe(false)
      const log = QueryLog.pull()[0]
      expect(log.data['raw']).toEqual('DataSource.remove({"a":"anything"}).write()')
      expect(log.data['action']).toEqual('Model.hardDelete()')
    })
  })
})
