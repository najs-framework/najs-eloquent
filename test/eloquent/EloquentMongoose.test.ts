import 'jest'
import * as Sinon from 'sinon'
import { Schema } from 'mongoose'
import { Eloquent } from '../../lib'
import { register } from 'najs'
import { IMongooseProvider } from '../../lib/interfaces/IMongooseProvider'
import { MongooseQueryBuilder } from '../../lib/query-builders/MongooseQueryBuilder'
import { EloquentMongoose } from '../../lib/eloquent/EloquentMongoose'
import { ObjectId } from 'bson'
import { NotFoundError } from '../../lib/errors/NotFoundError'

const mongoose = require('mongoose')
const Moment = require('moment')

class MongooseProvider implements IMongooseProvider {
  static className: string = 'MongooseProvider'

  getClassName() {
    return MongooseProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }
}
register(MongooseProvider)

interface Timestamps {
  name: string
  created_at: Date
  updated_at: Date
}

interface IUser extends Timestamps {
  first_name: string
  last_name: string
  full_name: string
  nick_name: string
  age: number
}
class User extends Eloquent.Mongoose<IUser, User>() {
  static className: string = 'User'

  getClassName() {
    return User.className
  }

  get full_name() {
    return this.attributes.first_name + ' ' + this.attributes.last_name
  }

  set full_name(value: string) {}

  getFullNameAttribute() {
    return this.attributes.first_name + ' ' + this.attributes.last_name
  }

  setFullNameAttribute(value: string) {
    const parts = value.split(' ')
    this.attributes['first_name'] = parts[0]
    this.attributes['last_name'] = parts[1]
  }

  getNickNameAttribute() {
    return this.attributes.first_name.toUpperCase()
  }

  setNickNameAttribute(value: string) {
    this.attributes['first_name'] = value.toLowerCase()
  }

  getSchema(): Schema {
    return new Schema(
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        age: { type: Number, default: 0 }
      },
      { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
    )
  }
}

