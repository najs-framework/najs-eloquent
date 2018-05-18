import { NotFoundError } from '../../../dist/lib/errors/NotFoundError'
import { QueryLog, factory } from '../../../dist/lib'
import { Comment, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent Casted (3rd way) querying', function () {
  beforeAll(async function () {
    await init_mongoose('integration_eloquent_casted_query')
  })

  afterEach(async function () {
    await delete_collection(['comments'])
  })

  const commentModel = new Comment()

  describe('.queryName()', function () {
    it('starts new query with given name.', async function () {
      const query = commentModel.queryName('You can name the query what ever you want')
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
      await factory(Comment).create()
      const comments = await commentModel.select('content', 'like').get()
      for (const comment of comments) {
        const result = comment.toObject()
        expect(result['name']).toBeUndefined()
        expect(result['email']).toBeUndefined()
      }
    })
  })

  describe('.orderBy()', function () {
    it('adds an "order by" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderBy('like').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await commentModel.orderBy('like', 'desc').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function () {
    it('adds an "order by" clause to the query with direction ASC.', async function () {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderByAsc('like').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await commentModel.orderByAsc('name').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderByDesc('like').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await commentModel.orderByDesc('name').get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel
          .orderByDesc('like')
          .limit(2)
          .get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await commentModel
          .orderByDesc('name')
          .limit(1)
          .get())
          .map(function (comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c'])
    })
  })

  describe('.where()', function () {
    it('adds a basic where clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 10)
        .where(function (query) {
          return query.where('name', 'a').orWhere('name', 'b')
        })
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function () {
    it('adds an "or where" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', 40)
        .orWhere(function (query) {
          return query.where('name', 'a').orWhere('name', 'b')
        })
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.andWhere()', function () {
    it('add an "and where" clause to query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 35)
        .andWhere('name', 'a')
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a' })
    })
  })

  describe('.whereIn()', function () {
    it('adds a "where in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereIn('like', [30, 40]).pluck('name', 'like')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function () {
    it('adds an "or where in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', 30)
        .orWhereIn('like', [40])
        .pluck('name', 'like')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.andWhereIn()', function () {
    it('adds an " and where in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 20)
        .andWhereIn('name', ['a', 'c'])
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.whereNotIn()', function () {
    it('adds a "where not in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereNotIn('like', [30, 40]).pluck('name', 'like')
      expect(result).toEqual({ 50: 'a' })
    })
  })

  describe('.orWhereNotIn()', function () {
    it('adds an "or where not in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', 30)
        .orWhereNotIn('like', [40])
        .pluck('name', 'like')
      expect(result).toEqual({ 30: 'c', 50: 'a' })
    })
  })

  describe('.andWhereNotIn()', function () {
    it('adds an "and where not in" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 25)
        .andWhereNotIn('name', ['a', 'c'])
        .pluck('name', 'like')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNull()', function () {
    it('adds a "where null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.whereNull('like').pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.orWhereNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel
        .where('name', 'a')
        .orWhereNull('like')
        .pluck('name', 'email')
      expect(result).toEqual({ a: 'a', b: 'b' })
    })
  })

  describe('.andWhereNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel
        .whereIn('name', ['a', 'b'])
        .andWhereNull('like')
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function () {
    it('adds a "where not null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.whereNotNull('like').pluck('name', 'email')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel
        .where('like', 50)
        .orWhereNotNull('like')
        .pluck('name', 'email')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.andWhereNotNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel
        .whereIn('name', ['a', 'b'])
        .andWhereNotNull('like')
        .pluck('name', 'email')
      expect(result).toEqual({ a: 'a' })
    })
  })

  describe('.whereBetween()', function () {
    it('adds a "where between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereBetween('like', [35, 50]).pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhereBetween()', function () {
    it('adds an "or where between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('name', 'c')
        .orWhereBetween('like', [45, 50])
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.andWhereBetween()', function () {
    it('adds an "and where between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .whereIn('name', ['a', 'b'])
        .andWhereBetween('like', [35, 45])
        .pluck('name', 'like')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNot()', function () {
    it('adds a "where not" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereNot('name', 'a').pluck('name', 'email')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.orWhereNot()', function () {
    it('adds an "or where not" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('email', 'b')
        .orWhereNot('name', 'a')
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNot()', function () {
    it('adds an "and where not" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 35)
        .andWhereNot('name', 'a')
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotBetween()', function () {
    it('adds a "where not between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereNotBetween('like', [45, 55]).pluck('name', 'email')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.orWhereNotBetween()', function () {
    it('adds an "or where not between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('email', 'b')
        .orWhereNotBetween('like', [45, 55])
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNotBetween()', function () {
    it('adds an "and where not between" clause to the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .whereIn('name', ['a', 'b'])
        .andWhereNotBetween('like', [45, 55])
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.execute()', function () {
    it('can execute clause and return an array', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.where('like', '>', 35).execute()
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toEqual(2)
    })
  })

  describe('.getPrimaryKeyName()', function () {
    it('retrieves the "get primary key name" result of the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '<', 40).getPrimaryKeyName()
      expect(result).toEqual('_id')
    })
  })

  describe('.withTrashed()', function () {
    it('considers all soft-deleted or not-deleted items.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      const b = await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await ((await commentModel.findOrFail(b.id)) as Comment).delete()

      const result = await commentModel
        .withTrashed()
        .where('like', '>', 0)
        .pluck('name', 'email')
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.onlyTrashed()', function () {
    it('considers soft-deleted items only.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      const b = await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      const c = await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await (await commentModel.findOrFail(b.id)).delete()
      await (await commentModel.findOrFail(c.id)).delete()

      const result = await commentModel
        .onlyTrashed()
        .where('like', '>', 30)
        .pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.all()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = (await commentModel.all()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = (await commentModel.get()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const comment = await commentModel
        .where('like', '>', 30)
        .orderBy('like')
        .first()
      const result = comment ? comment.toObject() : {}
      expect(result['name']).toEqual('b')
    })
  })

  describe('.firstOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const commentA = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '>', 35).firstOrFail(commentA.id)
      if (result) {
        expect(result.name).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const commentA = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      try {
        await commentModel.where('like', '<', 45).firstOrFail(commentA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('Comment')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.count()', function () {
    it('retrieves the "count" result of the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '<', 40).count()
      expect(result).toEqual(1)
    })
  })

  describe('.find()', function () {
    it('executes the query and return an instance of Model', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const comment = await commentModel
        .where('like', '>', 30)
        .orderBy('like')
        .find()
      const result = comment ? comment.toObject() : {}
      expect(result['name']).toEqual('b')
    })

    it('executes the query and return an instance of Model', async function () {
      await factory(Comment).create<Comment>({ like: 50, name: 'a', email: 'a' })
      const commentB = await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = ((await commentModel.find(commentB.id)) as Comment).toObject()
      expect(result['name']).toEqual('b')
    })
  })

  describe('.findOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const commentA = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '>', 35).findOrFail(commentA.id)
      if (result) {
        expect(result.name).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const commentA = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      try {
        await commentModel.where('like', '<', 45).findOrFail(commentA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('Comment')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.findById()', function () {
    it('executes the query and return a Collection', async function () {
      const commentA = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '>', 35).findById(commentA.id)
      if (result) {
        expect(result.name).toEqual('a')
      }
    })
  })

  describe('.delete()', function () {
    it('can delete an item', async function () {
      const a = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await a.delete()
      const result = await commentModel.onlyTrashed().pluck('name', 'email')
      expect(result).toEqual({ a: 'a' })
    })

    // TODO: it don't soft-delete multiple items, waiting for check
    // it('can delete multiple items', async function () {
    //   await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
    //   await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
    //   await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
    //   await commentModel.where('like', '>', 35).delete()
    //   const result = await commentModel.onlyTrashed().pluck('name', 'email')
    //   expect(result).toEqual({ a: 'a', b: 'b' })
    // })
  })

  describe('.restore()', function () {
    it('can restore a soft-deleted item', async function () {
      const a = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await a.delete()
      await a.restore()
      const result = (await commentModel.get()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })

    it('can restore multiple soft-deleted items', async function () {
      const a = await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      const b = await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await a.delete()
      await b.delete()
      await commentModel.onlyTrashed().whereIn('name', ['a', 'b']).restore()
      const result = (await commentModel.get()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.update()', function () {
    it('retrieves the "update" result of the query.', async function () {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      await commentModel.where('like', '>', 35).update({ like: 60, name: 'updated' })
      const resultNameUpdated = (await commentModel.get()).pluck('name', 'email').all()
      const resultLikeUpdated = (await commentModel.get()).pluck('like', 'email').all()
      expect(resultNameUpdated).toEqual({ a: 'updated', b: 'updated', c: 'c' })
      expect(resultLikeUpdated).toEqual({ a: 60, b: 60, c: 30 })
    })
  })
})
