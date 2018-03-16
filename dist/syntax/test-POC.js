"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_POC_1 = require("./def-POC");
class Model extends def_POC_1.Eloquent.Mongoose() {
}
const first = Model.first();
first.member = 'test';
first.method();
class Post extends def_POC_1.EloquentMongoose {
    static firstPost() {
        return {};
    }
    static allPosts() {
        return [];
    }
}
Post.allPosts();
Post.firstPost().member = 'test';
Post.firstPost().method();
const post = new Post();
post.member = 'test';
post.method();
const firstPost = Post.first();
firstPost.member = 'test';
firstPost.method();
class User extends def_POC_1.EloquentMongoose {
}
const userInstance = new User();
userInstance.first().member;
userInstance.member = 'test';
userInstance.method();
