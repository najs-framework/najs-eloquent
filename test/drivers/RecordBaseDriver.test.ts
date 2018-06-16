import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../lib/model/Record'
import { RecordBaseDriver } from '../../lib/drivers/RecordDriverBase'
import { AsyncEventEmitter } from 'najs-event/dist/lib/emitters/AsyncEventEmitter'

const baseModel = {
  getModelName() {
    return 'Model'
  },
  hasSoftDeletes() {
    return false
  },
  hasTimestamps() {
    return false
  }
}

describe('RecordBaseDriver', function() {
  describe('constructor()', function() {
    it('initialized by the model in the first param', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver['modelName']).toEqual('Model')
      expect(driver['queryLogGroup']).toEqual('all')
      expect(driver['softDeletesSetting']).toBeUndefined()
      expect(driver['timestampsSetting']).toBeUndefined()
    })

    it('get soft delete settings if model supported', function() {
      const model = {
        getModelName() {
          return 'Model'
        },
        hasSoftDeletes() {
          return true
        },
        hasTimestamps() {
          return false
        },
        getSoftDeletesSetting() {
          return 'anything'
        }
      }
      const driver = new RecordBaseDriver(<any>model)
      expect(driver['modelName']).toEqual('Model')
      expect(driver['queryLogGroup']).toEqual('all')
      expect(driver['softDeletesSetting']).toEqual('anything')
      expect(driver['timestampsSetting']).toBeUndefined()
    })

    it('get timestamp settings if model supported', function() {
      const model = {
        getModelName() {
          return 'Model'
        },
        hasSoftDeletes() {
          return false
        },
        hasTimestamps() {
          return true
        },
        getTimestampsSetting() {
          return 'anything'
        }
      }
      const driver = new RecordBaseDriver(<any>model)
      expect(driver['modelName']).toEqual('Model')
      expect(driver['queryLogGroup']).toEqual('all')
      expect(driver['timestampsSetting']).toEqual('anything')
      expect(driver['softDeletesSetting']).toBeUndefined()
    })
  })

  describe('.getRecord()', function() {
    it('simply returns this.attributes', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({})
      driver.setRecord(record)
      expect(driver.getRecord() === record).toBe(true)
    })
  })

  describe('.setRecord()', function() {
    it('simply assigns value to this.attributes', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({})
      driver.setRecord(record)
      expect(driver.getRecord() === record).toBe(true)
    })
  })

  describe('.useEloquentProxy()', function() {
    it('always returns true', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver.useEloquentProxy()).toBe(true)
    })
  })

  describe('.shouldBeProxied()', function() {
    it('returns true if the key is not "options"', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver.shouldBeProxied('a')).toBe(true)
      expect(driver.shouldBeProxied('b')).toBe(true)
      expect(driver.shouldBeProxied('test')).toBe(true)
      expect(driver.shouldBeProxied('options')).toBe(false)
    })
  })

  describe('.proxify()', function() {
    it('forwards to .getAttribute() or .setAttribute()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const getAttributeStub = Sinon.stub(driver, 'getAttribute')
      getAttributeStub.returns('get-attribute')
      const setAttributeStub = Sinon.stub(driver, 'setAttribute')
      setAttributeStub.returns('set-attribute')

      expect(driver.proxify('get', {}, 'key')).toEqual('get-attribute')
      expect(getAttributeStub.calledWith('key')).toBe(true)

      expect(driver.proxify('set', {}, 'key', 'value')).toEqual('set-attribute')
      expect(setAttributeStub.calledWith('key', 'value')).toBe(true)
    })
  })

  describe('.hasAttribute()', function() {
    it('always returns true', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver.hasAttribute('test')).toBe(true)
    })
  })

  describe('.getAttribute()', function() {
    it('simply forwards to this.attributes.getAttribute()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ a: 1 })
      const getAttributeSpy = Sinon.spy(record, 'getAttribute')

      driver.setRecord(record)
      expect(driver.getAttribute('test')).toBeUndefined()
      expect(getAttributeSpy.calledWith('test')).toBe(true)

      getAttributeSpy.resetHistory()
      expect(driver.getAttribute('a')).toEqual(1)
      expect(getAttributeSpy.calledWith('a')).toBe(true)
    })
  })

  describe('.setAttribute()', function() {
    it('simply forwards to this.attributes.setAttribute()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ a: 1 })
      const setAttributeSpy = Sinon.spy(record, 'setAttribute')

      driver.setRecord(record)

      expect(driver.setAttribute('test', 'value')).toBe(true)
      expect(setAttributeSpy.calledWith('test', 'value')).toBe(true)

      setAttributeSpy.resetHistory()
      expect(driver.setAttribute('a', 2)).toBe(true)
      expect(setAttributeSpy.calledWith('a', 2)).toBe(true)

      expect(record.toObject()).toEqual({ a: 2, test: 'value' })
    })
  })

  describe('.toObject()', function() {
    it('simply forwards to this.attributes.toObject()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ a: 1 })
      const toObjectSpy = Sinon.spy(record, 'toObject')

      driver.setRecord(record)

      expect(driver.toObject()).toEqual({ a: 1 })
      expect(toObjectSpy.called).toBe(true)
    })
  })

  describe('.markModified()', function() {
    it('simply forwards to this.attributes.markModified()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ a: 1 })
      const markModifiedSpy = Sinon.spy(record, 'markModified')

      driver.setRecord(record)

      driver.markModified('test')
      expect(markModifiedSpy.calledWith('test')).toBe(true)
    })
  })

  describe('.isModified()', function() {
    it('returns true if the name is not in this.attributes.getModified()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record()
      const getModifiedStub = Sinon.stub(record, 'getModified')
      getModifiedStub.returns(['a', 'b'])

      driver.setRecord(record)

      expect(driver.isModified('test')).toBe(false)
      expect(driver.isModified('a')).toBe(true)
      expect(driver.isModified('b')).toBe(true)
    })
  })

  describe('.getModified()', function() {
    it('simply forwards to this.attributes.getModified()', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ a: 1 })
      const getModifiedStub = Sinon.stub(record, 'getModified')
      getModifiedStub.returns(['a', 'b'])

      driver.setRecord(record)

      expect(driver.getModified()).toEqual(['a', 'b'])
      expect(getModifiedStub.calledWith()).toBe(true)
    })
  })

  describe('.formatAttributeName()', function() {
    it('transforms name to snakeCase()', function() {
      const dataset = {
        Test: 'test',
        test: 'test',
        someThing: 'some_thing',
        Some_Thing_Awesome: 'some_thing_awesome'
      }
      const driver = new RecordBaseDriver(<any>baseModel)
      for (const name in dataset) {
        expect(driver.formatAttributeName(name)).toEqual(dataset[name])
      }
    })
  })

  describe('.formatRecordName()', function() {
    it('transforms name to snakeCase() then plural() it', function() {
      const dataset = {
        Test: 'tests',
        company: 'companies',
        EmployeePassword: 'employee_passwords'
      }
      const driver = new RecordBaseDriver(<any>baseModel)
      for (const name in dataset) {
        driver['modelName'] = name
        expect(driver.formatRecordName()).toEqual(dataset[name])
      }
    })
  })

  describe('.isSoftDeleted()', function() {
    it('returns false if this.softDeletesSetting is not found', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver.isSoftDeleted()).toBe(false)
    })

    it('returns true if this.attributes contains soft delete key and not null', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      const record = new Record({ deleted_at: new Date() })
      driver.setRecord(record)

      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: false }
      expect(driver.isSoftDeleted()).toBe(true)
      // tslint:disable-next-line
      record.setAttribute('deleted_at', null)
      expect(driver.isSoftDeleted()).toBe(false)
    })
  })

  describe('.getEventEmitter()', function() {
    it('returns "RecordBaseDriver.GlobalEventEmitter" if global is true', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver.getEventEmitter(true) === RecordBaseDriver.GlobalEventEmitter).toBe(true)
    })

    it('creates an EventEmitter and assigned to this.eventEmitter if needed', function() {
      const driver = new RecordBaseDriver(<any>baseModel)
      expect(driver['eventEmitter']).toBeUndefined()
      expect(driver.getEventEmitter(false)).toBeInstanceOf(AsyncEventEmitter)
      expect(driver.getEventEmitter(false) === driver['eventEmitter']).toBe(true)
    })
  })
})
