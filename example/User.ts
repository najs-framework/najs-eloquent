import Eloquent from '../lib'
import { Schema } from 'mongoose'

// This interface can be shared between Server-side and Client-side
export interface IUser {
  id?: string
  first_name: string
  last_name: string
  full_name: string
}

export class User extends Eloquent.Mongoose<IUser, User>() {
  static className: string = 'User'

  getClassName() {
    return User.className
  }

  getSchema() {
    return new Schema({
      first_name: { type: String },
      last_name: { type: String }
    })
  }

  get full_name(): string {
    return this.first_name + ' ' + this.last_name
  }

  // custom static function of User model
  static getAllUsers() {
    return User.orderBy('last_name')
      .limit(10)
      .get()
  }
}
