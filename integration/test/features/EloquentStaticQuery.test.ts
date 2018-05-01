import { QueryLog, factory } from '../../../dist/lib'
import { Post, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Eloquent Static (2nd way) querying', function() {
  beforeAll(async function() {
    await init_mongoose('integration_eloquent_static_query')
  })

  afterEach(async function() {
    await delete_collection(['posts'])
  })

  describe('.queryName()', function() {
    it('starts new query with given name.', async function() {
      const query = Post.queryName('You can name the query what ever you want')
      expect(query['queryBuilder']['name']).toEqual('You can name the query what ever you want')

      QueryLog.enable()
      await query.where('title', 'test').get()
      const log = QueryLog.pull()
      expect(log[0].query['name']).toEqual('You can name the query what ever you want')
      QueryLog.disable()
    })
  })

  describe('.select()', function() {
    it('set the columns or fields to be selected.', async function() {
      await factory(Post).create()
      const posts = await Post.select('title', 'content').get()
      posts.each(function(post: Post) {
        const result = post.toObject()
        expect(result['user_id']).toBeUndefined()
        expect(result['view']).toBeUndefined()
      })
    })
  })

  describe('.orderBy()', function() {
    it('adds an "order by" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderBy('view').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await Post.orderBy('view', 'desc').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByAsc()', function() {
    it('adds an "order by" clause to the query with direction ASC.', async function() {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByAsc('view').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
      expect(
        (await Post.orderByAsc('title').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.orderByDesc()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByDesc('view').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b', 'c'])
      expect(
        (await Post.orderByDesc('title').get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c', 'b', 'a'])
    })
  })

  describe('.limit()', function() {
    it('adds an "order by" clause to the query with direction DESC.', async function() {
      await factory(Post).create({ view: 50, title: 'a' })
      await factory(Post).create({ view: 40, title: 'b' })
      await factory(Post).create({ view: 30, title: 'c' })
      expect(
        (await Post.orderByDesc('view')
          .limit(2)
          .get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['a', 'b'])
      expect(
        (await Post.orderByDesc('title')
          .limit(1)
          .get())
          .map(function(post) {
            return post.title
          })
          .toArray()
      ).toEqual(['c'])
    })
  })

  describe('.where()', function() {
    it('adds a basic where clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', '>', 10)
        .where(function(query) {
          return query.where('title', 'a').orWhere('title', 'b')
        })
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.orWhere()', function() {
    it('adds an "or where" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 40)
        .orWhere(function(query) {
          return query.where('title', 'a').orWhere('title', 'b')
        })
        .pluck('title', 'view')
      expect(result).toEqual({ 50: 'a', 40: 'b' })
    })
  })

  describe('.whereIn()', function() {
    it('adds a "where in" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.whereIn('view', [30, 40]).pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereIn()', function() {
    it('adds an "or where in" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 30)
        .orWhereIn('view', [40])
        .pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 40: 'b' })
    })
  })

  describe('.orWhereNotIn()', function() {
    it('adds an "or where not in" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })
      const result = await Post.where('view', 30)
        .orWhereNotIn('view', [40])
        .pluck('title', 'view')
      expect(result).toEqual({ 30: 'c', 50: 'a' })
    })
  })

  describe('.whereNull()', function() {
    it('adds a "where null" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereNull('view').pluck('title', 'content')
      expect(result).toEqual({ b: 'b' })
    })
  })

  describe('.whereNotNull()', function() {
    it('adds a "where not null" clause to the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      // tslint:disable-next-line
      await factory(Post).create({ view: null, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.whereNotNull('view').pluck('title', 'content')
      expect(result).toEqual({ a: 'a', c: 'c' })
    })
  })

  describe('.orWhereNotNull()', function() {
    it('adds an "or where null" clause to the query.', async function() {
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

  describe('.withTrashed()', function() {
    it('considers all soft-deleted or not-deleted items.', async function() {
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

  describe('.onlyTrashed()', function() {
    it('considers soft-deleted items only.', async function() {
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

  describe('.all()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = (await Post.all()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.get()', function() {
    it('executes the query and return a Collection', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = (await Post.get()).pluck('title', 'content').all()
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' })
    })
  })

  describe('.first()', function() {
    it('executes the query and return a Collection', async function() {
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

  describe('.count()', function() {
    it('retrieves the "count" result of the query.', async function() {
      await factory(Post).create({ view: 50, title: 'a', content: 'a' })
      await factory(Post).create({ view: 40, title: 'b', content: 'b' })
      await factory(Post).create({ view: 30, title: 'c', content: 'c' })

      const result = await Post.where('view', '<', 40).count()
      expect(result).toEqual(1)
    })
  })
})
