"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/query-log/FlipFlopQueryLog");
const Sinon = require("sinon");
const QueryLogFacade_1 = require("../../../lib/facades/global/QueryLogFacade");
const MongodbProviderFacade_1 = require("../../../lib/facades/global/MongodbProviderFacade");
const MongodbQueryBuilder_1 = require("../../../lib/query-builders/mongodb/MongodbQueryBuilder");
const util_1 = require("../../util");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
const MongodbQueryBuilderBase_1 = require("../../../lib/query-builders/mongodb/MongodbQueryBuilderBase");
const Moment = require('moment');
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy');
describe('MongodbQueryBuilder', function () {
    it('implements IAutoload and returns "NajsEloquent.QueryBuilder.Mongodb.MongodbQueryBuilder" as className', function () {
        const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
        expect(query.getClassName()).toEqual('NajsEloquent.QueryBuilder.Mongodb.MongodbQueryBuilder');
    });
    it('extends GenericQueryBuilder', function () {
        const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
        expect(query).toBeInstanceOf(MongodbQueryBuilderBase_1.MongodbQueryBuilderBase);
    });
    describe('.native()', function () {
        it('passes instance of collection, conditions, and options to handler', async function () {
            const collection = {};
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collection);
            query.where('a', 1).limit(10);
            const result = query.native(async function (passed, conditions, options) {
                expect(conditions).toEqual({ a: 1 });
                expect(options).toEqual({ limit: 10 });
                expect(passed === collection).toBe(true);
                return { result: 'anything' };
            });
            expect(result === query).toBe(true);
        });
    });
    describe('.execute()', function () {
        it('calls .get() if there is no result from .native()', function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            const getStub = Sinon.stub(query, 'get');
            getStub.returns('anything');
            expect(query.where('test', 'true').execute()).toEqual('anything');
            expect(getStub.calledWith()).toBe(true);
        });
        it('resolve promise "nativeHandlePromise" and return response or response.result', async function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            query['nativeHandlePromise'] = Promise.resolve('anything');
            expect(await query.execute()).toEqual('anything');
            expect(query['nativeHandlePromise']).toBeUndefined();
            query['nativeHandlePromise'] = Promise.resolve({ result: 'anything' });
            expect(await query.execute()).toEqual('anything');
            expect(query['nativeHandlePromise']).toBeUndefined();
        });
    });
    describe('.createQueryOptions()', function () {
        it('undefined if there is no option', function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            expect(query.createQueryOptions()).toBe(undefined);
        });
        it('adds this.limit to property "limit"', function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            query.limit(10);
            expect(query.createQueryOptions()).toEqual({ limit: 10 });
        });
        it('builds this.ordering and adds to property "sort"', function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            query
                .orderByAsc('a')
                .orderByDesc('b')
                .orderBy('c', 'asc')
                .orderBy('c', 'desc');
            expect(query.createQueryOptions()).toEqual({
                sort: [['a', 1], ['b', -1], ['c', -1]]
            });
        });
        it('builds this.fields.select and adds to property "projection"', function () {
            const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', {});
            query.select('a', 'b', 'c');
            expect(query.createQueryOptions()).toEqual({
                projection: { a: 1, b: 1, c: 1 }
            });
        });
    });
    describe('implements IFetchResultQuery', function () {
        const dataset = [
            { first_name: 'john', last_name: 'doe', age: 30 },
            { first_name: 'jane', last_name: 'doe', age: 25 },
            { first_name: 'tony', last_name: 'stark', age: 40 },
            { first_name: 'thor', last_name: 'god', age: 1000 },
            { first_name: 'captain', last_name: 'american', age: 100 },
            { first_name: 'tony', last_name: 'stewart', age: 40 },
            { first_name: 'peter', last_name: 'parker', age: 15 }
        ];
        let collectionUsers, collectionRoles;
        beforeAll(async function () {
            await util_1.init_mongodb('mongodb_query_builder');
            const db = MongodbProviderFacade_1.MongodbProviderFacade.getDatabase();
            collectionUsers = db.collection('users');
            collectionRoles = db.collection('roles');
            for (const data of dataset) {
                await collectionUsers.save(data);
            }
            for (let i = 0; i < 10; i++) {
                await collectionRoles.save({
                    name: 'role-' + i,
                    deleted_at: new Date()
                });
            }
        });
        beforeEach(function () {
            QueryLogFacade_1.QueryLog.clear().enable();
        });
        afterAll(async function () {
            util_1.delete_collection_use_mongodb('users');
            util_1.delete_collection_use_mongodb('roles');
        });
        function expect_match_user(result, expected) {
            for (const name in expected) {
                expect(result[name]).toEqual(expected[name]);
            }
        }
        function expect_query_log(attribute, value, index = 0) {
            expect(QueryLogFacade_1.QueryLog.pull()[index]['query'][attribute]).toEqual(value);
        }
        describe('.get()', function () {
            it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.get();
                expect_query_log('raw', 'db.users.find({}).toArray()');
                expect(result.length).toEqual(7);
                for (let i = 0; i < 7; i++) {
                    expect_match_user(result[i], dataset[i]);
                }
            });
            it('returns an empty collection if no result', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'no-one').get();
                expect_query_log('raw', 'db.users.find({"first_name":"no-one"}).toArray()');
                expect(result.length === 0).toBe(true);
            });
            it('can get data by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('age', 1000).get();
                expect_query_log('raw', 'db.users.find({"age":1000}).toArray()');
                expect(result.length).toEqual(1);
                expect_match_user(result[0], dataset[3]);
            });
            it('can get data by query builder, case 2', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('age', 40).get();
                expect_query_log('raw', 'db.users.find({"age":40}).toArray()');
                expect(result.length).toEqual(2);
                expect_match_user(result[0], dataset[2]);
                expect_match_user(result[1], dataset[5]);
            });
            it('can get data by query builder, case 3', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .where('last_name', 'stark')
                    .get();
                expect_query_log('raw', 'db.users.find({"age":40,"last_name":"stark"}).toArray()');
                expect(result.length).toEqual(1);
                expect_match_user(result[0], dataset[2]);
            });
            it('can get data by query builder, case 4', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'peter')
                    .get();
                expect_query_log('raw', 'db.users.find({"$or":[{"age":40},{"first_name":"peter"}]}).toArray()');
                expect(result.length).toEqual(3);
                expect_match_user(result[0], dataset[2]);
                expect_match_user(result[1], dataset[5]);
                expect_match_user(result[2], dataset[6]);
            });
            it('can get data by query builder, case 5', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'peter')
                    .orderBy('_id', 'desc')
                    .get();
                expect_query_log('raw', 'db.users.find({"$or":[{"age":40},{"first_name":"peter"}]}, {"sort":[["_id",-1]]}).toArray()');
                expect(result.length).toEqual(3);
                expect_match_user(result[0], dataset[6]);
                expect_match_user(result[1], dataset[5]);
                expect_match_user(result[2], dataset[2]);
            });
        });
        describe('.first()', function () {
            it('finds first document of collection and return an instance of Eloquent<T>', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.first();
                expect_query_log('raw', 'db.users.findOne({})');
                expect_match_user(result, dataset[0]);
            });
            it('finds first document of collection and return an instance of Eloquent<T>', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.orderBy('_id', 'desc').first();
                expect_query_log('raw', 'db.users.findOne({}, {"sort":[["_id",-1]]})');
                expect_match_user(result, dataset[6]);
            });
            it('returns null if no result', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'no-one').first();
                expect_query_log('raw', 'db.users.findOne({"first_name":"no-one"})');
                expect(result).toBeNull();
            });
            it('can find data by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('age', 1000).first();
                expect_query_log('raw', 'db.users.findOne({"age":1000})');
                expect_match_user(result, dataset[3]);
            });
            it('can find data by query builder, case 2', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'jane')
                    .first();
                expect_query_log('raw', 'db.users.findOne({"$or":[{"age":40},{"first_name":"jane"}]})');
                expect_match_user(result, dataset[1]);
            });
            it('can find data by query builder, case 3', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_query_log('raw', 'db.users.findOne({"first_name":"tony","last_name":"stewart"})');
                expect_match_user(result, dataset[5]);
            });
            it('can find data by .native() before using query functions of query builder', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .native(function (collection) {
                    return collection.findOne({
                        first_name: 'tony'
                    });
                })
                    .execute();
                expect_match_user(result, dataset[2]);
            });
            it('can find data by native() after using query functions of query builder', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .orWhere('age', 1000)
                    .native(function (collection, conditions) {
                    return collection.findOne(conditions, { sort: [['last_name', -1]] });
                })
                    .execute();
                expect_match_user(result, dataset[5]);
            });
            it('can find data by native() and modified after using query functions of query builder', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 40)
                    .orWhere('age', 1000)
                    .native(function (collection) {
                    return collection.findOne({
                        first_name: 'thor'
                    });
                })
                    .execute();
                expect_match_user(result, dataset[3]);
            });
        });
        describe('.count()', function () {
            it('counts all data of collection and returns a Number', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.count();
                expect_query_log('raw', 'db.users.count({})');
                expect(result).toEqual(7);
            });
            it('returns 0 if no result', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'no-one').count();
                expect_query_log('raw', 'db.users.count({"first_name":"no-one"})');
                expect(result).toEqual(0);
            });
            it('overrides select even .select was used', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.select('abc', 'def').count();
                expect_query_log('raw', 'db.users.count({})');
                expect(result).toEqual(7);
            });
            it('overrides ordering even .orderBy was used', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.orderBy('abc').count();
                expect_query_log('raw', 'db.users.count({})');
                expect(result).toEqual(7);
            });
            it('can count items by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 18)
                    .orWhere('first_name', 'tony')
                    .count();
                expect_query_log('raw', 'db.users.count({"$or":[{"age":18},{"first_name":"tony"}]})');
                expect(result).toEqual(2);
            });
            it('can count items by query builder, case 2', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('age', 1000)
                    .orWhere('first_name', 'captain')
                    .orderBy('last_name')
                    .limit(10)
                    .count();
                expect_query_log('raw', 'db.users.count({"$or":[{"age":1000},{"first_name":"captain"}]}, {"limit":10})');
                expect(result).toEqual(2);
            });
        });
        describe('.update()', function () {
            it('can update data of collection, returns update result of mongoose', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'peter').update({ $set: { age: 19 } });
                expect_query_log('raw', 'db.users.updateMany({"first_name":"peter"}, {"$set":{"age":19}})');
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers)
                    .where('first_name', 'peter')
                    .first();
                expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }));
            });
            it('returns empty update result if no row matched', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'no-one').update({ $set: { age: 19 } });
                expect_query_log('raw', 'db.users.updateMany({"first_name":"no-one"}, {"$set":{"age":19}})');
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can update data by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('age', 1000).update({ $set: { age: 1001 } });
                expect_query_log('raw', 'db.users.updateMany({"age":1000}, {"$set":{"age":1001}})');
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).where('first_name', 'thor').first();
                expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }));
            });
            it('can update data by query builder, case 2: multiple documents', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                query.where('first_name', 'tony').orWhere('first_name', 'jane');
                const result = await query.update({ $inc: { age: 1 } });
                expect_query_log('raw', 'db.users.updateMany({"$or":[{"first_name":"tony"},{"first_name":"jane"}]}, {"$inc":{"age":1}})');
                expect(result).toEqual({ n: 3, nModified: 3, ok: 1 });
                const updatedResults = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers)
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .get();
                expect_match_user(updatedResults[0], Object.assign({}, dataset[1], { age: 26 }));
                expect_match_user(updatedResults[1], Object.assign({}, dataset[2], { age: 41 }));
                expect_match_user(updatedResults[2], Object.assign({}, dataset[5], { age: 41 }));
            });
            it('can update data by query builder, case 3', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .update({ $inc: { age: 1 } });
                expect_query_log('raw', 'db.users.updateMany({"first_name":"tony","last_name":"stewart"}, {"$inc":{"age":1}})');
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers)
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }));
            });
            it('auto add updatedAt field to $set if timestamps options is on', async function () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                query['timestamps'] = { createdAt: 'created_at', updatedAt: 'updated_at' };
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .update({ $inc: { age: 1 } });
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers)
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 43, updated_at: now }));
                const result2 = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .update({ $set: { age: 44 } });
                expect(result2).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult2 = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers)
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_match_user(updatedResult2, Object.assign({}, dataset[5], { age: 44, updated_at: now }));
            });
        });
        describe('.delete()', function () {
            it('can delete data of collection, returns delete result of mongoose', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'peter').delete();
                expect_query_log('raw', 'db.users.deleteMany({"first_name":"peter"})');
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).count();
                expect(count).toEqual(6);
            });
            it('can delete data by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('age', 1001).delete();
                expect_query_log('raw', 'db.users.deleteMany({"age":1001})');
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).count();
                expect(count).toEqual(5);
            });
            it('can delete data by query builder, case 2: multiple documents', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .delete();
                expect_query_log('raw', 'db.users.deleteMany({"$or":[{"first_name":"tony"},{"first_name":"jane"}]})');
                expect(result).toEqual({ n: 3, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).count();
                expect(count).toEqual(2);
            });
            it('can delete data by query builder, case 3', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .where('first_name', 'john')
                    .where('last_name', 'doe')
                    .delete();
                expect_query_log('raw', 'db.users.deleteMany({"first_name":"john","last_name":"doe"})');
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).count();
                expect(count).toEqual(1);
            });
            it('can not call delete without using any .where() statement', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.delete();
                expect(result).toEqual({ n: 0, ok: 1 });
            });
            it('can not call delete if query is empty', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.select('any').delete();
                expect(result).toEqual({ n: 0, ok: 1 });
            });
            it('can delete by native() function', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query
                    .native(function (collection) {
                    return collection.remove({});
                })
                    .execute();
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers).count();
                expect(count).toEqual(0);
            });
        });
        describe('.restore()', function () {
            it('does nothing if Model do not support SoftDeletes', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('User', collectionUsers);
                const result = await query.where('first_name', 'peter').restore();
                expect(QueryLogFacade_1.QueryLog.pull()).toHaveLength(0);
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can not call restore if query is empty', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('Role', collectionRoles, {
                    deletedAt: 'deleted_at',
                    overrideMethods: true
                });
                const result = await query.withTrashed().restore();
                expect(QueryLogFacade_1.QueryLog.pull()).toHaveLength(0);
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can restore data by query builder, case 1', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('Role', collectionRoles, {
                    deletedAt: 'deleted_at',
                    overrideMethods: true
                });
                const result = await query
                    .onlyTrashed()
                    .where('name', 'role-0')
                    .restore();
                expect_query_log('raw', 'db.roles.updateMany({"deleted_at":{"$ne":null},"name":"role-0"}, {"$set":{"deleted_at":null}})');
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('Role', collectionRoles, {
                    deletedAt: 'deleted_at',
                    overrideMethods: true
                }).count();
                expect(count).toEqual(1);
            });
            it('can restore data by query builder, case 2: multiple documents', async function () {
                const query = new MongodbQueryBuilder_1.MongodbQueryBuilder('Role', collectionRoles, {
                    deletedAt: 'deleted_at',
                    overrideMethods: true
                });
                const result = await query
                    .withTrashed()
                    .where('name', 'role-1')
                    .orWhere('name', 'role-2')
                    .orWhere('name', 'role-3')
                    .restore();
                expect_query_log('raw', 'db.roles.updateMany({"$or":[{"name":"role-1"},{"name":"role-2"},{"name":"role-3"}]}, {"$set":{"deleted_at":null}})');
                expect(result).toEqual({ n: 3, nModified: 3, ok: 1 });
                const count = await new MongodbQueryBuilder_1.MongodbQueryBuilder('Role', collectionRoles, {
                    deletedAt: 'deleted_at',
                    overrideMethods: true
                }).count();
                expect(count).toEqual(4);
            });
        });
    });
});
