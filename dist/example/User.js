"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lib_1 = require("../lib");
exports.EloquentMongooseBase = lib_1.default.Mongoose();
class User extends exports.EloquentMongooseBase {
    getClassName() {
        return User.className;
    }
    getSchema() {
        return new mongoose_1.Schema({
            first_name: { type: String },
            last_name: { type: String }
        });
    }
    get full_name() {
        return this.first_name + ' ' + this.last_name;
    }
    // custom static function of User model
    static getAllUsers() {
        return User.orderBy('last_name')
            .limit(10)
            .get();
    }
}
User.className = 'User';
exports.User = User;
//# sourceMappingURL=User.js.map