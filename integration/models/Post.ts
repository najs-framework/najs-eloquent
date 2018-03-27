import { Eloquent, EloquentMongooseDefinition } from '../../dist/lib/v1'

export interface IPost {
  user_id: string
  title: string
  content: string
}

export const PostBase: EloquentMongooseDefinition<IPost, Post> = Eloquent.Mongoose<IPost, Post>()

/**
 * Post model, extends from Eloquent.Mongoose<IPost, Post>(), supports
 *   - full definitions of Eloquent<IPost>
 *   - full definitions of static API
 */
export class Post extends PostBase {
  static className: string = 'Post'
  protected timestamps = true
  protected softDeletes = false
  protected schema = {
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  }

  getClassName() {
    return Post.className
  }

  getShortContent() {
    return this.content
  }
}
