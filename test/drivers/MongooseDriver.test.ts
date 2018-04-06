import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { Facade, FacadeContainer } from 'najs-facade'
import { Schema } from 'mongoose'
import { init_mongoose, delete_collection } from '../util'
import { Eloquent } from '../../lib/model/Eloquent'
import { MongooseDriver } from '../../lib/drivers/MongooseDriver'
import { Factory, factory } from '../../lib/facades/global/FactoryFacade'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { MongooseQueryBuilder } from '../../lib/query-builders/mongodb/MongooseQueryBuilder'
import { MongooseProvider } from '../../lib/facades/global/MongooseProviderFacade'
import { EloquentMetadata } from '../../lib/model/EloquentMetadata'
import { SoftDelete } from '../../lib/drivers/mongoose/SoftDelete'

EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

interface IUser {
  email: string
  first_name: string
  last_name: string
  age: 20
}

class User extends Eloquent<IUser> {
  static className: string = 'User'
  schema: Object = {
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
  }

  getClassName() {
    return User.className
  }
}
register(User)

// Factory definitions
Factory.define(User.className, (faker: Chance.Chance, attributes?: Object): Object => {
  return Object.assign(
    {
      email: faker.email(),
      first_name: faker.first(),
      last_name: faker.last(),
      age: faker.age()
    },
    attributes
  )
})

const fakeModel = {
  getModelName() {
    return 'model'
  }
}

