import { User } from './User'
import { Collection } from 'collect.js'

class UserRepository {
  async createUser(firstName: string, lastName: string): Promise<User> {
    const user = new User({
      first_name: firstName,
      last_name: lastName
    })
    await user.save()
    return user
  }

  async updateUser(id: string, firstName: string, lastName: string): Promise<User> {
    const user = await User.find(id)
    user.first_name = firstName
    user.last_name = lastName
    await user.save()
    return user
  }

  async deleteUser(firstName: string, lastName: string): Promise<any> {
    return User.queryName('Delete user by first name and last name')
      .where('first_name', firstName)
      .where('last_name', lastName)
      .delete()
  }

  async getAllUsers(): Promise<Collection<User>> {
    // Using custom static function
    return User.getAllUsers()
  }

  async getUserByFirstName(firstName: string): Promise<Collection<User>> {
    return User.where('first_name', firstName).get()
  }

  async findUser(id: string): Promise<User | undefined> {
    return User.find(id)
  }
}
