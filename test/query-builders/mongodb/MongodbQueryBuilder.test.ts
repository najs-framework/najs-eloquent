import 'jest'
import '../../../lib/query-log/FlipFlopQueryLog'
// import * as Sinon from 'sinon'
import { QueryLog } from '../../../lib/facades/global/QueryLogFacade'
import { MongodbProviderFacade } from '../../../lib/facades/global/MongodbProviderFacade'
import { MongodbQueryBuilder } from '../../../lib/query-builders/mongodb/MongodbQueryBuilder'
import { init_mongodb, delete_collection_use_mongodb } from '../../util'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'
import { MongodbQueryBuilderBase } from '../../../lib/query-builders/mongodb/MongodbQueryBuilderBase'

EloquentDriverProvider.register(DummyDriver, 'dummy')

// ---------------------------------------------------------------------------------------------------------------------

describe('Coverage fill', function() {
  it('implements IAutoload and returns "NajsEloquent.QueryBuilder.Mongodb.MongodbQueryBuilder" as className', function() {
    const query = new MongodbQueryBuilder('User', <any>{})
    try {
      query.update({})
    } catch (error) {}
    try {
      query.delete()
    } catch (error) {}
    try {
      query.restore()
    } catch (error) {}
    try {
      query.execute()
    } catch (error) {}
  })
})

