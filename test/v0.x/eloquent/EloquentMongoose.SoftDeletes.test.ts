import 'jest'
import { Schema, Document, model } from 'mongoose'
import { register } from 'najs-binding'
import { Eloquent } from '../../../lib'
import { IMongooseProvider } from '../../../lib/v0.x/interfaces/IMongooseProvider'
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
    await init_mongoose(mongoose, 'eloquent_mongoose_soft_deletes')
  })

  afterAll(async function() {
    await delete_collection(mongoose, 'users')
    await delete_collection(mongoose, 'models')
    await delete_collection(mongoose, 'softdeletemodels')
    await delete_collection(mongoose, 'softdeleteusememberpropertymodels')
    await delete_collection(mongoose, 'softdelete1s')
    await delete_collection(mongoose, 'softdelete2s')
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

    class SoftDeleteUseMemberPropertyModel extends Eloquent.Mongoose<SoftDelete, SoftDeleteModel>() {
      softDeletes: boolean = true

      getClassName() {
        return 'SoftDeleteUseMemberPropertyModel'
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

    it('works with settings as a member property', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new SoftDeleteUseMemberPropertyModel({
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
