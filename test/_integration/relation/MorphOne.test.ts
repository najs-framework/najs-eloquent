import 'jest'
import { Model, MorphOne } from '../../../lib'

class Image extends Model {
  imageable_type: string
  imageable_id: string
  url: string

  protected fillable = ['imageable_type', 'imageable_id', 'url']

  getClassName() {
    return 'Image'
  }
}
Model.register(Image)

class User extends Model {
  image: MorphOne<Image>

  getClassName() {
    return 'User'
  }

  get imageRelation() {
    return this.defineRelation('image').morphOne(Image, 'imageable')
  }
}
Model.register(User)

class Post extends Model {
  image: MorphOne<Image>

  getClassName() {
    return 'Post'
  }

  get imageRelation() {
    return this.defineRelation('image').morphOne(Image, 'imageable')
  }
}
Model.register(Post)

describe('MorphOne', function() {
  it('should work as expected', async function() {
    const user = new User()
    await user.save()

    const post = new Post()
    await post.save()

    const userImage = new Image({
      imageable_type: 'User',
      imageable_id: user.id,
      url: 'image for user'
    })
    await userImage.save()

    const postImage = new Image({
      imageable_type: 'Post',
      imageable_id: post.id,
      url: 'image for post'
    })
    await postImage.save()

    const result = await User.findOrFail(user.id)

    expect(user.image).toBeUndefined()
    await user.load('image')
    expect(user.image!.attributesToObject()).toEqual(userImage.attributesToObject())

    expect(result.image).toBeUndefined()
    await result.load('image')
    expect(result.image!.attributesToObject()).toEqual(userImage.attributesToObject())
  })

  describe('.associate()', function() {
    it('should work with not saved model', async function() {
      const user = new User()
      const image = new Image()
      user.imageRelation.associate(image)

      await user.save()
      await user.load('image')
      expect(user.toObject()).toEqual({
        id: user.id,
        image: {
          imageable_id: user.id,
          imageable_type: user.getModelName(),
          id: image.id
        }
      })
    })

    it('should work with saved model', async function() {
      const user = new User()
      await user.save()

      const image = new Image()
      await image.save()

      user.imageRelation.associate(image)

      await user.save()
      await user.load('image')
      expect(user.toObject()).toEqual({
        id: user.id,
        image: {
          imageable_id: user.id,
          imageable_type: user.getModelName(),
          id: image.id
        }
      })
    })
  })
})
