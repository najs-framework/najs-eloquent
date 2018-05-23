import {
  Eloquent,
  EloquentStaticMongoose,
  HasMany,
  HasManyRelation,
  BelongsTo,
  BelongsToRelation
} from '../../dist/lib'
import { User } from './User'
import { Comment } from './Comment'

export interface IPost {
  user_id: string
  title: string
  content: string
  view: number
}

export interface IPostRelations {
  user: BelongsTo<User>
  comments: HasMany<Comment>

  getUserRelation(): BelongsToRelation<User>
  getCommentsRelation(): HasManyRelation<Comment>
}

export const PostBase: EloquentStaticMongoose<IPost & IPostRelations> = Eloquent.Mongoose<IPost & IPostRelations>()

/**
 * Post model, extends from Eloquent.Mongoose<IPost>(), supports
 *   - full definitions of Eloquent<IPost>
 *   - full definitions of static API
 */
export interface Post extends IPost, IPostRelations {}
export class Post extends PostBase {
  static className: string = 'Post'
  protected static timestamps = true
  protected static softDeletes = true
  protected static schema = {
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    view: { type: Number, required: false }
  }

  getClassName() {
    return Post.className
  }

  getUserRelation(): BelongsToRelation<User> {
    return this.defineRelationProperty('user').belongsTo(User)
  }

  getCommentsRelation(): HasManyRelation<Comment> {
    return this.defineRelationProperty('comments').hasMany(Comment)
  }
}
Eloquent.register(Post)
