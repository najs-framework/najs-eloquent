import 'jest'
import { ObjectId } from 'bson'
import { Record } from '../../../lib/drivers/Record'
import { MemoryDataSource } from '../../../lib/drivers/memory/MemoryDataSource'
import { RecordDataSourceBase } from '../../../lib/drivers/RecordDataSourceBase'

describe('MemoryDataSource', function() {
  const model: any = {
    getModelName() {
      return 'test'
    },
    getPrimaryKeyName() {
      return 'id'
    }
  }

  it('extends RecordDataSourceBase and implement Autoload under name "NajsEloquent.Driver.Memory.MemoryDataSource"', function() {
    const ds = new MemoryDataSource(model)
    expect(ds).toBeInstanceOf(RecordDataSourceBase)
    expect(ds.getClassName()).toEqual('NajsEloquent.Driver.Memory.MemoryDataSource')
  })

  describe('.createPrimaryKeyIfNeeded()', function() {
    it('returns the primary key if the record already had one', function() {
      const record = new Record({ id: '1' })
      const ds = new MemoryDataSource(model)
      expect(ds.createPrimaryKeyIfNeeded(record)).toEqual('1')
    })

    it('creates new objectId and assign to record in case the record does not have primary key', function() {
      const record = new Record()
      const ds = new MemoryDataSource(model)
      const pk = ds.createPrimaryKeyIfNeeded(record)
      expect(ObjectId.isValid(pk)).toBe(true)
      expect(record.getAttribute('id')).toEqual(pk)
    })
  })

  describe('.read()', function() {
    it('does nothing, simply return true', async function() {
      const ds = new MemoryDataSource(model)
      expect(await ds.read()).toBe(true)
    })
  })

  describe('.write()', function() {
    it('does nothing, simply return true', async function() {
      const ds = new MemoryDataSource(model)
      expect(await ds.write()).toBe(true)
    })
  })
})
