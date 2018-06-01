"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
const index_1 = require("../mongodb/index");
describe('Integration Test - Relation', function () {
    beforeAll(async function () {
        await index_1.init_mongoose('i_test_relation_has_one_or_many');
    });
    afterEach(async function () {
        await index_1.delete_collection(['users']);
    });
    it('init test data', async function () {
        const user1 = await lib_1.factory(index_1.User).create();
        const post11 = await lib_1.factory(index_1.Post).create({
            user_id: user1.id
        });
        await lib_1.factory(index_1.Comment).create({
            user_id: user1.id,
            post_id: post11.id
        });
        await lib_1.factory(index_1.Comment).create({
            user_id: user1.id,
            post_id: post11.id
        });
        const userModel = new index_1.User();
        const data = await userModel.first();
        if (data) {
            // console.log(data['relations'])
            await data.load('posts.comments');
            // console.log(data['relations'])
            // console.log(data.posts)
            const post = data.posts.first();
            // console.log(post.comments)
            // console.log(post.user)
            // console.log(post['relations'])
            // console.log(post['relationsMap'])
            // console.log(post.getUserRelation())
            // console.log(data.getPostsRelation())
            post.comments.first().getUserRelation();
            post.comments.first().getPostRelation();
            // console.log(post.getRelationDataBucket())
            // console.log(post.comments!.first().post)
            // console.log(data.getRelationDataBucket())
            // console.log(post.getRelationDataBucket())
            // console.log(await data.posts!.first().load('comments'))
            // console.log(data['relations'])
            // console.log(data.getPostsRelation().getData())
            // console.log(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(data)))
            // console.log((await userModel.first())!.posts)
            // console.log(Object.getPrototypeOf(data).posts)
            // console.log(data['getModelName'])
            // console.log(data.getPostsRelation().getData())
            // console.log(data.posts!.first().comments)
            // console.log(data.posts!.first()['relationsMap'])
            // console.log(data.getRelationDataBucket()!['bucket'])
            // data.getPostsRelation()['buildData']()
            // console.log(data.posts!.first().comments)
        }
    });
    it('should work', async function () { });
});
