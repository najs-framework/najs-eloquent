import 'jest'
import '../../../lib/query-log/FlipFlopQueryLog'
import { MongooseProvider } from '../../../lib/facades/global/MongooseProviderFacade'
import { QueryLog } from '../../../lib/facades/global/QueryLogFacade'
import { MongooseQueryBuilder } from '../../../lib/query-builders/mongodb/MongooseQueryBuilder'
import { Schema } from 'mongoose'

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
MongooseProvider.createModelFromSchema('User', UserSchema)

describe('MongooseQueryLog', function() {
  // TODO: write test

  beforeEach(function() {
    QueryLog.clear().enable()
  })

  describe('.get()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder
        .select()
        .where('first_name', 'test')
        .limit(10)
        .get()
      // const log = QueryLog.pull()[0]
      // console.log(log)
      // expect(log.query.raw).toEqual('User.find({"first_name":"test"}).exec()')
    })
  })

  describe('.count()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('first_name', 'test').count()
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })

  describe('.find()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('first_name', 'test').first()
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })

  describe('.update()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').update({ test: 'anything' })
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })

  describe('.delete()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').delete()
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })

  describe('.restore()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder['softDelete'] = { deletedAt: 'deleted_at' }
      builder.where('id', '000000000000000000000000').restore()
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })

  describe('.execute()', function() {
    it('should work', function() {
      const builder = new MongooseQueryBuilder('User')
      builder.where('id', '000000000000000000000000').execute()
      // const log = QueryLog.pull()[0]
      // console.log(log)
    })
  })
})
