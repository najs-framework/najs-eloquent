import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../../lib/model/Record'
import { RecordBaseDriver } from '../../../lib/drivers/based/RecordDriverBase'

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

  describe('.initialize()', function() {
    const model = {
      fill() {},
      getModelName() {
        return 'Test'
      },
      hasSoftDeletes() {
        return false
      },
      hasTimestamps() {
        return false
      }
    }

    it('creates new instance of Record and assigns to this.attributes if data is not found', function() {
      const driver = new RecordBaseDriver(<any>model)
      driver.initialize(<any>model, true)
      expect(driver['attributes']).toBeInstanceOf(Record)
    })

    it('assigns data to this.attributes if data is Record instance', function() {
      const driver = new RecordBaseDriver(<any>model)
      const record = new Record()
      driver.initialize(<any>model, true, record)
      expect(driver['attributes'] === record).toBe(true)
    })

    it('creates new Record with data if data is object and isGuarded = false', function() {
      const driver = new RecordBaseDriver(<any>model)
      const data = {}
      const fillSpy = Sinon.spy(model, 'fill')
      driver.initialize(<any>model, false, data)
      expect(driver['attributes']['data'] === data).toBe(true)
      expect(fillSpy.called).toBe(false)
      fillSpy.restore()
    })

    it('creates new Record and calls model.fill(data) if data is object and isGuarded = true', function() {
      const driver = new RecordBaseDriver(<any>model)
      const data = {}
      const fillSpy = Sinon.spy(model, 'fill')
      driver.initialize(<any>model, true, data)
      expect(fillSpy.calledWith(data)).toBe(true)
      fillSpy.restore()
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
})