describe('MongooseDriver', function() {
  beforeAll(async function() {
    await init_mongoose(MongooseProvider.getMongooseInstance(), 'drivers_mongoose_driver')
  })

  afterAll(async function() {
    await delete_collection(MongooseProvider.getMongooseInstance(), 'users')
  })

  it('implements IAutoload', function() {
    const model = {
      getModelName() {
        return 'model'
      }
    }
    const driver = new MongooseDriver(<any>model, true)
    expect(driver.getClassName()).toEqual('NajsEloquent.MongooseDriver')
  })

  describe('constructor()', function() {})

  describe('.initialize()', function() {
    it('creates metadata, then calls .initializeModelIfNeeded() and .createAttributesByData()', function() {
      const model = {}
      const driver = new MongooseDriver(new User(), true)
      driver['eloquentModel'] = <any>model

      const getStub = Sinon.stub(EloquentMetadata, 'get')
      getStub.returns('anything')

      const createAttributesByDataStub = Sinon.stub(driver, <any>'createAttributesByData')
      createAttributesByDataStub.callsFake(function() {})

      const initializeModelIfNeededStub = Sinon.stub(driver, <any>'initializeModelIfNeeded')
      initializeModelIfNeededStub.callsFake(function() {})

      driver.initialize()
      expect(getStub.calledWith(model)).toBe(true)
      expect(initializeModelIfNeededStub.called).toBe(true)
      expect(createAttributesByDataStub.calledWith()).toBe(true)

      driver.initialize(<any>{})
      expect(getStub.calledWith(model)).toBe(true)
      expect(initializeModelIfNeededStub.called).toBe(true)
      expect(createAttributesByDataStub.calledWith({})).toBe(true)

      const userModel = MongooseProvider.getMongooseInstance().model('User')
      const user = new userModel()

      driver.initialize(<any>user)
      expect(getStub.calledWith(model)).toBe(true)
      expect(initializeModelIfNeededStub.called).toBe(true)
      expect(createAttributesByDataStub.calledWith(user)).toBe(true)

      initializeModelIfNeededStub.restore()
      getStub.restore()
    })
  })

  describe('protected .createAttributesByData()', function() {
    it('simply assigns data to attributes if the data is instance of "mongooseModel"', function() {
      const driver = new MongooseDriver(new User(), true)

      expect(driver['attributes']).toBeUndefined()
      const UserModel = MongooseProvider.getMongooseInstance().model('User')
      const user = new UserModel()

      driver['createAttributesByData'](<any>user)
      expect(driver['attributes'] === user).toBe(true)
    })

    it('creates new instance of "mongooseModel" and does nothing if data is not an plain object', function() {
      const driver = new MongooseDriver(new User(), true)

      expect(driver['attributes']).toBeUndefined()
      const UserModel = MongooseProvider.getMongooseInstance().model('User')

      driver['createAttributesByData']()
      expect(driver['attributes']).toBeInstanceOf(UserModel)
      expect(driver['attributes'].isNew).toBe(true)
    })

    it('creates new instance of "mongooseModel", call eloquentModel.fill if "isGuard" is true', function() {
      const driver = new MongooseDriver(new User(), true)
      const eloquentModel = {
        fill() {}
      }
      const fillSpy = Sinon.spy(eloquentModel, 'fill')

      driver['eloquentModel'] = <any>eloquentModel
      expect(driver['attributes']).toBeUndefined()
      const UserModel = MongooseProvider.getMongooseInstance().model('User')

      const data = { a: 'test' }
      driver['createAttributesByData'](data)
      expect(driver['attributes']).toBeInstanceOf(UserModel)
      expect(driver['attributes'].isNew).toBe(true)
      expect(fillSpy.calledWith(data)).toBe(true)
    })

    it('creates new instance of "mongooseModel", call attributes.set() if "isGuard" is false', function() {
      const driver = new MongooseDriver(new User(), false)
      const eloquentModel = {
        fill() {}
      }
      const fillSpy = Sinon.spy(eloquentModel, 'fill')

      driver['eloquentModel'] = <any>eloquentModel
      expect(driver['attributes']).toBeUndefined()
      const UserModel = MongooseProvider.getMongooseInstance().model('User')

      const data = { first_name: 'test' }
      driver['createAttributesByData'](data)
      expect(driver['attributes']).toBeInstanceOf(UserModel)
      expect(driver['attributes'].isNew).toBe(true)
      expect(driver['attributes'].first_name).toEqual('test')
      expect(fillSpy.calledWith(data)).toBe(false)
    })
  })

  describe('protected .initializeModelIfNeeded()', function() {
    it('does nothing if the model is already register to mongoose', function() {
      MongooseProvider.createModelFromSchema('RegisteredModel', new Schema({}))
      const driver = new MongooseDriver(new User(), false)
      const getMongooseSchemaSpy = Sinon.spy(driver, <any>'getMongooseSchema')
      driver['modelName'] = 'RegisteredModel'
      driver['initializeModelIfNeeded']()
      expect(getMongooseSchemaSpy.called).toBe(false)
    })

    it('calls .getMongooseSchema(), then calls MongooseProvider.createModelFromSchema() to register model', function() {
      const schema = {}
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const driver = new MongooseDriver(new User(), false)
      driver['metadata'] = <any>{
        hasTimestamps() {
          return false
        },
        hasSoftDeletes() {
          return false
        }
      }

      const getMongooseSchemaStub = Sinon.stub(driver, <any>'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      driver['modelName'] = 'Test'
      driver['initializeModelIfNeeded']()

      expect(getMongooseSchemaStub.called).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls schema.set("timestamps", metadata.timestamps()) if the metadata.hasTimestamps() returns true', function() {
      const schema = {
        set() {}
      }
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const driver = new MongooseDriver(new User(), false)
      driver['metadata'] = <any>{
        hasTimestamps() {
          return true
        },
        timestamps() {
          return 'anything'
        },
        hasSoftDeletes() {
          return false
        }
      }

      const getMongooseSchemaStub = Sinon.stub(driver, <any>'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      const setSpy = Sinon.spy(schema, 'set')

      driver['modelName'] = 'Test'
      driver['initializeModelIfNeeded']()

      expect(setSpy.calledWith('timestamps', 'anything')).toBe(true)
      expect(getMongooseSchemaStub.called).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })

    it('calls schema.plugin(Schema, metadata.softDeletes()) if the metadata.hasSoftDeletes() returns true', function() {
      const schema = {
        plugin() {}
      }
      Facade(MongooseProvider)
        .shouldReceive('createModelFromSchema')
        .withArgs('Test', schema)

      const driver = new MongooseDriver(new User(), false)
      driver['metadata'] = <any>{
        hasTimestamps() {
          return false
        },
        softDeletes() {
          return 'anything'
        },
        hasSoftDeletes() {
          return true
        }
      }

      const getMongooseSchemaStub = Sinon.stub(driver, <any>'getMongooseSchema')
      getMongooseSchemaStub.returns(schema)

      const pluginSpy = Sinon.spy(schema, 'plugin')

      driver['modelName'] = 'Test'
      driver['initializeModelIfNeeded']()

      expect(pluginSpy.calledWith(SoftDelete, 'anything')).toBe(true)
      expect(getMongooseSchemaStub.called).toBe(true)
      FacadeContainer.verifyAndRestoreAllFacades()
    })
  })

  describe('protected .getMongooseSchema()', function() {
    it('calls "eloquentModel".getSchema() if that is a function', function() {
      const driver = new MongooseDriver(new User(), false)
      const eloquentModel = {
        getSchema() {
          return new Schema({})
        }
      }
      driver['eloquentModel'] = <any>eloquentModel
      const getSchemaSpy = Sinon.spy(eloquentModel, 'getSchema')

      driver['getMongooseSchema']()
      expect(getSchemaSpy.called).toBe(true)
    })

    it('auto creates a schema by "schema" and "options" settings from EloquentMetadata', function() {})
  })

  describe('implements IEloquentDriver', function() {
    describe('.getRecord()', function() {
      it('returns "attributes" property', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const attributes = {}
        driver['attributes'] = <any>attributes
        expect(driver.getRecord() === attributes).toBe(true)
      })
    })

    describe('.getAttribute()', function() {
      it('returns "attributes"[name]', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const attributes = {
          a: 1,
          b: '2'
        }
        driver['attributes'] = <any>attributes
        expect(driver.getAttribute('a') === attributes['a']).toBe(true)
        expect(driver.getAttribute('b') === attributes['b']).toBe(true)
        expect(driver.getAttribute('c')).toBeUndefined()
      })
    })

    describe('.setAttribute()', function() {
      it('assigns "attributes"[name] = value and always return true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const attributes = {}
        driver['attributes'] = <any>attributes
        expect(driver.setAttribute('a', 1)).toBe(true)
        expect(driver.setAttribute('b', 2)).toBe(true)
        expect(attributes).toEqual({ a: 1, b: 2 })
      })
    })

    describe('.getId()', function() {
      it('returns "attributes._id"', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const attributes = {
          _id: 123456
        }
        driver['attributes'] = <any>attributes
        expect(driver.getId()).toEqual(123456)
      })
    })

    describe('.setId()', function() {
      it('sets value to "attributes._id"', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const attributes = {}
        driver['attributes'] = <any>attributes
        driver.setId(123456)
        expect(attributes['_id']).toEqual(123456)
      })
    })

    describe('.newQuery()', function() {
      it('returns new instance of MongooseQueryBuilder with .setLogGroup() is called', function() {
        const user = new User()
        user['driver']['queryLogGroup'] = 'test'
        const query = user['newQuery']()
        expect(query).toBeInstanceOf(MongooseQueryBuilder)
        expect(query['logGroup']).toEqual('test')
        expect(query['softDelete']).toBeUndefined()
      })

      it('creates new instance of MongooseQueryBuilder with softDeletes options if metadata.hasSoftDeletes() returns true', function() {
        const softDeletes = { deletedAt: 'deleted_at' }
        const user = new User()
        user['driver']['queryLogGroup'] = 'test'
        user['driver']['metadata'] = {
          hasSoftDeletes() {
            return true
          },
          softDeletes() {
            return softDeletes
          }
        }
        const query = user['newQuery']()

        expect(query).toBeInstanceOf(MongooseQueryBuilder)
        expect(query['logGroup']).toEqual('test')
        expect(query['softDelete'] === softDeletes).toBe(true)
      })
    })

    describe('.toObject()', function() {
      it('simply returns "attributes".toObject()', function() {
        const attributes = {
          toObject() {
            return { a: 'test' }
          }
        }
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>attributes
        const toObjectSpy = Sinon.spy(attributes, 'toObject')
        expect(driver.toObject()).toEqual({ a: 'test' })
        expect(toObjectSpy.called).toBe(true)
      })
    })

    describe('.toJSON()', function() {
      it('calls .toObject() transform _id to id, and calls .isVisible() to filter visible keys', function() {
        const user = new User()
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['eloquentModel'] = user

        const toObjectStub = Sinon.stub(driver, 'toObject')
        toObjectStub.returns({
          _id: 1,
          a: 'a',
          b: 'b',
          c: 'c',
          __v: 0
        })
        expect(driver.toJSON()).toEqual({ id: 1, a: 'a', b: 'b', c: 'c' })

        user.markHidden('a')
        expect(driver.toJSON()).toEqual({ id: 1, b: 'b', c: 'c' })

        user.markHidden('id', 'b', 'c').markVisible('b')
        expect(driver.toJSON()).toEqual({ b: 'b' })
      })
    })

    describe('.is()', function() {
      it('returns true if the compared model has same id with current model', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{ _id: 1, name: 'model 1' }
        const compared = new MongooseDriver(<any>fakeModel, true)
        compared['attributes'] = <any>{ _id: 1, name: 'model 2' }
        expect(driver.is(compared)).toBe(true)
        compared['attributes'] = <any>{ _id: 2, name: 'model 2' }
        expect(driver.is(compared)).toBe(false)
      })
    })

    describe('.formatAttributeName()', function() {
      it('uses Lodash.snakeCase() to format the attribute name', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.formatAttributeName('Test')).toEqual('test')
        expect(driver.formatAttributeName('createdAt')).toEqual('created_at')
        expect(driver.formatAttributeName('created_At')).toEqual('created_at')
      })
    })

    describe('.getReservedNames()', function() {
      it('returns reserved names = "schema, collection, options, getSchema"', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.getReservedNames()).toEqual(['schema', 'collection', 'options', 'getSchema'])
      })
    })

    describe('.getDriverProxyMethods()', function() {
      it('returns some models method names like "is", "get" and all ActiveRecord methods name', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.getDriverProxyMethods()).toEqual([
          'is',
          'toObject',
          'toJSON',
          'getId',
          'setId',
          'newQuery',
          'touch',
          'save',
          'delete',
          'forceDelete',
          'restore',
          'fresh',
          'find',
          'first'
        ])
      })
    })

    describe('.getQueryProxyMethods()', function() {
      it('returns basic query, condition query method and some fetch result method names without "delete" and "restore"', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.getQueryProxyMethods()).toEqual([
          // IBasicQuery
          'queryName',
          'select',
          'distinct',
          'orderBy',
          'orderByAsc',
          'orderByDesc',
          'limit',
          // IConditionQuery
          'where',
          'orWhere',
          'whereIn',
          'whereNotIn',
          'orWhereIn',
          'orWhereNotIn',
          'whereNull',
          'whereNotNull',
          'orWhereNull',
          'orWhereNotNull',
          'native',
          // ISoftDeletesQuery
          'withTrashed',
          'onlyTrashed',
          // Mongoose Query Helpers
          'findOrFail',
          'firstOrFail',
          // IFetchResultQuery
          'get',
          'all',
          // 'find', removed because driver .find() will handle .find(id) case
          // 'first', removed because we add .find() will handle .find(id) case
          'count',
          'pluck',
          'update'
          // 'delete', conflict to .getDriverProxyMethods() then it should be removed
          // 'restore', conflict to .getDriverProxyMethods() then it should be removed
          // 'execute', removed because it could not run alone
        ])
      })
    })

    describe('.createStaticMethods()', function() {
      it('should work, the tests is written in integration/test', async function() {
        const user = new User()
        user.forceFill({ first_name: 'test', last_name: 'test', email: 'test' })
        await user['save']()

        expect(await User['count']()).toBeGreaterThan(0)
        const fresh = await User['first'](user['id'])
        expect(fresh.toJson()).toEqual(user.toJson())

        const firstUser = await User['first']()
        expect(firstUser).not.toBeNull()
      })
    })
  })

  describe('ActiveRecord Functions', function() {
    describe('.touch()', function() {
      it('returns "eloquentModel" for chain-ing', function() {
        const eloquentModel = {}
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['eloquentModel'] = <any>eloquentModel
        driver['metadata'] = <any>{
          hasTimestamps() {
            return false
          }
        }
        expect(driver.touch() === eloquentModel).toBe(true)
      })

      it('does nothing if metadata.hasTimestamps() is false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          markModified() {}
        }
        driver['metadata'] = <any>{
          hasTimestamps() {
            return false
          },
          timestamps() {
            return { updatedAt: 'updated' }
          }
        }
        const markModifiedSpy = Sinon.spy(driver['attributes'], 'markModified')
        driver.touch()
        expect(markModifiedSpy.called).toBe(false)
      })

      it('calls "attributes".markModified() if metadata.hasTimestamps() return true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          markModified() {}
        }
        driver['metadata'] = <any>{
          hasTimestamps() {
            return true
          },
          timestamps() {
            return { updatedAt: 'updated' }
          }
        }
        const markModifiedSpy = Sinon.spy(driver['attributes'], 'markModified')
        driver.touch()
        expect(markModifiedSpy.calledWith('updated')).toBe(true)
      })
    })

    describe('.save()', function() {
      it('simply calls "attributes".save()', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          save() {}
        }
        const saveSpy = Sinon.spy(driver['attributes'], 'save')
        driver.save()
        expect(saveSpy.called).toBe(true)
      })
    })

    describe('.delete()', function() {
      it('simply calls "attributes".delete() metadata.hasSoftDelete() returns true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          delete() {},
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return true
          }
        }
        const deleteSpy = Sinon.spy(driver['attributes'], <any>'delete')
        const removeSpy = Sinon.spy(driver['attributes'], 'remove')
        driver.delete()
        expect(deleteSpy.called).toBe(true)
        expect(removeSpy.called).toBe(false)
      })

      it('simply calls "attributes".remove() metadata.hasSoftDelete() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          delete() {},
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const deleteSpy = Sinon.spy(driver['attributes'], <any>'delete')
        const removeSpy = Sinon.spy(driver['attributes'], 'remove')
        driver.delete()
        expect(deleteSpy.called).toBe(false)
        expect(removeSpy.called).toBe(true)
      })
    })

    describe('.forceDelete()', function() {
      it('simply calls "attributes".remove() even metadata.hasSoftDeletes() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const removeSpy = Sinon.spy(driver['attributes'], 'remove')
        driver.forceDelete()
        expect(removeSpy.called).toBe(true)
      })
    })

    describe('.restore()', function() {
      it('does nothing if metadata.hasSoftDeletes() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          restore() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const restoreSpy = Sinon.spy(driver['attributes'], <any>'restore')
        driver.restore()
        expect(restoreSpy.called).toBe(false)
      })

      it('calls "attributes".restore() if metadata.hasSoftDelete() return true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          restore() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return true
          }
        }
        const restoreSpy = Sinon.spy(driver['attributes'], <any>'restore')
        driver.restore()
        expect(restoreSpy.called).toBe(true)
      })
    })

    describe('.fresh()', function() {
      it('always returns null if "attributes".isNew is true', async function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver['attributes'] = <any>{
          isNew: true
        }
        expect(await driver.fresh()).toBeNull()
      })

      it('find fresh instance of model in the database if it not new', async function() {
        const user = await factory(User.className).create()
        const originalFirstName = user.first_name
        user.first_name = 'test'
        const fresh = await user.fresh()
        expect(fresh.first_name).toEqual(originalFirstName)
      })
    })
  })

  describe('Helper Query Functions', function() {
    describe('.find()', function() {
      it('calls .newQuery().find() if id is not provided', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const query = {
          where() {
            return this
          },
          find() {}
        }
        const whereSpy = Sinon.spy(query, 'where')
        const findSpy = Sinon.spy(query, 'find')

        const newQueryStub = Sinon.stub(driver, 'newQuery')
        newQueryStub.returns(query)

        driver.find()

        expect(newQueryStub.called).toBe(true)
        expect(whereSpy.called).toBe(false)
        expect(findSpy.called).toBe(true)
      })

      it('calls .newQuery().where(id, id).find() if id is provide', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const query = {
          where() {
            return this
          },
          find() {}
        }
        const whereSpy = Sinon.spy(query, 'where')
        const findSpy = Sinon.spy(query, 'find')

        const newQueryStub = Sinon.stub(driver, 'newQuery')
        newQueryStub.returns(query)

        driver.find('test')

        expect(newQueryStub.called).toBe(true)
        expect(whereSpy.calledWith('id', 'test')).toBe(true)
        expect(findSpy.called).toBe(true)
      })
    })

    describe('.first()', function() {
      it('is an alias of .find()', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        const findStub = Sinon.stub(driver, 'find')
        findStub.returns('anything')

        expect(driver.first()).toEqual('anything')
        expect(findStub.calledWith()).toBe(true)

        expect(driver.first('test')).toEqual('anything')
        expect(findStub.calledWith('test')).toBe(true)
      })
    })
  })
})
