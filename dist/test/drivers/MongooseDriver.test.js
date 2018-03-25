"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const najs_facade_1 = require("najs-facade");
const mongoose_1 = require("mongoose");
const util_1 = require("../util");
const Eloquent_1 = require("../../lib/model/Eloquent");
const MongooseDriver_1 = require("../../lib/drivers/MongooseDriver");
const FactoryFacade_1 = require("../../lib/facades/global/FactoryFacade");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const MongooseQueryBuilder_1 = require("../../lib/query-builders/mongodb/MongooseQueryBuilder");
const MongooseProviderFacade_1 = require("../../lib/facades/global/MongooseProviderFacade");
const EloquentMetadata_1 = require("../../lib/model/EloquentMetadata");
const SoftDelete_1 = require("../../lib/v0.x/eloquent/mongoose/SoftDelete");
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
    describe('.initialize()', function () {
        it('creates metadata, then calls .initializeModelIfNeeded() and .createAttributesByData()', function () {
            const model = {};
            const driver = new MongooseDriver_1.MongooseDriver(new User(), true);
            driver['eloquentModel'] = model;
            const getStub = Sinon.stub(EloquentMetadata_1.EloquentMetadata, 'get');
            getStub.returns('anything');
            const createAttributesByDataStub = Sinon.stub(driver, 'createAttributesByData');
            createAttributesByDataStub.callsFake(function () { });
            const initializeModelIfNeededStub = Sinon.stub(driver, 'initializeModelIfNeeded');
            initializeModelIfNeededStub.callsFake(function () { });
            driver.initialize();
            expect(getStub.calledWith(model)).toBe(true);
            expect(initializeModelIfNeededStub.called).toBe(true);
            expect(createAttributesByDataStub.calledWith()).toBe(true);
            driver.initialize({});
            expect(getStub.calledWith(model)).toBe(true);
            expect(initializeModelIfNeededStub.called).toBe(true);
            expect(createAttributesByDataStub.calledWith({})).toBe(true);
            const userModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const user = new userModel();
            driver.initialize(user);
            expect(getStub.calledWith(model)).toBe(true);
            expect(initializeModelIfNeededStub.called).toBe(true);
            expect(createAttributesByDataStub.calledWith(user)).toBe(true);
            initializeModelIfNeededStub.restore();
            getStub.restore();
        });
    });
    describe('protected .createAttributesByData()', function () {
        it('simply assigns data to attributes if the data is instance of "mongooseModel"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(new User(), true);
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const user = new UserModel();
            driver['createAttributesByData'](user);
            expect(driver['attributes'] === user).toBe(true);
        });
        it('creates new instance of "mongooseModel" and does nothing if data is not an plain object', function () {
            const driver = new MongooseDriver_1.MongooseDriver(new User(), true);
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            driver['createAttributesByData']();
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
        });
        it('creates new instance of "mongooseModel", call eloquentModel.fill if "isGuard" is true', function () {
            const driver = new MongooseDriver_1.MongooseDriver(new User(), true);
            const eloquentModel = {
                fill() { }
            };
            const fillSpy = Sinon.spy(eloquentModel, 'fill');
            driver['eloquentModel'] = eloquentModel;
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const data = { a: 'test' };
            driver['createAttributesByData'](data);
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
            expect(fillSpy.calledWith(data)).toBe(true);
        });
        it('creates new instance of "mongooseModel", call attributes.set() if "isGuard" is false', function () {
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            const eloquentModel = {
                fill() { }
            };
            const fillSpy = Sinon.spy(eloquentModel, 'fill');
            driver['eloquentModel'] = eloquentModel;
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const data = { first_name: 'test' };
            driver['createAttributesByData'](data);
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
            expect(driver['attributes'].first_name).toEqual('test');
            expect(fillSpy.calledWith(data)).toBe(false);
        });
    });
    describe('protected .initializeModelIfNeeded()', function () {
        it('does nothing if the model is already register to mongoose', function () {
            MongooseProviderFacade_1.MongooseProvider.createModelFromSchema('RegisteredModel', new mongoose_1.Schema({}));
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            const getMongooseSchemaSpy = Sinon.spy(driver, 'getMongooseSchema');
            driver['modelName'] = 'RegisteredModel';
            driver['initializeModelIfNeeded']();
            expect(getMongooseSchemaSpy.called).toBe(false);
        });
        it('calls .getMongooseSchema(), then calls MongooseProvider.createModelFromSchema() to register model', function () {
            const schema = {};
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            driver['metadata'] = {
                hasTimestamps() {
                    return false;
                },
                hasSoftDeletes() {
                    return false;
                }
            };
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded']();
            expect(getMongooseSchemaStub.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls schema.set("timestamps", metadata.timestamps()) if the metadata.hasTimestamps() returns true', function () {
            const schema = {
                set() { }
            };
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            driver['metadata'] = {
                hasTimestamps() {
                    return true;
                },
                timestamps() {
                    return 'anything';
                },
                hasSoftDeletes() {
                    return false;
                }
            };
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            const setSpy = Sinon.spy(schema, 'set');
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded']();
            expect(setSpy.calledWith('timestamps', 'anything')).toBe(true);
            expect(getMongooseSchemaStub.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls schema.plugin(Schema, metadata.softDeletes()) if the metadata.hasSoftDeletes() returns true', function () {
            const schema = {
                plugin() { }
            };
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            driver['metadata'] = {
                hasTimestamps() {
                    return false;
                },
                softDeletes() {
                    return 'anything';
                },
                hasSoftDeletes() {
                    return true;
                }
            };
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            const pluginSpy = Sinon.spy(schema, 'plugin');
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded']();
            expect(pluginSpy.calledWith(SoftDelete_1.SoftDelete, 'anything')).toBe(true);
            expect(getMongooseSchemaStub.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
    });
    describe('protected .getMongooseSchema()', function () {
        it('calls "eloquentModel".getSchema() if that is a function', function () {
            const driver = new MongooseDriver_1.MongooseDriver(new User(), false);
            const eloquentModel = {
                getSchema() {
                    return new mongoose_1.Schema({});
                }
            };
            driver['eloquentModel'] = eloquentModel;
            const getSchemaSpy = Sinon.spy(eloquentModel, 'getSchema');
            driver['getMongooseSchema']();
            expect(getSchemaSpy.called).toBe(true);
        });
        it('auto creates a schema by "schema" and "options" settings from EloquentMetadata', function () { });
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
                expect(query['softDelete']).toBeUndefined();
            });
            it('creates new instance of MongooseQueryBuilder with softDeletes options if metadata.hasSoftDeletes() returns true', function () {
                const softDeletes = { deletedAt: 'deleted_at' };
                const user = new User();
                user['driver']['queryLogGroup'] = 'test';
                user['driver']['metadata'] = {
                    hasSoftDeletes() {
                        return true;
                    },
                    softDeletes() {
                        return softDeletes;
                    }
                };
                const query = user['newQuery']();
                expect(query).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(query['logGroup']).toEqual('test');
                expect(query['softDelete'] === softDeletes).toBe(true);
            });
        });
        describe('.toObject()', function () {
            it('simply returns "attributes".toObject()', function () {
                const attributes = {
                    toObject() {
                        return { a: 'test' };
                    }
                };
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = attributes;
                const toObjectSpy = Sinon.spy(attributes, 'toObject');
                expect(driver.toObject()).toEqual({ a: 'test' });
                expect(toObjectSpy.called).toBe(true);
            });
        });
        describe('.toJSON()', function () {
            it('calls .toObject() transform _id to id, and calls .isVisible() to filter visible keys', function () {
                const user = new User();
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['eloquentModel'] = user;
                const toObjectStub = Sinon.stub(driver, 'toObject');
                toObjectStub.returns({
                    _id: 1,
                    a: 'a',
                    b: 'b',
                    c: 'c',
                    __v: 0
                });
                expect(driver.toJSON()).toEqual({ id: 1, a: 'a', b: 'b', c: 'c' });
                user.markHidden('a');
                expect(driver.toJSON()).toEqual({ id: 1, b: 'b', c: 'c' });
                user.markHidden('id', 'b', 'c').markVisible('b');
                expect(driver.toJSON()).toEqual({ b: 'b' });
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
            it('returns reserved names = "schema, collection, options, getSchema"', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                expect(driver.getReservedNames()).toEqual(['schema', 'collection', 'options', 'getSchema']);
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
                    'native',
                    // ISoftDeletesQuery
                    'withTrashed',
                    'onlyTrashed',
                    // Mongoose Query Helpers
                    'findOrFail',
                    'firstOrFail',
                    // IFetchResultQuery
                    'get',
                    'all',
                    'find',
                    'first',
                    'count',
                    'pluck',
                    'update'
                    // 'delete', conflict to .getDriverProxyMethods() then it should be removed
                    // 'restore', conflict to .getDriverProxyMethods() then it should be removed
                    // 'execute', removed because it could not run alone
                ]);
            });
        });
        // TODO: write test
        describe('.createStaticMethods()', function () { });
    });
    describe('ActiveRecord Functions', function () {
        describe('.touch()', function () {
            it('returns "eloquentModel" for chain-ing', function () {
                const eloquentModel = {};
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['eloquentModel'] = eloquentModel;
                driver['metadata'] = {
                    hasTimestamps() {
                        return false;
                    }
                };
                expect(driver.touch() === eloquentModel).toBe(true);
            });
            it('does nothing if metadata.hasTimestamps() is false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
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
                const markModifiedSpy = Sinon.spy(driver['attributes'], 'markModified');
                driver.touch();
                expect(markModifiedSpy.called).toBe(false);
            });
            it('calls "attributes".markModified() if metadata.hasTimestamps() return true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
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
                const markModifiedSpy = Sinon.spy(driver['attributes'], 'markModified');
                driver.touch();
                expect(markModifiedSpy.calledWith('updated')).toBe(true);
            });
        });
        describe('.save()', function () {
            it('simply calls "attributes".save()', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    save() { }
                };
                const saveSpy = Sinon.spy(driver['attributes'], 'save');
                driver.save();
                expect(saveSpy.called).toBe(true);
            });
        });
        describe('.delete()', function () {
            it('simply calls "attributes".delete() metadata.hasSoftDelete() returns true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    delete() { },
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return true;
                    }
                };
                const deleteSpy = Sinon.spy(driver['attributes'], 'delete');
                const removeSpy = Sinon.spy(driver['attributes'], 'remove');
                driver.delete();
                expect(deleteSpy.called).toBe(true);
                expect(removeSpy.called).toBe(false);
            });
            it('simply calls "attributes".remove() metadata.hasSoftDelete() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    delete() { },
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const deleteSpy = Sinon.spy(driver['attributes'], 'delete');
                const removeSpy = Sinon.spy(driver['attributes'], 'remove');
                driver.delete();
                expect(deleteSpy.called).toBe(false);
                expect(removeSpy.called).toBe(true);
            });
        });
        describe('.forceDelete()', function () {
            it('simply calls "attributes".remove() even metadata.hasSoftDeletes() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    remove() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const removeSpy = Sinon.spy(driver['attributes'], 'remove');
                driver.forceDelete();
                expect(removeSpy.called).toBe(true);
            });
        });
        describe('.restore()', function () {
            it('does nothing if metadata.hasSoftDeletes() returns false', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    restore() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return false;
                    }
                };
                const restoreSpy = Sinon.spy(driver['attributes'], 'restore');
                driver.restore();
                expect(restoreSpy.called).toBe(false);
            });
            it('calls "attributes".restore() if metadata.hasSoftDelete() return true', function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
                    restore() { }
                };
                driver['metadata'] = {
                    hasSoftDeletes() {
                        return true;
                    }
                };
                const restoreSpy = Sinon.spy(driver['attributes'], 'restore');
                driver.restore();
                expect(restoreSpy.called).toBe(true);
            });
        });
        describe('.fresh()', function () {
            it('always returns null if "attributes".isNew is true', async function () {
                const driver = new MongooseDriver_1.MongooseDriver(fakeModel, true);
                driver['attributes'] = {
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
