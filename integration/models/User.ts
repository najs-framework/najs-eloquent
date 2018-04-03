import { Eloquent } from '../../dist/lib/v1'

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
export class User extends Eloquent implements IUser {
  static className: string = 'User'
  protected timestamps = true
  protected softDeletes = true
  protected fillable = ['email', 'first_name', 'last_name', 'age']
  protected hidden = ['password']
  protected schema = {
    email: { type: String, required: true },
    password: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
  }

  email: string
  password: string
  first_name: string
  last_name: string
  age: number
  created_at: Date
  updated_at: Date
  deleted_at: Date | null

  getClassName() {
    return User.className
  }

  getHashedPassword() {
    return this.password
  }

  setRawPassword(password: string) {}
}