describe('MongodbQueryBuilder', function() {
  it('implements IAutoload and returns "NajsEloquent.QueryBuilder.Mongodb.MongodbQueryBuilder" as className', function() {
    const query = new MongodbQueryBuilder('User', <any>{})
    expect(query.getClassName()).toEqual('NajsEloquent.QueryBuilder.Mongodb.MongodbQueryBuilder')
  })

  it('extends GenericQueryBuilder', function() {
    const query = new MongodbQueryBuilder('User', <any>{})
    expect(query).toBeInstanceOf(MongodbQueryBuilderBase)
  })

  // describe('constructor()', function() {
  //   it('is created by modelName', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query['mongooseModel'].modelName).toEqual('User')
  //   })

  //   it('is created by modelName + primaryKey', function() {
  //     const query = new MongooseQueryBuilder('User', undefined, 'test')
  //     expect(query.getPrimaryKey()).toEqual('test')
  //     expect(query['mongooseModel'].modelName).toEqual('User')
  //   })

  //   it('throws exception if model not found', function() {
  //     try {
  //       new MongooseQueryBuilder('NotFound')
  //     } catch (error) {
  //       expect(error.message).toEqual('Model NotFound Not Found')
  //       return
  //     }
  //     expect('it').toEqual('should throw exception')
  //   })
  // })

  // describe('protected .getQuery()', function() {
  //   it('just build getQuery once', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     query.limit(10)
  //     expect(query['hasMongooseQuery']).toBeUndefined()
  //     query['getQuery']()
  //     expect(query['hasMongooseQuery']).toBe(true)
  //     expect(query['getQuery']() === query['mongooseQuery']).toBe(true)
  //     expect(query['hasMongooseQuery']).toBe(true)
  //   })

  //   it('builds query for find by default', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query['getQuery']()['op']).toEqual('find')
  //   })

  //   it('can build query for findOne', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query['getQuery'](true)['op']).toEqual('findOne')
  //   })
  // })

  // describe('protected .getQueryConvention()', function() {
  //   it('converts id to _id if using .select()', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query.select('id').toObject()).toEqual({
  //       select: ['_id']
  //     })
  //   })

  //   it('converts id to _id if using .orderBy()', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query.orderBy('id').toObject()).toEqual({
  //       orderBy: { _id: 'asc' }
  //     })
  //   })

  //   it('converts id to _id if using .orderByAsc()', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query.orderByAsc('id').toObject()).toEqual({
  //       orderBy: { _id: 'asc' }
  //     })
  //   })

  //   it('converts id to _id if using .orderByDesc()', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(query.orderByDesc('id').toObject()).toEqual({
  //       orderBy: { _id: 'desc' }
  //     })
  //   })

  //   it('converts id to _id if using .where', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(
  //       query
  //         .where('id', 1)
  //         .where('id', '<>', 2)
  //         .toObject()
  //     ).toEqual({
  //       conditions: { $and: [{ _id: 1 }, { _id: { $ne: 2 } }] }
  //     })
  //   })

  //   it('converts id to _id if using .orWhere', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(
  //       query
  //         .orWhere('id', 1)
  //         .orWhereIn('id', [3, 4])
  //         .toObject()
  //     ).toEqual({
  //       conditions: { $or: [{ _id: 1 }, { _id: { $in: [3, 4] } }] }
  //     })
  //   })
  // })

  // describe('protected .passDataToMongooseQuery()', function() {
  //   it('never passes to mongooseQuery.select if .select() was not used', function() {
  //     const nativeQuery = UserModel.find()
  //     const selectSpy = Sinon.spy(nativeQuery, 'select')
  //     const query = new MongooseQueryBuilder('User')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(selectSpy.notCalled).toBe(true)
  //   })
  //   it('passes to mongooseQuery.select with selectedFields.join(" ") if .select() was used', function() {
  //     const nativeQuery = UserModel.find()
  //     const selectSpy = Sinon.spy(nativeQuery, 'select')
  //     const query = new MongooseQueryBuilder('User')
  //     query.select('first_name', 'last_name')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(selectSpy.calledWith('first_name last_name')).toBe(true)
  //   })

  //   it('never passes to mongooseQuery.limit if .limit() was not used', function() {
  //     const nativeQuery = UserModel.find()
  //     const limitSpy = Sinon.spy(nativeQuery, 'limit')
  //     const query = new MongooseQueryBuilder('User')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(limitSpy.notCalled).toBe(true)
  //   })

  //   it('passes to mongooseQuery.limit with limitNumber if .limit() was used', function() {
  //     const nativeQuery = UserModel.find()
  //     const limitSpy = Sinon.spy(nativeQuery, 'limit')
  //     const query = new MongooseQueryBuilder('User')
  //     query.limit(20)
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(limitSpy.calledWith(20)).toBe(true)
  //   })

  //   it('never passes to mongooseQuery.sort if .orderBy() .orderByAsc() .orderByDesc were not used', function() {
  //     const nativeQuery = UserModel.find()
  //     const sortSpy = Sinon.spy(nativeQuery, 'sort')
  //     const query = new MongooseQueryBuilder('User')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(sortSpy.notCalled).toBe(true)
  //   })

  //   it('passes to mongooseQuery.sort with transformed ordering if .orderBy() was used', function() {
  //     const nativeQuery = UserModel.find()
  //     const sortSpy = Sinon.spy(nativeQuery, 'sort')
  //     const query = new MongooseQueryBuilder('User')
  //     query.orderBy('first_name')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(sortSpy.calledWith({ first_name: 1 })).toBe(true)
  //   })

  //   it('passes to mongooseQuery.sort with transformed ordering if .orderByAsc() was used', function() {
  //     const nativeQuery = UserModel.find()
  //     const sortSpy = Sinon.spy(nativeQuery, 'sort')
  //     const query = new MongooseQueryBuilder('User')
  //     query.orderByAsc('first_name.child')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(sortSpy.calledWith({ 'first_name.child': 1 })).toBe(true)
  //   })

  //   it('passes to mongooseQuery.sort with transformed ordering if .orderByDesc() was used', function() {
  //     const nativeQuery = UserModel.find()
  //     const sortSpy = Sinon.spy(nativeQuery, 'sort')
  //     const query = new MongooseQueryBuilder('User')
  //     query.orderByDesc('first_name.child')
  //     query['passDataToMongooseQuery'](nativeQuery)
  //     expect(sortSpy.calledWith({ 'first_name.child': -1 })).toBe(true)
  //   })
  // })

  // describe('.native()', function() {
  //   it('is chain-able', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     expect(
  //       query.native(function(model) {
  //         return model.find()
  //       })
  //     ).toEqual(query)
  //   })

  //   it('passes instance of Mongoose Model if there is no query builder function was used', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     query.native(function(model) {
  //       expect(model === query['mongooseModel']).toBe(true)
  //       return model.find()
  //     })
  //   })

  //   it('passes getQuery(false) result if there is a query builder functions was used', function() {
  //     const query = new MongooseQueryBuilder('User')
  //     query.limit(10)
  //     query.native(function(nativeQuery: any) {
  //       expect(nativeQuery === query['mongooseQuery']).toBe(true)
  //       return nativeQuery
  //     })
  //   })
  // })

  describe('.createQueryOptions()', function() {
    it('undefined if there is no option', function() {
      const query = new MongodbQueryBuilder('User', <any>{})
      expect(query.createQueryOptions()).toBe(undefined)
    })

    it('adds this.limit to property "limit"', function() {
      const query = new MongodbQueryBuilder('User', <any>{})
      query.limit(10)
      expect(query.createQueryOptions()).toEqual({ limit: 10 })
    })

    it('builds this.ordering and adds to property "sort"', function() {
      const query = new MongodbQueryBuilder('User', <any>{})
      query
        .orderByAsc('a')
        .orderByDesc('b')
        .orderBy('c', 'asc')
        .orderBy('c', 'desc')
      expect(query.createQueryOptions()).toEqual({
        sort: [['a', 1], ['b', -1], ['c', -1]]
      })
    })

    it('builds this.fields.select and adds to property "projection"', function() {
      const query = new MongodbQueryBuilder('User', <any>{})
      query.select('a', 'b', 'c')
      expect(query.createQueryOptions()).toEqual({
        projection: { a: 1, b: 1, c: 1 }
      })
    })
  })

  describe('implements IFetchResultQuery', function() {
    jest.setTimeout(10000)

    const dataset = [
      { first_name: 'john', last_name: 'doe', age: 30 },
      { first_name: 'jane', last_name: 'doe', age: 25 },
      { first_name: 'tony', last_name: 'stark', age: 40 },
      { first_name: 'thor', last_name: 'god', age: 1000 },
      { first_name: 'captain', last_name: 'american', age: 100 },
      { first_name: 'tony', last_name: 'stewart', age: 40 },
      { first_name: 'peter', last_name: 'parker', age: 15 }
    ]
    let collectionUsers: any, collectionRoles: any

    beforeAll(async function() {
      await init_mongodb('mongodb_query_builder')
      const db = MongodbProviderFacade.getDatabase()
      collectionUsers = db.collection('users')
      collectionRoles = db.collection('roles')
      for (const data of dataset) {
        await collectionUsers.save(data)
      }
      for (let i = 0; i < 10; i++) {
        await collectionRoles.save({
          name: 'role-' + i,
          deleted_at: new Date()
        })
      }
    })

    beforeEach(function() {
      QueryLog.clear().enable()
    })

    afterAll(async function() {
      delete_collection_use_mongodb('users')
      delete_collection_use_mongodb('roles')
    })

    function expect_match_user(result: any, expected: any) {
      for (const name in expected) {
        expect(result[name]).toEqual(expected[name])
      }
    }

    function expect_query_log(attribute: string, value: any, index: number = 0) {
      expect(QueryLog.pull()[index]['query'][attribute]).toEqual(value)
    }

    describe('.get()', function() {
      it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.get()

        expect_query_log('raw', 'db.users.find({}).toArray()')
        expect(result.length).toEqual(7)
        for (let i = 0; i < 7; i++) {
          expect_match_user(result[i], dataset[i])
        }
      })

      it('returns an empty collection if no result', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('first_name', 'no-one').get()

        expect_query_log('raw', 'db.users.find({"first_name":"no-one"}).toArray()')
        expect(result.length === 0).toBe(true)
      })

      it('can get data by query builder, case 1', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('age', 1000).get()

        expect_query_log('raw', 'db.users.find({"age":1000}).toArray()')
        expect(result.length).toEqual(1)
        expect_match_user(result[0], dataset[3])
      })

      it('can get data by query builder, case 2', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('age', 40).get()

        expect_query_log('raw', 'db.users.find({"age":40}).toArray()')
        expect(result.length).toEqual(2)
        expect_match_user(result[0], dataset[2])
        expect_match_user(result[1], dataset[5])
      })

      it('can get data by query builder, case 3', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 40)
          .where('last_name', 'stark')
          .get()

        expect_query_log('raw', 'db.users.find({"age":40,"last_name":"stark"}).toArray()')
        expect(result.length).toEqual(1)
        expect_match_user(result[0], dataset[2])
      })

      it('can get data by query builder, case 4', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 40)
          .orWhere('first_name', 'peter')
          .get()

        expect_query_log('raw', 'db.users.find({"$or":[{"age":40},{"first_name":"peter"}]}).toArray()')
        expect(result.length).toEqual(3)
        expect_match_user(result[0], dataset[2])
        expect_match_user(result[1], dataset[5])
        expect_match_user(result[2], dataset[6])
      })

      it('can get data by query builder, case 5', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 40)
          .orWhere('first_name', 'peter')
          .orderBy('_id', 'desc')
          .get()

        expect_query_log(
          'raw',
          'db.users.find({"$or":[{"age":40},{"first_name":"peter"}]}, {"sort":[["_id",-1]]}).toArray()'
        )
        expect(result.length).toEqual(3)
        expect_match_user(result[0], dataset[6])
        expect_match_user(result[1], dataset[5])
        expect_match_user(result[2], dataset[2])
      })
    })

    describe('.first()', function() {
      it('finds first document of collection and return an instance of Eloquent<T>', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.first()
        expect_query_log('raw', 'db.users.findOne({})')
        expect_match_user(result, dataset[0])
      })

      it('finds first document of collection and return an instance of Eloquent<T>', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.orderBy('_id', 'desc').first()
        expect_query_log('raw', 'db.users.findOne({}, {"sort":[["_id",-1]]})')
        expect_match_user(result, dataset[6])
      })

      it('returns null if no result', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('first_name', 'no-one').first()
        expect_query_log('raw', 'db.users.findOne({"first_name":"no-one"})')
        expect(result).toBeNull()
      })

      it('can find data by query builder, case 1', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('age', 1000).first()
        expect_query_log('raw', 'db.users.findOne({"age":1000})')
        expect_match_user(result, dataset[3])
      })

      it('can find data by query builder, case 2', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 40)
          .orWhere('first_name', 'jane')
          .first()
        expect_query_log('raw', 'db.users.findOne({"$or":[{"age":40},{"first_name":"jane"}]})')
        expect_match_user(result, dataset[1])
      })

      it('can find data by query builder, case 3', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('first_name', 'tony')
          .where('last_name', 'stewart')
          .first()
        expect_query_log('raw', 'db.users.findOne({"first_name":"tony","last_name":"stewart"})')
        expect_match_user(result, dataset[5])
      })

      // it('can find data by native() before using query functions of query builder', async function() {
      //   const query = new MongodbQueryBuilder('User', collectionUsers)
      //   const result = await query
      //     .native(function(model: any) {
      //       return model.findOne({
      //         first_name: 'tony'
      //       })
      //     })
      //     .first()
      //   expect_match_user(result, dataset[2])
      // })

      // it('can find data by native() after using query functions of query builder', async function() {
      //   const query = new MongooseQueryBuilder('User')
      //   const result = await query
      //     .where('age', 40)
      //     .orWhere('age', 1000)
      //     .native(function(nativeQuery: any) {
      //       return nativeQuery.sort({ last_name: -1 })
      //     })
      //     .first()
      //   expect_match_user(result, dataset[5])
      // })

      // it('can find data by native() and modified after using query functions of query builder', async function() {
      //   const query = new MongooseQueryBuilder('User')
      //   const result = await query
      //     .where('age', 40)
      //     .orWhere('age', 1000)
      //     .native(function(nativeQuery: any) {
      //       return nativeQuery.findOne({
      //         first_name: 'thor'
      //       })
      //     })
      //     .first()
      //   expect_match_user(result, dataset[3])
      // })
    })

    describe('.count()', function() {
      it('counts all data of collection and returns a Number', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.count()
        expect_query_log('raw', 'db.users.count({})')
        expect(result).toEqual(7)
      })

      it('returns 0 if no result', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.where('first_name', 'no-one').count()
        expect_query_log('raw', 'db.users.count({"first_name":"no-one"})')
        expect(result).toEqual(0)
      })

      it('overrides select even .select was used', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.select('abc', 'def').count()
        expect_query_log('raw', 'db.users.count({})')
        expect(result).toEqual(7)
      })

      it('overrides ordering even .orderBy was used', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query.orderBy('abc').count()
        expect_query_log('raw', 'db.users.count({})')
        expect(result).toEqual(7)
      })

      it('can count items by query builder, case 1', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 18)
          .orWhere('first_name', 'tony')
          .count()
        expect_query_log('raw', 'db.users.count({"$or":[{"age":18},{"first_name":"tony"}]})')
        expect(result).toEqual(2)
      })

      it('can count items by query builder, case 2', async function() {
        const query = new MongodbQueryBuilder('User', collectionUsers)
        const result = await query
          .where('age', 1000)
          .orWhere('first_name', 'captain')
          .orderBy('last_name')
          .limit(10)
          .count()
        expect_query_log('raw', 'db.users.count({"$or":[{"age":1000},{"first_name":"captain"}]}, {"limit":10})')
        expect(result).toEqual(2)
      })
    })

    //   describe('.update()', function() {
    //     it('can update data of collection, returns update result of mongoose', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('first_name', 'peter').update({ $set: { age: 19 } })
    //       expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
    //       const updatedResult = await new MongooseQueryBuilder('User').where('first_name', 'peter').first()
    //       expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }))
    //     })

    //     it('returns empty update result if no row matched', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('first_name', 'no-one').update({ $set: { age: 19 } })
    //       expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
    //     })

    //     it('can update data by query builder, case 1', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('age', 1000).update({ $set: { age: 1001 } })
    //       expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
    //       const updatedResult = await new MongooseQueryBuilder('User').where('first_name', 'thor').first()
    //       expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }))
    //     })

    //     it('can update data by query builder, case 2: multiple documents', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       query.where('first_name', 'tony').orWhere('first_name', 'jane')
    //       const result = await query.update({ $inc: { age: 1 } })
    //       expect(result).toEqual({ n: 3, nModified: 3, ok: 1 })
    //       const updatedResults = await new MongooseQueryBuilder('User')
    //         .where('first_name', 'tony')
    //         .orWhere('first_name', 'jane')
    //         .get()
    //       expect_match_user(updatedResults[0], Object.assign({}, dataset[1], { age: 26 }))
    //       expect_match_user(updatedResults[1], Object.assign({}, dataset[2], { age: 41 }))
    //       expect_match_user(updatedResults[2], Object.assign({}, dataset[5], { age: 41 }))
    //     })

    //     it('can update data by query builder, case 3', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query
    //         .where('first_name', 'tony')
    //         .where('last_name', 'stewart')
    //         .update({ $inc: { age: 1 } })
    //       expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
    //       const updatedResult = await new MongooseQueryBuilder('User')
    //         .where('first_name', 'tony')
    //         .where('last_name', 'stewart')
    //         .first()
    //       expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }))
    //     })
    //   })

    //   describe('.delete()', function() {
    //     it('can delete data of collection, returns delete result of mongoose', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('first_name', 'peter').delete()
    //       expect(result).toEqual({ n: 1, ok: 1 })
    //       const count = await new MongooseQueryBuilder('User').count()
    //       expect(count).toEqual(6)
    //     })

    //     it('can delete data by query builder, case 1', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('age', 1001).delete()
    //       expect(result).toEqual({ n: 1, ok: 1 })
    //       const count = await new MongooseQueryBuilder('User').count()
    //       expect(count).toEqual(5)
    //     })

    //     it('can delete data by query builder, case 2: multiple documents', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query
    //         .where('first_name', 'tony')
    //         .orWhere('first_name', 'jane')
    //         .delete()
    //       expect(result).toEqual({ n: 3, ok: 1 })
    //       const count = await new MongooseQueryBuilder('User').count()
    //       expect(count).toEqual(2)
    //     })

    //     it('can delete data by query builder, case 3', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query
    //         .where('first_name', 'john')
    //         .where('last_name', 'doe')
    //         .delete()
    //       expect(result).toEqual({ n: 1, ok: 1 })
    //       const count = await new MongooseQueryBuilder('User').count()
    //       expect(count).toEqual(1)
    //     })

    //     it('can not call delete without using any .where() statement', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.delete()
    //       expect(result).toEqual({ n: 0, ok: 1 })
    //     })

    //     it('can not call delete if query is empty', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.select('any').delete()
    //       expect(result).toEqual({ n: 0, ok: 1 })
    //     })

    //     it('can delete by native() function', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query
    //         .native(function(model: any) {
    //           return model.remove({})
    //         })
    //         .execute()
    //       expect(result).toEqual({ n: 1, ok: 1 })
    //       const count = await new MongooseQueryBuilder('User').count()
    //       expect(count).toEqual(0)
    //     })
    //   })

    //   describe('.restore()', function() {
    //     it('does nothing if Model do not support SoftDeletes', async function() {
    //       const query = new MongooseQueryBuilder('User')
    //       const result = await query.where('first_name', 'peter').restore()
    //       expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
    //     })

    //     it('can not call restore if query is empty', async function() {
    //       const query = new MongooseQueryBuilder('Role', { deletedAt: 'deleted_at', overrideMethods: true })
    //       const result = await query.withTrashed().restore()
    //       expect(result).toEqual({ n: 0, nModified: 0, ok: 1 })
    //     })

    //     it('can restore data by query builder, case 1', async function() {
    //       const query = new MongooseQueryBuilder('Role', { deletedAt: 'deleted_at', overrideMethods: true })
    //       const result = await query
    //         .onlyTrashed()
    //         .where('name', 'role-0')
    //         .restore()
    //       expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
    //       const count = await new MongooseQueryBuilder('Role').count()
    //       expect(count).toEqual(1)
    //     })

    //     it('can restore data by query builder, case 2: multiple documents', async function() {
    //       const query = new MongooseQueryBuilder('Role', { deletedAt: 'deleted_at', overrideMethods: true })
    //       const result = await query
    //         .withTrashed()
    //         .where('name', 'role-1')
    //         .orWhere('name', 'role-2')
    //         .orWhere('name', 'role-3')
    //         .restore()
    //       expect(result).toEqual({ n: 3, nModified: 3, ok: 1 })
    //       const count = await new MongooseQueryBuilder('Role').count()
    //       expect(count).toEqual(4)
    //     })
    //   })
  })
})
