import 'jest'
import { Factory } from '../../../lib'
import { User, Post, init_mongoose, delete_collection } from '../mongodb/index'

describe('Integration Test - Relation', function() {
  beforeAll(async function() {
    await init_mongoose('i_test_relation_has_one_or_many_user_post')
  })

  afterEach(async function() {
    await delete_collection(['users'])
    await delete_collection(['posts'])
  })

  it('can use with .associate() to assign the model to relation', async function() {
    const user = await Factory.create(User)
    const postOne = await Factory.make(Post)
    const postTwo = await Factory.make(Post)

    console.log(postOne.toObject())
    user.getPostsRelation().associate(postOne)
    console.log(postOne.toObject())
    user.save()

    console.log(postTwo.toObject())
    postTwo.getUserRelation().associate(user)
    console.log(postTwo.toObject())
    await postTwo.save()

    const fresh = await Post.findOrFail(postOne.getPrimaryKey())
    console.log(fresh)

    const freshUser = await user.fresh()
    await freshUser!.load('posts')
    console.log(freshUser!.posts)
  })
})
