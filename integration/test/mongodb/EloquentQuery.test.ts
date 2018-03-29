import { QueryLog, factory } from '../../../dist/lib/v1'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent functions', function() {
  beforeAll(async function() {
    await init_mongoose('integration_eloquent_query')
  })

  afterEach(async function() {
    await delete_collection(['users'])
  })

  const userModel = new User()

  describe('.queryName()', function() {
    it('starts new query with given name.', async function() {
      const query = userModel.queryName('You can name the query what ever you want')
      expect(query['name']).toEqual('You can name the query what ever you want')

      QueryLog.enable()
      await query.where('email', 'test').get()
      const log = QueryLog.pull()
      expect(log[0].query['name']).toEqual('You can name the query what ever you want')
      QueryLog.disable()
    })
  })

  describe('.select()', function() {
    it('set the columns or fields to be selected.', async function() {
      await factory(User).create()
      const users = await userModel.select('email', 'password').get()
      for (const user of users) {
        const result = user.toObject()
        expect(result['first_name']).toBeUndefined()
        expect(result['last_name']).toBeUndefined()
      }
    })
  })

  // describe('.distinct()', function() {
  //   it('sets the columns or fields to be applied distinct operation.', async function() {
  //     await factory(User)
  //       .times(2)
  //       .create({ age: 20 })

  //     QueryLog.enable()
  //     const users = await userModel
  //       .distinct('age')
  //       .where('age', 20)
  //       .all()

  //     console.log(QueryLog.pull())
  //     QueryLog.disable()
  //     console.log(users)

  //     for (const user of users) {
  //       const result = user.toObject()
  //       console.log(result)
  //     }
  //   })
  // })

  describe('.orderBy()', function() {
    it('adds an "order by" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderBy('age').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await userModel.orderBy('age', 'DESC').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function() {
    it('adds an "order by" clause to the query with direction ASC.', async function() {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderByAsc('age').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await userModel.orderByAsc('first_name').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderByDesc('age').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await userModel.orderByDesc('first_name').get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel
          .orderByDesc('age')
          .limit(2)
          .get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await userModel
          .orderByDesc('first_name')
          .limit(1)
          .get())
          .map(function(user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c'])
    })
  })
})
