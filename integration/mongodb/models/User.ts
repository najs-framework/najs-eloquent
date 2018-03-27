import { Eloquent } from '../../../dist/lib/v1'

export interface IUser {
  email: string
  first_name: string
  last_name: string
  age: number
}

export class User extends Eloquent<IUser> implements IUser {
  static className: string = 'User'
  protected timestamps = true
  protected schema = {
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
  }

  email: string
  first_name: string
  last_name: string
  age: number

  getClassName() {
    return User.className
  }

  getFirstName() {
    return this.getAttribute('first_name')
  }
}
