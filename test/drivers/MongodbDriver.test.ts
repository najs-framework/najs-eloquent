import 'jest'
import * as Sinon from 'sinon'
import { init_mongodb, delete_collection_use_mongodb } from '../util'
import { Eloquent } from '../../lib/model/Eloquent'
import { MongodbDriver } from '../../lib/drivers/MongodbDriver'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { RecordBaseDriver } from '../../lib/drivers/based/RecordDriverBase'
import { register } from 'najs-binding'
import { Record } from '../../lib/model/Record'
import { MongodbQueryBuilderWrapper } from '../../lib/wrappers/MongodbQueryBuilderWrapper'
import { MongodbQueryBuilder } from '../../lib/query-builders/mongodb/MongodbQueryBuilder'

EloquentDriverProvider.register(MongodbDriver, 'mongodb')

interface IUser {
  email: string
  first_name: string
  last_name: string
  age: 20
}

class User extends Eloquent<IUser> {
  static className: string = 'User'
  static fillable = ['email', 'first_name', 'last_name', 'age']
  getClassName() {
    return User.className
  }
}
register(User)

describe('MongodbDriver', function() {
  let modelInstance: any = undefined
  beforeAll(async function() {
    await init_mongodb('drivers_mongodb_driver')
    modelInstance = new User()
  })

  afterAll(async function() {
    await delete_collection_use_mongodb('users')
  })

  it('extends RecordBaseDriver and implements Autoload under name "NajsEloquent.Driver.MongodbDriver"', function() {
    const driver = new MongodbDriver(modelInstance)
    expect(driver).toBeInstanceOf(RecordBaseDriver)
    expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongodbDriver')
  })

  describe('.initialize()', function() {
    it('always create an instance of collection by MongodbProviderFacade', function() {
      const driver = new MongodbDriver(modelInstance)
      expect(driver['collection']).toBeUndefined()
      driver.initialize(modelInstance, true)
      expect(driver['collection']).not.toBeUndefined()
      expect(driver['collection'].collectionName).toEqual('users')
    })

    it('creates new instance of Record and assigns to this.attributes if data is not found', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.initialize(modelInstance, true)
      expect(driver['attributes']).toBeInstanceOf(Record)
    })

    it('assigns data to this.attributes if data is Record instance', function() {
      const driver = new MongodbDriver(modelInstance)
      const record = new Record()
      driver.initialize(modelInstance, true, record)
      expect(driver['attributes'] === record).toBe(true)
    })

    it('creates new Record with data if data is object and isGuarded = false', function() {
      const driver = new MongodbDriver(modelInstance)
      const data = {}
      const fillSpy = Sinon.spy(modelInstance, 'fill')
      driver.initialize(modelInstance, false, data)
      expect(driver['attributes']['data'] === data).toBe(true)
      expect(fillSpy.called).toBe(false)
      fillSpy.restore()
    })

    it('creates new Record and calls model.fill(data) if data is object and isGuarded = true', function() {
      const driver = new MongodbDriver(modelInstance)
      const data = {}
      const fillSpy = Sinon.spy(modelInstance, 'fill')
      driver.initialize(modelInstance, true, data)
      expect(fillSpy.calledWith(data)).toBe(true)
      fillSpy.restore()
    })
  })

  describe('.shouldBeProxied()', function() {
    it('returns true if the key is not "options" and "schema"', function() {
      const driver = new MongodbDriver(modelInstance)
      expect(driver.shouldBeProxied('a')).toBe(true)
      expect(driver.shouldBeProxied('b')).toBe(true)
      expect(driver.shouldBeProxied('test')).toBe(true)
      expect(driver.shouldBeProxied('options')).toBe(false)
      expect(driver.shouldBeProxied('schema')).toBe(false)
    })
  })

  describe('.getRecordName()', function() {
    it('returns this.collection.collectionName', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.initialize(modelInstance, true)
      expect(driver.getRecordName()).toEqual('users')

      driver['collection'] = <any>{ collectionName: 'anything' }
      expect(driver.getRecordName()).toEqual('anything')
    })
  })

  describe('.getRecordName()', function() {
    it('returns this.collection.collectionName', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.initialize(modelInstance, true)
      expect(driver.getRecordName()).toEqual('users')

      driver['collection'] = <any>{ collectionName: 'anything' }
      expect(driver.getRecordName()).toEqual('anything')
    })
  })

  describe('.getPrimaryKeyName()', function() {
    it('returns _id', function() {
      const driver = new MongodbDriver(modelInstance)
      expect(driver.getPrimaryKeyName()).toEqual('_id')
    })
  })

  describe('.isNew()', function() {
    it('returns true if this.attributes does not contain _id', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      expect(driver.isNew()).toBe(true)
      driver.getRecord().setAttribute('_id', 123)
      expect(driver.isNew()).toBe(false)
    })
  })

  describe('.newQuery()', function() {
    it('returns MongodbQueryBuilderWrapper which wrap MongodbQueryBuilder', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.initialize(modelInstance, true)
      const queryBuilderWrapper = driver.newQuery()
      expect(queryBuilderWrapper).toBeInstanceOf(MongodbQueryBuilderWrapper)
      expect(queryBuilderWrapper['modelName']).toEqual(driver['modelName'])
      expect(queryBuilderWrapper['queryBuilder']).toBeInstanceOf(MongodbQueryBuilder)
    })

    it('transfers RelationDataBucket to new query', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.initialize(modelInstance, true)
      const queryBuilderWrapper = driver.newQuery(<any>'any')
      expect(queryBuilderWrapper['relationDataBucket']).toEqual('any')
    })
  })

  describe('.delete()', function() {
    it('does nothing if softDeletes is true but has no softDeletesSetting', async function() {
      const driver = new MongodbDriver(modelInstance)
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)

      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.delete(true)).toBe(undefined)
      expect(setAttributeSpy.called).toBe(false)
      expect(saveStub.called).toBe(false)
    })

    it('calls .setAttributeIfNeeded() then calls and returns .save()', async function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(false)
      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: true }

      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.delete(true)).toBe('anything')
      expect(setAttributeSpy.calledWith('deleted_at')).toBe(true)
      expect(saveStub.called).toBe(true)
    })

    it('does nothing if softDeletes is false and isNew() returns true', async function() {
      const driver = new MongodbDriver(modelInstance)
      const collection = {
        deleteOne() {
          return Promise.resolve('anything')
        }
      }
      driver['collection'] = <any>collection

      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)

      const deleteOneSpy = Sinon.spy(collection, 'deleteOne')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.delete(false)).toBe(undefined)
      expect(deleteOneSpy.called).toBe(false)
    })

    it('calls and returns this.collection.deleteOne with {_id: ...}', async function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record({ _id: 'xxx' }))
      const collection = {
        deleteOne() {
          return Promise.resolve('anything')
        }
      }
      driver['collection'] = <any>collection

      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(false)

      const deleteOneSpy = Sinon.spy(collection, 'deleteOne')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.delete(false)).toEqual('anything')
      expect(deleteOneSpy.calledWith({ _id: 'xxx' })).toBe(true)
    })
  })

  describe('.restore()', function() {
    it('does nothing if the .isNew() return true', async function() {
      const driver = new MongodbDriver(modelInstance)
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)

      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.restore()).toBe(undefined)
      expect(setAttributeSpy.called).toBe(false)
      expect(saveStub.called).toBe(false)
    })

    it('does nothing if the this.softDeletesSetting is not found', async function() {
      const driver = new MongodbDriver(modelInstance)
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(false)

      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.restore()).toBe(undefined)
      expect(setAttributeSpy.called).toBe(false)
      expect(saveStub.called).toBe(false)
    })

    it('calls .setAttributeIfNeeded() then calls and returns .save()', async function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(false)
      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: true }

      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const saveStub = Sinon.stub(driver, 'save')
      saveStub.returns(Promise.resolve('anything'))

      expect(await driver.restore()).toBe('anything')
      // tslint:disable-next-line
      expect(setAttributeSpy.calledWith('deleted_at', null)).toBe(true)
      expect(saveStub.called).toBe(true)
    })
  })

  describe('.save()', function() {
    it('never calls this.setAttributeIfNeeded() if timestamps and soft delete settings are not found', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const setAttributeIfNeededSpy = Sinon.spy(driver, 'setAttributeIfNeeded')

      driver.save()
      expect(setAttributeIfNeededSpy.callCount).toEqual(0)
      expect(setAttributeSpy.callCount).toEqual(0)
    })

    it('calls this.setAttributeIfNeeded() for updatedAt if timestamps settings found, but not call for createdAt if isNew is false', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(false)
      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const setAttributeIfNeededSpy = Sinon.spy(driver, 'setAttributeIfNeeded')

      driver['timestampsSetting'] = { createdAt: 'created_at', updatedAt: 'updated_at' }
      driver.save()
      expect(setAttributeSpy.callCount).toEqual(1)
      expect(setAttributeIfNeededSpy.callCount).toEqual(0)
      expect(setAttributeSpy.calledWith('updated_at')).toBe(true)
    })

    it('calls this.setAttributeIfNeeded() for updatedAt if timestamps settings found, and for createdAt if isNew is true', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)
      const setAttributeSpy = Sinon.spy(driver, 'setAttribute')
      const setAttributeIfNeededSpy = Sinon.spy(driver, 'setAttributeIfNeeded')

      driver['timestampsSetting'] = { createdAt: 'created_at', updatedAt: 'updated_at' }
      driver.save()
      expect(setAttributeSpy.callCount).toEqual(1)
      expect(setAttributeIfNeededSpy.callCount).toEqual(1)
      expect(setAttributeSpy.calledWith('updated_at')).toBe(true)
      expect(setAttributeIfNeededSpy.calledWith('created_at')).toBe(true)
    })

    it('calls this.setAttributeIfNeeded() for deletedAt if soft delete is found', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)
      const setAttributeIfNeededSpy = Sinon.spy(driver, 'setAttributeIfNeeded')

      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: true }
      driver.save()
      expect(setAttributeIfNeededSpy.callCount).toEqual(1)
      // tslint:disable-next-line
      expect(setAttributeIfNeededSpy.firstCall.calledWith('deleted_at', null)).toBe(true)
    })

    it('never calls this.setAttributeIfNeeded() if the first params is false', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const isNewStub = Sinon.stub(driver, 'isNew')
      isNewStub.returns(true)
      const setAttributeIfNeededSpy = Sinon.spy(driver, 'setAttributeIfNeeded')

      driver['timestampsSetting'] = { createdAt: 'created_at', updatedAt: 'updated_at' }
      driver['softDeletesSetting'] = { deletedAt: 'deleted_at', overrideMethods: true }
      driver.save(false)
      expect(setAttributeIfNeededSpy.callCount).toEqual(0)
    })

    it('calls this.collection.save() and promisify the result, case 1 success', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback(undefined, 'anything')
        }
      }
      const saveSpy = Sinon.spy(driver['collection'], 'save')
      driver
        .save()
        .then(function() {
          expect(saveSpy.called).toBe(true)
        })
        .catch(function() {
          expect('should not reach here').toEqual('hm')
        })
    })

    it('calls this.collection.save() and promisify the result, case 2 failed', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      driver['collection'] = <any>{
        save(data: any, callback: any) {
          callback('error')
        }
      }
      const saveSpy = Sinon.spy(driver['collection'], 'save')
      driver
        .save()
        .then(function() {
          expect('should not reach here').toEqual('hm')
        })
        .catch(function(error) {
          expect(saveSpy.called).toBe(true)
          expect(error).toEqual('error')
        })
    })

    it('should work in real world', async function() {
      const user = new User()
      user.fill({ email: 'test@test.com', first_name: 'first', last_name: 'last' })
      await user.save()
      expect(user.toObject()['_id']).not.toBeUndefined()
    })
  })

  describe('.setAttributeIfNeeded()', function() {
    it('call this.attributes.setAttribute() if the attribute is undefined', function() {
      const driver = new MongodbDriver(modelInstance)
      driver.setRecord(new Record())
      const setAttributeSpy = Sinon.spy(driver['attributes'], 'setAttribute')

      driver.setAttributeIfNeeded('test', 'anything')
      expect(setAttributeSpy.calledWith('test', 'anything')).toBe(true)

      setAttributeSpy.resetHistory()
      driver.setAttributeIfNeeded('test', 'anything')
      expect(setAttributeSpy.calledWith('test', 'anything')).toBe(false)

      setAttributeSpy.resetHistory()
      // tslint:disable-next-line
      driver.setAttributeIfNeeded('null', null)
      // tslint:disable-next-line
      expect(setAttributeSpy.calledWith('null', null)).toBe(true)

      setAttributeSpy.resetHistory()
      // tslint:disable-next-line
      driver.setAttributeIfNeeded('null', null)
      // tslint:disable-next-line
      expect(setAttributeSpy.calledWith('null', null)).toBe(false)
    })
  })
})