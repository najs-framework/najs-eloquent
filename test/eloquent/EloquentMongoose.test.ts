import 'jest'
import * as Sinon from 'sinon'
import { Schema, Document, model } from 'mongoose'
import { register } from 'najs'
import { ObjectId } from 'bson'
import { Eloquent } from '../../lib'
import { IMongooseProvider } from '../../lib/interfaces/IMongooseProvider'
import { MongooseQueryBuilder } from '../../lib/query-builders/MongooseQueryBuilder'
import { EloquentMongoose } from '../../lib/eloquent/EloquentMongoose'
import { NotFoundError } from '../../lib/errors/NotFoundError'
import { init_mongoose, delete_collection } from '../util'

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

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema) {
    return model<T>(modelName, schema)
  }
}
register(MongooseProvider)

interface Timestamps {
  name: string
  created_at: Date
  updated_at: Date
}

interface SoftDelete {
  name: string
  deleted_at: Date | null
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
    await init_mongoose(mongoose, 'eloquent_mongoose')
  })

  afterAll(async function() {
    await delete_collection(mongoose, 'users')
    await delete_collection(mongoose, 'models')
    await delete_collection(mongoose, 'timestampmodeldefaults')
    await delete_collection(mongoose, 'customtimestampmodels')
    await delete_collection(mongoose, 'softdeletemodels')
    await delete_collection(mongoose, 'softdelete1s')
    await delete_collection(mongoose, 'softdelete2s')
  })

  it('can be initialized with static function .all()', async function() {
    const users = await User.all()
    expect(users.count()).toEqual(0)
  })

  it('can be initialized with static function .find()', async function() {
    const user = await User.find()
    expect(user).toBeNull()
  })

  it('can be registered and initialized with static function .first()', async function() {
    const user = new User({
      first_name: 'tony',
      last_name: 'stark',
      age: 45
    })
    await user.save()
    class Model extends Eloquent.Mongoose<{}, Model>() {
      static className: string = 'Model'

      getClassName() {
        return Model.className
      }

      getSchema(): Schema {
        return new Schema({}, { collection: 'users' })
      }
    }

    const model = await Model.first()
    await model.delete()
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

    describe('restore()', function() {
      it('does nothing if soft deletes is not defined', function() {
        const user: User = new User()
        expect(user['attributes']['restore']).toBeUndefined()
        user.restore()
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

  describe('Static/Query functions', function() {
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

        expect(new User().queryName('Query')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.select()', function() {
        const queryNameSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'queryName')
        User.queryName('Query')
        expect(queryNameSpy.calledWith('Query')).toBe(true)

        new User().queryName('Query')
        expect(queryNameSpy.calledWith('Query')).toBe(true)
        queryNameSpy.restore()
      })
    })

    describe('select()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'newQuery')
        expect(User.select('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().select('first_name')).toBeInstanceOf(MongooseQueryBuilder)
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

        new User().select('first_name')
        expect(selectSpy.calledWith('first_name')).toBe(true)
        new User().select('first_name', 'last_name', 'age')
        expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        new User().select(['first_name', 'last_name', 'age'])
        expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        new User().select('first_name', ['last_name', 'age'])
        expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        selectSpy.restore()
      })
    })

    describe('distinct()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.distinct('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        expect(new User().distinct('first_name')).toBeInstanceOf(MongooseQueryBuilder)
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

        new User().distinct('first_name')
        expect(distinctSpy.calledWith('first_name')).toBe(true)
        new User().distinct('first_name', 'last_name', 'age')
        expect(distinctSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        new User().distinct(['first_name', 'last_name', 'age'])
        expect(distinctSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        new User().distinct('first_name', ['last_name', 'age'])
        expect(distinctSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        distinctSpy.restore()
      })
    })

    describe('orderBy()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderBy('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orderBy('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderBy()', function() {
        const orderBySpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderBy')
        User.orderBy('first_name')
        expect(orderBySpy.calledWith('first_name', 'asc')).toBe(true)
        User.orderBy('first_name', 'desc')
        expect(orderBySpy.calledWith('first_name', 'desc')).toBe(true)

        new User().orderBy('first_name')
        expect(orderBySpy.calledWith('first_name', 'asc')).toBe(true)
        new User().orderBy('first_name', 'desc')
        expect(orderBySpy.calledWith('first_name', 'desc')).toBe(true)
        orderBySpy.restore()
      })
    })

    describe('orderByAsc()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderByAsc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orderByAsc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderByAsc()', function() {
        const orderByAscSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderByAsc')
        User.orderByAsc('first_name')
        expect(orderByAscSpy.calledWith('first_name')).toBe(true)

        new User().orderByAsc('first_name')
        expect(orderByAscSpy.calledWith('first_name')).toBe(true)
        orderByAscSpy.restore()
      })
    })

    describe('orderByDesc()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orderByDesc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orderByDesc('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orderByDesc()', function() {
        const orderByDescSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orderByDesc')
        User.orderByDesc('first_name')
        expect(orderByDescSpy.calledWith('first_name')).toBe(true)

        new User().orderByDesc('first_name')
        expect(orderByDescSpy.calledWith('first_name')).toBe(true)
        orderByDescSpy.restore()
      })
    })

    describe('limit()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.limit(10)).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().limit(10)).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.limit()', function() {
        const limitSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'limit')
        User.limit(10)
        expect(limitSpy.calledWith(10)).toBe(true)

        new User().limit(10)
        expect(limitSpy.calledWith(10)).toBe(true)
        limitSpy.restore()
      })
    })

    describe('where()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.where('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().where('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.where()', function() {
        const whereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'where')
        User.where('first_name', 'tony')
        expect(whereSpy.calledWith('first_name', 'tony')).toBe(true)
        User.where('first_name', '<>', 'tony')
        expect(whereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)

        new User().where('first_name', 'tony')
        expect(whereSpy.calledWith('first_name', 'tony')).toBe(true)
        new User().where('first_name', '<>', 'tony')
        expect(whereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)
        whereSpy.restore()
      })
    })

    describe('orWhere()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhere('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orWhere('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhere()', function() {
        const orWhereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhere')
        User.orWhere('first_name', 'tony')
        expect(orWhereSpy.calledWith('first_name', 'tony')).toBe(true)
        User.orWhere('first_name', '<>', 'tony')
        expect(orWhereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)

        new User().orWhere('first_name', 'tony')
        expect(orWhereSpy.calledWith('first_name', 'tony')).toBe(true)
        new User().orWhere('first_name', '<>', 'tony')
        expect(orWhereSpy.calledWith('first_name', '<>', 'tony')).toBe(true)
        orWhereSpy.restore()
      })
    })

    describe('whereIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().whereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereIn()', function() {
        const whereInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereIn')
        User.whereIn('first_name', ['tony'])
        expect(whereInSpy.calledWith('first_name', ['tony'])).toBe(true)

        new User().whereIn('first_name', ['tony'])
        expect(whereInSpy.calledWith('first_name', ['tony'])).toBe(true)
        whereInSpy.restore()
      })
    })

    describe('whereNotIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().whereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereNotIn()', function() {
        const whereNotInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereNotIn')
        User.whereNotIn('first_name', ['tony'])
        expect(whereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)

        new User().whereNotIn('first_name', ['tony'])
        expect(whereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)
        whereNotInSpy.restore()
      })
    })

    describe('orWhereIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orWhereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereIn()', function() {
        const orWhereInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereIn')
        User.orWhereIn('first_name', ['tony'])
        expect(orWhereInSpy.calledWith('first_name', ['tony'])).toBe(true)

        new User().orWhereIn('first_name', ['tony'])
        expect(orWhereInSpy.calledWith('first_name', ['tony'])).toBe(true)
        orWhereInSpy.restore()
      })
    })

    describe('orWhereNotIn()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orWhereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereNotIn()', function() {
        const orWhereNotInSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereNotIn')
        User.orWhereNotIn('first_name', ['tony'])
        expect(orWhereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)

        new User().orWhereNotIn('first_name', ['tony'])
        expect(orWhereNotInSpy.calledWith('first_name', ['tony'])).toBe(true)
        orWhereNotInSpy.restore()
      })
    })

    describe('whereNull()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().whereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereNull()', function() {
        const whereNullSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereNull')
        User.whereNull('first_name')
        expect(whereNullSpy.calledWith('first_name')).toBe(true)

        new User().whereNull('first_name')
        expect(whereNullSpy.calledWith('first_name')).toBe(true)
        whereNullSpy.restore()
      })
    })

    describe('whereNotNull()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.whereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().whereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.whereNotNull()', function() {
        const whereNotNullSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'whereNotNull')
        User.whereNotNull('first_name')
        expect(whereNotNullSpy.calledWith('first_name')).toBe(true)

        new User().whereNotNull('first_name')
        expect(whereNotNullSpy.calledWith('first_name')).toBe(true)
        whereNotNullSpy.restore()
      })
    })

    describe('orWhereNull()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().orWhereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereNull()', function() {
        const orWhereNullSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereNull')
        User.orWhereNull('first_name')
        expect(orWhereNullSpy.calledWith('first_name')).toBe(true)

        new User().orWhereNull('first_name')
        expect(orWhereNullSpy.calledWith('first_name')).toBe(true)
        orWhereNullSpy.restore()
      })
    })

    describe('orWhereNotNull()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.orWhereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.calledWith()).toBe(true)

        expect(new User().orWhereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.calledWith()).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.orWhereNotNull()', function() {
        const orWhereNotNullSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'orWhereNotNull')
        User.orWhereNotNull('first_name')
        expect(orWhereNotNullSpy.calledWith('first_name')).toBe(true)

        new User().orWhereNotNull('first_name')
        expect(orWhereNotNullSpy.calledWith('first_name')).toBe(true)
        orWhereNotNullSpy.restore()
      })
    })

    describe('withTrashed()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.withTrashed()).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.calledWith()).toBe(true)

        expect(new User().withTrashed()).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.calledWith()).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.withTrash()', function() {
        const withTrashSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'withTrashed')
        User.withTrashed()
        expect(withTrashSpy.called).toBe(true)

        new User().withTrashed()
        expect(withTrashSpy.called).toBe(true)
        withTrashSpy.restore()
      })
    })

    describe('onlyTrashed()', function() {
      it('creates MongooseQueryBuilder with model from prototype.newQuery()', function() {
        const newQuerySpy = Sinon.spy(User.prototype, 'getModelName')
        expect(User.onlyTrashed()).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)

        expect(new User().onlyTrashed()).toBeInstanceOf(MongooseQueryBuilder)
        expect(newQuerySpy.called).toBe(true)
        newQuerySpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.onlyTrash()', function() {
        const onlyTrashSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'onlyTrashed')
        User.onlyTrashed()
        expect(onlyTrashSpy.called).toBe(true)

        new User().onlyTrashed()
        expect(onlyTrashSpy.called).toBe(true)
        onlyTrashSpy.restore()
      })
    })

    describe('all()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .all()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(typeof User.all().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)

        expect(typeof new User().all().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.all()', function() {
        const allSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'all')
        User.all()
        expect(allSpy.calledWith()).toBe(true)

        new User().all()
        expect(allSpy.calledWith()).toBe(true)
        allSpy.restore()
      })
    })

    describe('get()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .get()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(typeof User.get().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)

        expect(typeof new User().get().then).toEqual('function')
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

        new User().get()
        expect(selectSpy.calledWith()).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        new User().get('first_name')
        expect(selectSpy.calledWith('first_name')).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        new User().get('first_name', 'last_name', 'age')
        expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        new User().get(['first_name', 'last_name', 'age'])
        expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        new User().get('first_name', ['last_name', 'age'])
        expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true)
        expect(getSpy.calledWith()).toBe(true)

        selectSpy.restore()
        getSpy.restore()
      })
    })

    describe('find()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .find()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(typeof User.find().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)

        expect(typeof new User().find().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.find()', function() {
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        new User().find()
        expect(findSpy.calledWith()).toBe(true)
        findSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.find() - static', function() {
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        User.find()
        expect(findSpy.calledWith()).toBe(true)
        findSpy.restore()
      })

      it('calls where("_id" ) before passing params to MongooseQueryBuilder.find() if id is provided', function() {
        const whereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'where')
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        new User().find('000000000000000000000000')
        expect(whereSpy.calledWith('_id', '000000000000000000000000')).toBe(true)
        expect(findSpy.calledWith()).toBe(true)
        whereSpy.restore()
        findSpy.restore()
      })

      it('calls where("_id" ) before passing params to MongooseQueryBuilder.find() if id is provided - static', function() {
        const whereSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'where')
        const findSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'find')
        User.find('000000000000000000000000')
        expect(whereSpy.calledWith('_id', '000000000000000000000000')).toBe(true)
        expect(findSpy.calledWith()).toBe(true)
        whereSpy.restore()
        findSpy.restore()
      })
    })

    describe('first()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .first()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(typeof User.first().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)

        expect(typeof new User().first().then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.first()', function() {
        const firstSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'first')
        User.first()
        expect(firstSpy.calledWith()).toBe(true)

        new User().first()
        expect(firstSpy.calledWith()).toBe(true)
        firstSpy.restore()
      })
    })

    describe('pluck()', function() {
      it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .pluck()', function() {
        const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName')
        expect(typeof User.pluck('id').then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)

        expect(typeof new User().pluck('id').then).toEqual('function')
        expect(getModelNameSpy.called).toBe(true)
        getModelNameSpy.restore()
      })

      it('passes all params to MongooseQueryBuilder.pluck()', function() {
        const pluckSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'pluck')
        User.pluck('first_name')
        expect(pluckSpy.calledWith('first_name')).toBe(true)
        User.pluck('first_name', 'id')
        expect(pluckSpy.calledWith('first_name', 'id')).toBe(true)

        new User().pluck('first_name')
        expect(pluckSpy.calledWith('first_name')).toBe(true)
        new User().pluck('first_name', 'id')
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

        new User().findById(id)
        expect(findSpy.calledWith(id)).toBe(true)
        findSpy.restore()
      })
    })

    describe('count()', function() {
      it('passes all params to MongooseQueryBuilder.count()', function() {
        const countSpy = Sinon.spy(MongooseQueryBuilder.prototype, 'count')
        User.count()
        expect(countSpy.calledWith()).toBe(true)

        new User().count()
        expect(countSpy.calledWith()).toBe(true)
        countSpy.restore()
      })
    })

    describe('native()', function() {
      it('passes all params to MongooseQueryBuilder.native()', function() {
        const handler = () => {}
        const nativeSpy = Sinon.spy(User, 'native')
        User.native(<any>handler)
        expect(nativeSpy.calledWith(handler)).toBe(true)

        new User().native(<any>handler)
        expect(nativeSpy.calledWith(handler)).toBe(true)
        nativeSpy.restore()
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
        let result = await User.findOrFail(user.id)
        expect(result.is(user)).toBe(true)
        expect(findSpy.calledWith(user.id)).toBe(true)

        result = await new User().findOrFail(user.id)
        expect(result.is(user)).toBe(true)
        expect(findSpy.calledWith(user.id)).toBe(true)
        findSpy.restore()
      })

      it('throws NotFoundError if model not found - member', async function() {
        const id = new ObjectId()
        try {
          await new User().findOrFail(id)
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          expect(error).toBeInstanceOf(NotFoundError)
          expect(error.model).toEqual(User.className)
          return
        }
        expect('should not reach this line').toEqual('yeah')
      })

      it('throws NotFoundError if model not found - static', async function() {
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

    describe('protected getMongooseProvider()', function() {
      it('uses make("MongooseProvider") to get an instance of mongoose', function() {
        const user = new User()
        expect(user['getMongooseProvider']().getMongooseInstance() === mongoose).toBe(true)
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

    describe('touch()', function() {
      it('has no effect if model do not support timestamps', function() {
        const user: User = new User()
        const markModifiedSpy = Sinon.spy(user['attributes'], 'markModified')
        user.touch()
        expect(markModifiedSpy.called).toBe(false)
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

    describe('touch()', function() {
      it('does nothing with not supported Timestamp Model', async function() {
        const user = new User()
        const markModifiedSpy = Sinon.spy(user['attributes'], 'markModified')
        user.touch()
        expect(markModifiedSpy.called).toBe(false)
      })

      it('updates timestamps by calling markModified', async function() {
        let now = new Date(1988, 4, 16)
        Moment.now = () => now

        const defaultSettings: TimestampModelDefault = new TimestampModelDefault()
        await defaultSettings.save()
        defaultSettings.touch()
        expect(defaultSettings.created_at).toEqual(now)
        expect(defaultSettings.updated_at).toEqual(now)

        const model: CustomTimestampModel = new CustomTimestampModel()
        const markModifiedSpy = Sinon.spy(model['attributes'], 'markModified')
        await model.save()

        expect(model['createdAt']).toEqual(now)
        expect(model['updatedAt']).toEqual(now)

        now = new Date(2000, 1, 1)
        model.touch()
        expect(markModifiedSpy.calledWith('updatedAt')).toBe(true)

        await model.save()
        expect(model['updatedAt']).toEqual(now)
      })
    })
  })

  describe('SoftDeletes', function() {
    class SoftDeleteModel extends Eloquent.Mongoose<SoftDelete, SoftDeleteModel>() {
      static softDeletes: boolean = true

      getClassName() {
        return 'SoftDeleteModel'
      }

      getSchema() {
        return new Schema({ name: String })
      }
    }

    it('does not load plugin SoftDelete with deleted_at by default', async function() {
      const model = new User()
      expect(model['schema'].path('deleted_at')).toBeUndefined()
      expect(model.newQuery()['softDelete']).toBe(false)
    })

    it('loads plugin SoftDelete with deleted_at by default', async function() {
      class SoftDelete1 extends Eloquent.Mongoose<SoftDelete, SoftDelete1>() {
        static softDeletes: boolean = true

        getClassName() {
          return 'SoftDelete1'
        }

        getSchema() {
          return new Schema({ name: String })
        }
      }

      const model = new SoftDelete1()
      expect(model['schema'].path('deleted_at')['instance']).toEqual('Date')
      expect(model['schema'].path('deleted_at')['defaultValue']).toBeDefined()
      expect(model.newQuery()['softDelete']).toMatchObject({
        deletedAt: 'deleted_at'
      })
    })

    it('has custom field for deletedAt', async function() {
      class SoftDelete2 extends Eloquent.Mongoose<SoftDelete, SoftDelete2>() {
        static softDeletes = { deletedAt: 'any' }

        getClassName() {
          return 'SoftDelete2'
        }

        getSchema() {
          return new Schema({ name: String })
        }
      }

      const model = new SoftDelete2()
      expect(model['schema'].path('any')['instance']).toEqual('Date')
      expect(model['schema'].path('any')['defaultValue']).toBeDefined()
      expect(model['schema'].path('deleted_at')).toBeUndefined()
      expect(model.newQuery()['softDelete']).toMatchObject({
        deletedAt: 'any'
      })
    })

    it('works with ActiveRecord and use Moment as Date source', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new SoftDeleteModel({
        name: 'test'
      })
      await model.delete()
      expect(model.deleted_at).toEqual(now)

      await model.restore()
      expect(model.deleted_at).toBeNull()

      await model.forceDelete()
    })

    it('works with static functions', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now
      expect(await SoftDeleteModel.count()).toEqual(0)
      const notDeletedModel = new SoftDeleteModel({
        name: 'test'
      })
      await notDeletedModel.save()

      const deletedModel = new SoftDeleteModel({
        name: 'test'
      })
      await deletedModel.delete()

      expect(await SoftDeleteModel.count()).toEqual(1)
      expect(await SoftDeleteModel.withTrashed().count()).toEqual(2)
      expect(await SoftDeleteModel.onlyTrashed().count()).toEqual(1)
      await notDeletedModel.forceDelete()
      await deletedModel.forceDelete()
    })

    it('does not override .find or .findOne when use .native()', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const notDeletedModel = new SoftDeleteModel({
        name: 'test'
      })
      await notDeletedModel.save()

      const deletedModel = new SoftDeleteModel({
        name: 'test'
      })
      await deletedModel.delete()

      expect(await SoftDeleteModel.count()).toEqual(1)
      expect(await SoftDeleteModel.withTrashed().count()).toEqual(2)
      expect(await SoftDeleteModel.onlyTrashed().count()).toEqual(1)
      expect(
        await SoftDeleteModel.native(function(model: any) {
          return model.find()
        }).count()
      ).toEqual(2)
      await notDeletedModel.forceDelete()
      await deletedModel.forceDelete()
    })
  })
})
