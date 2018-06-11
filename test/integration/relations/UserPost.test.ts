import 'jest'
import { Factory } from '../../../lib'
import { User, Post, Comment, init_mongoose, delete_collection } from '../mongodb/index'

describe('Integration Test - Relation', function() {
  beforeAll(async function() {
    await init_mongoose('i_test_relation_has_one_or_many_user_post')
  })

  afterEach(async function() {
    await delete_collection(['users'])
    await delete_collection(['posts'])
  })

  describe('.associate()', function() {
    it('works with .hasMany() from parent model. After saving user, post is also saved.', async function() {
      const user = Factory.make(User)
      const post = Factory.make(Post)

      user.getPostsRelation().associate(post)
      await user.save()

      await user.load('posts')
      expect(user.posts!.first().toJSON()).toEqual(post.toJSON())
    })

    it('throws TypeError if associate invalid model with .hasMany()', function() {
      const user = Factory.make(User)
      try {
        user.getPostsRelation().associate(Factory.make(Comment))
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError)
        expect(error.message).toEqual('Can not associate model Comment to User.')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })

    it('works with inverse relation .belongsTo(). After saving post, user is also saved.', async function() {
      const user = Factory.make(User)
      const post = Factory.make(Post)

      post.getUserRelation().associate(user)
      await post.save()

      await post.load('user')
      expect(post.user!.toJSON()).toEqual(user.toJSON())
    })

    it('throws TypeError if associate invalid model with .belongsTo()', function() {
      const post = Factory.make(Post)
      try {
        post.getUserRelation().associate(Factory.make(Comment))
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError)
        expect(error.message).toEqual('Can not associate model Comment to Post.')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })
})
