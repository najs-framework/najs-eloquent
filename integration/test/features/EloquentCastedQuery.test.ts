import { QueryLog, factory } from '../../../dist/lib'
import { Comment, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent Casted (3rd way) querying', function() {
  beforeAll(async function() {
    await init_mongoose('integration_eloquent_casted_query')
  })

  afterEach(async function() {
    await delete_collection(['comments'])
  })

  const commentModel = new Comment()

  describe('.queryName()', function() {
    it('starts new query with given name.', async function() {
      const query = commentModel.queryName('You can name the query what ever you want')
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
      await factory(Comment).create()
      const comments = await commentModel.select('content', 'like').get()
      for (const comment of comments) {
        const result = comment.toObject()
        expect(result['name']).toBeUndefined()
        expect(result['email']).toBeUndefined()
      }
    })
  })

  describe('.orderBy()', function() {
    it('adds an "order by" clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderBy('like').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await commentModel.orderBy('like', 'desc').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function() {
    it('adds an "order by" clause to the query with direction ASC.', async function() {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderByAsc('like').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await commentModel.orderByAsc('name').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel.orderByDesc('like').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await commentModel.orderByDesc('name').get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(Comment).create({ like: 50, name: 'a' })
      await factory(Comment).create({ like: 40, name: 'b' })
      await factory(Comment).create({ like: 30, name: 'c' })
      expect(
        (await commentModel
          .orderByDesc('like')
          .limit(2)
          .get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await commentModel
          .orderByDesc('name')
          .limit(1)
          .get())
          .map(function(comment) {
            return comment.name
          })
          .toArray()
      ).toEqual(['c'])
    })
  })

  describe('.where()', function() {
    it('adds a basic where clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', '>', 10)
        .where(function(query) {
          return query.where('name', 'a').orWhere('name', 'b')
        })
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function() {
    it('adds an "or where" clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel
        .where('like', 40)
        .orWhere(function(query) {
          return query.where('name', 'a').orWhere('name', 'b')
        })
        .pluck('name', 'like')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.whereIn()', function() {
    it('adds a "where in" clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })
      const result = await commentModel.whereIn('like', [30, 40]).pluck('name', 'like')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function() {
    it('adds an "or where in" clause to the query.', async function() {
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

  describe('.orWhereNotIn()', function() {
    it('adds an "or where not in" clause to the query.', async function() {
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

  describe('.whereNull()', function() {
    it('adds a "where null" clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.whereNull('like').pluck('name', 'email')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function() {
    it('adds a "where not null" clause to the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      // tslint:disable-next-line
      await factory(Comment).create({ like: null, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.whereNotNull('like').pluck('name', 'email')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function() {
    it('adds an "or where null" clause to the query.', async function() {
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

  describe('.withTrashed()', function() {
    it('considers all soft-deleted or not-deleted items.', async function() {
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

  describe('.onlyTrashed()', function() {
    it('considers soft-deleted items only.', async function() {
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

  describe('.all()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = (await commentModel.all()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = (await commentModel.get()).pluck('name', 'email').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const user = await commentModel
        .where('like', '>', 30)
        .orderBy('like')
        .first()
      const result = user ? user.toObject() : {}
      expect(result['name']).toEqual('b')
    })
  })

  describe('.count()', function() {
    it('retrieves the "count" result of the query.', async function() {
      await factory(Comment).create({ like: 50, name: 'a', email: 'a' })
      await factory(Comment).create({ like: 40, name: 'b', email: 'b' })
      await factory(Comment).create({ like: 30, name: 'c', email: 'c' })

      const result = await commentModel.where('like', '<', 40).count()
      expect(result).toEqual(1)
    })
  })
})
