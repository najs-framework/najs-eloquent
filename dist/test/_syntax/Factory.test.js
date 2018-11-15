"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const lib_1 = require("../../lib");
describe('Syntax/Factory', function () {
    class User extends lib_1.Model {
    }
    User.className = 'SyntaxUser';
    najs_binding_1.register(User);
    class Post extends lib_1.Model {
        doSomething(...args) { }
    }
    Post.className = 'SyntaxPost';
    najs_binding_1.register(Post);
    lib_1.Factory.define(User, function (faker) {
        return {};
    });
    lib_1.Factory.define(Post, function (faker) {
        return {};
    });
    describe('Factory', function () {
        it('can be detect which Model is using without GenericType', function () {
            lib_1.Factory.make(User).first_name = 'test';
            const lastName = lib_1.Factory.make(User).last_name;
            lib_1.Factory.make(Post).content = lastName;
            lib_1.Factory.make(Post).doSomething();
        });
    });
    describe('factory()', function () {
        it('can be detect which Model is using without GenericType', function () {
            lib_1.factory(User).make().first_name;
            lib_1.factory(User).make().first_name = 'test';
            const lastName = lib_1.Factory.make(User).last_name;
            lib_1.factory(Post).make().content = lastName;
            lib_1.factory(Post)
                .make()
                .doSomething();
        });
        it('should detect the collection or singular model base on amount argument', function () {
            lib_1.factory(User).make().first_name = 'test';
            lib_1.factory(User, 2)
                .make()
                .map(item => item.attributesToObject());
            lib_1.factory(User, 'default').make().first_name = 'test';
            lib_1.factory(User, 'default', 2)
                .make()
                .map(item => item.attributesToObject());
        });
    });
});
