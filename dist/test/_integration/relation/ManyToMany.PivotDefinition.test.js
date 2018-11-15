"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
class Role extends lib_1.Model {
    getClassName() {
        return 'Role';
    }
}
lib_1.Model.register(Role);
describe('ManyToMany Pivot definitions Test', function () {
    it('should work no custom pivot', function () {
        class UserOneRole extends lib_1.Model {
            getClassName() {
                return 'UserOneRole';
            }
        }
        lib_1.Model.register(UserOneRole);
        class UserZero extends lib_1.Model {
            getClassName() {
                return 'UserZero';
            }
            get rolesRelation() {
                return this.defineRelation('roles')
                    .belongsToMany(Role)
                    .withPivot('status');
            }
        }
        lib_1.Model.register(UserZero);
        const user = new UserZero();
        const pivot = user.rolesRelation.newPivot();
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'options', {})).toEqual({ foreignKeys: ['role_id', 'user_zero_id'], fields: ['status'], name: 'role_user_zeros' });
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'fillable', {})).toEqual(['role_id', 'user_zero_id', 'status']);
    });
    it('should work with defined Model but passed as string', function () {
        class UserOneRole extends lib_1.Model {
            getClassName() {
                return 'UserOneRole';
            }
        }
        lib_1.Model.register(UserOneRole);
        class UserOne extends lib_1.Model {
            getClassName() {
                return 'UserOne';
            }
            get rolesRelation() {
                return this.defineRelation('roles')
                    .belongsToMany(Role, 'UserOneRole')
                    .withPivot('status');
            }
        }
        lib_1.Model.register(UserOne);
        const user = new UserOne();
        const pivot = user.rolesRelation.newPivot();
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'options', {})).toEqual({ foreignKeys: ['role_id', 'user_one_id'], fields: ['status'] });
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'fillable', {})).toEqual(['role_id', 'user_one_id', 'status']);
    });
    it('should work with defined Model', function () {
        class UserTwoRole extends lib_1.Model {
            getClassName() {
                return 'UserTwoRole';
            }
        }
        lib_1.Model.register(UserTwoRole);
        class UserTwo extends lib_1.Model {
            getClassName() {
                return 'UserTwo';
            }
            get rolesRelation() {
                return this.defineRelation('roles')
                    .belongsToMany(Role, UserTwoRole)
                    .withPivot('status');
            }
        }
        lib_1.Model.register(UserTwo);
        const user = new UserTwo();
        const pivot = user.rolesRelation.newPivot();
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'options', {})).toEqual({ foreignKeys: ['role_id', 'user_two_id'], fields: ['status'] });
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'fillable', {})).toEqual(['role_id', 'user_two_id', 'status']);
    });
    it('should work with non-existing Model but passed as string', function () {
        class UserThree extends lib_1.Model {
            getClassName() {
                return 'UserThree';
            }
            get rolesRelation() {
                return this.defineRelation('roles')
                    .belongsToMany(Role, 'user_roles')
                    .withPivot('status');
            }
        }
        lib_1.Model.register(UserThree);
        const user = new UserThree();
        const pivot = user.rolesRelation.newPivot();
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'options', {})).toEqual({ foreignKeys: ['role_id', 'user_three_id'], fields: ['status'], name: 'user_roles' });
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'fillable', {})).toEqual(['role_id', 'user_three_id', 'status']);
    });
    it('should work with non-existing Model but passed as string and redefined', function () {
        class UserFour extends lib_1.Model {
            getClassName() {
                return 'UserFour';
            }
            get rolesRelation() {
                return this.defineRelation('roles')
                    .belongsToMany(Role, 'user_roles')
                    .withPivot('status', 'new');
            }
        }
        lib_1.Model.register(UserFour);
        const user = new UserFour();
        const pivot = user.rolesRelation.newPivot();
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'options', {})).toEqual({ foreignKeys: ['role_id', 'user_four_id'], fields: ['status', 'new'], name: 'user_roles' });
        expect(pivot
            .getDriver()
            .getSettingFeature()
            .getSettingProperty(pivot, 'fillable', {})).toEqual(['role_id', 'user_three_id', 'status', 'user_four_id', 'new']);
    });
});
