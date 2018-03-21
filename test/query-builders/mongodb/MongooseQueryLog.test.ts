import 'jest'
import '../../../lib/log/FlipFlopQueryLog'
import { QueryLog } from '../../../lib/facades/global/QueryLogFacade'
import { MongooseQueryBuilder } from '../../../lib/query-builders/mongodb/MongooseQueryBuilder'
import { register } from 'najs-binding'
import { IMongooseProvider } from '../../../lib/query-builders/interfaces/IMongooseProvider'
import { model, Schema, Model, Document } from 'mongoose'

const mongoose = require('mongoose')

class MongooseProvider implements IMongooseProvider {
  static className: string = 'MongooseProvider'

  getClassName() {
    return MongooseProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return model<T>(modelName, schema)
  }
}
register(MongooseProvider)

const UserSchema: Schema = new Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number }
  },
  {
    collection: 'users'
  }
)
model('User', UserSchema)

describe('MongooseQueryLog', function() {
  beforeEach(function() {
    QueryLog.clear().enable()
  })

  describe('.get()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder
        .select()
        .where('first_name', 'test')
        .get()
      const log = QueryLog.pull()[0]
      console.log(log)
      // expect(log.query.raw).toEqual('User.find({"first_name":"test"}).exec()')
    })
  })

  describe('.count()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('first_name', 'test').count()
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.find()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder
        .distinct('first_name')
        .where('first_name', 'test')
        .find()
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.pluck()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder
        .limit(10)
        .where('first_name', '!=', 'test')
        .pluck('first_name')
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.update()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').update({ test: 'anything' })
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.delete()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').delete()
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.restore()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder['softDelete'] = { deletedAt: 'deleted_at' }
      builder.where('id', '000000000000000000000000').restore()
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })

  describe('.execute()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').execute()
      const log = QueryLog.pull()[0]
      console.log(log)
    })
  })
})
