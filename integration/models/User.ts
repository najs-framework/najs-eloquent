import { Eloquent } from '../../dist/lib'

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

/**
 * User model, extends from Eloquent<IPost>
 *   - supports full definitions of Eloquent<IPost>
 *   - DO NOT SUPPORT definitions of static API
 */
export interface User extends IUser {}
export class User extends Eloquent<IUser> {
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
}
