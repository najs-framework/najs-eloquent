"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const User_1 = require("./models/User");
const Post_1 = require("./models/Post");
const Comment_1 = require("./models/Comment");
const bson_1 = require("bson");
function createObjectId() {
    return new bson_1.ObjectId().toHexString();
}
lib_1.Factory.define(User_1.User, (faker, attributes) => {
    return Object.assign({
        email: faker.email(),
        first_name: faker.first(),
        last_name: faker.last(),
        age: faker.age()
    }, attributes);
});
lib_1.Factory.define(Post_1.Post, (faker, attributes) => {
    return Object.assign({
        user_id: createObjectId(),
        title: faker.sentence(),
        content: faker.paragraph(),
        view: faker.natural()
    }, attributes);
});
lib_1.Factory.define(Comment_1.Comment, (faker, attributes) => {
    return Object.assign({
        email: faker.email(),
        name: faker.name(),
        content: faker.paragraph(),
        like: faker.natural()
    }, attributes);
});
