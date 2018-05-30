"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
const Post_1 = require("./Post");
class User extends lib_1.Eloquent {
    getClassName() {
        return User.className;
    }
    getHashedPassword() {
        return this.password;
    }
    setRawPassword(password) { }
    getPostsRelation() {
        return this.defineRelationProperty('posts').hasMany(Post_1.Post);
    }
}
User.className = 'User';
User.timestamps = true;
User.softDeletes = true;
User.fillable = ['email', 'first_name', 'last_name', 'age'];
User.hidden = ['password'];
User.schema = {
    email: { type: String, required: true },
    password: { type: String, required: false },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, default: 0 }
};
exports.User = User;
lib_1.Eloquent.register(User);
