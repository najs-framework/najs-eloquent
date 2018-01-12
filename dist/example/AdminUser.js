"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./User");
exports.AdminUserBase = User_1.User.Class();
class AdminUser extends exports.AdminUserBase {
    // using the same collection as User model
    getModelName() {
        return super.getModelName();
    }
    getClassName() {
        return AdminUser.className;
    }
    getSchema() {
        const schema = super.getSchema();
        schema.add({
            is_admin: { type: Boolean }
        });
        return this.schema;
    }
}
AdminUser.className = 'AdminUser';
exports.AdminUser = AdminUser;
