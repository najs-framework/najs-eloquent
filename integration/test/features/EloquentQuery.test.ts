import { QueryLog, factory } from '../../../dist/lib'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent (1st way) querying', function() {
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
      expect(query['queryBuilder']['name']).toEqual('You can name the query what ever you want')

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
        (await userModel.orderBy('age', 'desc').get())
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

  describe('.where()', function() {
    it('adds a basic where clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 10)
        .where(function(query) {
          return query.where('first_name', 'a').orWhere('first_name', 'b')
        })
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function() {
    it('adds an "or where" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', 40)
        .orWhere(function(query) {
          return query.where('first_name', 'a').orWhere('first_name', 'b')
        })
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.whereIn()', function() {
    it('adds a "where in" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereIn('age', [30, 40]).pluck('first_name', 'age')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function() {
    it('adds an "or where in" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', 30)
        .orWhereIn('age', [40])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereNotIn()', function() {
    it('adds an "or where not in" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', 30)
        .orWhereNotIn('age', [40])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 30: 'c', 50: 'a' })
    })
  })

  describe('.whereNull()', function() {
    it('adds a "where null" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.whereNull('age').pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function() {
    it('adds a "where not null" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.whereNotNull('age').pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function() {
    it('adds an "or where null" clause to the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel
        .where('age', 50)
        .orWhereNotNull('age')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.withTrashed()', function() {
    it('considers all soft-deleted or not-deleted items.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const user = await userModel.where('age', 40).first()
      if (user) {
        await user.delete()
      }

      const result = await userModel
        .withTrashed()
        .where('age', '>', 0)
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.onlyTrashed()', function() {
    it('considers soft-deleted items only.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const userTwo = await userModel.where('age', 40).first()
      if (userTwo) {
        await userTwo.delete()
      }
      const userThree = await userModel.where('age', 30).first()
      if (userThree) {
        await userThree.delete()
      }

      const result = await userModel
        .onlyTrashed()
        .where('age', '>', 30)
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.all()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = (await userModel.all()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = (await userModel.get()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function() {
    it('executes the query and return an instance of Model', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const user = await userModel
        .where('age', '>', 30)
        .orderBy('age')
        .first()
      const result = user ? user.toObject() : {}
      expect(result['first_name']).toEqual('b')
    })

    it('executes the query and return an instance of Model', async function() {
      await factory(User).create<User>({ age: 50, first_name: 'a', last_name: 'a' })
      const userB = await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = ((await userModel.first(userB.id)) as User).toObject()
      expect(result['first_name']).toEqual('b')
    })
  })

  describe('.find()', function() {
    it('executes the query and return an instance of Model', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const user = await userModel
        .where('age', '>', 30)
        .orderBy('age')
        .find()
      const result = user ? user.toObject() : {}
      expect(result['first_name']).toEqual('b')
    })

    it('executes the query and return an instance of Model', async function() {
      await factory(User).create<User>({ age: 50, first_name: 'a', last_name: 'a' })
      const userB = await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = ((await userModel.find(userB.id)) as User).toObject()
      expect(result['first_name']).toEqual('b')
    })
  })

  describe('.count()', function() {
    it('retrieves the "count" result of the query.', async function() {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('age', '<', 40).count()
      expect(result).toEqual(1)
    })
  })
})
