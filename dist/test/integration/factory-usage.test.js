"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const v1_1 = require("../../lib/v1");
const mongoose_1 = require("mongoose");
const util_1 = require("../util");
const mongoose = require('mongoose');
v1_1.EloquentDriverProvider.register(v1_1.MongooseDriver, 'mongoose', true);
describe('Integration Test - Factory Usage', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'integration_factory_usage');
    });
    afterAll(async function () {
        await util_1.delete_collection(mongoose, 'users');
    });
    describe('User model', function () {
        class User extends v1_1.Eloquent {
            getClassName() {
                return User.className;
            }
            getSchema() {
                return new mongoose_1.Schema({
                    email: { type: String, required: true },
                    first_name: { type: String, required: true },
                    last_name: { type: String, required: true },
                    age: { type: Number, default: 0 }
                }, { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
            }
        }
        User.className = 'User';
        v1_1.Eloquent.register(User);
        v1_1.Eloquent.register(User);
        it('can use Factory.define() to define factory for model', function () {
            v1_1.Factory.define(User.className, (faker, attributes) => {
                return Object.assign({
                    email: faker.email(),
                    first_name: faker.first(),
                    last_name: faker.last(),
                    age: faker.age()
                }, attributes);
            });
        });
        it('can use factory(User).raw() to get raw attributes', async function () {
            const user = await v1_1.factory(User.className).create({
                age: 20
            });
            expect((await User['find']()).toJson()).toEqual(user.toJson());
            await User['delete'](user.id);
            expect(await User['count']()).toEqual(0);
            // const user: User
            // user.getId()
            // user.getId()
            // console.log(raw)
            // console.log(
            //   factory(User.className)
            //     .make()
            //     .toJson()
            // )
            // console.log(await factory(User.className).create())
        });
    });
});
