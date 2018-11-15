import 'jest'
import { Model, HasMany, BelongsTo, Factory, factory } from '../../../lib'
import { ObjectID } from 'bson'

class Post extends Model {
  user: BelongsTo<User>
  comments: HasMany<Comment>

  user_id: string
  title: string

  protected fillable: ['title']

  getClassName() {
    return 'Post'
  }

  get userRelation() {
    return this.defineRelation('user').belongsTo(User)
  }

  get commentsRelation() {
    return this.defineRelation('comments')
      .hasMany(Comment)
      .query(qb => {
        qb.where('status', 'accepted')
      })
  }
}
Model.register(Post)

class User extends Model {
  posts: HasMany<Post>

  getClassName() {
    return 'User'
  }

  get postsRelation() {
    return this.defineRelation('posts').hasMany(Post)
  }
}
Model.register(User)

class Comment extends Model {
  post: BelongsTo<Post>
  user: BelongsTo<User>

  post_id: string
  user_id: string
  content: string
  status: string

  getClassName() {
    return 'Comment'
  }

  get postRelation() {
    return this.defineRelation('post').belongsTo(Post)
  }

  get userRelation() {
    return this.defineRelation('user').hasOne(User)
  }
}
Model.register(Comment)

Factory.define(User, (faker, attributes) => {
  return Object.assign({}, attributes, {})
})

Factory.define(Post, (faker, attributes) => {
  return Object.assign({}, attributes, {
    title: faker.sentence()
  })
})

Factory.define(Comment, (faker, attributes) => {
  return Object.assign({ status: 'accepted' }, attributes, {
    content: faker.paragraph()
  })
})

describe('HasMany Relationship', function() {
  it('should work as expected', async function() {
    const user = new User()

    user.postsRelation.associate(
      factory(Post)
        .times(3)
        .make()
    )
    await user.save()

    expect(user.posts).toBeUndefined()
    await user.load('posts')
    for (const post of user.posts!) {
      expect(post.user_id).toEqual(user.id)
    }

    // const result = await User.with('posts').firstOrFail(user.id)
    // console.log(result.toObject('posts.user'))

    // const posts = await Post.where('user_id', user.id).get()
    // console.log(posts.map(item => item.attributesToObject()))

    // const userResult = await User.findOrFail(user.id)
    // QueryLog.disable()
    // console.log(userResult.posts)
    // await userResult.postsRelation.load()
    // console.log(userResult.posts)

    // for (const log of QueryLog.pull()) {
    //   console.log(log)
    // }
  })

  it('should work with ObjectId', async function() {
    const user = new User()
    user.id = new ObjectID()
    await user.save()

    const post = new Post()
    post.id = new ObjectID()
    post.user_id = user.id.toString()
    post.title = 'test'
    await post.save()

    const result = await User.with('posts').findOrFail(user.id)
    expect(result.posts!.first().id.toHexString()).toEqual(post.id.toHexString())
  })

  it('could be loaded via chain', async function() {
    const user = await factory(User).create()
    const post = await factory(Post).create({ user_id: user.id })
    user.postsRelation.associate(
      post,
      factory(Post)
        .times(3)
        .make()
    )
    await user.save()

    post.commentsRelation.associate(
      factory(Comment)
        .times(2)
        .make()
    )
    await post.save()

    const firstUser = await User.findOrFail(user.id)
    await firstUser.load('posts.comments')

    const firstPost = firstUser.posts!.first()
    expect(firstPost.comments!.count()).toEqual(2)
    expect(firstPost.comments!.map(item => item.post_id).all()).toEqual([firstPost.id, firstPost.id])
    expect(firstPost.comments!.map(item => item.id).all()).toEqual(
      (await Comment.where('post_id', firstPost.id).get()).map(item => item.id).all()
    )
  })

  describe('.query()', function() {
    it('should work with custom query', async function() {
      const post = await factory(Post).create()

      const acceptedComments = await factory(Comment)
        .times(2)
        .create({ status: 'accepted' })
      const disabledComments = await factory(Comment)
        .times(2)
        .create({ status: 'disabled' })

      post.commentsRelation.associate(acceptedComments.all(), disabledComments.all())
      await post.save()

      await post.load('comments')
      expect(post.comments!.map(item => item.attributesToObject())).toEqual(
        acceptedComments.map(item => item.attributesToObject())
      )
    })
  })

  describe('.associate()', function() {
    it('should work with new model', async function() {
      const user = new User()

      user.postsRelation.associate(
        factory(Post)
          .times(3)
          .make()
      )
      await user.save()

      const posts = await Post.where('user_id', user.id).get()
      for (const post of posts) {
        expect(post.user_id).toEqual(user.id)
      }
    })

    it('should work with existing model', async function() {
      const user = new User()
      await user.save()

      user.postsRelation.associate(
        factory(Post)
          .times(3)
          .make()
      )
      await user.save()

      const posts = await Post.where('user_id', user.id).get()
      for (const post of posts) {
        expect(post.user_id).toEqual(user.id)
      }
    })
  })

  describe('.dissociate()', function() {
    it('should work when the root model get saved', async function() {
      const user = new User()
      const posts = factory(Post, 5).make()
      user.postsRelation.associate(posts)
      await user.save()

      await user.load('posts')
      expect(user.posts!.pluck('id', 'id').all()).toEqual(posts.pluck('id', 'id').all())

      const postA = await Post.findOrFail(posts.get(1)!.id)
      const postB = await Post.findOrFail(posts.get(3)!.id)

      user.postsRelation.dissociate(postA, postB)
      expect(postA.user_id).toBeNull()
      expect(postB.user_id).toBeNull()
      await user.save()

      const result = await User.findOrFail(user.id)
      await result.load('posts')
      expect(result.posts!.pluck('id', 'id').all()).toEqual({
        [posts.get(0)!.id]: posts.get(0)!.id,
        [posts.get(2)!.id]: posts.get(2)!.id,
        [posts.get(4)!.id]: posts.get(4)!.id
      })
    })
  })

  describe('.isInverseOf()', function() {
    it('could be detect the inverse relationship', function() {
      const user = new User()
      const post = new Post()
      const comment = new Comment()

      expect(user.postsRelation.isInverseOf(post.userRelation)).toBe(true)
      expect(post.userRelation.isInverseOf(user.postsRelation)).toBe(true)

      expect(post.commentsRelation.isInverseOf(comment.postRelation)).toBe(true)
      expect(comment.postRelation.isInverseOf(post.commentsRelation)).toBe(true)

      expect(comment.userRelation.isInverseOf(post.commentsRelation)).toBe(false)
      expect(post.commentsRelation.isInverseOf(comment.userRelation)).toBe(false)
    })

    it('should mark the inverse relation loaded automatically', async function() {
      const user = new User()
      user.postsRelation.associate(
        factory(Post)
          .times(3)
          .make()
      )
      await user.save()

      const result = await User.firstOrFail(user.id)
      result.load('posts')
      for (const post of result.posts!) {
        expect(post.userRelation.isLoaded()).toBe(true)
        expect(post.user!.attributesToObject()).toEqual(user.attributesToObject())
      }
    })
  })
})
