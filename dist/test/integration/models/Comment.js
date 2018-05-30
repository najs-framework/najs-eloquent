"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
const lib_2 = require("../../../lib");
const User_1 = require("./User");
const Post_1 = require("./Post");
class Comment extends lib_1.EloquentMongoose {
    getClassName() {
        return Comment.className;
    }
    getUserRelation() {
        return this.defineRelationProperty('user').belongsTo(User_1.User);
    }
    getPostRelation() {
        return this.defineRelationProperty('post').belongsTo(Post_1.Post);
    }
}
Comment.className = 'Comment';
Comment.timestamps = true;
Comment.softDeletes = true;
Comment.schema = {
    user_id: { type: String, required: false },
    post_id: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    content: { type: String, required: true },
    like: { type: Number, required: false }
};
exports.Comment = Comment;
lib_2.Eloquent.register(Comment);
