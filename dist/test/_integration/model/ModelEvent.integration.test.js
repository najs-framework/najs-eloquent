"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
class User extends lib_1.Model {
    getClassName() {
        return 'ModelEvent.User';
    }
}
lib_1.Model.register(User);
class Post extends lib_1.Model {
    getClassName() {
        return 'ModelEvent.Post';
    }
}
lib_1.Model.register(Post);
describe('Model Event integration test', function () {
    it('should work with global event listener', async function () {
        const user = new User();
        const post = new Post();
        User.on('created', async function (createdModel) {
            if (createdModel instanceof User) {
                expect(createdModel === user).toBe(true);
            }
            else {
                expect(createdModel === post).toBe(true);
            }
        });
        // Post.once('created', async function(createdModel: any) {
        // console.log(arguments)
        // if (createdModel instanceof User) {
        //   expect(createdModel === user).toBe(true)
        // } else {
        //   expect(createdModel === post).toBe(true)
        // }
        // })
        await user.save();
        await post.save();
    });
});
