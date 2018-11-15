"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lib_1 = require("../../../lib");
class Image extends lib_1.Model {
    constructor() {
        super(...arguments);
        this.fillable = ['imageable_type', 'imageable_id', 'url'];
    }
    getClassName() {
        return 'Image';
    }
}
lib_1.Model.register(Image);
class User extends lib_1.Model {
    getClassName() {
        return 'User';
    }
    get imageRelation() {
        return this.defineRelation('image').morphOne(Image, 'imageable');
    }
}
lib_1.Model.register(User);
class Post extends lib_1.Model {
    getClassName() {
        return 'Post';
    }
    get imageRelation() {
        return this.defineRelation('image').morphOne(Image, 'imageable');
    }
}
lib_1.Model.register(Post);
describe('MorphOne', function () {
    it('should work as expected', async function () {
        const user = new User();
        await user.save();
        const post = new Post();
        await post.save();
        const userImage = new Image({
            imageable_type: 'User',
            imageable_id: user.id,
            url: 'image for user'
        });
        await userImage.save();
        const postImage = new Image({
            imageable_type: 'Post',
            imageable_id: post.id,
            url: 'image for post'
        });
        await postImage.save();
        const result = await User.findOrFail(user.id);
        expect(user.image).toBeUndefined();
        await user.load('image');
        expect(user.image.attributesToObject()).toEqual(userImage.attributesToObject());
        expect(result.image).toBeUndefined();
        await result.load('image');
        expect(result.image.attributesToObject()).toEqual(userImage.attributesToObject());
    });
    describe('.associate()', function () {
        it('should work with not saved model', async function () {
            const user = new User();
            const image = new Image();
            user.imageRelation.associate(image);
            await user.save();
            await user.load('image');
            expect(user.toObject()).toEqual({
                id: user.id,
                image: {
                    imageable_id: user.id,
                    imageable_type: user.getModelName(),
                    id: image.id
                }
            });
        });
        it('should work with saved model', async function () {
            const user = new User();
            await user.save();
            const image = new Image();
            await image.save();
            user.imageRelation.associate(image);
            await user.save();
            await user.load('image');
            expect(user.toObject()).toEqual({
                id: user.id,
                image: {
                    imageable_id: user.id,
                    imageable_type: user.getModelName(),
                    id: image.id
                }
            });
        });
    });
});
