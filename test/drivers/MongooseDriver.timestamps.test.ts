import 'jest'
import '../../lib/query-log/FlipFlopQueryLog'
import * as Sinon from 'sinon'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { MongooseDriver } from '../../lib/drivers/MongooseDriver'
import { init_mongoose, delete_collection } from '../util'
const mongoose = require('mongoose')
const Moment = require('moment')

EloquentDriverProvider.register(MongooseDriver, 'mongoose', true)

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

describe('MongooseDriver.Timestamps', function() {
  jest.setTimeout(10000)

  beforeAll(async function() {
    await init_mongoose(mongoose, 'mongoose_driver_timestamps')
  })

  afterAll(async function() {
    await delete_collection(mongoose, 'users')
    await delete_collection(mongoose, 'timestamp_model_defaults')
    await delete_collection(mongoose, 'custom_timestamp_models')
    await delete_collection(mongoose, 'not_static_timestamp_models')
  })

  class TimestampModelDefault extends Eloquent<Timestamps> {
    protected timestamps: boolean = true
    protected schema = { name: String }
    name: string
    created_at: Date
    updated_at: Date

    getClassName() {
      return 'TimestampModelDefault'
    }
  }

  it('should use custom "setupTimestamp" which use Moment instead of native Date', async function() {
    const now = new Date(1988, 4, 16)
    Moment.now = function test() {
      return now
    }

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

    const updatedModel = <TimestampModelDefault>await model.fresh()
    expect(updatedModel.updated_at).toEqual(updatedAt)
  })

  it('works with QueryBuilder.update(), one document', async function() {
    const createdAt = new Date(1988, 4, 16)
    Moment.now = () => createdAt

    const model = new TimestampModelDefault()
    await model.save()

    const updatedAt = new Date(2000, 0, 1)
    Moment.now = () => updatedAt

    await model.where('id', model['id']).update({})
    const updatedModel = await model.findOrFail(model.id)
    expect(updatedModel.updated_at).toEqual(updatedAt)
  })

  it('works with QueryBuilder.update(), multiple documents', async function() {
    const model = new TimestampModelDefault()

    const now = new Date(2010, 0, 1)
    Moment.now = () => now
    const idList = await model.pluck('id')
    await model.whereIn('id', Object.keys(idList)).update({})

    const documents = await model.get()
    expect(documents.map((item: any) => item.updated_at).all()).toEqual([now, now, now])
  })

  class CustomTimestampModel extends Eloquent<Timestamps> {
    static timestamps = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
    protected schema = { name: String }
    name: string
    createdAt: Date
    updatedAt: Date

    getClassName() {
      return 'CustomTimestampModel'
    }
  }

  it('works with custom name for createdAt and updatedAt', async function() {
    const now = new Date(1988, 4, 16)
    Moment.now = () => now

    const model = new CustomTimestampModel()
    await model.save()
    expect(model.createdAt).toEqual(now)
    expect(model.updatedAt).toEqual(now)
  })

  class NotStaticTimestampModel extends Eloquent<Timestamps> {
    protected timestamps = true
    protected schema = { name: String }
    name: string
    created_at: Date
    updated_at: Date

    getClassName() {
      return 'NotStaticTimestampModel'
    }
  }

  it('works with timestamps settings which not use static variable', async function() {
    const now = new Date(1988, 4, 16)
    Moment.now = () => now

    const model = new NotStaticTimestampModel()
    await model.save()
    expect(model.created_at).toEqual(now)
    expect(model.updated_at).toEqual(now)
  })

  describe('.touch()', function() {
    it('does nothing with not supported Timestamp Model', async function() {
      const user = new User()
      const markModifiedSpy = Sinon.spy(user['attributes'], <any>'markModified')
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
      const markModifiedSpy = Sinon.spy(model['attributes'], <any>'markModified')
      await model.save()

      expect(model.createdAt).toEqual(now)
      expect(model.updatedAt).toEqual(now)

      now = new Date(2000, 1, 1)
      model['touch']()
      expect(markModifiedSpy.calledWith('updatedAt')).toBe(true)

      await model.save()
      expect(model.updatedAt).toEqual(now)
    })
  })
})
