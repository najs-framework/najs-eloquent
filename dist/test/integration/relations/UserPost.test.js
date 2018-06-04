"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
const index_1 = require("../mongodb/index");
describe('Integration Test - Relation', function () {
    beforeAll(async function () {
        await index_1.init_mongoose('i_test_relation_has_one_or_many_user_post');
    });
    afterEach(async function () {
        await index_1.delete_collection(['users']);
        await index_1.delete_collection(['posts']);
    });
    it('can use with .associate() to assign the model to relation', async function () {
        const user = await lib_1.Factory.create(index_1.User);
        const postOne = await lib_1.Factory.make(index_1.Post);
        const postTwo = await lib_1.Factory.make(index_1.Post);
        console.log(postOne.toObject());
        user.getPostsRelation().associate(postOne);
        console.log(postOne.toObject());
        user.save();
        console.log(postTwo.toObject());
        postTwo.getUserRelation().associate(user);
        console.log(postTwo.toObject());
        await postTwo.save();
        // This is flaky test because the post saved async
        // const fresh = await Post.findOrFail(postOne.getPrimaryKey())
        // console.log(fresh)
        const freshUser = await user.fresh();
        await freshUser.load('posts');
        console.log(freshUser.posts);
    });
});
