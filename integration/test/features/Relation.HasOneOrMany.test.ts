import 'jest'
import { factory } from '../../../dist/lib'
import { User, Post, Comment, init_mongoose, delete_collection } from '../../mongodb/index'

describe('Integration Test - Relation', function() {
  beforeAll(async function() {
    await init_mongoose('integration_relation_has_one_or_many')
  })

  afterEach(async function() {
    await delete_collection(['users'])
  })

  it('init test data', async function() {
    const user1 = await factory(User).create()
    const post11 = await factory(Post).create({
      user_id: user1.id
    })

    await factory(Comment).create({
      user_id: user1.id,
      post_id: post11.id
    })
    await factory(Comment).create({
      user_id: user1.id,
      post_id: post11.id
    })

    const userModel = new User()
    const data = await userModel.first()
    if (data) {
      // console.log(data['relations'])
      await data!.load('posts.comments')
      // console.log(data['relations'])
      // const post = data.posts!.first()
      // console.log(post.comments)
      // console.log(data.getRelationDataBucket())
      // console.log(post.getRelationDataBucket())
      // console.log(await data.posts!.first().load('comments'))
      // console.log(await data.posts!.first().comments)
      // console.log(data.getRelationDataBucket()!['bucket'])
      // data.getPostsRelation()['buildData']()
      // console.log(data.posts!.first().comments)
    }
  })

  it('should work', async function() {})
})