describe('EloquentMongoose', function() {
  jest.setTimeout(10000)

  beforeAll(async function() {
    return new Promise(resolve => {
      mongoose.connect('mongodb://localhost/najs_eloquent_test_0')
      mongoose.Promise = global.Promise
      mongoose.connection.once('open', () => {
        resolve(true)
      })
    })
  })

  afterAll(async function() {
    return new Promise(resolve => {
      try {
        if (mongoose.connection.collection('users')) {
          mongoose.connection.collection('users').drop(function() {
            mongoose.connection.collection('timestampmodeldefaults').drop(function() {
              mongoose.connection.collection('customtimestampmodel').drop(function() {
                resolve(true)
              })
            })
          })
        } else {
          resolve(true)
        }
      } catch (error) {}
    })
  })

  it('can be initialized with static function', async function() {
    const users = await User.all()
    expect(users.count()).toEqual(0)
  })

  describe('ActiveRecord', function() {
    describe('save()', function() {
      it('can create a document', async function() {
        const user = new User({
          first_name: 'tony',
          last_name: 'stark',
          age: 45
        })
        await user.save()
        const result: User = await User.where('first_name', 'tony').find()
        expect(result.toObject()).toMatchObject(user.toObject())
      })

      it('can update a document', async function() {
        const user = await User.where('first_name', 'tony').find()
        user.age = 40
        await user.save()
        const result: User = await User.where('first_name', 'tony').find()
        expect(result.toObject()).toMatchObject(user.toObject())
      })

      it('does not catch error from Mongoose', async function() {
        const user = new User()
        try {
          await user.save()
        } catch (error) {
          expect(error.name).toEqual('ValidationError')
          return
        }
        expect('it should not go to this line').toEqual('')
      })
    })

    describe('delete()', function() {
      it('calls MongooseDocument.remove()', async function() {
        const user: User = new User()
        user.first_name = 'john'
        user.last_name = 'doe'
        user.age = 20
        await user.save()
        const removeSpy = Sinon.spy(user['attributes'], 'remove')
        await user.delete()
        expect(removeSpy.called).toBe(true)
        expect(await User.where('first_name', 'john').count()).toEqual(0)
      })
    })

    describe('forceDelete()', function() {
      it('calls MongooseDocument.remove()', async function() {
        const user: User = new User()
        user.first_name = 'john'
        user.last_name = 'doe'
        user.age = 20
        await user.save()
        const removeSpy = Sinon.spy(user['attributes'], 'remove')
        await user.forceDelete()
        expect(removeSpy.called).toBe(true)
        expect(await User.where('first_name', 'john').count()).toEqual(0)
      })
    })

    describe('fresh()', function() {
      it('always returns null if attribute._id is not found', async function() {
        const user = new User()
        expect(await user.fresh()).toBeNull()
      })

      it('returns "fresh" version in db if attribute._id exists', async function() {
        const user = await User.where('first_name', 'tony').find()
        user.age = 4000000

        const fresh = await user.fresh()
        expect(fresh.toJson()).toMatchObject({
          first_name: 'tony',
          last_name: 'stark',
          full_name: 'tony stark',
          age: 40
        })
      })
    })
  })

  describe('Static functions', function() {
    describe('Class', function() {
      it('is return EloquentMongoose.constructor, this is a part of syntax', function() {
        expect(<any>User.Class() === EloquentMongoose).toBe(true)
      })
    })

    describe('queryName()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'newQuery')
        expect(User.queryName('Query')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.select()', function() {
        const queryNameSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'queryName')
        User.queryName('Query')
        expect(queryNameSpy.calledWith('Query')).toBe(true)
        queryNameSpy.restore()
      })
    })

    describe('select()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'newQuery')
        expect(User.select('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.select()', function() {
        const selectSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'select')
        User.select('first_name')
        expect(selectSpy.calledWith('first_name')).toBe(true)
        User.select('first_name', 'last_name', 'age')
        expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        User.select(['first_name', 'last_name', 'age'])
        expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        User.select('first_name', ['last_name', 'age'])
        expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        selectSpy.restore()
      })
    })

    describe('distinct()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.distinct('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.distinct()', function() {
        const distinctSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'distinct')
        User.distinct('first_name')
        expect(distinctSpy.calledWith('first_name')).toBe(true)
        User.distinct('first_name', 'last_name', 'age')
        expect(distinctSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        User.distinct(['first_name', 'last_name', 'age'])
        expect(distinctSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        User.distinct('first_name', ['last_name', 'age'])
        expect(distinctSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        distinctSpy.restore()
      })
    })

    describe('orderBy()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderBy('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderBy()', function() {
        const orderBySpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderBy')
        User.orderBy('first_name')
        expect(orderBySpy.calledWith('first_name', 'asc')).toBe(true)
        User.orderBy('first_name', 'desc')
        expect(orderBySpy.calledWith('first_name', 'desc')).toBe(true)
        orderBySpy.restore()
      })
    })

    describe('orderByAsc()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderByAsc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderByAsc()', function() {
        const orderByAscSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderByAsc')
        User.orderByAsc('first_name')
        expect(orderByAscSpy.calledWith('first_name')).toBe(true)
        orderByAscSpy.restore()
      })
    })

    describe('orderByDesc()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderByDesc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderByDesc()', function() {
        const orderByDescSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderByDesc')
        User.orderByDesc('first_name')
        expect(orderByDescSpy.calledWith('first_name')).toBe(true)
        orderByDescSpy.restore()
      })
    })

    describe('limit()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.limit(10)).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.limit()', function() {
        const limitSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'limit')
        User.limit(10)
        expect(limitSpy.calledWith(10)).toBe(true)
        limitSpy.restore()
      })
    })

    describe('where()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.where('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.where()', function() {
        const whereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'where')
        User.where('first_name', 'tony')
        expect(whereSpy.calledWith('first_name', 'tony')).toBe(true)
        User.where('first_name', '<>', 'tony')
        expect(whereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)
        whereSpy.restore()
      })
    })

    describe('orWhere()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhere('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhere()', function() {
        const orWhereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhere')
        User.orWhere('first_name', 'tony')
        expect(orWhereSpy.calledWith('first_name', 'tony')).toBe(true)
        User.orWhere('first_name', '<>', 'tony')
        expect(orWhereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)
        orWhereSpy.restore()
      })
    })

    describe('whereIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereIn()', function() {
        const whereInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereIn')
        User.whereIn('first_name', ['tony'])
        expect(whereInSpy.calledWith('first_name', ['tony'])).toBe(true)
        whereInSpy.restore()
      })
    })

    describe('whereNotIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereNotIn()', function() {
        const whereNotInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereNotIn')
        User.whereNotIn('first_name', ['tony'])
        expect(whereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)
        whereNotInSpy.restore()
      })
    })

    describe('orWhereIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereIn()', function() {
        const orWhereInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereIn')
        User.orWhereIn('first_name', ['tony'])
        expect(orWhereInSpy.calledWith('first_name', ['tony'])).toBe(true)
        orWhereInSpy.restore()
      })
    })

    describe('orWhereNotIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereNotIn()', function() {
        const orWhereNotInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereNotIn')
        User.orWhereNotIn('first_name', ['tony'])
        expect(orWhereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)
        orWhereNotInSpy.restore()
      })
    })

    describe('all()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .all()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.all()).toBeInstanceOf(Promise)
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.all()', function() {
        const allSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'all')
        User.all()
        expect(allSpy.calledWith()).toBe(true)
        allSpy.restore()
      })
    })

    describe('get()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .get()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.get()).toBeInstanceOf(Promise)
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.select() before calling .get()', function() {
        const selectSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'select')
        const getSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'get')

        User.get()
        expect(selectSpy.calledWith()).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        User.get('first_name')
        expect(selectSpy.calledWith('first_name')).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        User.get('first_name', 'last_name', 'age')
        expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        User.get(['first_name', 'last_name', 'age'])
        expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        User.get('first_name', ['last_name', 'age'])
        expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        selectSpy.restore()
        getSpy.restore()
      })
    })

    describe('find()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .find()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.find()).toBeInstanceOf(Promise)
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.find()', function() {
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        User.find()
        expect(findSpy.calledWith()).toBe(true)
        findSpy.restore()
      })

      it('calls where("_id" ) before passing params to MongooseQueryBuilder.find() if id is provided', function() {
        const whereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'where')
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        User.find('000000000000000000000000')
        expect(whereSpy.calledWith('_id', '000000000000000000000000')).toBe(true)
        expect(findSpy.calledWith()).toBe(true)
        whereSpy.restore()
        findSpy.restore()
      })
    })

    describe('pluck()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .pluck()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.pluck('id')).toBeInstanceOf(Promise)
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.pluck()', function() {
        const pluckSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'pluck')
        User.pluck('first_name')
        expect(pluckSpy.calledWith('first_name')).toBe(true)
        User.pluck('first_name', 'id')
        expect(pluckSpy.calledWith('first_name', 'id')).toBe(true)
        pluckSpy.restore()
      })
    })

    describe('findById()', function() {
      it('calls find() with id', function() {
        const findSpy = Sinon.spy(User, 'find')
        const id = new ObjectId()
        User.findById(id)
        expect(findSpy.calledWith(id)).toBe(true)
        findSpy.restore()
      })
    })

    describe('findOrFail()', function() {
      it('calls find() with id and return instance of Model if found', async function() {
        const findSpy = Sinon.spy(User, 'find')
        const user = new User({
          first_name: 'john',
          last_name: 'doe'
        })
        await user.save()
        const result = await User.findOrFail(user.id)
        expect(result.is(user)).toBe(true)
        expect(findSpy.calledWith(user.id)).toBe(true)
        findSpy.restore()
      })

      it('throws NotFoundError if model not found', async function() {
        const id = new ObjectId()
        try {
          await User.findOrFail(id)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          expect(error).toBeInstanceOf(NotFoundError)
          expect(error.model).toEqual(User.className)
          return
        }
        expect('should not reach this line').toEqual('yeah')
      })
    })
  })

  describe('Eloquent method', function() {
    let id: string
    describe('setId()', function() {
      it('sets values to attributes[_id]', function() {
        const user = new User()
        const id = new ObjectId()
        user.id = id
        expect(user['attributes']['_id']).toEqual(id)
      })
    })

    describe('protected initialize()', function() {
      it('was called by constructor()', function() {
        const initializeSpy = Sinon.spy(User.prototype, <any>'initialize')
        const user = new User()
        expect(user).toBeDefined()
        expect(initializeSpy.called).toBe(true)
        initializeSpy.restore()
      })
      it('creates or get model from mongoose and assign to this.model', function() {
        const user = new User()
        expect(user['model'].modelName).toEqual('User')
      })
    })

    describe('protected getMongoose()', function() {
      it('uses make("MongooseProvider") to get an instance of mongoose', function() {
        const user = new User()
        expect(user['getMongoose']() === mongoose).toBe(true)
      })
    })

    describe('protected isNativeRecord(document)', function() {
      it('use instanceof this.model to detect the document is instance of model or not', function() {
        const user = new User()
        expect(user['isNativeRecord']({})).toBe(false)
        expect(user['isNativeRecord'](user)).toBe(false)
        expect(user['isNativeRecord'](user['attributes'])).toBe(true)
      })
    })

    describe('protected getReservedPropertiesList()', function() {
      it('contains all attribute in prototype and [collection, model, schema]', function() {
        const user = new User()
        const list = user['getReservedPropertiesList']()
        expect(list).toContain('collection')
        expect(list).toContain('model')
        expect(list).toContain('schema')
      })
    })

    describe('getAttribute(name)', function() {
      it('returns this.attributes[name]', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        expect(user.getAttribute('first_name')).toEqual('tony')
      })

      it('is called if the name is not in __knownAttributeList', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        const getAttributeSpy = Sinon.spy(user, 'getAttribute')
        user.first_name = user.last_name
        expect(getAttributeSpy.calledWith('last_name')).toBe(true)
      })
    })

    describe('setAttribute(name, value)', function() {
      it('assigns value to this.attributes[name]', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        user.setAttribute('first_name', 'test')
        expect(user.first_name).toEqual('test')
      })

      it('is called if the name is not in __knownAttributeList', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        const setAttributeSpy = Sinon.spy(user, 'setAttribute')
        user.first_name = user.last_name
        expect(setAttributeSpy.calledWith('first_name', user.last_name)).toBe(true)
      })
    })

    describe('toObject()', function() {
      it('calls MongooseDocument.toObject()', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        const toObjectSpy = Sinon.spy(user['attributes'], 'toObject')
        expect(user.toObject()).toMatchObject({
          first_name: 'tony',
          last_name: 'stark',
          full_name: 'tony stark',
          age: 40,
          __v: 0
        })
        expect(toObjectSpy.called).toBe(true)
        id = user['_id']
      })
    })

    describe('toJson()', function() {
      it('calls MongooseDocument.toJSON(), strips __v, changes _id to "id"', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        const toJSONSpy = Sinon.spy(user['attributes'], 'toJSON')
        expect(user.toJson()).toMatchObject({
          id,
          first_name: 'tony',
          last_name: 'stark',
          full_name: 'tony stark',
          age: 40
        })
        expect(
          toJSONSpy.calledWith({
            getters: true,
            virtuals: true,
            versionKey: false
          })
        ).toBe(true)
      })
    })

    describe('newInstance()', function() {
      it('works exactly like Eloquent.newInstance()', async function() {
        const user: User = new User()
        expect(user.newInstance()).toBeInstanceOf(User)
        expect(user.newInstance({})).toBeInstanceOf(User)
      })
    })

    describe('newCollection()', function() {
      it('works exactly like Eloquent.newCollection()', async function() {
        const user: User = new User()
        expect(user.newCollection([]).items).toEqual([])
      })
    })

    describe('newQuery()', function() {
      it('creates new MongooseQueryBuilder with model name is getModelName()', async function() {
        const user: User = new User()
        const getModelNameSpy = Sinon.spy(user, 'getModelName')
        expect(user.newQuery()).toBeInstanceOf(MongooseQueryBuilder)
        expect(getModelNameSpy.called).toBe(true)
      })
    })

    describe('fireEvent(event)', function() {
      it('is chain-able', function() {
        const user: User = new User()
        expect(user.fireEvent('any') === user).toBe(true)
      })

      it('triggers event by using MongooseDocument.emit() with this value', async function() {
        const user: User = new User()
        const emitSpy = Sinon.spy(user['model'], 'emit')
        user.fireEvent('any')
        expect(emitSpy.calledWith('any', user)).toBe(true)
      })
    })

    describe('is()', function() {
      it('calls MongooseDocument.equals()', async function() {
        const user: User = await User.where('first_name', 'tony').find()
        const comparison = new User()
        const equalsSpy = Sinon.spy(user['attributes'], 'equals')
        expect(user.is(comparison)).toBe(false)
        expect(equalsSpy.calledWith(comparison['attributes'])).toBe(true)
      })
    })
  })

  describe('Timestamps', function() {
    class TimestampModelDefault extends Eloquent.Mongoose<Timestamps, TimestampModelDefault>() {
      static timestamps: boolean = true

      getClassName() {
        return 'TimestampModelDefault'
      }

      getSchema() {
        return new Schema({ name: String })
      }
    }

    it('should use custom "setupTimestamp" which use Moment instead of native Date', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new TimestampModelDefault()
      await model.save()
      expect(model.created_at).toEqual(now)
      expect(model.updated_at).toEqual(now)
    })

    it('works with ActiveRecord.save()', async function() {
      const createdAt = new Date(1988, 4, 16)
      Moment.now = () => createdAt

      const model = new TimestampModelDefault()
      await model.save()

      const updatedAt = new Date(2000, 0, 1)
      Moment.now = () => updatedAt

      model.name = 'updated'
      await model.save()

      const updatedModel = await TimestampModelDefault.find(model.id)
      expect(updatedModel.updated_at).toEqual(updatedAt)
    })

    it('works with QueryBuilder.update(), one document', async function() {
      const createdAt = new Date(1988, 4, 16)
      Moment.now = () => createdAt

      const model = new TimestampModelDefault()
      await model.save()

      const updatedAt = new Date(2000, 0, 1)
      Moment.now = () => updatedAt

      await TimestampModelDefault.where('_id', model.id).update({})
      const updatedModel = await TimestampModelDefault.find(model.id)
      expect(updatedModel.updated_at).toEqual(updatedAt)
    })

    it('works with QueryBuilder.update(), multiple documents', async function() {
      const now = new Date(2010, 0, 1)
      Moment.now = () => now
      const idList = await TimestampModelDefault.pluck('id')
      await TimestampModelDefault.whereIn('id', Object.keys(idList)).update({})

      const documents = await TimestampModelDefault.all()
      expect(documents.map(item => item.updated_at).all()).toEqual([now, now, now])
    })

    class CustomTimestampModel extends Eloquent.Mongoose<Timestamps, TimestampModelDefault>() {
      static timestamps = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }

      getClassName() {
        return 'CustomTimestampModel'
      }

      getSchema() {
        return new Schema({ name: String })
      }
    }
    it('works with custom name for createdAt and updatedAt', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new CustomTimestampModel()
      await model.save()
      expect(model['createdAt']).toEqual(now)
      expect(model['updatedAt']).toEqual(now)
    })
  })
})
