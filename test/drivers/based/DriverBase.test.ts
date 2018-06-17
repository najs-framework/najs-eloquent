import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../../lib/model/Record'
import { DriverBase } from '../../../lib/drivers/based/DriverBase'
import { AsyncEventEmitter } from 'najs-event/dist/lib/emitters/AsyncEventEmitter'

class DriverImplementation extends DriverBase<any> {
  constructor(model: any) {
    super()
    this.modelName = model
  }

  getAttribute(path: string) {}

  setAttribute(path: string, value: any): boolean {
    return true
  }
}

describe('DriverBase', function() {
  describe('.getRecord()', function() {
    it('simply returns this.attributes', function() {
      const driver = Reflect.construct(DriverBase, [])
      const record = new Record({})
      driver.setRecord(record)
      expect(driver.getRecord() === record).toBe(true)
    })
  })

  describe('.setRecord()', function() {
    it('simply assigns value to this.attributes', function() {
      const driver = Reflect.construct(DriverBase, [])
      const record = new Record({})
      driver.setRecord(record)
      expect(driver.getRecord() === record).toBe(true)
    })
  })

  describe('.useEloquentProxy()', function() {
    it('always returns true', function() {
      const driver = Reflect.construct(DriverBase, [])
      expect(driver.useEloquentProxy()).toBe(true)
    })
  })

  describe('.proxify()', function() {
    it('forwards to .getAttribute() or .setAttribute()', function() {
      const driver = new DriverImplementation('Test')
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

  describe('.formatAttributeName()', function() {
    it('transforms name to snakeCase()', function() {
      const dataset = {
        Test: 'test',
        test: 'test',
        someThing: 'some_thing',
        Some_Thing_Awesome: 'some_thing_awesome'
      }
      const driver = Reflect.construct(DriverBase, [])
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
        EmployeePassword: 'employee_passwords',
        TestSomething: 'test_somethings',
        User: 'users',
        Company: 'companies',
        Shoe: 'shoes',
        CompanyTax: 'company_taxes'
      }
      const driver = Reflect.construct(DriverBase, [])
      for (const name in dataset) {
        driver['modelName'] = name
        expect(driver.formatRecordName()).toEqual(dataset[name])
      }
    })
  })

  describe('.isSoftDeleted()', function() {
    it('returns false if this.softDeletesSetting is not found', function() {
      const driver = new DriverImplementation('Test')
      expect(driver.isSoftDeleted()).toBe(false)
    })

    it('returns true if this.attributes contains soft delete key and not null', function() {
      const driver = new DriverImplementation('Test')
      const getAttributeStub = Sinon.stub(driver, 'getAttribute')

      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: false }
      expect(driver.isSoftDeleted()).toBe(true)
      // tslint:disable-next-line
      getAttributeStub.returns(null)
      expect(driver.isSoftDeleted()).toBe(false)
    })
  })

  describe('.getModelComponentName()', function() {
    it('returns undefined', function() {
      const driver = new DriverImplementation('Test')
      expect(driver.getModelComponentName()).toBeUndefined()
    })
  })

  describe('.getModelComponentOrder()', function() {
    it('returns the same instance of components and ordering', function() {
      const driver = new DriverImplementation('Test')
      const components = ['c', 'a', 'b']
      expect(driver.getModelComponentOrder(components) === components).toBe(true)
      expect(driver.getModelComponentOrder(components)).toEqual(['c', 'a', 'b'])
    })
  })

  describe('.getEventEmitter()', function() {
    it('returns "RecordBaseDriver.GlobalEventEmitter" if global is true', function() {
      const driver = Reflect.construct(DriverBase, [])
      expect(driver.getEventEmitter(true) === DriverBase.GlobalEventEmitter).toBe(true)
    })

    it('creates an EventEmitter and assigned to this.eventEmitter if needed', function() {
      const driver = Reflect.construct(DriverBase, [])
      expect(driver['eventEmitter']).toBeUndefined()
      expect(driver.getEventEmitter(false)).toBeInstanceOf(AsyncEventEmitter)
      expect(driver.getEventEmitter(false) === driver['eventEmitter']).toBe(true)
    })
  })
})
