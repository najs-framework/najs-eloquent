"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const util_1 = require("../util");
const Eloquent_1 = require("../../lib/model/Eloquent");
const najs_binding_1 = require("najs-binding");
const KnexDriver_1 = require("../../lib/drivers/KnexDriver");
const RecordDriverBase_1 = require("../../lib/drivers/based/RecordDriverBase");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const KnexQueryBuilder_1 = require("../../lib/query-builders/KnexQueryBuilder");
const KnexQueryBuilderWrapper_1 = require("../../lib/wrappers/KnexQueryBuilderWrapper");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(KnexDriver_1.KnexDriver, 'knex');
class User extends Eloquent_1.Eloquent {
    getClassName() {
        return User.className;
    }
}
User.className = 'User';
User.fillable = ['email', 'first_name', 'last_name', 'age'];
najs_binding_1.register(User);
describe('KnexDriver', function () {
    let modelInstance = undefined;
    beforeAll(async function () {
        await util_1.init_knex('najs_eloquent_knex_driver');
        await util_1.knex_run_sql(`CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        age INT,
        PRIMARY KEY (id)
      )`);
        modelInstance = new User();
    });
    it('extends RecordBaseDriver and implements Autoload under name "NajsEloquent.Driver.KnexDriver"', function () {
        const driver = new KnexDriver_1.KnexDriver(modelInstance);
        expect(driver).toBeInstanceOf(RecordDriverBase_1.RecordBaseDriver);
        expect(driver.getClassName()).toEqual('NajsEloquent.Driver.KnexDriver');
    });
    describe('.initialize()', function () {
        it('calls super.initialize()', function () {
            const superInitialize = Sinon.spy(RecordDriverBase_1.RecordBaseDriver.prototype, 'initialize');
            const driver = new KnexDriver_1.KnexDriver(modelInstance);
            driver.initialize(modelInstance, true);
            expect(superInitialize.calledWith(modelInstance, true)).toBe(true);
            superInitialize.restore();
        });
    });
    describe('.newQuery()', function () {
        it('returns MongodbQueryBuilderWrapper which wrap MongodbQueryBuilder', function () {
            const driver = new KnexDriver_1.KnexDriver(modelInstance);
            driver.initialize(modelInstance, true);
            const queryBuilderWrapper = driver.newQuery();
            expect(queryBuilderWrapper).toBeInstanceOf(KnexQueryBuilderWrapper_1.KnexQueryBuilderWrapper);
            expect(queryBuilderWrapper['modelName']).toEqual(driver['modelName']);
            expect(queryBuilderWrapper['queryBuilder']).toBeInstanceOf(KnexQueryBuilder_1.KnexQueryBuilder);
        });
        it('transfers RelationDataBucket to new query', function () {
            const driver = new KnexDriver_1.KnexDriver(modelInstance);
            driver.initialize(modelInstance, true);
            const queryBuilderWrapper = driver.newQuery('any');
            expect(queryBuilderWrapper['relationDataBucket']).toEqual('any');
        });
    });
    describe('.shouldBeProxied()', function () {
        it('returns true if the key is not "table" and "primaryKey" and "connection"', function () {
            const driver = new KnexDriver_1.KnexDriver(modelInstance);
            expect(driver.shouldBeProxied('a')).toBe(true);
            expect(driver.shouldBeProxied('b')).toBe(true);
            expect(driver.shouldBeProxied('test')).toBe(true);
            expect(driver.shouldBeProxied('table')).toBe(false);
            expect(driver.shouldBeProxied('connection')).toBe(false);
            expect(driver.shouldBeProxied('primaryKey')).toBe(false);
        });
    });
    describe('.getRecordName()', function () {
        it('returns this.tableName', function () {
            const driver = new KnexDriver_1.KnexDriver(modelInstance);
            expect(driver.getRecordName()).toEqual('users');
            driver['tableName'] = 'anything';
            expect(driver.getRecordName()).toEqual('anything');
        });
    });
});
