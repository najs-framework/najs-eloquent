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
import { HasOne, BelongsTo, HasOneRelation, BelongsToRelation } from '../../lib/relations/types'
import { Factory, factory } from './../../lib/facades/global/FactoryFacade'

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

  // describe('.buildData()', function() {
  //   const relation = new HasOneOrMany(<any>{}, 'test')
  //   relation.buildData()
  // })

  // describe('.lazyLoad()', function() {
  //   const relation = new HasOneOrMany(<any>{}, 'test')
  //   relation.lazyLoad()
  // })

  // describe('.eagerLoad()', function() {
  //   const relation = new HasOneOrMany(<any>{}, 'test')
  //   relation.eagerLoad()
  // })

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

  interface IPhone {
    number: string
    user_id: string
  }

  interface IPhoneRelations {
    user: BelongsTo<IUser>

    getUserRelation(): BelongsToRelation<IUser>
  }

  interface Phone extends IPhone, IPhoneRelations {}
  class Phone extends Eloquent<IPhone & IPhoneRelations> {
    static className: string = 'Phone'
    static schema = {
      user_id: { type: String, required: true },
      number: { type: String, required: true }
    }
    static fillable = ['number']

    getUserRelation() {
      return this.defineRelationProperty('user').belongsTo('User')
    }
  }
  Eloquent.register(Phone)

  interface IUser {
    name: string
  }

  interface IUserRelations {
    phone: HasOne<IPhone>

    getPhoneRelation(): HasOneRelation<IPhone>
  }

  interface User extends IUser, IUserRelations {}
  class User extends Eloquent<IUser & IUserRelations> {
    static className: string = 'User'
    static schema = {
      name: { type: String, required: true }
    }
    static fillable = ['name']

    getPhoneRelation() {
      return this.defineRelationProperty('phone').hasOne('Phone')
    }
  }
  register(User)

  Factory.define(User, function(faker, attributes) {
    return Object.assign(
      {
        name: faker.name()
      },
      attributes
    )
  })
  Factory.define(Phone, function(faker, attributes) {
    return Object.assign(
      {
        number: faker.phone()
      },
      attributes
    )
  })

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

  describe('.eagerLoad()', function() {
    it('should work', async function() {
      const users = await factory(User)
        .times(3)
        .create()
      const phones = await factory(Phone)
        .times(5)
        .make()

      phones.items[0]['user_id'] = users.items[0]['id']
      await phones.items[0].save()
      phones.items[1]['user_id'] = users.items[0]['id']
      await phones.items[1].save()
      phones.items[2]['user_id'] = users.items[0]['id']
      await phones.items[2].save()
      phones.items[3]['user_id'] = users.items[1]['id']
      await phones.items[3].save()
      phones.items[4]['user_id'] = users.items[1]['id']
      await phones.items[3].save()

      const userModel = new User()
      const result = await userModel.get()
      // const first = result.first()
      // const last = result.last()
      // console.log(first.getRelationDataBucket() === last.getRelationDataBucket())
      // console.log('result', result)
      // console.log('data bucket', userModel.getRelationDataBucket())

      await result.first().load('phone')
      console.log(result.first().phone!.toJson())

      const last: User = <any>result.last()
      console.log(last.phone)

      const newUser = await Factory.create(User)
      await newUser.getPhoneRelation().load()
      newUser.getPhoneRelation().markBuild(false)
      console.log(newUser.phone)
    })
  })
})
