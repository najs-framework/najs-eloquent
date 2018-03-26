"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/log/FlipFlopQueryLog");
const Sinon = require("sinon");
const EloquentTestBase_1 = require("../eloquent/EloquentTestBase");
const MongooseQueryBuilder_1 = require("../../../lib/v0.x/query-builders/MongooseQueryBuilder");
const SoftDelete_1 = require("../../../lib/drivers/mongoose/SoftDelete");
const util_1 = require("../util");
const najs_binding_1 = require("najs-binding");
const mongoose_1 = require("mongoose");
const NotFoundError_1 = require("../../../lib/v0.x/errors/NotFoundError");
const bson_1 = require("bson");
const mongoose = require('mongoose');
let MongooseProvider = MongooseProvider_1 = class MongooseProvider {
    getClassName() {
        return MongooseProvider_1.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
};
MongooseProvider.className = 'MongooseProvider';
MongooseProvider = MongooseProvider_1 = __decorate([
    najs_binding_1.register()
], MongooseProvider);
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number }
}, {
    collection: 'users'
});
const UserModel = mongoose_1.model('User', UserSchema);
const RoleSchema = new mongoose_1.Schema({
    name: { type: String }
}, {
    collection: 'roles'
});
RoleSchema.plugin(SoftDelete_1.SoftDelete, { overrideMethods: true });
const RoleModel = mongoose_1.model('Role', RoleSchema);
class User extends EloquentTestBase_1.EloquentTestBase {
    getClassName() {
        return 'User';
    }
}
najs_binding_1.register(User);
class Role extends EloquentTestBase_1.EloquentTestBase {
    getClassName() {
        return 'Role';
    }
}
najs_binding_1.register(Role);
// ---------------------------------------------------------------------------------------------------------------------
describe('MongooseQueryBuilder', function () {
    describe('pre-configuration', function () {
        it('must register MongooseProvider before using MongooseQueryBuilder', function () {
            expect(najs_binding_1.make(MongooseProvider.className).getMongooseInstance()).toBeInstanceOf(mongoose_1.Mongoose);
        });
    });
    describe('constructor()', function () {
        it('is created by modelName', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query['mongooseModel'].modelName).toEqual('User');
        });
        it('is created by modelName + primaryKey', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User', undefined, 'test');
            expect(query.getPrimaryKey()).toEqual('test');
            expect(query['mongooseModel'].modelName).toEqual('User');
        });
        it('throws exception if model not found', function () {
            try {
                new MongooseQueryBuilder_1.MongooseQueryBuilder('NotFound');
            }
            catch (error) {
                expect(error.message).toEqual('Model NotFound Not Found');
                return;
            }
            expect('it').toEqual('should throw exception');
        });
    });
    describe('protected getMongooseProvider()', function () {
        it('uses make("MongooseProvider") to get an instance of mongoose', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query['getMongooseProvider']().getMongooseInstance() === mongoose).toBe(true);
        });
    });
    describe('protected getQuery()', function () {
        it('just build getQuery once', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.limit(10);
            expect(query['hasMongooseQuery']).toBeUndefined();
            query['getQuery']();
            expect(query['hasMongooseQuery']).toBe(true);
            expect(query['getQuery']() === query['mongooseQuery']).toBe(true);
            expect(query['hasMongooseQuery']).toBe(true);
        });
        it('builds query for find by default', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query['getQuery']()['op']).toEqual('find');
        });
        it('can build query for findOne', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query['getQuery'](true)['op']).toEqual('findOne');
        });
    });
    describe('Auto convert id to _id', function () {
        it('converts id to _id if using .select()', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.select('id').toObject()).toEqual({
                select: ['_id']
            });
        });
        it('converts id to _id if using .distinct()', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.distinct('id').toObject()).toEqual({
                distinct: ['_id']
            });
        });
        it('converts id to _id if using .orderBy()', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.orderBy('id').toObject()).toEqual({
                orderBy: { _id: 'asc' }
            });
        });
        it('converts id to _id if using .orderByAsc()', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.orderByAsc('id').toObject()).toEqual({
                orderBy: { _id: 'asc' }
            });
        });
        it('converts id to _id if using .orderByDesc()', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.orderByDesc('id').toObject()).toEqual({
                orderBy: { _id: 'desc' }
            });
        });
        it('converts id to _id if using .where', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query
                .where('id', 1)
                .where('id', '<>', 2)
                .toObject()).toEqual({
                conditions: { $and: [{ _id: 1 }, { _id: { $ne: 2 } }] }
            });
        });
        it('converts id to _id if using .orWhere', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query
                .orWhere('id', 1)
                .orWhereIn('id', [3, 4])
                .toObject()).toEqual({
                conditions: { $or: [{ _id: 1 }, { _id: { $in: [3, 4] } }] }
            });
        });
    });
    describe('protected passDataToMongooseQuery()', function () {
        it('never passes to mongooseQuery.select if .select() was not used', function () {
            const nativeQuery = UserModel.find();
            const selectSpy = Sinon.spy(nativeQuery, 'select');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(selectSpy.notCalled).toBe(true);
        });
        it('passes to mongooseQuery.select with selectedFields.join(" ") if .select() was used', function () {
            const nativeQuery = UserModel.find();
            const selectSpy = Sinon.spy(nativeQuery, 'select');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.select('first_name', 'last_name');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(selectSpy.calledWith('first_name last_name')).toBe(true);
        });
        it('never passes to mongooseQuery.distinct if .distinct() was not used', function () {
            const nativeQuery = UserModel.find();
            const distinctSpy = Sinon.spy(nativeQuery, 'distinct');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(distinctSpy.notCalled).toBe(true);
        });
        it('passes to mongooseQuery.distinct with distinctFields.join(" ") if .distinct() was used', function () {
            const nativeQuery = UserModel.find();
            const distinctSpy = Sinon.spy(nativeQuery, 'distinct');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.distinct('first_name', 'last_name');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(distinctSpy.calledWith('first_name last_name')).toBe(true);
        });
        it('never passes to mongooseQuery.limit if .limit() was not used', function () {
            const nativeQuery = UserModel.find();
            const limitSpy = Sinon.spy(nativeQuery, 'limit');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(limitSpy.notCalled).toBe(true);
        });
        it('passes to mongooseQuery.limit with limitNumber if .limit() was used', function () {
            const nativeQuery = UserModel.find();
            const limitSpy = Sinon.spy(nativeQuery, 'limit');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.limit(20);
            query['passDataToMongooseQuery'](nativeQuery);
            expect(limitSpy.calledWith(20)).toBe(true);
        });
        it('never passes to mongooseQuery.sort if .orderBy() .orderByAsc() .orderByDesc were not used', function () {
            const nativeQuery = UserModel.find();
            const sortSpy = Sinon.spy(nativeQuery, 'sort');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(sortSpy.notCalled).toBe(true);
        });
        it('passes to mongooseQuery.sort with transformed ordering if .orderBy() was used', function () {
            const nativeQuery = UserModel.find();
            const sortSpy = Sinon.spy(nativeQuery, 'sort');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.orderBy('first_name');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(sortSpy.calledWith({ first_name: 1 })).toBe(true);
        });
        it('passes to mongooseQuery.sort with transformed ordering if .orderByAsc() was used', function () {
            const nativeQuery = UserModel.find();
            const sortSpy = Sinon.spy(nativeQuery, 'sort');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.orderByAsc('first_name.child');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(sortSpy.calledWith({ 'first_name.child': 1 })).toBe(true);
        });
        it('passes to mongooseQuery.sort with transformed ordering if .orderByDesc() was used', function () {
            const nativeQuery = UserModel.find();
            const sortSpy = Sinon.spy(nativeQuery, 'sort');
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.orderByDesc('first_name.child');
            query['passDataToMongooseQuery'](nativeQuery);
            expect(sortSpy.calledWith({ 'first_name.child': -1 })).toBe(true);
        });
    });
    describe('native()', function () {
        it('is chain-able', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            expect(query.native(function (model) {
                return model.find();
            })).toEqual(query);
        });
        it('passes instance of Mongoose Model if there is no query builder function was used', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.native(function (model) {
                expect(model === query['mongooseModel']).toBe(true);
                return model.find();
            });
        });
        it('passes getQuery(false) result if there is a query builder functions was used', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.limit(10);
            query.native(function (nativeQuery) {
                expect(nativeQuery === query['mongooseQuery']).toBe(true);
                return nativeQuery;
            });
        });
    });
    describe('toObject()', function () {
        it('returns signature object of the query, conditions is translated to mongodb query', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query
                .queryName('Test')
                .select('first_name')
                .distinct('last_name')
                .limit(10)
                .orderBy('first_name')
                .where('first_name', 'tony')
                .where('last_name', 'any')
                .orWhere('age', 10);
            expect(query.toObject()).toEqual({
                name: 'Test',
                select: ['first_name'],
                distinct: ['last_name'],
                limit: 10,
                orderBy: { first_name: 'asc' },
                conditions: {
                    first_name: 'tony',
                    $or: [{ last_name: 'any' }, { age: 10 }]
                }
            });
        });
        it('skips select, distinct, limit if was not called', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.orderBy('first_name').where('first_name', 'tony');
            expect(query.toObject()).toEqual({
                orderBy: { first_name: 'asc' },
                conditions: {
                    first_name: 'tony'
                }
            });
        });
        it('skips orderBy if was not called', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.where('first_name', 'tony');
            expect(query.toObject()).toEqual({
                conditions: {
                    first_name: 'tony'
                }
            });
        });
        it('skips conditions if empty', function () {
            const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            query.orderBy('first_name', 'asc');
            expect(query.toObject()).toEqual({
                orderBy: { first_name: 'asc' }
            });
        });
    });
    describe('Fetch Result Functions', function () {
        jest.setTimeout(10000);
        const dataset = [
            { first_name: 'john', last_name: 'doe', age: 30 },
            { first_name: 'jane', last_name: 'doe', age: 25 },
            { first_name: 'tony', last_name: 'stark', age: 40 },
            { first_name: 'thor', last_name: 'god', age: 1000 },
            { first_name: 'captain', last_name: 'american', age: 100 },
            { first_name: 'tony', last_name: 'stewart', age: 40 },
            { first_name: 'peter', last_name: 'parker', age: 15 }
        ];
        beforeAll(async function () {
            await util_1.init_mongoose(mongoose, 'mongoose_query_builder');
            for (const data of dataset) {
                const user = new UserModel();
                user.set(data);
                await user.save();
            }
            for (let i = 0; i < 10; i++) {
                const role = new RoleModel();
                role.set({ name: 'role-' + i });
                await role['delete']();
            }
        });
        afterAll(async function () {
            util_1.delete_collection(mongoose, 'users');
            util_1.delete_collection(mongoose, 'roles');
        });
        function expect_match_user(result, expected) {
            expect(result).toBeInstanceOf(User);
            for (const name in expected) {
                expect(result[name]).toEqual(expected[name]);
            }
        }
        describe('get()', function () {
            it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.get();
                expect(result.count()).toEqual(7);
                const resultArray = result.all();
                for (let i = 0; i < 7; i++) {
                    expect_match_user(resultArray[i], dataset[i]);
                }
            });
            it('returns an empty collection if no result', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'no-one').get();
                expect(result.isEmpty()).toBe(true);
            });
            it('can get data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('age', 1000).get();
                expect(result.count()).toEqual(1);
                expect_match_user(result.first(), dataset[3]);
            });
            it('can get data by query builder, case 2', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('age', 40).get();
                expect(result.count()).toEqual(2);
                expect_match_user(result.items[0], dataset[2]);
                expect_match_user(result.items[1], dataset[5]);
            });
            it('can get data by query builder, case 3', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 40)
                    .where('last_name', 'stark')
                    .get();
                expect(result.count()).toEqual(1);
                expect_match_user(result.items[0], dataset[2]);
            });
            it('can get data by query builder, case 4', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'peter')
                    .get();
                expect(result.count()).toEqual(3);
                expect_match_user(result.items[0], dataset[2]);
                expect_match_user(result.items[1], dataset[5]);
                expect_match_user(result.items[2], dataset[6]);
            });
        });
        describe('all()', function () {
            it('just an alias of .get()', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const getSpy = Sinon.spy(query, 'get');
                await query.all();
                expect(getSpy.called).toBe(true);
            });
        });
        describe('find()', function () {
            it('finds first document of collection and return an instance of Eloquent<T>', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.find();
                expect_match_user(result, dataset[0]);
            });
            it('returns null if no result', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'no-one').find();
                expect(result).toBeNull();
            });
            it('can find data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('age', 1000).find();
                expect_match_user(result, dataset[3]);
            });
            it('can find data by query builder, case 2', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'jane')
                    .find();
                expect_match_user(result, dataset[1]);
            });
            it('can find data by query builder, case 3', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .find();
                expect_match_user(result, dataset[5]);
            });
            it('can find data by native() before using query functions of query builder', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .native(function (model) {
                    return model.findOne({
                        first_name: 'tony'
                    });
                })
                    .find();
                expect_match_user(result, dataset[2]);
            });
            it('can find data by native() after using query functions of query builder', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 40)
                    .orWhere('age', 1000)
                    .native(function (nativeQuery) {
                    return nativeQuery.sort({ last_name: -1 });
                })
                    .find();
                expect_match_user(result, dataset[5]);
            });
            it('can find data by native() and modified after using query functions of query builder', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 40)
                    .orWhere('age', 1000)
                    .native(function (nativeQuery) {
                    return nativeQuery.findOne({
                        first_name: 'thor'
                    });
                })
                    .find();
                expect_match_user(result, dataset[3]);
            });
        });
        describe('first()', function () {
            it('just an alias of find', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const findSpy = Sinon.spy(query, 'find');
                await query.first();
                expect(findSpy.called).toBe(true);
            });
        });
        describe('findOrFail', function () {
            it('calls find() and returns instance of Model if found', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const findSpy = Sinon.spy(query, 'find');
                const user = await query.first();
                const result = await query.where('id', user.id).findOrFail();
                expect(result.id).toEqual(user.id);
                expect(findSpy.called).toBe(true);
                findSpy.restore();
            });
            it('throws NotFoundError if model not found', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const id = new bson_1.ObjectId();
                try {
                    await query.where('id', id).findOrFail();
                }
                catch (error) {
                    expect(error).toBeInstanceOf(Error);
                    expect(error).toBeInstanceOf(NotFoundError_1.NotFoundError);
                    expect(error.model).toEqual('User');
                    return;
                }
                expect('should not reach this line').toEqual('yeah');
            });
        });
        describe('firstOrFail()', function () {
            it('just an alias of firstOrFail', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const firstOrFailSpy = Sinon.spy(query, 'firstOrFail');
                await query.firstOrFail();
                expect(firstOrFailSpy.called).toBe(true);
            });
        });
        describe('pluck()', function () {
            it('plucks all data of collection and returns an Object', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.pluck('first_name', '_id');
                const actual = Object.values ? Object.values(result) : Object.keys(result).map(key => result[key]);
                expect(actual).toEqual(['john', 'jane', 'tony', 'thor', 'captain', 'tony', 'peter']);
            });
            it('returns an empty object if no result', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'no-one').pluck('first_name');
                expect(result).toEqual({});
            });
            it('overrides select even .select was used', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.select('abc', 'def').pluck('first_name', '_id');
                expect(query['selectedFields']).toEqual(['first_name', '_id']);
                const actual = Object.values ? Object.values(result) : Object.keys(result).map(key => result[key]);
                expect(actual).toEqual(['john', 'jane', 'tony', 'thor', 'captain', 'tony', 'peter']);
            });
            it('can pluck data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 18)
                    .orWhere('first_name', 'tony')
                    .pluck('first_name');
                const actual = Object.values ? Object.values(result) : Object.keys(result).map(key => result[key]);
                expect(actual).toEqual(['tony', 'tony']);
            });
            it('can pluck data by query builder, case 2', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 1000)
                    .orWhere('first_name', 'captain')
                    .orderBy('last_name')
                    .pluck('last_name');
                const actual = Object.values ? Object.values(result) : Object.keys(result).map(key => result[key]);
                expect(actual).toEqual(['american', 'god']);
            });
        });
        describe('count()', function () {
            it('counts all data of collection and returns a Number', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.count();
                expect(result).toEqual(7);
            });
            it('returns 0 if no result', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'no-one').count();
                expect(result).toEqual(0);
            });
            it('overrides select even .select was used', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.select('abc', 'def').count();
                expect(query['selectedFields']).toEqual(['_id']);
                expect(result).toEqual(7);
            });
            it('can count items by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 18)
                    .orWhere('first_name', 'tony')
                    .count();
                expect(result).toEqual(2);
            });
            it('can count items by query builder, case 2', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('age', 1000)
                    .orWhere('first_name', 'captain')
                    .orderBy('last_name')
                    .count();
                expect(result).toEqual(2);
            });
        });
        describe('update()', function () {
            it('can update data of collection, returns update result of mongoose', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'peter').update({ $set: { age: 19 } });
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').where('first_name', 'peter').find();
                expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }));
            });
            it('returns empty update result if no row matched', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'no-one').update({ $set: { age: 19 } });
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can update data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('age', 1000).update({ $set: { age: 1001 } });
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').where('first_name', 'thor').find();
                expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }));
            });
            it('can update data by query builder, case 2: multiple documents', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                query.where('first_name', 'tony').orWhere('first_name', 'jane');
                const result = await query.update({ $inc: { age: 1 } });
                expect(result).toEqual({ n: 3, nModified: 3, ok: 1 });
                const updatedResults = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User')
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .get();
                expect_match_user(updatedResults.items[0], Object.assign({}, dataset[1], { age: 26 }));
                expect_match_user(updatedResults.items[1], Object.assign({}, dataset[2], { age: 41 }));
                expect_match_user(updatedResults.items[2], Object.assign({}, dataset[5], { age: 41 }));
            });
            it('can update data by query builder, case 3', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .update({ $inc: { age: 1 } });
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const updatedResult = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User')
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .find();
                expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }));
            });
        });
        describe('delete()', function () {
            it('can delete data of collection, returns delete result of mongoose', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'peter').delete();
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').count();
                expect(count).toEqual(6);
            });
            it('can delete data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('age', 1001).delete();
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').count();
                expect(count).toEqual(5);
            });
            it('can delete data by query builder, case 2: multiple documents', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .delete();
                expect(result).toEqual({ n: 3, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').count();
                expect(count).toEqual(2);
            });
            it('can delete data by query builder, case 3', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .where('first_name', 'john')
                    .where('last_name', 'doe')
                    .delete();
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').count();
                expect(count).toEqual(1);
            });
            it('can not call delete without using any .where() statement', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.delete();
                expect(result).toEqual({ n: 0, ok: 1 });
            });
            it('can not call delete if query is empty', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.select('any').delete();
                expect(result).toEqual({ n: 0, ok: 1 });
            });
            it('can delete by native() function', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query
                    .native(function (model) {
                    return model.remove({});
                })
                    .execute();
                expect(result).toEqual({ n: 1, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('User').count();
                expect(count).toEqual(0);
            });
        });
        describe('restore()', function () {
            it('does nothing if Model do not support SoftDeletes', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
                const result = await query.where('first_name', 'peter').restore();
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can not call restore if query is empty', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('Role', { deletedAt: 'deleted_at' });
                const result = await query.withTrashed().restore();
                expect(result).toEqual({ n: 0, nModified: 0, ok: 1 });
            });
            it('can restore data by query builder, case 1', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('Role', { deletedAt: 'deleted_at' });
                const result = await query
                    .onlyTrashed()
                    .where('name', 'role-0')
                    .restore();
                expect(result).toEqual({ n: 1, nModified: 1, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('Role').count();
                expect(count).toEqual(1);
            });
            it('can restore data by query builder, case 2: multiple documents', async function () {
                const query = new MongooseQueryBuilder_1.MongooseQueryBuilder('Role', { deletedAt: 'deleted_at' });
                const result = await query
                    .withTrashed()
                    .where('name', 'role-1')
                    .orWhere('name', 'role-2')
                    .orWhere('name', 'role-3')
                    .restore();
                expect(result).toEqual({ n: 3, nModified: 3, ok: 1 });
                const count = await new MongooseQueryBuilder_1.MongooseQueryBuilder('Role').count();
                expect(count).toEqual(4);
            });
        });
    });
});
var MongooseProvider_1;
