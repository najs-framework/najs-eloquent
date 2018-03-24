"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const util_1 = require("../util");
const Eloquent_1 = require("../../lib/model/Eloquent");
const MongooseDriver_1 = require("../../lib/drivers/MongooseDriver");
const FactoryFacade_1 = require("../../lib/facades/global/FactoryFacade");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const MongooseQueryBuilder_1 = require("../../lib/query-builders/mongodb/MongooseQueryBuilder");
const MongooseProviderFacade_1 = require("../../lib/facades/global/MongooseProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(MongooseDriver_1.MongooseDriver, 'mongoose', true);
class User extends Eloquent_1.Eloquent {
    constructor() {
        super(...arguments);
        this.schema = {
            email: { type: String, required: true },
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
najs_binding_1.register(User);
// Factory definitions
FactoryFacade_1.Factory.define(User.className, (faker, attributes) => {
    return Object.assign({
        email: faker.email(),
        first_name: faker.first(),
        last_name: faker.last(),
        age: faker.age()
    }, attributes);
});
const fakeModel = {
    getModelName() {
        return 'model';
    }
};
describe('MongooseDriver', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'drivers_mongoose_driver');
    });
    afterAll(async function () {
        await util_1.delete_collection(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'users');
    });
    it('implements IAutoload', function () {
        const model = {
            getModelName() {
                return 'model';
            }
        };
        const driver = new MongooseDriver_1.MongooseDriver(model, true);
        expect(driver.getClassName()).toEqual('NajsEloquent.MongooseDriver');
    });
    describe('constructor()', function () { });
    // TODO: write more tests
    describe('.initialize()', function () {
        it('creates metadata, and calls .initializeModelIfNeeded()', function () {
            // const driver = new MongooseDriver(new User(), true)
            // driver.initialize({})
            // driver.initialize(new User())
            const user = new User({});
            new User(user);
        });
    });
    // TODO: write more tests
    describe('protected .initializeModelIfNeeded()', function () { });
    it('works', async function () {
        // const userModel = new User()
        // await factory(User.className).create()
        // console.log(await userModel['count']())
        // User.where('')
    });
    describe('implements IEloquentDriver', function () {
        describe('.getRecord()', function () {
            it('returns "attributes" property', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                const attributes = {};
                driver['attributes'] = attributes;
                expect(driver.getRecord() === attributes).toBe(true);
            });
        });
        describe('.getAttribute()', function () {
            it('returns "attributes"[name]', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                const attributes = {
                    a: 1,
                    b: '2'
                };
                driver['attributes'] = attributes;
                expect(driver.getAttribute('a') === attributes['a']).toBe(true);
                expect(driver.getAttribute('b') === attributes['b']).toBe(true);
                expect(driver.getAttribute('c')).toBeUndefined();
            });
        });
        describe('.setAttribute()', function () {
            it('assigns "attributes"[name] = value and always return true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                const attributes = {};
                driver['attributes'] = attributes;
                expect(driver.setAttribute('a', 1)).toBe(true);
                expect(driver.setAttribute('b', 2)).toBe(true);
                expect(attributes).toEqual({ a: 1, b: 2 });
            });
        });
        describe('.getId()', function () {
            it('returns "attributes._id"', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                const attributes = {
                    _id: 123456
                };
                driver['attributes'] = attributes;
                expect(driver.getId()).toEqual(123456);
            });
        });
        describe('.setId()', function () {
            it('sets value to "attributes._id"', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                const attributes = {};
                driver['attributes'] = attributes;
                driver.setId(123456);
                expect(attributes['_id']).toEqual(123456);
            });
        });
        describe('.newQuery()', function () {
            it('returns new instance of MongooseQueryBuilder with .setLogGroup() is called', function () {
                const user = new User();
                user['driver']['queryLogGroup'] = 'test';
                const query = user['newQuery']();
                expect(query).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(query['logGroup']).toEqual('test');
            });
        });
        describe('.toObject()', function () {
            // TODO: write a test
            it('works (not finished yet)', function () {
                const user = new User();
                user.toObject();
            });
        });
        describe('.toJSON()', function () {
            // TODO: write a test
            it('works (not finished yet)', function () {
                const user = new User();
                user.toJSON();
            });
        });
        describe('.is()', function () {
            it('returns true if the compared model has same id with current model', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = { _id: 1, name: 'model 1' };
                const compared = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                compared['attributes'] = { _id: 1, name: 'model 2' };
                expect(driver.is(compared)).toBe(true);
                compared['attributes'] = { _id: 2, name: 'model 2' };
                expect(driver.is(compared)).toBe(false);
            });
        });
        describe('.formatAttributeName()', function () {
            it('uses Lodash.snakeCase() to format the attribute name', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                expect(driver.formatAttributeName('Test')).toEqual('test');
                expect(driver.formatAttributeName('createdAt')).toEqual('created_at');
                expect(driver.formatAttributeName('created_At')).toEqual('created_at');
            });
        });
        describe('.getReservedNames()', function () {
            it('returns reserved names = "schema, collection, options"', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                expect(driver.getReservedNames()).toEqual(['schema', 'collection', 'options']);
            });
        });
        describe('.getDriverProxyMethods()', function () {
            it('returns some models method names like "is", "get" and all ActiveRecord methods name', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                expect(driver.getDriverProxyMethods()).toEqual([
                    'is',
                    'getId',
                    'setId',
                    'newQuery',
                    'touch',
                    'save',
                    'delete',
                    'forceDelete',
                    'restore',
                    'fresh'
                ]);
            });
        });
        describe('.getQueryProxyMethods()', function () {
            it('returns basic query, condition query method and some fetch result method names without "delete" and "restore"', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                expect(driver.getQueryProxyMethods()).toEqual([
                    // IBasicQuery
                    'queryName',
                    'select',
                    'distinct',
                    'orderBy',
                    'orderByAsc',
                    'orderByDesc',
                    'limit',
                    // IConditionQuery
                    'where',
                    'orWhere',
                    'whereIn',
                    'whereNotIn',
                    'orWhereIn',
                    'orWhereNotIn',
                    'whereNull',
                    'whereNotNull',
                    'orWhereNull',
                    'orWhereNotNull',
                    // IFetchResultQuery
                    'get',
                    'all',
                    'find',
                    'first',
                    'count',
                    'pluck',
                    'update',
                    // 'delete', conflict to .getDriverProxyMethods() then it should be removed
                    // 'restore', conflict to .getDriverProxyMethods() then it should be removed
                    'execute'
                ]);
            });
        });
    });
    describe('ActiveRecord Functions', function () {
        describe('.touch()', function () {
            it('does nothing if metadata.hasTimestamps() is false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    markModified() { }
                };
                driver['metadata'] = {
                    hasTimestamps() {
                        return false;
                    },
                    timestamps() {
                        return { updatedAt: 'updated' };
                    }
                };
                const markModifiedSpy = Sinon.spy(driver.attributes, 'markModified');
                driver.touch();
                expect(markModifiedSpy.called).toBe(false);
            });
            it('calls "attributes".markModified() if metadata.hasTimestamps() return true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    markModified() { }
                };
                driver['metadata'] = {
                    hasTimestamps() {
                        return true;
                    },
                    timestamps() {
                        return { updatedAt: 'updated' };
                    }
                };
                const markModifiedSpy = Sinon.spy(driver.attributes, 'markModified');
                driver.touch();
                expect(markModifiedSpy.calledWith('updated')).toBe(true);
            });
        });
        describe('.save()', function () {
            it('simply calls "attributes".save()', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    save() { }
                };
                const saveSpy = Sinon.spy(driver.attributes, 'save');
                driver.save();
                expect(saveSpy.called).toBe(true);
            });
        });
        describe('.delete()', function () {
            it('simply calls "attributes".delete() metadata.hasSoftDelete() returns true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    delete() { },
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return true;
                    }
                };
                const deleteSpy = Sinon.spy(driver.attributes, 'delete');
                const removeSpy = Sinon.spy(driver.attributes, 'remove');
                driver.delete();
                expect(deleteSpy.called).toBe(true);
                expect(removeSpy.called).toBe(false);
            });
            it('simply calls "attributes".remove() metadata.hasSoftDelete() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    delete() { },
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const deleteSpy = Sinon.spy(driver.attributes, 'delete');
                const removeSpy = Sinon.spy(driver.attributes, 'remove');
                driver.delete();
                expect(deleteSpy.called).toBe(false);
                expect(removeSpy.called).toBe(true);
            });
        });
        describe('.forceDelete()', function () {
            it('simply calls "attributes".remove() even metadata.hasSoftDeletes() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const removeSpy = Sinon.spy(driver.attributes, 'remove');
                driver.forceDelete();
                expect(removeSpy.called).toBe(true);
            });
        });
        describe('.restore()', function () {
            it('does nothing if metadata.hasSoftDeletes() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    restore() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const restoreSpy = Sinon.spy(driver.attributes, 'restore');
                driver.restore();
                expect(restoreSpy.called).toBe(false);
            });
            it('calls "attributes".restore() if metadata.hasSoftDelete() return true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    restore() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return true;
                    }
                };
                const restoreSpy = Sinon.spy(driver.attributes, 'restore');
                driver.restore();
                expect(restoreSpy.called).toBe(true);
            });
        });
        describe('.fresh()', function () {
            it('always returns null if "attributes".isNew is true', async function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver.attributes = {
                    isNew: true
                };
                expect(await driver.fresh()).toBeNull();
            });
            it('find fresh instance of model in the database if it not new', async function () {
                const user = await FactoryFacade_1.factory(User.className).create();
                const originalFirstName = user.first_name;
                user.first_name = 'test';
                const fresh = await user.fresh();
                expect(fresh.first_name).toEqual(originalFirstName);
            });
        });
    });
});
