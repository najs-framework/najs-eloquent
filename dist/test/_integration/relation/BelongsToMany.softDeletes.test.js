"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
const najs_binding_1 = require("najs-binding");
class Role extends lib_1.Model {
    getClassName() {
        return 'Role';
    }
    get usersRelation() {
        return this.defineRelation('users')
            .belongsToMany(User, 'user_roles')
            .withSoftDeletes();
    }
}
najs_binding_1.register(Role);
class User extends lib_1.Model {
    getClassName() {
        return 'User';
    }
    get rolesRelation() {
        return this.defineRelation('roles')
            .belongsToMany(Role, 'user_roles')
            .withSoftDeletes();
    }
}
najs_binding_1.register(User);
lib_1.Factory.define(User, function (faker, attributes) {
    return Object.assign({}, {
        first_name: faker.first(),
        last_name: faker.last()
    }, attributes);
});
lib_1.Factory.define(Role, function (faker, attributes) {
    return Object.assign({}, {
        name: faker.word()
    }, attributes);
});
describe('BelongsToManyRelationship - Timestamps options', function () {
    it('should work', async function () {
        const user = lib_1.factory(User).make();
        const roleA = await lib_1.factory(Role).create({ name: 'a' });
        const roleB = await lib_1.factory(Role).create({ name: 'b' });
        await user.rolesRelation.attach([roleA.id, roleB.id]);
        await user.save();
        await user.rolesRelation.detach(roleB.id);
        const result = await User.with('roles').findOrFail(user.id);
        for (const role of result.roles) {
            const pivot = role.pivot.toObject();
            expect(pivot['deleted_at']).toBeNull();
        }
    });
});
