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
    describe('.associate()', function () {
        it('works with .hasMany() from parent model. After saving user, post is also saved.', async function () {
            const user = lib_1.Factory.make(index_1.User);
            const post = lib_1.Factory.make(index_1.Post);
            user.getPostsRelation().associate(post);
            await user.save();
            await user.load('posts');
            expect(user.posts.first().toJSON()).toEqual(post.toJSON());
        });
        it('throws TypeError if associate invalid model with .hasMany()', function () {
            const user = lib_1.Factory.make(index_1.User);
            try {
                user.getPostsRelation().associate(lib_1.Factory.make(index_1.Comment));
            }
            catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect(error.message).toEqual('Can not associate model Comment to User.');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
        it('works with inverse relation .belongsTo(). After saving post, user is also saved.', async function () {
            const user = lib_1.Factory.make(index_1.User);
            const post = lib_1.Factory.make(index_1.Post);
            post.getUserRelation().associate(user);
            await post.save();
            await post.load('user');
            expect(post.user.toJSON()).toEqual(user.toJSON());
        });
        it('throws TypeError if associate invalid model with .belongsTo()', function () {
            const post = lib_1.Factory.make(index_1.Post);
            try {
                post.getUserRelation().associate(lib_1.Factory.make(index_1.Comment));
            }
            catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect(error.message).toEqual('Can not associate model Comment to Post.');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
});
