import 'jest'
import * as Sinon from 'sinon'
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

describe('EloquentMongoose.Timestamps', function() {
  jest.setTimeout(10000)

  beforeAll(async function() {
    await init_mongoose(mongoose, 'eloquent_mongoose_timestamps')
  })

  afterAll(async function() {
    await delete_collection(mongoose, 'users')
    await delete_collection(mongoose, 'timestampmodeldefaults')
    await delete_collection(mongoose, 'customtimestampmodels')
    await delete_collection(mongoose, 'notstatictimestampmodels')
  })

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

  class NotStaticTimestampModel extends Eloquent.Mongoose<Timestamps, TimestampModelDefault>() {
    timestamps = true

    getClassName() {
      return 'NotStaticTimestampModel'
    }

    getSchema() {
      return new Schema({ name: String })
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
