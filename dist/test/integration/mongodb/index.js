"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../ModelFactory");
const lib_1 = require("../../../lib");
const User_1 = require("../models/User");
exports.User = User_1.User;
const Post_1 = require("../models/Post");
exports.Post = Post_1.Post;
const Comment_1 = require("../models/Comment");
exports.Comment = Comment_1.Comment;
lib_1.EloquentDriverProvider.register(lib_1.MongooseDriver, 'mongoose', true);
lib_1.Eloquent.register(User_1.User);
lib_1.Eloquent.register(Post_1.Post);
lib_1.Eloquent.register(Comment_1.Comment);
function init_mongoose(name) {
    return new Promise(resolve => {
        const mongoose = lib_1.MongooseProvider.getMongooseInstance();
        mongoose.connect('mongodb://localhost/najs_eloquent_test_' + name);
        mongoose.Promise = global.Promise;
        mongoose.connection.once('open', () => {
            resolve(true);
        });
    });
}
exports.init_mongoose = init_mongoose;
function delete_collection(collections) {
    return new Promise(resolve => {
        for (const collection of collections) {
            lib_1.MongooseProvider.getMongooseInstance()
                .connection.collection(collection)
                .drop(resolve);
        }
    });
}
exports.delete_collection = delete_collection;
