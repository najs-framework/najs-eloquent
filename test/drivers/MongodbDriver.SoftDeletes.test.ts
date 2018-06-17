import 'jest'
import '../../lib/query-log/FlipFlopQueryLog'
import { register } from 'najs-binding'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { MongodbDriver } from '../../lib/drivers/MongodbDriver'
import { init_mongodb, delete_collection_use_mongodb } from '../util'
const Moment = require('moment')

EloquentDriverProvider.register(MongodbDriver, 'mongodb', true)

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
class User extends Eloquent<IUser> {
  static className: string = 'User'
  schema = {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
  }

  getClassName() {
    return User.className
  }
}

describe('MongodbDriver.SoftDeletes', function() {
  jest.setTimeout(10000)

  beforeAll(async function() {
    await init_mongodb('mongodb_driver_soft_deletes')
  })

  afterAll(async function() {
    await delete_collection_use_mongodb('users')
    await delete_collection_use_mongodb('models')
    await delete_collection_use_mongodb('soft_delete_models')
    await delete_collection_use_mongodb('soft_delete_use_member_property_models')
    await delete_collection_use_mongodb('soft_delete_1s')
    await delete_collection_use_mongodb('soft_delete_2s')
  })

  describe('SoftDeletes', function() {
    class SoftDeleteModel extends Eloquent.Mongoose<SoftDelete>() {
      static softDeletes: boolean = true
      protected schema = { name: String }

      getClassName() {
        return 'SoftDeleteModel'
      }
    }
    register(SoftDeleteModel)

    class SoftDeleteUseMemberPropertyModel extends Eloquent<SoftDelete> {
      softDeletes: boolean = true
      protected schema = { name: String }

      getClassName() {
        return 'SoftDeleteUseMemberPropertyModel'
      }
    }

    it('does not load plugin SoftDelete with deleted_at by default', async function() {
      const model = new User()
      expect(model.newQuery()['softDelete']).toBeUndefined()
    })

    it('works with ActiveRecord and use Moment as Date source', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new SoftDeleteModel({
        name: 'test'
      })
      await model.delete()
      expect(model['deleted_at']).toEqual(now)

      await model.restore()
      expect(model['deleted_at']).toBeNull()

      await model.forceDelete()
    })

    it('works with settings as a member property', async function() {
      const now = new Date(1988, 4, 16)
      Moment.now = () => now

      const model = new SoftDeleteUseMemberPropertyModel({
        name: 'test'
      })
      await model.delete()
      expect(model['deleted_at']).toEqual(now)

      await model.restore()
      expect(model['deleted_at']).toBeNull()

      await model.forceDelete()
    })

    // it('works with static functions', async function() {
    //   const now = new Date(1988, 4, 16)
    //   Moment.now = () => now
    //   expect(await SoftDeleteModel['count']()).toEqual(0)
    //   const notDeletedModel = new SoftDeleteModel({
    //     name: 'test'
    //   })
    //   await notDeletedModel.save()

    //   const deletedModel = new SoftDeleteModel({
    //     name: 'test'
    //   })
    //   await deletedModel.delete()

    //   expect(await SoftDeleteModel['count']()).toEqual(1)
    //   expect(await SoftDeleteModel['withTrashed']().count()).toEqual(2)
    //   expect(await SoftDeleteModel['onlyTrashed']().count()).toEqual(1)
    //   await notDeletedModel.forceDelete()
    //   await deletedModel.forceDelete()
    // })

    // it('does not override .find or .findOne when use .native()', async function() {
    //   const model = new SoftDeleteModel()

    //   const now = new Date(1988, 4, 16)
    //   Moment.now = () => now

    //   const notDeletedModel = new SoftDeleteModel({
    //     name: 'test'
    //   })
    //   await notDeletedModel.save()

    //   const deletedModel = new SoftDeleteModel({
    //     name: 'test'
    //   })
    //   await deletedModel.delete()

    //   expect(await model.count()).toEqual(1)
    //   expect(await model.withTrashed().count()).toEqual(2)
    //   expect(await model.onlyTrashed().count()).toEqual(1)
    //   expect(
    //     await model
    //       .newQuery()
    //       .native(function(model: any) {
    //         return model.find()
    //       })
    //       .count()
    //   ).toEqual(2)
    //   await notDeletedModel.forceDelete()
    //   await deletedModel.forceDelete()
    // })
  })
})
