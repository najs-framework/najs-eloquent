/// <reference path="../../../dist/lib/index.d.ts" />

import { CollectionAsync } from '../../../dist/lib'
import { autoload } from 'najs-binding'
import { User, IUser } from '../../models/User'

export class UserRepository {
  @autoload(User) userModel: User

  async findOrFail(id: any) {
    return this.userModel.findOrFail(id)
  }

  async getAll(): CollectionAsync<IUser> {
    return this.userModel.get()
  }
}
