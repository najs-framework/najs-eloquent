import { NotFoundError } from '../../../dist/lib/errors/NotFoundError'
import { QueryLog, factory } from '../../../dist/lib'
import { User, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent (1st way) querying', function () {
  beforeAll(async function () {
    await init_mongoose('integration_eloquent_query')
  })

  afterEach(async function () {
    await delete_collection(['users'])
  })

  const userModel = new User()

  describe('.queryName()', function () {
    it('starts new query with given name.', async function () {
      const query = userModel.queryName('You can name the query what ever you want')
      expect(query['queryBuilder']['name']).toEqual('You can name the query what ever you want')

      QueryLog.enable()
      await query.where('email', 'test').get()
      const log = QueryLog.pull()
      expect(log[0].query['name']).toEqual('You can name the query what ever you want')
      QueryLog.disable()
    })
  })

  describe('.select()', function () {
    it('set the columns or fields to be selected.', async function () {
      await factory(User).create()
      const users = await userModel.select('email', 'password').get()
      for (const user of users) {
        const result = user.toObject()
        expect(result['first_name']).toBeUndefined()
        expect(result['last_name']).toBeUndefined()
      }
    })
  })

  describe('.orderBy()', function () {
    it('adds an "order by" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderBy('age').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await userModel.orderBy('age', 'desc').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function () {
    it('adds an "order by" clause to the query with direction ASC.', async function () {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderByAsc('age').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await userModel.orderByAsc('first_name').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel.orderByDesc('age').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await userModel.orderByDesc('first_name').get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(User).create({ age: 50, first_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c' })
      expect(
        (await userModel
          .orderByDesc('age')
          .limit(2)
          .get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await userModel
          .orderByDesc('first_name')
          .limit(1)
          .get())
          .map(function (user) {
            return user.first_name
          })
          .toArray()
      ).toEqual(['c'])
    })
  })

  describe('.where()', function () {
    it('adds a basic where clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 10)
        .where(function (query) {
          return query.where('first_name', 'a').orWhere('first_name', 'b')
        })
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function () {
    it('adds an "or where" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', 40)
        .orWhere(function (query) {
          return query.where('first_name', 'a').orWhere('first_name', 'b')
        })
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.andWhere()', function () {
    it('add an "and where" clause to query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 35)
        .andWhere('first_name', 'a')
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a' })
    })
  })

  describe('.whereIn()', function () {
    it('adds a "where in" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereIn('age', [30, 40]).pluck('first_name', 'age')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function () {
    it('adds an "or where in" clause to the query.', async function () {
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

  describe('.andWhereIn()', function () {
    it('adds an " and where in" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 20)
        .andWhereIn('first_name', ['a', 'c'])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.whereNotIn()', function () {
    it('adds a "where not in" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereNotIn('age', [30, 40]).pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a' })
    })
  })

  describe('.orWhereNotIn()', function () {
    it('adds an "or where not in" clause to the query.', async function () {
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

  describe('.andWhereNotIn()', function () {
    it('adds an "and where not in" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 25)
        .andWhereNotIn('first_name', ['a', 'c'])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNull()', function () {
    it('adds a "where null" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.whereNull('age').pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.orWhereNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel
        .where('first_name', 'a')
        .orWhereNull('age')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a', b: 'b' })
    })
  })

  describe('.andWhereNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel
        .whereIn('first_name', ['a', 'b'])
        .andWhereNull('age')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function () {
    it('adds a "where not null" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.whereNotNull('age').pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
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

  describe('.andWhereNotNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      // tslint:disable-next-line
      await factory(User).create({ age: null, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel
        .whereIn('first_name', ['a', 'b'])
        .andWhereNotNull('age')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a' })
    })
  })

  describe('.whereBetween()', function () {
    it('adds a "where between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereBetween('age', [35, 50]).pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhereBetween()', function () {
    it('adds an "or where between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('first_name', 'c')
        .orWhereBetween('age', [45, 50])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.andWhereBetween()', function () {
    it('adds an "and where between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .whereIn('first_name', ['a', 'b'])
        .andWhereBetween('age', [35, 45])
        .pluck('first_name', 'age')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNot()', function () {
    it('adds a "where not" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereNot('first_name', 'a').pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.orWhereNot()', function () {
    it('adds an "or where not" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('last_name', 'b')
        .orWhereNot('first_name', 'a')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNot()', function () {
    it('adds an "and where not" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('age', '>', 35)
        .andWhereNot('first_name', 'a')
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotBetween()', function () {
    it('adds a "where not between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.whereNotBetween('age', [45, 55]).pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.orWhereNotBetween()', function () {
    it('adds an "or where not between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .where('first_name', 'b')
        .orWhereNotBetween('age', [45, 55])
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNotBetween()', function () {
    it('adds an "and where not between" clause to the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel
        .whereIn('first_name', ['a', 'b'])
        .andWhereNotBetween('age', [45, 55])
        .pluck('first_name', 'last_name')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.execute()', function () {
    it('can execute clause and return an array', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      const result = await userModel.where('age', '>', 35).execute()
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toEqual(2)
    })
  })

  describe('.getPrimaryKeyName()', function () {
    it('retrieves the "get primary key name" result of the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('age', '<', 40).getPrimaryKeyName()
      expect(result).toEqual('_id')
    })
  })

  describe('.withTrashed()', function () {
    it('considers all soft-deleted or not-deleted items.', async function () {
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

  describe('.onlyTrashed()', function () {
    it('considers soft-deleted items only.', async function () {
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

  describe('.all()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = (await userModel.all()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = (await userModel.get()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function () {
    it('executes the query and return an instance of Model', async function () {
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

    it('executes the query and return an instance of Model', async function () {
      await factory(User).create<User>({ age: 50, first_name: 'a', last_name: 'a' })
      const userB = await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = ((await userModel.first(userB.id)) as User).toObject()
      expect(result['first_name']).toEqual('b')
    })
  })

  describe('.find()', function () {
    it('executes the query and return an instance of Model', async function () {
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

    it('executes the query and return an instance of Model', async function () {
      await factory(User).create<User>({ age: 50, first_name: 'a', last_name: 'a' })
      const userB = await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = ((await userModel.find(userB.id)) as User).toObject()
      expect(result['first_name']).toEqual('b')
    })
  })

  describe('.count()', function () {
    it('retrieves the "count" result of the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('age', '<', 40).count()
      expect(result).toEqual(1)
    })
  })

  describe('.delete()', function () {
    it('can delete an item', async function () {
      const a = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      await a.delete()
      const result = await userModel.onlyTrashed().pluck('first_name', 'last_name')
      expect(result).toEqual({ a: 'a' })
    })

    // TODO: it don't soft-delete multiple items, waiting for check
    // it('can delete multiple items', async function () {
    //   await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
    //   await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
    //   await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
    //   await userModel.where('view', '>', 35).delete
    //   const result = await userModel.onlyTrashed().pluck('first_name', 'last_name')
    //   expect(result).toEqual({ a: 'a', b: 'b' })
    // })
  })

  describe('.restore()', function () {
    it('can restore a soft-deleted item', async function () {
      const a = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      await a.delete()
      await a.restore()
      const result = (await userModel.get()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })

    it('can restore multiple soft-deleted items', async function () {
      const a = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      const b = await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      await a.delete()
      await b.delete()
      await userModel.onlyTrashed().whereIn('first_name', ['a', 'b']).restore()
      const result = (await userModel.get()).pluck('first_name', 'last_name').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.update()', function () {
    it('retrieves the "update" result of the query.', async function () {
      await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      await userModel.where('age', '>', 35).update({ age: 60, first_name: 'updated' })
      const resultFirstNameUpdated = (await userModel.get()).pluck('first_name', 'last_name').all()
      const resultAgeUpdated = (await userModel.get()).pluck('age', 'last_name').all()
      expect(resultFirstNameUpdated).toEqual({ a: 'updated', b: 'updated', c: 'c' })
      expect(resultAgeUpdated).toEqual({ a: 60, b: 60, c: 30 })
    })
  })

  describe('.findOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const userA = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('age', '>', 35).findOrFail(userA.id)
      if (result) {
        expect(result.first_name).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const userA = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      try {
        await userModel.where('age', '<', 45).findOrFail(userA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('User')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.firstOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const userA = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('age', '>', 35).firstOrFail(userA.id)
      if (result) {
        expect(result.first_name).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const userA = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })
      try {
        await userModel.where('age', '<', 45).firstOrFail(userA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('User')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.findById()', function () {
    it('executes the query and return a Collection', async function () {
      const userA = await factory(User).create({ age: 50, first_name: 'a', last_name: 'a' })
      await factory(User).create({ age: 40, first_name: 'b', last_name: 'b' })
      await factory(User).create({ age: 30, first_name: 'c', last_name: 'c' })

      const result = await userModel.where('view', '>', 35).findById(userA.id)
      if (result) {
        expect(result.first_name).toEqual('a')
      }
    })
  })
})
