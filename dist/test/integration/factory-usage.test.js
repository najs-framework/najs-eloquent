"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const lib_1 = require("../../lib");
const mongoose_1 = require("mongoose");
const util_1 = require("../util");
const mongoose = require('mongoose');
class MongooseProvider {
    getClassName() {
        return MongooseProvider.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
MongooseProvider.className = 'MongooseProvider';
najs_binding_1.register(MongooseProvider);
describe('Integration Test - Factory Usage', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'integration_factory_usage');
    });
    afterAll(async function () {
        await util_1.delete_collection(mongoose, 'users');
    });
    describe('User model', function () {
        class User extends lib_1.Eloquent.Mongoose() {
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
        najs_binding_1.register(User);
        it('can use Factory.define() to define factory for model', function () {
            lib_1.Factory.define(User.className, (faker, attributes) => {
                return Object.assign({
                    email: faker.email(),
                    first_name: faker.first(),
                    last_name: faker.last(),
                    age: faker.age()
                }, attributes);
            });
        });
        it('can use factory(User).raw() to get raw attributes', async function () {
            lib_1.factory(User.className).raw({
                age: 20
            });
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
