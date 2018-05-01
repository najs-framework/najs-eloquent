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
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const MongooseProviderFacade_1 = require("../../lib/facades/global/MongooseProviderFacade");
const SoftDelete_1 = require("../../lib/drivers/mongoose/SoftDelete");
const MongooseQueryBuilderWrapper_1 = require("../../lib/wrappers/MongooseQueryBuilderWrapper");
const MongooseQueryBuilder_1 = require("../../lib/query-builders/mongodb/MongooseQueryBuilder");
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
const modelInstance = new User();
describe('MongooseDriver', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'drivers_mongoose_driver');
    });
    afterAll(async function () {
        await util_1.delete_collection(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'users');
    });
    it('implements IAutoload and return NajsEloquent.Driver.MongooseDriver', function () {
        const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
        expect(driver.getClassName()).toEqual('NajsEloquent.Driver.MongooseDriver');
    });
    describe('constructor()', function () { });
    describe('.initialize()', function () {
        it('creates metadata, then calls .initializeModelIfNeeded() and .createAttributesByData()', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const createAttributesByDataStub = Sinon.stub(driver, 'createAttributesByData');
            createAttributesByDataStub.callsFake(function () { });
            const initializeModelIfNeededStub = Sinon.stub(driver, 'initializeModelIfNeeded');
            initializeModelIfNeededStub.callsFake(function () { });
            driver.initialize(modelInstance, true);
            expect(initializeModelIfNeededStub.calledWith(modelInstance)).toBe(true);
            expect(createAttributesByDataStub.calledWith(modelInstance, true, undefined)).toBe(true);
            driver.initialize(modelInstance, false, {});
            expect(initializeModelIfNeededStub.calledWith(modelInstance)).toBe(true);
            expect(createAttributesByDataStub.calledWith(modelInstance, false, {})).toBe(true);
            const userModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const user = new userModel();
            driver.initialize(modelInstance, true, user);
            expect(initializeModelIfNeededStub.calledWith(modelInstance)).toBe(true);
            expect(createAttributesByDataStub.calledWith(modelInstance, true, user)).toBe(true);
        });
    });
    describe('protected .createAttributesByData()', function () {
        it('simply assigns data to attributes if the data is instance of "mongooseModel"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const user = new UserModel();
            driver['createAttributesByData'](modelInstance, true, user);
            expect(driver['attributes'] === user).toBe(true);
        });
        it('creates new instance of "mongooseModel" and does nothing if data is not an plain object', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            driver['createAttributesByData'](modelInstance, true);
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
        });
        it('creates new instance of "mongooseModel", call eloquentModel.fill if "isGuard" is true', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const fillSpy = Sinon.spy(modelInstance, 'fill');
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const data = { a: 'test' };
            driver['createAttributesByData'](modelInstance, true, data);
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
            expect(fillSpy.calledWith(data)).toBe(true);
            fillSpy.restore();
        });
        it('creates new instance of "mongooseModel", call attributes.set() if "isGuard" is false', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const fillSpy = Sinon.spy(modelInstance, 'fill');
            expect(driver['attributes']).toBeUndefined();
            const UserModel = MongooseProviderFacade_1.MongooseProvider.getMongooseInstance().model('User');
            const data = { first_name: 'test' };
            driver['createAttributesByData'](modelInstance, false, data);
            expect(driver['attributes']).toBeInstanceOf(UserModel);
            expect(driver['attributes'].isNew).toBe(true);
            expect(driver['attributes']['first_name']).toEqual('test');
            expect(fillSpy.calledWith(data)).toBe(false);
            fillSpy.restore();
        });
    });
    describe('protected .initializeModelIfNeeded()', function () {
        it('does nothing if the model is already register to mongoose', function () {
            MongooseProviderFacade_1.MongooseProvider.createModelFromSchema('RegisteredModel', new mongoose_1.Schema({}));
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const getMongooseSchemaSpy = Sinon.spy(driver, 'getMongooseSchema');
            driver['modelName'] = 'RegisteredModel';
            driver['initializeModelIfNeeded'](modelInstance);
            expect(getMongooseSchemaSpy.called).toBe(false);
        });
        it('calls .getMongooseSchema(), then calls MongooseProvider.createModelFromSchema() to register model', function () {
            const schema = {};
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded'](modelInstance);
            expect(getMongooseSchemaStub.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
        });
        it('calls schema.set("timestamps", model.getTimestampsSetting()) if the model.hasTimestamps() returns true', function () {
            const schema = {
                set() { }
            };
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const hasTimestampsStub = Sinon.stub(modelInstance, 'hasTimestamps');
            hasTimestampsStub.returns(true);
            const getTimestampsSettingStub = Sinon.stub(modelInstance, 'getTimestampsSetting');
            getTimestampsSettingStub.returns('anything');
            const hasSoftDeletesStub = Sinon.stub(modelInstance, 'hasSoftDeletes');
            hasSoftDeletesStub.returns(false);
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            const setSpy = Sinon.spy(schema, 'set');
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded'](modelInstance);
            expect(setSpy.calledWith('timestamps', 'anything')).toBe(true);
            expect(getMongooseSchemaStub.called).toBe(true);
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
            getTimestampsSettingStub.restore();
            hasTimestampsStub.restore();
            hasSoftDeletesStub.restore();
        });
        it('calls schema.plugin(Schema, model.getSoftDeletesSetting()) if the model.hasSoftDeletes() returns true', function () {
            const schema = {
                plugin() { }
            };
            najs_facade_1.Facade(MongooseProviderFacade_1.MongooseProvider)
                .shouldReceive('createModelFromSchema')
                .withArgs('Test', schema);
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const hasTimestampsStub = Sinon.stub(modelInstance, 'hasTimestamps');
            hasTimestampsStub.returns(false);
            const getSoftDeletesSettingStub = Sinon.stub(modelInstance, 'getSoftDeletesSetting');
            getSoftDeletesSettingStub.returns({ deletedAt: 'anything' });
            const hasSoftDeletesStub = Sinon.stub(modelInstance, 'hasSoftDeletes');
            hasSoftDeletesStub.returns(true);
            const getMongooseSchemaStub = Sinon.stub(driver, 'getMongooseSchema');
            getMongooseSchemaStub.returns(schema);
            const pluginSpy = Sinon.spy(schema, 'plugin');
            driver['modelName'] = 'Test';
            driver['initializeModelIfNeeded'](modelInstance);
            expect(pluginSpy.calledWith(SoftDelete_1.SoftDelete, { deletedAt: 'anything' })).toBe(true);
            expect(getMongooseSchemaStub.called).toBe(true);
            expect(driver['softDeletesSetting']).toEqual({ deletedAt: 'anything' });
            najs_facade_1.FacadeContainer.verifyAndRestoreAllFacades();
            getSoftDeletesSettingStub.restore();
            hasTimestampsStub.restore();
            hasSoftDeletesStub.restore();
        });
    });
    describe('protected .getMongooseSchema()', function () {
        it('calls "eloquentModel".getSchema() if that is a function', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const eloquentModel = {
                getSchema() {
                    return new mongoose_1.Schema({});
                }
            };
            const getSchemaSpy = Sinon.spy(eloquentModel, 'getSchema');
            driver['getMongooseSchema'](eloquentModel);
            expect(getSchemaSpy.called).toBe(true);
        });
        it('auto creates a schema by "schema" and "options" settings from Model', function () { });
    });
    describe('protected .getCollectionName()', function () {
        it('returns plural version with snake case', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const dataset = {
                TestSomething: 'test_somethings',
                User: 'users',
                Company: 'companies',
                Shoe: 'shoes',
                CompanyTax: 'company_taxes'
            };
            for (const name in dataset) {
                driver['modelName'] = name;
                expect(driver['getCollectionName']()).toEqual(dataset[name]);
            }
        });
    });
    describe('.getRecordName()', function () {
        it('returns collection name of attributes if attributes && attributes.collection is not undefined', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver.initialize(modelInstance, true, {});
            expect(driver.getRecordName()).toEqual('users');
        });
        it('returns .getCollectionName() in case the driver is not initialized', function () {
            const notInitializedDriver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(notInitializedDriver.getRecordName()).toEqual('users');
        });
    });
    describe('.getRecord()', function () {
        it('returns "attributes" property', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const attributes = {};
            driver['attributes'] = attributes;
            expect(driver.getRecord() === attributes).toBe(true);
        });
    });
    describe('.setRecord()', function () {
        it('sets "attributes" property with given record', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const attributes = {};
            driver.setRecord(attributes);
            expect(driver['attributes'] === attributes).toBe(true);
            expect(driver.getRecord() === attributes).toBe(true);
        });
    });
    describe('.useEloquentProxy()', function () {
        it('returns true, that means it depends on EloquentProxy', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver.useEloquentProxy()).toBe(true);
        });
        it('can fill the value automatically by proxy', function () {
            const user = new User();
            user['first_name'] = 'test';
            expect(user['driver']).toBeInstanceOf(MongooseDriver_1.MongooseDriver);
            expect(user
                .markVisible('first_name')
                .markHidden('id')
                .toJSON()).toEqual({ first_name: 'test' });
            expect(user['first_name']).toEqual('test');
        });
    });
    describe('.shouldBeProxied()', function () {
        it('returns true if the key is not "schema" or "options"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver.shouldBeProxied('a')).toBe(true);
            expect(driver.shouldBeProxied('schemas')).toBe(true);
            expect(driver.shouldBeProxied('option')).toBe(true);
            expect(driver.shouldBeProxied('schema')).toBe(false);
            expect(driver.shouldBeProxied('options')).toBe(false);
        });
        it('should be returns original schema setup of Model', function () {
            const user = new User();
            expect(user.schema).toEqual({
                email: { type: String, required: true },
                first_name: { type: String, required: true },
                last_name: { type: String, required: true },
                age: { type: Number, default: 0 }
            });
        });
    });
    describe('.proxify()', function () {
        it('calls .getAttribute() if the type is "get"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const getAttributeStub = Sinon.stub(driver, 'getAttribute');
            getAttributeStub.returns('anything');
            expect(driver.proxify('get', {}, 'test')).toBe('anything');
            expect(getAttributeStub.calledWith('test')).toBe(true);
        });
        it('calls .setAttribute() if the type is "set"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const setAttributeStub = Sinon.stub(driver, 'setAttribute');
            setAttributeStub.returns('anything');
            expect(driver.proxify('set', {}, 'test', 'value')).toBe('anything');
            expect(setAttributeStub.calledWith('test', 'value')).toBe(true);
        });
    });
    describe('.hasAttribute()', function () {
        it('returns true if the attributes is defined in model.schema', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const schema = { test: String };
            driver['schema'] = schema;
            expect(driver.hasAttribute('test')).toBe(true);
            expect(driver.hasAttribute('not-found')).toBe(false);
        });
    });
    describe('.getAttribute()', function () {
        it('calls and returns attributes.get()', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                get() {
                    return 'anything';
                }
            };
            const getSpy = Sinon.spy(driver['attributes'], 'get');
            expect(driver.getAttribute('test')).toEqual('anything');
            expect(getSpy.calledWith('test')).toBe(true);
        });
    });
    describe('.setAttribute()', function () {
        it('calls attributes.set() and always returns true', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                set() {
                    return 'anything';
                }
            };
            const setSpy = Sinon.spy(driver['attributes'], 'set');
            expect(driver.setAttribute('test', 'value')).toEqual(true);
            expect(setSpy.calledWith('test', 'value')).toBe(true);
        });
    });
    describe('.getPrimaryKeyName()', function () {
        it('always returns "_id"', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver.getPrimaryKeyName()).toEqual('_id');
        });
    });
    describe('.toObject()', function () {
        it('calls and returns attributes.toObject()', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                toObject() {
                    return 'anything';
                }
            };
            expect(driver.toObject()).toEqual('anything');
        });
    });
    describe('.newQuery()', function () {
        it('returns MongooseQueryBuilderWrapper which wrap MongooseQueryBuilder', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const queryBuilderWrapper = driver.newQuery();
            expect(queryBuilderWrapper).toBeInstanceOf(MongooseQueryBuilderWrapper_1.MongooseQueryBuilderWrapper);
            expect(queryBuilderWrapper['modelName']).toEqual(driver['modelName']);
            expect(queryBuilderWrapper['queryBuilder']).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
        });
    });
    describe('.delete()', function () {
        it('calls and returns attributes.delete() if softDeletes param = true', async function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                async delete() {
                    return 'delete';
                },
                async remove() {
                    return 'remove';
                }
            };
            expect(await driver.delete(true)).toEqual('delete');
        });
        it('calls and returns attributes.remove() if softDeletes param = false', async function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                async delete() {
                    return 'delete';
                },
                async remove() {
                    return 'remove';
                }
            };
            expect(await driver.delete(false)).toEqual('remove');
        });
    });
    describe('.restore()', function () {
        it('calls and returns attributes.restore()', async function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                async restore() {
                    return 'anything';
                }
            };
            expect(await driver.restore()).toEqual('anything');
        });
    });
    describe('.save()', function () {
        it('calls and returns attributes.save()', async function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                async save() {
                    return 'anything';
                }
            };
            expect(await driver.save()).toEqual('anything');
        });
    });
    describe('.markModified()', function () {
        it('calls and returns attributes.markModified()', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                markModified(name) {
                    return 'mark-' + name;
                }
            };
            const markModifiedSpy = Sinon.spy(driver['attributes'], 'markModified');
            driver.markModified('test');
            expect(markModifiedSpy.calledWith('test')).toBe(true);
        });
    });
    describe('.isNew()', function () {
        it('returns attributes.isNew', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                isNew: 'anything'
            };
            expect(driver.isNew()).toEqual('anything');
        });
    });
    describe('.isSoftDeleted()', function () {
        it('always returns false if this.softDeletesSetting is not found', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['softDeletesSetting'] = undefined;
            expect(driver.isSoftDeleted()).toEqual(false);
        });
        it('calls attributes.get(this.softDeletesSetting.deletedAt) and returns true if the value is not null', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            driver['attributes'] = {
                get() { }
            };
            driver['softDeletesSetting'] = { deletedAt: 'anything', overrideMethods: true };
            const getStub = Sinon.stub(driver['attributes'], 'get');
            // tslint:disable-next-line
            getStub.returns(null);
            expect(driver.isSoftDeleted()).toEqual(false);
            expect(getStub.calledWith('anything')).toBe(true);
            getStub.returns(new Date());
            expect(driver.isSoftDeleted()).toEqual(true);
            expect(getStub.calledWith('anything')).toBe(true);
        });
    });
    describe('.formatAttributeName()', function () {
        it('formats name in snake case', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            const dataset = {
                SomethingAwesome: 'something_awesome',
                createdAt: 'created_at',
                Modified_AT: 'modified_at'
            };
            for (const name in dataset) {
                expect(driver.formatAttributeName(name)).toEqual(dataset[name]);
            }
        });
    });
    describe('.getModelComponentName()', function () {
        it('returns undefined', function () {
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver.getModelComponentName()).toBeUndefined();
        });
    });
    describe('.getModelComponentOrder()', function () {
        it('returns the given components', function () {
            const components = ['a', 'b', 'c'];
            const driver = new MongooseDriver_1.MongooseDriver(modelInstance);
            expect(driver.getModelComponentOrder(components) === components).toBe(true);
        });
    });
});
