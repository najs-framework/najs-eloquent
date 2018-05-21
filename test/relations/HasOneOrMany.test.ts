import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { Relation } from '../../lib/relations/Relation'
import { HasOneOrMany } from '../../lib/relations/HasOneOrMany'
import { MongooseDriver } from '../../lib/drivers/MongooseDriver'
import { MongooseProvider } from '../../lib/facades/global/MongooseProviderFacade'
import { EloquentDriverProviderFacade } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { init_mongoose, delete_collection } from '../util'
import { Eloquent } from '../../lib/model/Eloquent'
import { HasOne } from '../../lib/relations/types/HasOne'

EloquentDriverProviderFacade.register(MongooseDriver, 'mongoose', true)

describe('HasOneOrMany', function() {
  it('extends Relation, implements IAutoload with class name NajsEloquent.Relation.HasOneOrMany', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    expect(relation).toBeInstanceOf(Relation)
    expect(relation.getClassName()).toEqual('NajsEloquent.Relation.HasOneOrMany')
  })

  describe('.setup()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.setup(true, <any>{}, <any>{})
  })

  describe('.buildData()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.buildData()
  })

  // describe('.lazyLoad()', function() {
  //   const relation = new HasOneOrMany(<any>{}, 'test')
  //   relation.lazyLoad()
  // })

  describe('.eagerLoad()', function() {
    const relation = new HasOneOrMany(<any>{}, 'test')
    relation.eagerLoad()
  })

  describe('.executeQuery', function() {
    it('calls query.first() if "is1v1" is true', function() {
      const query = {
        first() {
          return 'first'
        },

        get() {
          return 'get'
        }
      }

      const firstSpy = Sinon.spy(query, 'first')
      const getSpy = Sinon.spy(query, 'get')

      const relation = new HasOneOrMany(<any>{}, 'test')
      relation['is1v1'] = true
      relation.executeQuery(<any>query)
      expect(firstSpy.called).toBe(true)
      expect(getSpy.called).toBe(false)
    })

    it('calls query.get() if "is1v1" is false', function() {
      const query = {
        first() {
          return 'first'
        },

        get() {
          return 'get'
        }
      }

      const firstSpy = Sinon.spy(query, 'first')
      const getSpy = Sinon.spy(query, 'get')

      const relation = new HasOneOrMany(<any>{}, 'test')
      relation['is1v1'] = false
      relation.executeQuery(<any>query)
      expect(firstSpy.called).toBe(false)
      expect(getSpy.called).toBe(true)
    })
  })
})

describe('HasOneOrMany - Integration - MongooseDriver', function() {
  beforeAll(async function() {
    await init_mongoose(MongooseProvider.getMongooseInstance(), 'relations_has_one_or_many')
  })

  afterAll(async function() {
    await delete_collection(MongooseProvider.getMongooseInstance(), 'users')
    await delete_collection(MongooseProvider.getMongooseInstance(), 'posts')
  })

  class Phone extends Eloquent {
    static className: string = 'Phone'
    static schema = {
      user_id: { type: String, required: true },
      number: { type: String, required: true }
    }

    user?: HasOne<Phone>
    user_id: string
    number: string

    getUserRelation() {
      return this.defineRelationProperty('user').belongsTo('User')
    }
  }
  Eloquent.register(Phone)

  class User extends Eloquent {
    static className: string = 'User'
    static schema = {
      name: { type: String, required: true }
    }
    phone?: HasOne<Phone>
    name: string

    getPhoneRelation() {
      return this.defineRelationProperty('phone').hasOne('Phone')
    }
  }
  register(User)

  describe('.lazyLoad()', function() {
    it('should work', async function() {
      const user = new User()
      user.name = 'a'
      await user.save()

      expect(await user.getPhoneRelation().lazyLoad()).toBeNull()

      const phone = new Phone()
      phone.number = 'a-phone'
      phone.user_id = user.id
      await phone.save()

      const phoneData = await user.getPhoneRelation().lazyLoad()
      console.log(phoneData!['toJson']())

      const userData = await phone.getUserRelation().lazyLoad()
      console.log(userData!['toJson']())
    })
  })
})
