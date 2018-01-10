import { User } from './User'

// This interface can be shared between Server-side and Client-side
export interface IAdminUser {
  id?: string
  is_admin: true
}

export class AdminUser extends User.Class<IAdminUser, User>() {
  static className: string = 'AdminUser'

  // using the same collection as User model
  getModelName() {
    return super.getModelName()
  }

  getClassName() {
    return AdminUser.className
  }

  getSchema() {
    const schema = super.getSchema()
    schema.add({
      is_admin: { type: Boolean }
    })
    return schema
  }
}
