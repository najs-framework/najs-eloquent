import { EloquentMongoose, BelongsTo, BelongsToRelation, Eloquent } from '../../dist/lib'
import { User } from './User'
import { Post } from './Post'

export interface IComment {
  user_id?: string
  email?: string
  name?: string
  content: string
  like: number
}

export interface ICommentRelations {
  user: BelongsTo<User>
  post: BelongsTo<Post>

  getUserRelation(): BelongsToRelation<User>

  getPostRelation(): BelongsToRelation<Post>
}

export interface Comment extends IComment, ICommentRelations {}
export class Comment extends EloquentMongoose<IComment & ICommentRelations> {
  static className: string = 'Comment'
  protected static timestamps = true
  protected static softDeletes = true
  protected static schema = {
    user_id: { type: String, required: false },
    post_id: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    content: { type: String, required: true },
    like: { type: Number, required: false }
  }

  getClassName() {
    return Comment.className
  }

  getUserRelation(): BelongsToRelation<User> {
    return this.defineRelationProperty('user').belongsTo(User)
  }

  getPostRelation(): BelongsToRelation<Post> {
    return this.defineRelationProperty('post').belongsTo(Post)
  }
}
Eloquent.register(Comment)
