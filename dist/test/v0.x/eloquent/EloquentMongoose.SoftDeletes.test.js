"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const mongoose_1 = require("mongoose");
const najs_binding_1 = require("najs-binding");
const lib_1 = require("../../../lib");
const util_1 = require("../util");
const mongoose = require('mongoose');
const Moment = require('moment');
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
class User extends lib_1.Eloquent.Mongoose() {
    getClassName() {
        return User.className;
    }
    get full_name() {
        return this.attributes.first_name + ' ' + this.attributes.last_name;
    }
    set full_name(value) { }
    getFullNameAttribute() {
        return this.attributes.first_name + ' ' + this.attributes.last_name;
    }
    setFullNameAttribute(value) {
        const parts = value.split(' ');
        this.attributes['first_name'] = parts[0];
        this.attributes['last_name'] = parts[1];
    }
    getNickNameAttribute() {
        return this.attributes.first_name.toUpperCase();
    }
    setNickNameAttribute(value) {
        this.attributes['first_name'] = value.toLowerCase();
    }
    getSchema() {
        return new mongoose_1.Schema({
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            age: { type: Number, default: 0 }
        }, { collection: 'users', timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
    }
}
User.className = 'User';
describe('EloquentMongoose', function () {
    jest.setTimeout(10000);
    beforeAll(async function () {
        await util_1.init_mongoose(mongoose, 'eloquent_mongoose_soft_deletes');
    });
    afterAll(async function () {
        await util_1.delete_collection(mongoose, 'users');
        await util_1.delete_collection(mongoose, 'models');
        await util_1.delete_collection(mongoose, 'softdeletemodels');
        await util_1.delete_collection(mongoose, 'softdeleteusememberpropertymodels');
        await util_1.delete_collection(mongoose, 'softdelete1s');
        await util_1.delete_collection(mongoose, 'softdelete2s');
    });
    describe('SoftDeletes', function () {
        class SoftDeleteModel extends lib_1.Eloquent.Mongoose() {
            getClassName() {
                return 'SoftDeleteModel';
            }
            getSchema() {
                return new mongoose_1.Schema({ name: String });
            }
        }
        SoftDeleteModel.softDeletes = true;
        class SoftDeleteUseMemberPropertyModel extends lib_1.Eloquent.Mongoose() {
            constructor() {
                super(...arguments);
                this.softDeletes = true;
            }
            getClassName() {
                return 'SoftDeleteUseMemberPropertyModel';
            }
            getSchema() {
                return new mongoose_1.Schema({ name: String });
            }
        }
        it('does not load plugin SoftDelete with deleted_at by default', async function () {
            const model = new User();
            expect(model['schema'].path('deleted_at')).toBeUndefined();
            expect(model.newQuery()['softDelete']).toBe(false);
        });
        it('loads plugin SoftDelete with deleted_at by default', async function () {
            class SoftDelete1 extends lib_1.Eloquent.Mongoose() {
                getClassName() {
                    return 'SoftDelete1';
                }
                getSchema() {
                    return new mongoose_1.Schema({ name: String });
                }
            }
            SoftDelete1.softDeletes = true;
            const model = new SoftDelete1();
            expect(model['schema'].path('deleted_at')['instance']).toEqual('Date');
            expect(model['schema'].path('deleted_at')['defaultValue']).toBeDefined();
            expect(model.newQuery()['softDelete']).toMatchObject({
                deletedAt: 'deleted_at'
            });
        });
        it('has custom field for deletedAt', async function () {
            class SoftDelete2 extends lib_1.Eloquent.Mongoose() {
                getClassName() {
                    return 'SoftDelete2';
                }
                getSchema() {
                    return new mongoose_1.Schema({ name: String });
                }
            }
            SoftDelete2.softDeletes = { deletedAt: 'any' };
            const model = new SoftDelete2();
            expect(model['schema'].path('any')['instance']).toEqual('Date');
            expect(model['schema'].path('any')['defaultValue']).toBeDefined();
            expect(model['schema'].path('deleted_at')).toBeUndefined();
            expect(model.newQuery()['softDelete']).toMatchObject({
                deletedAt: 'any'
            });
        });
        it('works with ActiveRecord and use Moment as Date source', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const model = new SoftDeleteModel({
                name: 'test'
            });
            await model.delete();
            expect(model.deleted_at).toEqual(now);
            await model.restore();
            expect(model.deleted_at).toBeNull();
            await model.forceDelete();
        });
        it('works with settings as a member property', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const model = new SoftDeleteUseMemberPropertyModel({
                name: 'test'
            });
            await model.delete();
            expect(model.deleted_at).toEqual(now);
            await model.restore();
            expect(model.deleted_at).toBeNull();
            await model.forceDelete();
        });
        it('works with static functions', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            expect(await SoftDeleteModel.count()).toEqual(0);
            const notDeletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await notDeletedModel.save();
            const deletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await deletedModel.delete();
            expect(await SoftDeleteModel.count()).toEqual(1);
            expect(await SoftDeleteModel.withTrashed().count()).toEqual(2);
            expect(await SoftDeleteModel.onlyTrashed().count()).toEqual(1);
            await notDeletedModel.forceDelete();
            await deletedModel.forceDelete();
        });
        it('does not override .find or .findOne when use .native()', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const notDeletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await notDeletedModel.save();
            const deletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await deletedModel.delete();
            expect(await SoftDeleteModel.count()).toEqual(1);
            expect(await SoftDeleteModel.withTrashed().count()).toEqual(2);
            expect(await SoftDeleteModel.onlyTrashed().count()).toEqual(1);
            expect(await SoftDeleteModel.native(function (model) {
                return model.find();
            }).count()).toEqual(2);
            await notDeletedModel.forceDelete();
            await deletedModel.forceDelete();
        });
    });
});
