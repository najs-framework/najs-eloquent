import 'jest'
import { Model, BelongsToMany } from '../../../lib'

class Role extends Model {
  getClassName() {
    return 'Role'
  }
}
Model.register(Role)

describe('ManyToMany Pivot definitions Test', function() {
  it('should work no custom pivot', function() {
    class UserOneRole extends Model {
      getClassName() {
        return 'UserOneRole'
      }
    }
    Model.register(UserOneRole)

    class UserZero extends Model {
      roles: BelongsToMany<Role>

      getClassName() {
        return 'UserZero'
      }

      get rolesRelation() {
        return this.defineRelation('roles')
          .belongsToMany(Role)
          .withPivot('status')
      }
    }
    Model.register(UserZero)

    const user = new UserZero()
    const pivot = user.rolesRelation.newPivot()
    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'options', {})
    ).toEqual({ foreignKeys: ['role_id', 'user_zero_id'], fields: ['status'], name: 'role_user_zeros' })

    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'fillable', {})
    ).toEqual(['role_id', 'user_zero_id', 'status'])
  })

  it('should work with defined Model but passed as string', function() {
    class UserOneRole extends Model {
      getClassName() {
        return 'UserOneRole'
      }
    }
    Model.register(UserOneRole)

    class UserOne extends Model {
      roles: BelongsToMany<Role>

      getClassName() {
        return 'UserOne'
      }

      get rolesRelation() {
        return this.defineRelation('roles')
          .belongsToMany(Role, 'UserOneRole')
          .withPivot('status')
      }
    }
    Model.register(UserOne)

    const user = new UserOne()
    const pivot = user.rolesRelation.newPivot()
    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'options', {})
    ).toEqual({ foreignKeys: ['role_id', 'user_one_id'], fields: ['status'] })

    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'fillable', {})
    ).toEqual(['role_id', 'user_one_id', 'status'])
  })

  it('should work with defined Model', function() {
    class UserTwoRole extends Model {
      getClassName() {
        return 'UserTwoRole'
      }
    }
    Model.register(UserTwoRole)

    class UserTwo extends Model {
      roles: BelongsToMany<Role>

      getClassName() {
        return 'UserTwo'
      }

      get rolesRelation() {
        return this.defineRelation('roles')
          .belongsToMany(Role, UserTwoRole)
          .withPivot('status')
      }
    }
    Model.register(UserTwo)

    const user = new UserTwo()
    const pivot = user.rolesRelation.newPivot()
    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'options', {})
    ).toEqual({ foreignKeys: ['role_id', 'user_two_id'], fields: ['status'] })

    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'fillable', {})
    ).toEqual(['role_id', 'user_two_id', 'status'])
  })

  it('should work with non-existing Model but passed as string', function() {
    class UserThree extends Model {
      roles: BelongsToMany<Role>

      getClassName() {
        return 'UserThree'
      }

      get rolesRelation() {
        return this.defineRelation('roles')
          .belongsToMany(Role, 'user_roles')
          .withPivot('status')
      }
    }
    Model.register(UserThree)

    const user = new UserThree()
    const pivot = user.rolesRelation.newPivot()
    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'options', {})
    ).toEqual({ foreignKeys: ['role_id', 'user_three_id'], fields: ['status'], name: 'user_roles' })

    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'fillable', {})
    ).toEqual(['role_id', 'user_three_id', 'status'])
  })

  it('should work with non-existing Model but passed as string and redefined', function() {
    class UserFour extends Model {
      roles: BelongsToMany<Role>

      getClassName() {
        return 'UserFour'
      }

      get rolesRelation() {
        return this.defineRelation('roles')
          .belongsToMany(Role, 'user_roles')
          .withPivot('status', 'new')
      }
    }
    Model.register(UserFour)

    const user = new UserFour()
    const pivot = user.rolesRelation.newPivot()
    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'options', {})
    ).toEqual({ foreignKeys: ['role_id', 'user_four_id'], fields: ['status', 'new'], name: 'user_roles' })

    expect(
      pivot
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(pivot, 'fillable', {})
    ).toEqual(['role_id', 'user_three_id', 'status', 'user_four_id', 'new'])
  })
})
