"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
const User_1 = require("./User");
const Comment_1 = require("./Comment");
exports.PostBase = lib_1.Eloquent.Mongoose();
class Post extends exports.PostBase {
    getClassName() {
        return Post.className;
    }
    getUserRelation() {
        return this.defineRelationProperty('user').belongsTo(User_1.User);
    }
    getCommentsRelation() {
        return this.defineRelationProperty('comments').hasMany(Comment_1.Comment);
    }
}
Post.className = 'Post';
Post.timestamps = true;
Post.softDeletes = true;
Post.schema = {
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    view: { type: Number, required: false }
};
exports.Post = Post;
lib_1.Eloquent.register(Post);
