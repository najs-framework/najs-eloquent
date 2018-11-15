import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../lib/drivers/Record'
import { MomentProvider } from '../../lib/facades/global/MomentProviderFacade'
import { MemoryRecordExecutor } from '../../lib/drivers/memory/MemoryRecordExecutor'
import { MemoryQueryLog } from '../../lib/drivers/memory/MemoryQueryLog'

describe('RecordExecutorBase', function() {
  function makeExecutor(model: any, record: Record) {
    return new MemoryRecordExecutor(model, record, {} as any, new MemoryQueryLog())
  }

  function makeModel(name: string, timestamps: boolean | object, softDeletes: boolean | object) {
    let timestampsFeature = {}
    if (timestamps === false) {
      timestampsFeature = {
        hasTimestamps() {
          return false
        }
      }
    } else {
      timestampsFeature = {
        hasTimestamps() {
          return true
        },
        getTimestampsSetting() {
          return timestamps
        }
      }
    }

    let softDeleteFeature = {}
    if (softDeletes === false) {
      softDeleteFeature = {
        hasSoftDeletes() {
          return false
        }
      }
    } else {
      softDeleteFeature = {
        hasSoftDeletes() {
          return true
        },
        getSoftDeletesSetting() {
          return softDeletes
        }
      }
    }

    const model = {
      getDriver() {
        return {
          getSoftDeletesFeature() {
            return softDeleteFeature
          },
          getTimestampsFeature() {
            return timestampsFeature
          }
        }
      },

      getModelName() {
        return name
      }
    }
    return model
  }

  describe('.fillData()', function() {
    it('simply calls .fillTimestampsData() and .fillSoftDeletesData()', function() {
      const model = makeModel('Test', false, false)
      const record = new Record()
      const executor = makeExecutor(model, record)
      const fillTimestampsDataSpy = Sinon.spy(executor, 'fillTimestampsData')
      const fillSoftDeletesDataSpy = Sinon.spy(executor, 'fillSoftDeletesData')
      executor.fillData(true)
      expect(fillTimestampsDataSpy.calledWith(true)).toBe(true)
      expect(fillSoftDeletesDataSpy.called).toBe(true)
    })
  })

  describe('.fillTimestampsData()', function() {
    it('does nothing if there is no timestamps or softDeletes settings', function() {
      const model = makeModel('Test', false, false)
      const record = new Record()
      const executor = makeExecutor(model, record)
      executor.fillTimestampsData(true)
      expect(record.toObject()).toEqual({})
    })

    it('fills updatedAt only if isCreate = false if has timestamp settings', function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', { createdAt: 'created_at', updatedAt: 'updated_at' }, false)
      const record = new Record()
      const executor = makeExecutor(model, record)
      executor.fillTimestampsData(false)
      expect(record.toObject()).toEqual({ updated_at: now.toDate() })
    })

    it('fills updatedAt/createdAt if isCreate = true if has timestamp settings', function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', { createdAt: 'created_at', updatedAt: 'updated_at' }, false)
      const record = new Record()
      const executor = makeExecutor(model, record)
      executor.fillTimestampsData(true)
      expect(record.toObject()).toEqual({ updated_at: now.toDate(), created_at: now.toDate() })
    })

    it('skips createdAt if it already exists', function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', { createdAt: 'created_at', updatedAt: 'updated_at' }, false)
      const record = new Record({ created_at: 'anything' })
      const executor = makeExecutor(model, record)
      executor.fillTimestampsData(true)
      expect(record.toObject()).toEqual({ updated_at: now.toDate(), created_at: 'anything' })
    })
  })

  describe('.fillSoftDeletesData()', function() {
    it('does nothing if there is no timestamps or softDeletes settings', function() {
      const model = makeModel('Test', false, false)
      const record = new Record()
      const executor = makeExecutor(model, record)
      executor.fillSoftDeletesData()
      expect(record.toObject()).toEqual({})
    })

    it('fills deletedAt = null there is a softDeletes setting', function() {
      const model = makeModel('Test', false, { deletedAt: 'deleted_at' })
      const record = new Record()
      const executor = makeExecutor(model, record)
      executor.fillSoftDeletesData()
      // tslint:disable-next-line
      expect(record.toObject()).toEqual({ deleted_at: null })
    })

    it('skips deletedAt if it already exists', function() {
      const model = makeModel('Test', false, { deletedAt: 'deleted_at' })
      const record = new Record({ deleted_at: 'anything' })
      const executor = makeExecutor(model, record)
      executor.fillSoftDeletesData()
      expect(record.toObject()).toEqual({ deleted_at: 'anything' })
    })
  })

  describe('.create()', function() {
    it('calls .fillData(true) by default then save the data by calls and returns .createRecord()', async function() {
      const model = makeModel('Test', false, false)
      const executor = makeExecutor(model, new Record())
      const createRecordStub = Sinon.stub(executor, 'createRecord')
      createRecordStub.returns(Promise.resolve('anything'))

      const fillDataSpy = Sinon.spy(executor, 'fillData')

      expect(await executor.create()).toEqual('anything')
      expect(fillDataSpy.calledWith(true)).toBe(true)
    })

    it('skips .fillData(true) if the option shouldFillData = false', async function() {
      const model = makeModel('Test', false, false)
      const executor = makeExecutor(model, new Record())
      const fillDataSpy = Sinon.spy(executor, 'fillData')
      const createRecordStub = Sinon.stub(executor, 'createRecord')
      createRecordStub.returns(Promise.resolve('anything'))

      expect(await executor.create(false)).toEqual('anything')
      expect(fillDataSpy.calledWith(true)).toBe(false)
    })
  })

  describe('.update()', function() {
    it('does nothing and returns false if a .hasPrimaryKey() is false', async function() {
      const model = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return undefined
      }

      const executor = makeExecutor(model, new Record())
      const fillDataSpy = Sinon.spy(executor, 'fillData')
      const stub = Sinon.stub(executor, 'updateRecord')
      stub.returns(Promise.resolve('anything'))

      expect(await executor.update()).toBe(false)
      expect(fillDataSpy.calledWith(true)).toBe(false)
      expect(stub.called).toBe(false)
    })

    it('calls .fillData(false) by default then save the data by .updateRecord()', async function() {
      const model = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return 'id'
      }
      model['getPrimaryKeyName'] = function() {
        return 'id'
      }

      const record = new Record({ id: 'id' })
      record.setAttribute('name', 'test')

      const executor = makeExecutor(model, record)
      const fillDataSpy = Sinon.spy(executor, 'fillData')
      const stub = Sinon.stub(executor, 'updateRecord')
      stub.returns(Promise.resolve('anything'))

      expect(await executor.update()).toEqual('anything')
      expect(fillDataSpy.calledWith(false)).toBe(true)
      expect(stub.calledWith('update')).toBe(true)
    })

    it('skips calling .fillData(false) if shouldFillData = false', async function() {
      const model = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return 'id'
      }
      model['getPrimaryKeyName'] = function() {
        return 'id'
      }

      const record = new Record({ id: 'id' })
      record.setAttribute('name', 'test')

      const executor = makeExecutor(model, record)
      const fillDataSpy = Sinon.spy(executor, 'fillData')
      const stub = Sinon.stub(executor, 'updateRecord')
      stub.returns(Promise.resolve('anything'))

      await executor.update(false)
      expect(fillDataSpy.calledWith(false)).toBe(false)
    })

    it('skips calling .updateRecord() and return false if there is no modified data', async function() {
      const model = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return 'id'
      }
      model['getPrimaryKeyName'] = function() {
        return 'id'
      }

      const record = new Record({ id: 'id' })
      record.setAttribute('test', 'a')

      const executor = makeExecutor(model, record)
      const hasModifiedDataStub = Sinon.stub(executor, 'hasModifiedData')
      hasModifiedDataStub.returns(false)

      const stub = Sinon.stub(executor, 'updateRecord')
      stub.returns(Promise.resolve('anything'))

      expect(await executor.update()).toEqual(false)
    })
  })

  describe('.softDelete()', function() {
    it('sets deleted_at field then calls and returns .create() if the model is new', async function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', false, { deletedAt: 'deleted_at' })
      model['isNew'] = function() {
        return true
      }
      const record = new Record()
      const executor = makeExecutor(model, record)
      const fillTimestampsDataSpy = Sinon.spy(executor, 'fillTimestampsData')
      const createStub = Sinon.stub(executor, 'create')
      const updateStub = Sinon.stub(executor, 'update')
      createStub.returns('create-result')
      updateStub.returns('update-result')

      expect(await executor.softDelete()).toEqual('create-result')
      expect(fillTimestampsDataSpy.calledWith(true)).toBe(true)
      expect(createStub.calledWith(false, 'softDelete')).toBe(true)
      expect(updateStub.calledWith(false, 'softDelete')).toBe(false)
      expect(record.getAttribute('deleted_at')).toEqual(now.toDate())
    })

    it('sets deleted_at field then calls and returns .update() if the model is not new', async function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', false, { deletedAt: 'deleted_at' })
      model['isNew'] = function() {
        return false
      }
      const record = new Record()
      const executor = makeExecutor(model, record)
      const fillTimestampsDataSpy = Sinon.spy(executor, 'fillTimestampsData')
      const createStub = Sinon.stub(executor, 'create')
      const updateStub = Sinon.stub(executor, 'update')
      createStub.returns('create-result')
      updateStub.returns('update-result')

      expect(await executor.softDelete()).toEqual('update-result')
      expect(fillTimestampsDataSpy.calledWith(false)).toBe(true)
      expect(createStub.calledWith(false, 'softDelete')).toBe(false)
      expect(updateStub.calledWith(false, 'softDelete')).toBe(true)
      expect(record.getAttribute('deleted_at')).toEqual(now.toDate())
    })
  })

  describe('.hardDelete()', function() {
    it('does nothing if there is no filter', async function() {
      const model: any = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return undefined
      }
      model['getPrimaryKeyName'] = function() {
        return 'id'
      }

      expect(await makeExecutor(model, new Record()).hardDelete()).toBe(false)
    })

    it('calls and returns this.hardDeleteRecord() if there is a primary key', async function() {
      const model: any = makeModel('Test', false, false)
      model['getPrimaryKey'] = function() {
        return 'id'
      }
      model['getPrimaryKeyName'] = function() {
        return 'id'
      }

      const executor = makeExecutor(model, new Record({ id: 'id' }))
      const hardDeleteRecordStub = Sinon.stub(executor, 'hardDeleteRecord')
      hardDeleteRecordStub.returns('anything')

      expect(await executor.hardDelete()).toEqual('anything')
    })
  })

  describe('.restore()', function() {
    it('calls .fillTimestampsData() then calls and returns .update()', async function() {
      const now = MomentProvider.make('2018-01-01T00:00:00.000Z')
      MomentProvider.setNow(() => now)

      const model = makeModel('Test', false, { deletedAt: 'deleted_at' })
      model['isNew'] = function() {
        return true
      }
      const record = new Record()
      const executor = makeExecutor(model, record)
      const fillTimestampsDataSpy = Sinon.spy(executor, 'fillTimestampsData')
      const updateStub = Sinon.stub(executor, 'update')
      updateStub.returns('update-result')

      expect(await executor.restore()).toEqual('update-result')
      expect(fillTimestampsDataSpy.calledWith(false)).toBe(true)
      expect(updateStub.calledWith(false, 'restore')).toBe(true)
      expect(record.getAttribute('deleted_at')).toBeNull()
    })
  })
})
