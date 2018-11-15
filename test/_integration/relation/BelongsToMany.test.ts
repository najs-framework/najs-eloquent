import 'jest'
import { Model, BelongsToMany, Factory, factory } from '../../../lib'
import { register } from 'najs-binding'

interface IUserRolePivot extends Model {
  user_id: string
  role_id: string
}

class Role extends Model {
  name: string
  users: BelongsToMany<User, IUserRolePivot>

  getClassName() {
    return 'Role'
  }

  get usersRelation() {
    return this.defineRelation('users')
      .belongsToMany(User, 'user_roles')
      .withPivot('active')
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
      .withPivot('active')
  }

  get adminRolesRelation() {
    return this.defineRelation('admin_roles')
      .belongsToMany(Role, 'user_roles')
      .as('setting')
      .withPivot('active')
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

describe('BelongsToManyRelationship', function() {
  it('should work', async function() {
    const user = factory(User).make()
    const roleA = await factory(Role).create({ name: 'a' })
    const roleB = await factory(Role).create({ name: 'b' })

    await user.rolesRelation.attach(roleA.id, { active: true })
    await user.rolesRelation.attach(roleB.id, { active: false })
    await user.save()

    const pivotData = await user.rolesRelation
      .newPivotQuery()
      .where('user_id', user.id)
      .get()

    // console.log(pivotData.first()['internalData']['relationDataBucket'])
    expect(pivotData.pluck('user_id', 'role_id').all()).toEqual({
      [roleA.id]: user.id,
      [roleB.id]: user.id
    })

    const result = await User.findOrFail(user.id)
    expect(result.roles).toBeUndefined()
    await result.load('roles')
    expect(result.roles!.pluck('id', 'id').all()).toEqual({
      [roleA.id]: roleA.id,
      [roleB.id]: roleB.id
    })

    const hash = {}
    for (const role of result.roles!) {
      hash[role.pivot.role_id] = role.pivot.user_id
    }
    expect(hash).toEqual({
      [roleA.id]: user.id,
      [roleB.id]: user.id
    })
  })

  it('should work with .as()', async function() {
    const user = factory(User).make()
    const roleA = await factory(Role).create({ name: 'a' })
    const roleB = await factory(Role).create({ name: 'b' })

    await user.adminRolesRelation.attach(roleA.id, { active: true })
    await user.adminRolesRelation.attach(roleB.id, { active: false })
    await user.save()

    const result = await User.findOrFail(user.id)
    expect(result.admin_roles).toBeUndefined()
    await result.load('admin_roles')
    expect(result.admin_roles!.pluck('id', 'id').all()).toEqual({
      [roleA.id]: roleA.id,
      [roleB.id]: roleB.id
    })

    const hash = {}
    for (const role of result.admin_roles!) {
      hash[role.setting.role_id] = role.setting.user_id
    }

    // The pivot never displayed when using toObject
    expect(result.toObject()).toEqual({
      first_name: result.getAttribute('first_name'),
      last_name: result.getAttribute('last_name'),
      id: result.getAttribute('id'),
      admin_roles: [
        { name: result.admin_roles!.first().getAttribute('name'), id: result.admin_roles!.first().getPrimaryKey() },
        { name: result.admin_roles!.last().getAttribute('name'), id: result.admin_roles!.last().getPrimaryKey() }
      ]
    })

    expect(hash).toEqual({
      [roleA.id]: user.id,
      [roleB.id]: user.id
    })
  })

  describe('.attach()', function() {
    it('should work', async function() {
      const user = new User()
      const role1 = await factory(Role).create()
      const role2 = await factory(Role).create()

      user.rolesRelation.attach([role1.id, role2.id])
      await user.save()

      const result = await User.with('roles').findOrFail(user.id)
      expect(result.toObject()).toEqual(
        Object.assign(
          {},
          {
            id: user.id,
            roles: [role1.toObject(), role2.toObject()]
          }
        )
      )
    })
  })

  describe('.detach()', function() {
    it('should work', async function() {
      const user = new User()
      const role1 = await factory(Role).create()
      const role2 = await factory(Role).create()

      user.rolesRelation.attach([role1.id, role2.id])
      await user.save()

      await user.rolesRelation.detach(role2.id)

      const result = await User.with('roles').findOrFail(user.id)
      expect(result.toObject()).toEqual(
        Object.assign(
          {},
          {
            id: user.id,
            roles: [role1.toObject()]
          }
        )
      )
    })
  })

  describe('.sync()', function() {
    it('should work with detaching = true', async function() {
      const user = await factory(User).create()
      const role1 = await factory(Role).create({ name: 'one' })
      const role2 = await factory(Role).create({ name: 'two' })
      const role3 = await factory(Role).create({ name: 'three' })
      const role4 = await factory(Role).create({ name: 'four' })
      const role5 = await factory(Role).create({ name: 'five' })

      await user.rolesRelation.attach([role1.id, role2.id, role3.id])
      await user.rolesRelation.sync([role3.id, role4.id, role5.id])

      const result = await User.with('roles').findOrFail(user.id)
      expect(result.roles!.pluck('name').all()).toEqual(['three', 'four', 'five'])
    })

    it('should work with detaching = false', async function() {
      const user = await factory(User).create()
      const role1 = await factory(Role).create({ name: 'one' })
      const role2 = await factory(Role).create({ name: 'two' })
      const role3 = await factory(Role).create({ name: 'three' })
      const role4 = await factory(Role).create({ name: 'four' })
      const role5 = await factory(Role).create({ name: 'five' })

      await user.rolesRelation.attach([role1.id, role2.id, role3.id])
      await user.rolesRelation.sync([role3.id, role4.id, role5.id], false)

      const result = await User.with('roles').findOrFail(user.id)
      expect(result.roles!.pluck('name').all()).toEqual(['one', 'two', 'three', 'four', 'five'])
    })
  })
})
