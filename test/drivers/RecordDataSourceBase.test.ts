import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../lib/drivers/Record'
import { MemoryDataSource } from '../../lib/drivers/memory/MemoryDataSource'
import { DataBuffer } from '../../lib/data/DataBuffer'

describe('RecordDataSourceBase', function() {
  const model: any = {
    getModelName() {
      return 'test'
    },
    getPrimaryKeyName() {
      return 'id'
    }
  }

  it('extends DataBuffer with RecordDataReader by default', function() {
    const ds = new MemoryDataSource(model)
    expect(ds).toBeInstanceOf(DataBuffer)
  })

  describe('constructor()', function() {
    it('assigns modelName and primaryKeyName to respective properties and create new buffer as a Map', function() {
      const ds = new MemoryDataSource(model)
      expect(ds.getModelName()).toEqual('test')
      expect(ds.getPrimaryKeyName()).toEqual('id')
      expect(ds.getBuffer()).toBeInstanceOf(Map)
    })
  })

  describe('.add()', function() {
    it('is chainable, simply assigns the record to map with id from .getPrimaryKey()', function() {
      const record = new Record()
      const ds = new MemoryDataSource(model)
      const spy = Sinon.spy(ds, 'createPrimaryKeyIfNeeded')

      expect(ds.add(record) === ds).toBe(true)
      expect(ds.getBuffer().get(record.getAttribute('id')) === record).toBe(true)
      expect(spy.calledWith(record)).toBe(true)
    })
  })

  describe('.remove()', function() {
    it('is chainable, simply removes the record out of map with id from .getPrimaryKey()', function() {
      const record = new Record()
      const ds = new MemoryDataSource(model)
      const spy = Sinon.spy(ds, 'createPrimaryKeyIfNeeded')

      ds.add(record)
      const id = record.getAttribute('id')

      expect(ds.remove(record) === ds).toBe(true)
      expect(ds.getBuffer().get(id)).toBeUndefined()
      expect(spy.calledWith(record)).toBe(true)
    })
  })
})
