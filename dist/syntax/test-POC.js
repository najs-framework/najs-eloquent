"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const def_POC_1 = require("./def-POC");
class ClassOne extends def_POC_1.Eloquent {
    static findByName() { }
    method() { }
}
class ClassOneChild extends ClassOne {
}
class ClassTwo extends def_POC_1.Eloquent {
    method() { }
}
class ClassTwoChild extends ClassOne {
}
class ClassThree extends def_POC_1.Eloquent.Mongoose() {
    method() { }
}
async function test() {
    const one = new ClassOne();
    const result = await one.select().first();
    if (result) {
        result.member = 'test';
    }
    const oneChild = new ClassOneChild();
    oneChild.id = 'test';
    const two = new ClassTwo();
    two.member = 'test';
    const twoChild = new ClassTwoChild();
    twoChild.member = 'test';
    const three = new ClassThree();
    const threeResult = await three.select().first();
    if (threeResult) {
    }
    const threeStaticResult = await ClassThree.select().first();
    if (threeStaticResult) {
        // threeStaticResult.
    }
}
test();
// import { Eloquent, WithStatic, EloquentMongoose, EloquentTest } from './def-POC'
// interface IModel {
//   member: string
// }
// class Model extends Eloquent.Mongoose<IModel>() implements IModel {
//   member: string
// }
// const first = Model.first()
// first.member = 'test'
// first.method()
// class Post extends (EloquentMongoose as WithStatic<IModel>) {
//   static firstPost(): Post {
//     return <any>{}
//   }
//   static allPosts(): Post[] {
//     return []
//   }
// }
// Post.allPosts()
// Post.firstPost().member = 'test'
// Post.firstPost().method()
// const post = new Post()
// post.member = 'test'
// post.method()
// const firstPost = Post.first()
// firstPost.member = 'test'
// firstPost.method()
// class User extends EloquentMongoose implements IModel {
//   member: string
// }
// const userInstance = new User()
// userInstance.first().member
// userInstance.member = 'test'
// userInstance.method()
// class IClass extends EloquentTest {
//   getSomething() {
//     this.test = 'test'
//   }
// }
// const instance = new IClass()
// instance.getId()
