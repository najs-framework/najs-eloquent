"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../lib/query-log/FlipFlopQueryLog");
const najs_binding_1 = require("najs-binding");
const Eloquent_1 = require("../../lib/model/Eloquent");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const MongodbDriver_1 = require("../../lib/drivers/MongodbDriver");
const util_1 = require("../util");
const Moment = require('moment');
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(MongodbDriver_1.MongodbDriver, 'mongodb', true);
class User extends Eloquent_1.Eloquent {
    constructor() {
        super(...arguments);
        this.schema = {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            age: { type: Number, default: 0 }
        };
    }
    getClassName() {
        return User.className;
    }
}
User.className = 'User';
describe('MongodbDriver.SoftDeletes', function () {
    jest.setTimeout(10000);
    beforeAll(async function () {
        await util_1.init_mongodb('mongodb_driver_soft_deletes');
    });
    afterAll(async function () {
        await util_1.delete_collection_use_mongodb('users');
        await util_1.delete_collection_use_mongodb('models');
        await util_1.delete_collection_use_mongodb('soft_delete_models');
        await util_1.delete_collection_use_mongodb('soft_delete_use_member_property_models');
        await util_1.delete_collection_use_mongodb('soft_delete_1s');
        await util_1.delete_collection_use_mongodb('soft_delete_2s');
    });
    describe('SoftDeletes', function () {
        class SoftDeleteModel extends Eloquent_1.Eloquent.Mongoose() {
            constructor() {
                super(...arguments);
                this.schema = { name: String };
            }
            getClassName() {
                return 'SoftDeleteModel';
            }
        }
        SoftDeleteModel.softDeletes = true;
        najs_binding_1.register(SoftDeleteModel);
        class SoftDeleteUseMemberPropertyModel extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.softDeletes = true;
                this.schema = { name: String };
            }
            getClassName() {
                return 'SoftDeleteUseMemberPropertyModel';
            }
        }
        it('does not load plugin SoftDelete with deleted_at by default', async function () {
            const model = new User();
            expect(model.newQuery()['softDelete']).toBeUndefined();
        });
        it('works with ActiveRecord and use Moment as Date source', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const model = new SoftDeleteModel({
                name: 'test'
            });
            await model.delete();
            expect(model['deleted_at']).toEqual(now);
            await model.restore();
            expect(model['deleted_at']).toBeNull();
            await model.forceDelete();
        });
        it('works with settings as a member property', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            const model = new SoftDeleteUseMemberPropertyModel({
                name: 'test'
            });
            await model.delete();
            expect(model['deleted_at']).toEqual(now);
            await model.restore();
            expect(model['deleted_at']).toBeNull();
            await model.forceDelete();
        });
        it('works with static functions', async function () {
            const now = new Date(1988, 4, 16);
            Moment.now = () => now;
            expect(await SoftDeleteModel['count']()).toEqual(0);
            const notDeletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await notDeletedModel.save();
            const deletedModel = new SoftDeleteModel({
                name: 'test'
            });
            await deletedModel.delete();
            expect(await SoftDeleteModel['count']()).toEqual(1);
            expect(await SoftDeleteModel['withTrashed']().count()).toEqual(2);
            expect(await SoftDeleteModel['onlyTrashed']().count()).toEqual(1);
            await notDeletedModel.forceDelete();
            await deletedModel.forceDelete();
        });
        it('does not override .find or .findOne when use .native()', async function () {
            const model = new SoftDeleteModel();
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
            expect(await model.count()).toEqual(1);
            expect(await model.withTrashed().count()).toEqual(2);
            expect(await model.onlyTrashed().count()).toEqual(1);
            // expect(
            //   await (model as any)
            //     .newQuery()
            //     .native(function(collection: any, conditions: any) {
            //       return collection.find(conditions)
            //     })
            //     .count()
            // ).toEqual(2)
            await notDeletedModel.forceDelete();
            await deletedModel.forceDelete();
        });
    });
});
