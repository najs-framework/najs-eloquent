import 'jest'
import { Model } from '../../../lib'

class User extends Model {
  getClassName() {
    return 'ModelEvent.User'
  }
}
Model.register(User)

class Post extends Model {
  getClassName() {
    return 'ModelEvent.Post'
  }
}
Model.register(Post)

describe('Model Event integration test', function() {
  it('should work with global event listener', async function() {
    const user = new User()
    const post = new Post()

    User.on('created', async function(createdModel: any) {
      if (createdModel instanceof User) {
        expect(createdModel === user).toBe(true)
      } else {
        expect(createdModel === post).toBe(true)
      }
    })

    // Post.once('created', async function(createdModel: any) {
    // console.log(arguments)
    // if (createdModel instanceof User) {
    //   expect(createdModel === user).toBe(true)
    // } else {
    //   expect(createdModel === post).toBe(true)
    // }
    // })

    await user.save()
    await post.save()
  })
})
