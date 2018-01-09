import 'jest'
import * as Sinon from 'sinon'
import { Schema } from 'mongoose'
import { Eloquent } from '../../lib'
import { register } from 'najs'
import { IMongooseProvider } from '../../lib/interfaces/IMongooseProvider'
import { MongooseQueryBuilder } from '../../lib/query-builders/MongooseQueryBuilder'
const mongoose = require('mongoose')

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

interface IUser {
  first_name: string
  last_name: string
}
class User extends Eloquent.Mongoose<IUser, User>() {
  static className: string = 'User'

  getClassName() {
    return User.className
  }

  getSchema(): Schema {
    return new Schema(
      {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        age: { type: Number, default: 0 }
      },
      { collection: 'users' }
    )
  }
}

describe('EloquentMongoose', function() {
  jest.setTimeout(10000)

  beforeAll(async function() {
    return new Promise(resolve => {
      mongoose.connect('mongodb://localhost/najs_eloquent_test')
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
            resolve(true)
          })
        } else {
          resolve(true)
        }
      } catch (error) {}
    })
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
    })
  })

  describe('Static functions', function() {})

  describe('Eloquent method', function() {
    let id: string
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
})
