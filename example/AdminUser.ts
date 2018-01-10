import { EloquentMongooseSpec } from '../lib'
import { User } from './User'
import { Schema } from 'mongoose'

// This interface can be shared between Server-side and Client-side
export interface IAdminUser {
  id?: string
  is_admin: true
}

export const AdminUserBase: EloquentMongooseSpec<IAdminUser, AdminUser> = User.Class<IAdminUser, AdminUser>()
export class AdminUser extends AdminUserBase {
  static className: string = 'AdminUser'

  // using the same collection as User model
  getModelName() {
    return super.getModelName()
  }

  getClassName() {
    return AdminUser.className
  }

  getSchema(): Schema {
    this.schema.add({
      is_admin: { type: Boolean }
    })
    return this.schema
  }
}
