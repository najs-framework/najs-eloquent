"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const mongoose_1 = require("mongoose");
const najs_1 = require("najs");
const bson_1 = require("bson");
const lib_1 = require("../../lib");
const MongooseQueryBuilder_1 = require("../../lib/query-builders/MongooseQueryBuilder");
const EloquentMongoose_1 = require("../../lib/eloquent/EloquentMongoose");
const NotFoundError_1 = require("../../lib/errors/NotFoundError");
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
}
MongooseProvider.className = 'MongooseProvider';
najs_1.register(MongooseProvider);
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
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.init_mongoose(mongoose);
        });
    });
    afterAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield util_1.delete_collection(mongoose, 'users');
            yield util_1.delete_collection(mongoose, 'timestampmodeldefaults');
            yield util_1.delete_collection(mongoose, 'customtimestampmodels');
            yield util_1.delete_collection(mongoose, 'softdeletemodels');
            yield util_1.delete_collection(mongoose, 'softdelete1s');
            yield util_1.delete_collection(mongoose, 'softdelete2s');
        });
    });
    it('can be initialized with static function', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User.all();
            expect(users.count()).toEqual(0);
        });
    });
    describe('ActiveRecord', function () {
        describe('save()', function () {
            it('can create a document', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User({
                        first_name: 'tony',
                        last_name: 'stark',
                        age: 45
                    });
                    yield user.save();
                    const result = yield User.where('first_name', 'tony').find();
                    expect(result.toObject()).toMatchObject(user.toObject());
                });
            });
            it('can update a document', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    user.age = 40;
                    yield user.save();
                    const result = yield User.where('first_name', 'tony').find();
                    expect(result.toObject()).toMatchObject(user.toObject());
                });
            });
            it('does not catch error from Mongoose', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    try {
                        yield user.save();
                    }
                    catch (error) {
                        expect(error.name).toEqual('ValidationError');
                        return;
                    }
                    expect('it should not go to this line').toEqual('');
                });
            });
        });
        describe('delete()', function () {
            it('calls MongooseDocument.remove()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    user.first_name = 'john';
                    user.last_name = 'doe';
                    user.age = 20;
                    yield user.save();
                    const removeSpy = Sinon.spy(user['attributes'], 'remove');
                    yield user.delete();
                    expect(removeSpy.called).toBe(true);
                    expect(yield User.where('first_name', 'john').count()).toEqual(0);
                });
            });
        });
        describe('forceDelete()', function () {
            it('calls MongooseDocument.remove()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    user.first_name = 'john';
                    user.last_name = 'doe';
                    user.age = 20;
                    yield user.save();
                    const removeSpy = Sinon.spy(user['attributes'], 'remove');
                    yield user.forceDelete();
                    expect(removeSpy.called).toBe(true);
                    expect(yield User.where('first_name', 'john').count()).toEqual(0);
                });
            });
        });
        describe('fresh()', function () {
            it('always returns null if attribute._id is not found', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    expect(yield user.fresh()).toBeNull();
                });
            });
            it('returns "fresh" version in db if attribute._id exists', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    user.age = 4000000;
                    const fresh = yield user.fresh();
                    expect(fresh.toJson()).toMatchObject({
                        first_name: 'tony',
                        last_name: 'stark',
                        full_name: 'tony stark',
                        age: 40
                    });
                });
            });
        });
    });
    describe('Static functions', function () {
        describe('Class', function () {
            it('is return EloquentMongoose.constructor, this is a part of syntax', function () {
                expect(User.Class() === EloquentMongoose_1.EloquentMongoose).toBe(true);
            });
        });
        describe('queryName()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'newQuery');
                expect(User.queryName('Query')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.select()', function () {
                const queryNameSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'queryName');
                User.queryName('Query');
                expect(queryNameSpy.calledWith('Query')).toBe(true);
                queryNameSpy.restore();
            });
        });
        describe('select()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'newQuery');
                expect(User.select('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.select()', function () {
                const selectSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'select');
                User.select('first_name');
                expect(selectSpy.calledWith('first_name')).toBe(true);
                User.select('first_name', 'last_name', 'age');
                expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true);
                User.select(['first_name', 'last_name', 'age']);
                expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true);
                User.select('first_name', ['last_name', 'age']);
                expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true);
                selectSpy.restore();
            });
        });
        describe('distinct()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.distinct('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.distinct()', function () {
                const distinctSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'distinct');
                User.distinct('first_name');
                expect(distinctSpy.calledWith('first_name')).toBe(true);
                User.distinct('first_name', 'last_name', 'age');
                expect(distinctSpy.calledWith('first_name', 'last_name', 'age')).toBe(true);
                User.distinct(['first_name', 'last_name', 'age']);
                expect(distinctSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true);
                User.distinct('first_name', ['last_name', 'age']);
                expect(distinctSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true);
                distinctSpy.restore();
            });
        });
        describe('orderBy()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderBy('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orderBy()', function () {
                const orderBySpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orderBy');
                User.orderBy('first_name');
                expect(orderBySpy.calledWith('first_name', 'asc')).toBe(true);
                User.orderBy('first_name', 'desc');
                expect(orderBySpy.calledWith('first_name', 'desc')).toBe(true);
                orderBySpy.restore();
            });
        });
        describe('orderByAsc()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderByAsc('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orderByAsc()', function () {
                const orderByAscSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orderByAsc');
                User.orderByAsc('first_name');
                expect(orderByAscSpy.calledWith('first_name')).toBe(true);
                orderByAscSpy.restore();
            });
        });
        describe('orderByDesc()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderByDesc('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orderByDesc()', function () {
                const orderByDescSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orderByDesc');
                User.orderByDesc('first_name');
                expect(orderByDescSpy.calledWith('first_name')).toBe(true);
                orderByDescSpy.restore();
            });
        });
        describe('limit()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.limit(10)).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.limit()', function () {
                const limitSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'limit');
                User.limit(10);
                expect(limitSpy.calledWith(10)).toBe(true);
                limitSpy.restore();
            });
        });
        describe('where()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.where('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.where()', function () {
                const whereSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'where');
                User.where('first_name', 'tony');
                expect(whereSpy.calledWith('first_name', 'tony')).toBe(true);
                User.where('first_name', '<>', 'tony');
                expect(whereSpy.calledWith('first_name', '<>', 'tony')).toBe(true);
                whereSpy.restore();
            });
        });
        describe('orWhere()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhere('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhere()', function () {
                const orWhereSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhere');
                User.orWhere('first_name', 'tony');
                expect(orWhereSpy.calledWith('first_name', 'tony')).toBe(true);
                User.orWhere('first_name', '<>', 'tony');
                expect(orWhereSpy.calledWith('first_name', '<>', 'tony')).toBe(true);
                orWhereSpy.restore();
            });
        });
        describe('whereIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereIn()', function () {
                const whereInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereIn');
                User.whereIn('first_name', ['tony']);
                expect(whereInSpy.calledWith('first_name', ['tony'])).toBe(true);
                whereInSpy.restore();
            });
        });
        describe('whereNotIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereNotIn()', function () {
                const whereNotInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereNotIn');
                User.whereNotIn('first_name', ['tony']);
                expect(whereNotInSpy.calledWith('first_name', ['tony'])).toBe(true);
                whereNotInSpy.restore();
            });
        });
        describe('orWhereIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereIn()', function () {
                const orWhereInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereIn');
                User.orWhereIn('first_name', ['tony']);
                expect(orWhereInSpy.calledWith('first_name', ['tony'])).toBe(true);
                orWhereInSpy.restore();
            });
        });
        describe('orWhereNotIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereNotIn()', function () {
                const orWhereNotInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereNotIn');
                User.orWhereNotIn('first_name', ['tony']);
                expect(orWhereNotInSpy.calledWith('first_name', ['tony'])).toBe(true);
                orWhereNotInSpy.restore();
            });
        });
        describe('whereNull()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereNull()', function () {
                const whereNullSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereNull');
                User.whereNull('first_name');
                expect(whereNullSpy.calledWith('first_name')).toBe(true);
                whereNullSpy.restore();
            });
        });
        describe('whereNotNull()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereNotNull()', function () {
                const whereNotNullSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereNotNull');
                User.whereNotNull('first_name');
                expect(whereNotNullSpy.calledWith('first_name')).toBe(true);
                whereNotNullSpy.restore();
            });
        });
        describe('orWhereNull()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereNull('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereNull()', function () {
                const orWhereNullSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereNull');
                User.orWhereNull('first_name');
                expect(orWhereNullSpy.calledWith('first_name')).toBe(true);
                orWhereNullSpy.restore();
            });
        });
        describe('orWhereNotNull()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereNotNull('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.calledWith()).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereNotNull()', function () {
                const orWhereNotNullSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereNotNull');
                User.orWhereNotNull('first_name');
                expect(orWhereNotNullSpy.calledWith('first_name')).toBe(true);
                orWhereNotNullSpy.restore();
            });
        });
        describe('withTrashed()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.withTrashed()).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.calledWith()).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.withTrash()', function () {
                const withTrashSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'withTrashed');
                User.withTrashed();
                expect(withTrashSpy.called).toBe(true);
                withTrashSpy.restore();
            });
        });
        describe('onlyTrashed()', function () {
            it('creates MongooseQueryBuilder with model from prototype.newQuery()', function () {
                const newQuerySpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.onlyTrashed()).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(newQuerySpy.called).toBe(true);
                newQuerySpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.onlyTrash()', function () {
                const onlyTrashSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'onlyTrashed');
                User.onlyTrashed();
                expect(onlyTrashSpy.called).toBe(true);
                onlyTrashSpy.restore();
            });
        });
        describe('all()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .all()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.all()).toBeInstanceOf(Promise);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.all()', function () {
                const allSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'all');
                User.all();
                expect(allSpy.calledWith()).toBe(true);
                allSpy.restore();
            });
        });
        describe('get()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .get()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.get()).toBeInstanceOf(Promise);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.select() before calling .get()', function () {
                const selectSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'select');
                const getSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'get');
                User.get();
                expect(selectSpy.calledWith()).toBe(true);
                expect(getSpy.calledWith()).toBe(true);
                User.get('first_name');
                expect(selectSpy.calledWith('first_name')).toBe(true);
                expect(getSpy.calledWith()).toBe(true);
                User.get('first_name', 'last_name', 'age');
                expect(selectSpy.calledWith('first_name', 'last_name', 'age')).toBe(true);
                expect(getSpy.calledWith()).toBe(true);
                User.get(['first_name', 'last_name', 'age']);
                expect(selectSpy.calledWith(['first_name', 'last_name', 'age'])).toBe(true);
                expect(getSpy.calledWith()).toBe(true);
                User.get('first_name', ['last_name', 'age']);
                expect(selectSpy.calledWith('first_name', ['last_name', 'age'])).toBe(true);
                expect(getSpy.calledWith()).toBe(true);
                selectSpy.restore();
                getSpy.restore();
            });
        });
        describe('find()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .find()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.find()).toBeInstanceOf(Promise);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.find()', function () {
                const findSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'find');
                User.find();
                expect(findSpy.calledWith()).toBe(true);
                findSpy.restore();
            });
            it('calls where("_id" ) before passing params to MongooseQueryBuilder.find() if id is provided', function () {
                const whereSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'where');
                const findSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'find');
                User.find('000000000000000000000000');
                expect(whereSpy.calledWith('_id', '000000000000000000000000')).toBe(true);
                expect(findSpy.calledWith()).toBe(true);
                whereSpy.restore();
                findSpy.restore();
            });
        });
        describe('pluck()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName(), and calls .pluck()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.pluck('id')).toBeInstanceOf(Promise);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.pluck()', function () {
                const pluckSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'pluck');
                User.pluck('first_name');
                expect(pluckSpy.calledWith('first_name')).toBe(true);
                User.pluck('first_name', 'id');
                expect(pluckSpy.calledWith('first_name', 'id')).toBe(true);
                pluckSpy.restore();
            });
        });
        describe('findById()', function () {
            it('calls find() with id', function () {
                const findSpy = Sinon.spy(User, 'find');
                const id = new bson_1.ObjectId();
                User.findById(id);
                expect(findSpy.calledWith(id)).toBe(true);
                findSpy.restore();
            });
        });
        describe('findOrFail()', function () {
            it('calls find() with id and return instance of Model if found', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const findSpy = Sinon.spy(User, 'find');
                    const user = new User({
                        first_name: 'john',
                        last_name: 'doe'
                    });
                    yield user.save();
                    const result = yield User.findOrFail(user.id);
                    expect(result.is(user)).toBe(true);
                    expect(findSpy.calledWith(user.id)).toBe(true);
                    findSpy.restore();
                });
            });
            it('throws NotFoundError if model not found', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const id = new bson_1.ObjectId();
                    try {
                        yield User.findOrFail(id);
                    }
                    catch (error) {
                        expect(error).toBeInstanceOf(Error);
                        expect(error).toBeInstanceOf(NotFoundError_1.NotFoundError);
                        expect(error.model).toEqual(User.className);
                        return;
                    }
                    expect('should not reach this line').toEqual('yeah');
                });
            });
        });
    });
    describe('Eloquent method', function () {
        let id;
        describe('setId()', function () {
            it('sets values to attributes[_id]', function () {
                const user = new User();
                const id = new bson_1.ObjectId();
                user.id = id;
                expect(user['attributes']['_id']).toEqual(id);
            });
        });
        describe('protected initialize()', function () {
            it('was called by constructor()', function () {
                const initializeSpy = Sinon.spy(User.prototype, 'initialize');
                const user = new User();
                expect(user).toBeDefined();
                expect(initializeSpy.called).toBe(true);
                initializeSpy.restore();
            });
            it('creates or get model from mongoose and assign to this.model', function () {
                const user = new User();
                expect(user['model'].modelName).toEqual('User');
            });
        });
        describe('protected getMongoose()', function () {
            it('uses make("MongooseProvider") to get an instance of mongoose', function () {
                const user = new User();
                expect(user['getMongoose']() === mongoose).toBe(true);
            });
        });
        describe('protected isNativeRecord(document)', function () {
            it('use instanceof this.model to detect the document is instance of model or not', function () {
                const user = new User();
                expect(user['isNativeRecord']({})).toBe(false);
                expect(user['isNativeRecord'](user)).toBe(false);
                expect(user['isNativeRecord'](user['attributes'])).toBe(true);
            });
        });
        describe('protected getReservedPropertiesList()', function () {
            it('contains all attribute in prototype and [collection, model, schema]', function () {
                const user = new User();
                const list = user['getReservedPropertiesList']();
                expect(list).toContain('collection');
                expect(list).toContain('model');
                expect(list).toContain('schema');
            });
        });
        describe('getAttribute(name)', function () {
            it('returns this.attributes[name]', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    expect(user.getAttribute('first_name')).toEqual('tony');
                });
            });
            it('is called if the name is not in __knownAttributeList', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    const getAttributeSpy = Sinon.spy(user, 'getAttribute');
                    user.first_name = user.last_name;
                    expect(getAttributeSpy.calledWith('last_name')).toBe(true);
                });
            });
        });
        describe('setAttribute(name, value)', function () {
            it('assigns value to this.attributes[name]', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    user.setAttribute('first_name', 'test');
                    expect(user.first_name).toEqual('test');
                });
            });
            it('is called if the name is not in __knownAttributeList', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    const setAttributeSpy = Sinon.spy(user, 'setAttribute');
                    user.first_name = user.last_name;
                    expect(setAttributeSpy.calledWith('first_name', user.last_name)).toBe(true);
                });
            });
        });
        describe('toObject()', function () {
            it('calls MongooseDocument.toObject()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    const toObjectSpy = Sinon.spy(user['attributes'], 'toObject');
                    expect(user.toObject()).toMatchObject({
                        first_name: 'tony',
                        last_name: 'stark',
                        full_name: 'tony stark',
                        age: 40,
                        __v: 0
                    });
                    expect(toObjectSpy.called).toBe(true);
                    id = user['_id'];
                });
            });
        });
        describe('toJson()', function () {
            it('calls MongooseDocument.toJSON(), strips __v, changes _id to "id"', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    const toJSONSpy = Sinon.spy(user['attributes'], 'toJSON');
                    expect(user.toJson()).toMatchObject({
                        id,
                        first_name: 'tony',
                        last_name: 'stark',
                        full_name: 'tony stark',
                        age: 40
                    });
                    expect(toJSONSpy.calledWith({
                        getters: true,
                        virtuals: true,
                        versionKey: false
                    })).toBe(true);
                });
            });
        });
        describe('newInstance()', function () {
            it('works exactly like Eloquent.newInstance()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    expect(user.newInstance()).toBeInstanceOf(User);
                    expect(user.newInstance({})).toBeInstanceOf(User);
                });
            });
        });
        describe('newCollection()', function () {
            it('works exactly like Eloquent.newCollection()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    expect(user.newCollection([]).items).toEqual([]);
                });
            });
        });
        describe('newQuery()', function () {
            it('creates new MongooseQueryBuilder with model name is getModelName()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    const getModelNameSpy = Sinon.spy(user, 'getModelName');
                    expect(user.newQuery()).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                    expect(getModelNameSpy.called).toBe(true);
                });
            });
        });
        describe('fireEvent(event)', function () {
            it('is chain-able', function () {
                const user = new User();
                expect(user.fireEvent('any') === user).toBe(true);
            });
            it('triggers event by using MongooseDocument.emit() with this value', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    const emitSpy = Sinon.spy(user['model'], 'emit');
                    user.fireEvent('any');
                    expect(emitSpy.calledWith('any', user)).toBe(true);
                });
            });
        });
        describe('is()', function () {
            it('calls MongooseDocument.equals()', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.where('first_name', 'tony').find();
                    const comparison = new User();
                    const equalsSpy = Sinon.spy(user['attributes'], 'equals');
                    expect(user.is(comparison)).toBe(false);
                    expect(equalsSpy.calledWith(comparison['attributes'])).toBe(true);
                });
            });
        });
    });
    describe('Timestamps', function () {
        class TimestampModelDefault extends lib_1.Eloquent.Mongoose() {
            getClassName() {
                return 'TimestampModelDefault';
            }
            getSchema() {
                return new mongoose_1.Schema({ name: String });
            }
        }
        TimestampModelDefault.timestamps = true;
        it('should use custom "setupTimestamp" which use Moment instead of native Date', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                const model = new TimestampModelDefault();
                yield model.save();
                expect(model.created_at).toEqual(now);
                expect(model.updated_at).toEqual(now);
            });
        });
        it('works with ActiveRecord.save()', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const createdAt = new Date(1988, 4, 16);
                Moment.now = () => createdAt;
                const model = new TimestampModelDefault();
                yield model.save();
                const updatedAt = new Date(2000, 0, 1);
                Moment.now = () => updatedAt;
                model.name = 'updated';
                yield model.save();
                const updatedModel = yield TimestampModelDefault.find(model.id);
                expect(updatedModel.updated_at).toEqual(updatedAt);
            });
        });
        it('works with QueryBuilder.update(), one document', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const createdAt = new Date(1988, 4, 16);
                Moment.now = () => createdAt;
                const model = new TimestampModelDefault();
                yield model.save();
                const updatedAt = new Date(2000, 0, 1);
                Moment.now = () => updatedAt;
                yield TimestampModelDefault.where('_id', model.id).update({});
                const updatedModel = yield TimestampModelDefault.find(model.id);
                expect(updatedModel.updated_at).toEqual(updatedAt);
            });
        });
        it('works with QueryBuilder.update(), multiple documents', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(2010, 0, 1);
                Moment.now = () => now;
                const idList = yield TimestampModelDefault.pluck('id');
                yield TimestampModelDefault.whereIn('id', Object.keys(idList)).update({});
                const documents = yield TimestampModelDefault.all();
                expect(documents.map(item => item.updated_at).all()).toEqual([now, now, now]);
            });
        });
        class CustomTimestampModel extends lib_1.Eloquent.Mongoose() {
            getClassName() {
                return 'CustomTimestampModel';
            }
            getSchema() {
                return new mongoose_1.Schema({ name: String });
            }
        }
        CustomTimestampModel.timestamps = {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        };
        it('works with custom name for createdAt and updatedAt', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                const model = new CustomTimestampModel();
                yield model.save();
                expect(model['createdAt']).toEqual(now);
                expect(model['updatedAt']).toEqual(now);
            });
        });
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
        it('does not load plugin SoftDelete with deleted_at by default', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const model = new User();
                expect(model['schema'].path('deleted_at')).toBeUndefined();
                expect(model.newQuery()['softDelete']).toBe(false);
            });
        });
        it('loads plugin SoftDelete with deleted_at by default', function () {
            return __awaiter(this, void 0, void 0, function* () {
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
        });
        it('has custom field for deletedAt', function () {
            return __awaiter(this, void 0, void 0, function* () {
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
        });
        it('works with ActiveRecord and use Moment as Date source', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                const model = new SoftDeleteModel({
                    name: 'test'
                });
                yield model.delete();
                expect(model.deleted_at).toEqual(now);
                yield model.forceDelete();
            });
        });
        it('works with static functions', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                expect(yield SoftDeleteModel.count()).toEqual(0);
                const notDeletedModel = new SoftDeleteModel({
                    name: 'test'
                });
                yield notDeletedModel.save();
                const deletedModel = new SoftDeleteModel({
                    name: 'test'
                });
                yield deletedModel.delete();
                expect(yield SoftDeleteModel.count()).toEqual(1);
                expect(yield SoftDeleteModel.withTrashed().count()).toEqual(2);
                expect(yield SoftDeleteModel.onlyTrashed().count()).toEqual(1);
                yield notDeletedModel.forceDelete();
                yield deletedModel.forceDelete();
            });
        });
        it('does not override .find or .findOne when use .native()', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date(1988, 4, 16);
                Moment.now = () => now;
                const notDeletedModel = new SoftDeleteModel({
                    name: 'test'
                });
                yield notDeletedModel.save();
                const deletedModel = new SoftDeleteModel({
                    name: 'test'
                });
                yield deletedModel.delete();
                expect(yield SoftDeleteModel.count()).toEqual(1);
                expect(yield SoftDeleteModel.withTrashed().count()).toEqual(2);
                expect(yield SoftDeleteModel.onlyTrashed().count()).toEqual(1);
                expect(yield SoftDeleteModel.native(function (model) {
                    return model.find();
                }).count()).toEqual(2);
                yield notDeletedModel.forceDelete();
                yield deletedModel.forceDelete();
            });
        });
    });
});
