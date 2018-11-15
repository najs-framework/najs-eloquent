import 'jest'
import { Model, BelongsToMany, Factory, factory } from '../../../lib'
import { register } from 'najs-binding'

interface IUserRolePivot extends Model {
  user_id: string
  role_id: string
}

class Role extends Model {
  users: BelongsToMany<User, IUserRolePivot>

  getClassName() {
    return 'Role'
  }

  get usersRelation() {
    return this.defineRelation('users')
      .belongsToMany(User, 'user_roles')
      .withSoftDeletes()
  }
}
register(Role)

class User extends Model {
  roles: BelongsToMany<Role, IUserRolePivot>
  admin_roles: BelongsToMany<Role, IUserRolePivot, 'setting'>

  getClassName() {
    return 'User'
  }

  get rolesRelation() {
    return this.defineRelation('roles')
      .belongsToMany(Role, 'user_roles')
      .withSoftDeletes()
  }
}
register(User)

Factory.define(User, function(faker, attributes) {
  return Object.assign(
    {},
    {
      first_name: faker.first(),
      last_name: faker.last()
    },
    attributes
  )
})

Factory.define(Role, function(faker, attributes) {
  return Object.assign(
    {},
    {
      name: faker.word()
    },
    attributes
  )
})

describe('BelongsToManyRelationship - Timestamps options', function() {
  it('should work', async function() {
    const user = factory(User).make()
    const roleA = await factory(Role).create({ name: 'a' })
    const roleB = await factory(Role).create({ name: 'b' })

    await user.rolesRelation.attach([roleA.id, roleB.id])
    await user.save()
    await user.rolesRelation.detach(roleB.id)

    const result = await User.with('roles').findOrFail(user.id)
    for (const role of result.roles!) {
      const pivot = role.pivot.toObject()
      expect(pivot['deleted_at']).toBeNull()
    }
  })
})
