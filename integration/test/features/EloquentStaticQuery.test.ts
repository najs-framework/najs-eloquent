import { NotFoundError } from '../../../dist/lib/errors/NotFoundError'
import { QueryLog, factory } from '../../../dist/lib'
import { Post, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent Static (2nd way) querying', function () {
  beforeAll(async function () {
    await init_mongoose('integration_eloquent_static_query')
  })

  afterEach(async function () {
    await delete_collection(['posts'])
  })

  describe('.queryName()', function () {
    it('starts new query with given name.', async function () {
      const query = Post.queryName('You can name the query what ever you want')
      expect(query['queryBuilder']['name']).toEqual('You can name the query what ever you want')

      QueryLog.enable()
      await query.where('title', 'test').get()
      const log = QueryLog.pull()
      expect(log[0].query['name']).toEqual('You can name the query what ever you want')
      QueryLog.disable()
    })
  })

  describe('.select()', function () {
    it('set the columns or fields to be selected.', async function () {
      await factory(Post).create()
      const posts = await Post.select('title', 'content').get()
      posts.each(function (post: Post) {
        const result = post.toObject()
        expect(result['user_id']).toBeUndefined()
        expect(result['view']).toBeUndefined()
      })
    })
  })

  describe('.orderBy()', function () {
    it('adds an "order by" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderBy('view').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await Post.orderBy('view', 'desc').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function () {
    it('adds an "order by" clause to the query with direction ASC.', async function () {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByAsc('view').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await Post.orderByAsc('title').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByDesc('view').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await Post.orderByDesc('title').get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function () {
    it('adds an "order by" clause to the query with direction DESC.', async function () {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByDesc('view')
          .limit(2)
          .get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await Post.orderByDesc('title')
          .limit(1)
          .get())
          .map(function (post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c'])
    })
  })

  describe('.execute()', function () {
    it('can execute clause and return an array', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 35).execute()
      expect(result).toBeInstanceOf(Array)
      expect(result.length).toEqual(2)
    })
  })

  describe('.where()', function () {
    it('adds a basic where clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 10)
        .where(function (query) {
          return query.where('title', 'a').orWhere('title', 'b')
        })
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function () {
    it('adds an "or where" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 40)
        .orWhere(function (query) {
          return query.where('title', 'a').orWhere('title', 'b')
        })
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.whereIn()', function () {
    it('adds a "where in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereIn('view', [30, 40]).pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function () {
    it('adds an "or where in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 30)
        .orWhereIn('view', [40])
        .pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.andWhereIn()', function () {
    it('adds an " and where in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 20)
        .andWhereIn('title', ['a', 'c'])
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.whereNotIn()', function () {
    it('adds a "where not in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereNotIn('view', [30, 40]).pluck('title', 'view')
      expect(result).toEqual({ 50: 'a' })
    })
  })

  describe('.orWhereNotIn()', function () {
    it('adds an "or where not in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 30)
        .orWhereNotIn('view', [40])
        .pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 50: 'a' })
    })
  })

  describe('.andWhereNotIn()', function () {
    it('adds an "and where not in" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 25)
        .andWhereNotIn('title', ['a', 'c'])
        .pluck('title', 'view')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNull()', function () {
    it('adds a "where null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereNull('view').pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.orWhereNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('title', 'a')
        .orWhereNull('view')
        .pluck('title', 'content')
      expect(result).toEqual({ a: 'a', b: 'b' })
    })
  })

  describe('.andWhereNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereIn('title', ['a', 'b'])
        .andWhereNull('view')
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function () {
    it('adds a "where not null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereNotNull('view').pluck('title', 'content')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function () {
    it('adds an "or where null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', 50)
        .orWhereNotNull('view')
        .pluck('title', 'content')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.andWhereNotNull()', function () {
    it('adds an "and where null" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereIn('title', ['a', 'b'])
        .andWhereNotNull('view')
        .pluck('title', 'content')
      expect(result).toEqual({ a: 'a' })
    })
  })

  describe('.whereBetween()', function () {
    it('adds a "where between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereBetween('view', [35, 50]).pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhereBetween()', function () {
    it('adds an "or where between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('title', 'c')
        .orWhereBetween('view', [45, 50])
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 30: 'c' })
    })
  })

  describe('.andWhereBetween()', function () {
    it('adds an "and where between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereIn('title', ['a', 'b'])
        .andWhereBetween('view', [35, 45])
        .pluck('title', 'view')
      expect(result).toEqual({ 40: 'b' })
    })
  })

  describe('.whereNot()', function () {
    it('adds a "where not" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereNot('title', 'a').pluck('title', 'content')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })
  describe('.orWhereNot()', function () {
    it('adds an "or where not" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('title', 'b')
        .orWhereNot('title', 'a')
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNot()', function () {
    it('adds an "and where not" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 35)
        .andWhereNot('title', 'a')
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotBetween()', function () {
    it('adds a "where not between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereNotBetween('view', [45, 55]).pluck('title', 'content')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.orWhereNotBetween()', function () {
    it('adds an "or where not between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('title', 'b')
        .orWhereNotBetween('view', [45, 55])
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b', c: 'c' })
    })
  })

  describe('.andWhereNotBetween()', function () {
    it('adds an "and where not between" clause to the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereIn('title', ['a', 'b'])
        .andWhereNotBetween('view', [45, 55])
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.withTrashed()', function () {
    it('considers all soft-deleted or not-deleted items.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      const b = await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await b.delete()

      const result = await Post.withTrashed()
        .where('view', '>', 0)
        .pluck('title', 'content')
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.onlyTrashed()', function () {
    it('considers soft-deleted items only.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      const b = await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      const c = await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await b.delete()
      await c.delete()

      const result = await Post.onlyTrashed()
        .where('view', '>', 30)
        .pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.all()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = (await Post.all()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = (await Post.get()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function () {
    it('executes the query and return a Collection', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '>', 30)
        .orderBy('view')
        .first()
      if (result) {
        expect(result.title).toEqual('b')
      }
    })
  })

  describe('.count()', function () {
    it('retrieves the "count" result of the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '<', 40).count()
      expect(result).toEqual(1)
    })
  })

  describe('.getPrimaryKeyName()', function () {
    it('retrieves the "get primary key name" result of the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '<', 40).getPrimaryKeyName()
      expect(result).toEqual('_id')
    })
  })

  describe('.getClassName()', function () {
    it('retrieves the "get class name" result of the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '<', 40).getClassName()
      expect(result).toEqual('NajsEloquent.Wrapper.MongooseQueryBuilderWrapper')
    })
  })

  describe('.delete()', function () {
    it('can delete an item', async function () {
      const a = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await a.delete()
      const result = await Post.onlyTrashed().pluck('title', 'content')
      expect(result).toEqual({ a: 'a' })
    })

    // TODO: it don't soft-delete multiple items, waiting for check
    // it('can delete multiple items', async function () {
    //   await factory(Post).create({ view: 50, title: 'a', content: 'a' })
    //   await factory(Post).create({ view: 40, title: 'b', content: 'b' })
    //   await factory(Post).create({ view: 30, title: 'c', content: 'c' })
    //   await Post.where('view', '>', 35).delete
    //   const result = await Post.onlyTrashed().pluck('title', 'content')
    // expect(result).toEqual({ a: 'a', b: 'b' })
  })

  describe('.restore()', function () {
    it('can restore a soft-deleted item', async function () {
      const a = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await a.delete()
      await a.restore()
      const result = (await Post.get()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })

    it('can restore multiple soft-deleted items', async function () {
      const a = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      const b = await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await a.delete()
      await b.delete()
      await Post.onlyTrashed().whereIn('title', ['a', 'b']).restore()
      const result = (await Post.get()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.update()', function () {
    it('retrieves the "update" result of the query.', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      await Post.where('view', '>', 35).update({ view: 60, title: 'updated' })
      const resultContentTitle = (await Post.get()).pluck('title', 'content').all()
      const resultContentView = (await Post.get()).pluck('view', 'content').all()
      expect(resultContentTitle).toEqual({ a: 'updated', b: 'updated', c: 'c' })
      expect(resultContentView).toEqual({ a: 60, b: 60, c: 30 })
    })
  })

  describe('.find()', function () {
    it('executes the query and return an instance of Model', async function () {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const post = await Post.where('view', '>', 30)
        .orderBy('view')
        .find()
      const result = post ? post.toObject() : {}
      expect(result['title']).toEqual('b')
    })

    it('executes the query and return an instance of Model', async function () {
      await factory(Post).create<Post>({ view: 50, title: 'a', content: 'a' })
      const postB = await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = ((await Post.find(postB.id)) as Post).toObject()
      expect(result['title']).toEqual('b')
    })
  })

  describe('.findOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const postA = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '>', 35).findOrFail(postA.id)
      if (result) {
        expect(result.title).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const postA = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      try {
        await Post.where('view', '<', 45).findOrFail(postA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('Post')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.firstOrFail()', function () {
    it('executes the query and return a Collection', async function () {
      const postA = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '>', 35).firstOrFail(postA.id)
      if (result) {
        expect(result.title).toEqual('a')
      }
    })

    it('executes the query and throws a NotFoundError if result is null', async function () {
      const postA = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      try {
        await Post.where('view', '<', 45).firstOrFail(postA.id)
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError)
        expect(err.model).toEqual('Post')
        return
      }
      expect('should not reach this line').toEqual('hum')
    })
  })

  describe('.findById()', function () {
    it('executes the query and return a Collection', async function () {
      const postA = await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '>', 35).findById(postA.id)
      if (result) {
        expect(result.title).toEqual('a')
      }
    })
  })
})
