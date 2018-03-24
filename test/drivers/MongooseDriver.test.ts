import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { init_mongoose, delete_collection } from '../util'
import { Eloquent } from '../../lib/model/Eloquent'
import { MongooseDriver } from '../../lib/drivers/MongooseDriver'
import { Factory, factory } from '../../lib/facades/global/FactoryFacade'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { MongooseQueryBuilder } from '../../lib/query-builders/mongodb/MongooseQueryBuilder'
import { MongooseProvider } from '../../lib/facades/global/MongooseProviderFacade'

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

  // TODO: write more tests
  describe('.initialize()', function() {
    it('creates metadata, and calls .initializeModelIfNeeded()', function() {
      // const driver = new MongooseDriver(new User(), true)
      // driver.initialize({})
      // driver.initialize(new User())
      const user = new User({})
      new User(user)
    })
  })

  // TODO: write more tests
  describe('protected .initializeModelIfNeeded()', function() {})

  it('works', async function() {
    // const userModel = new User()
    // await factory(User.className).create()
    // console.log(await userModel['count']())
    // User.where('')
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
      })
    })

    describe('.toObject()', function() {
      // TODO: write a test
      it('works (not finished yet)', function() {
        const user = new User()
        user.toObject()
      })
    })

    describe('.toJSON()', function() {
      // TODO: write a test
      it('works (not finished yet)', function() {
        const user = new User()
        user.toJSON()
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
      it('returns reserved names = "schema, collection, options"', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.getReservedNames()).toEqual(['schema', 'collection', 'options'])
      })
    })

    describe('.getDriverProxyMethods()', function() {
      it('returns some models method names like "is", "get" and all ActiveRecord methods name', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        expect(driver.getDriverProxyMethods()).toEqual([
          'is',
          'getId',
          'setId',
          'newQuery',
          'touch',
          'save',
          'delete',
          'forceDelete',
          'restore',
          'fresh'
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
          // IFetchResultQuery
          'get',
          'all',
          'find',
          'first',
          'count',
          'pluck',
          'update',
          // 'delete', conflict to .getDriverProxyMethods() then it should be removed
          // 'restore', conflict to .getDriverProxyMethods() then it should be removed
          'execute'
        ])
      })
    })
  })

  describe('ActiveRecord Functions', function() {
    describe('.touch()', function() {
      it('does nothing if metadata.hasTimestamps() is false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
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
        const markModifiedSpy = Sinon.spy(driver.attributes, 'markModified')
        driver.touch()
        expect(markModifiedSpy.called).toBe(false)
      })

      it('calls "attributes".markModified() if metadata.hasTimestamps() return true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
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
        const markModifiedSpy = Sinon.spy(driver.attributes, 'markModified')
        driver.touch()
        expect(markModifiedSpy.calledWith('updated')).toBe(true)
      })
    })

    describe('.save()', function() {
      it('simply calls "attributes".save()', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          save() {}
        }
        const saveSpy = Sinon.spy(driver.attributes, 'save')
        driver.save()
        expect(saveSpy.called).toBe(true)
      })
    })

    describe('.delete()', function() {
      it('simply calls "attributes".delete() metadata.hasSoftDelete() returns true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          delete() {},
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return true
          }
        }
        const deleteSpy = Sinon.spy(driver.attributes, <any>'delete')
        const removeSpy = Sinon.spy(driver.attributes, 'remove')
        driver.delete()
        expect(deleteSpy.called).toBe(true)
        expect(removeSpy.called).toBe(false)
      })

      it('simply calls "attributes".remove() metadata.hasSoftDelete() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          delete() {},
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const deleteSpy = Sinon.spy(driver.attributes, <any>'delete')
        const removeSpy = Sinon.spy(driver.attributes, 'remove')
        driver.delete()
        expect(deleteSpy.called).toBe(false)
        expect(removeSpy.called).toBe(true)
      })
    })

    describe('.forceDelete()', function() {
      it('simply calls "attributes".remove() even metadata.hasSoftDeletes() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          remove() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const removeSpy = Sinon.spy(driver.attributes, 'remove')
        driver.forceDelete()
        expect(removeSpy.called).toBe(true)
      })
    })

    describe('.restore()', function() {
      it('does nothing if metadata.hasSoftDeletes() returns false', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          restore() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return false
          }
        }
        const restoreSpy = Sinon.spy(driver.attributes, <any>'restore')
        driver.restore()
        expect(restoreSpy.called).toBe(false)
      })

      it('calls "attributes".restore() if metadata.hasSoftDelete() return true', function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
          restore() {}
        }
        driver['metadata'] = <any>{
          hasSoftDeletes() {
            return true
          }
        }
        const restoreSpy = Sinon.spy(driver.attributes, <any>'restore')
        driver.restore()
        expect(restoreSpy.called).toBe(true)
      })
    })

    describe('.fresh()', function() {
      it('always returns null if "attributes".isNew is true', async function() {
        const driver = new MongooseDriver(<any>fakeModel, true)
        driver.attributes = <any>{
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
})
