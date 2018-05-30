import { Eloquent, HasMany, HasManyRelation } from '../../../lib'
import { Post } from './Post'

export interface IUser {
  email: string
  password: string
  first_name: string
  last_name: string
  age: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface IUserRelations {
  posts: HasMany<Post>

  getPostsRelation(): HasManyRelation<Post>
}

/**
 * User model, extends from Eloquent<IPost>
 *   - supports full definitions of Eloquent<IPost>
 *   - DO NOT SUPPORT definitions of static API
 */
export interface User extends IUser, IUserRelations {}
export class User extends Eloquent<IUser & IUserRelations> {
  static className: string = 'User'
  static timestamps = true
  static softDeletes = true
  static fillable = ['email', 'first_name', 'last_name', 'age']
  static hidden = ['password']
  static schema = {
    email: { type: String, required: true },
    password: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
  }

  getClassName() {
    return User.className
  }

  getHashedPassword() {
    return this.password
  }

  setRawPassword(password: string) {}

  getPostsRelation(): HasManyRelation<Post> {
    return this.defineRelationProperty('posts').hasMany(Post)
  }
}
Eloquent.register(User)
