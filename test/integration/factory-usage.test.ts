import 'jest'
import { register } from 'najs-binding'
import { Factory, factory, Eloquent } from '../../lib/v1'
import { Schema } from 'mongoose'
import { init_mongoose, delete_collection } from '../util'
const mongoose = require('mongoose')

describe('Integration Test - Factory Usage', function() {
  beforeAll(async function() {
    await init_mongoose(mongoose, 'integration_factory_usage')
  })

  afterAll(async function() {
    await delete_collection(mongoose, 'users')
  })

  describe('User model', function() {
    interface IUser {
      email: string
      first_name: string
      last_name: string
      age: number
    }
    class User extends Eloquent<IUser> {
      static className: string = 'User'

      getClassName() {
        return User.className
      }

      getSchema(): Schema {
        return new Schema(
          {
            email: { type: String, required: true },
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            age: { type: Number, default: 0 }
          },
          { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
        )
      }
    }
    register(User)

    it('can use Factory.define() to define factory for model', function() {
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
    })

    it('can use factory(User).raw() to get raw attributes', async function() {
      factory(User.className).raw({
        age: 20
      })

      // const user: User
      // user.getId()
      // user.getId()

      // console.log(raw)

      // console.log(
      //   factory(User.className)
      //     .make()
      //     .toJson()
      // )
      // console.log(await factory(User.className).create())
    })
  })
})
