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
const lib_1 = require("../../lib");
const najs_1 = require("najs");
const MongooseQueryBuilder_1 = require("../../lib/query-builders/MongooseQueryBuilder");
const EloquentMongoose_1 = require("../../lib/eloquent/EloquentMongoose");
const mongoose = require('mongoose');
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
    getFullNameAttribute() {
        return this.attributes.first_name + ' ' + this.attributes.last_name;
    }
    getSchema() {
        return new mongoose_1.Schema({
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            age: { type: Number, default: 0 }
        }, { collection: 'users' });
    }
}
User.className = 'User';
describe('EloquentMongoose', function () {
    jest.setTimeout(10000);
    beforeAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                mongoose.connect('mongodb://localhost/najs_eloquent_test_0');
                mongoose.Promise = global.Promise;
                mongoose.connection.once('open', () => {
                    resolve(true);
                });
            });
        });
    });
    afterAll(function () {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                try {
                    if (mongoose.connection.collection('users')) {
                        mongoose.connection.collection('users').drop(function () {
                            resolve(true);
                        });
                    }
                    else {
                        resolve(true);
                    }
                }
                catch (error) { }
            });
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
        describe('select()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.select('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
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
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.distinct('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
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
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderBy('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
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
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderByAsc('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orderByAsc()', function () {
                const orderByAscSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orderByAsc');
                User.orderByAsc('first_name');
                expect(orderByAscSpy.calledWith('first_name')).toBe(true);
                orderByAscSpy.restore();
            });
        });
        describe('orderByDesc()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orderByDesc('first_name')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orderByDesc()', function () {
                const orderByDescSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orderByDesc');
                User.orderByDesc('first_name');
                expect(orderByDescSpy.calledWith('first_name')).toBe(true);
                orderByDescSpy.restore();
            });
        });
        describe('limit()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.limit(10)).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.limit()', function () {
                const limitSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'limit');
                User.limit(10);
                expect(limitSpy.calledWith(10)).toBe(true);
                limitSpy.restore();
            });
        });
        describe('where()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.where('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
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
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhere('first_name', 'tony')).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
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
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereIn()', function () {
                const whereInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereIn');
                User.whereIn('first_name', ['tony']);
                expect(whereInSpy.calledWith('first_name', ['tony'])).toBe(true);
                whereInSpy.restore();
            });
        });
        describe('whereNotIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.whereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.whereNotIn()', function () {
                const whereNotInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'whereNotIn');
                User.whereNotIn('first_name', ['tony']);
                expect(whereNotInSpy.calledWith('first_name', ['tony'])).toBe(true);
                whereNotInSpy.restore();
            });
        });
        describe('orWhereIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereIn()', function () {
                const orWhereInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereIn');
                User.orWhereIn('first_name', ['tony']);
                expect(orWhereInSpy.calledWith('first_name', ['tony'])).toBe(true);
                orWhereInSpy.restore();
            });
        });
        describe('orWhereNotIn()', function () {
            it('creates MongooseQueryBuilder with model from prototype.getModelName()', function () {
                const getModelNameSpy = Sinon.spy(User.prototype, 'getModelName');
                expect(User.orWhereNotIn('first_name', ['tony'])).toBeInstanceOf(MongooseQueryBuilder_1.MongooseQueryBuilder);
                expect(getModelNameSpy.called).toBe(true);
                getModelNameSpy.restore();
            });
            it('passes all params to MongooseQueryBuilder.orWhereNotIn()', function () {
                const orWhereNotInSpy = Sinon.spy(MongooseQueryBuilder_1.MongooseQueryBuilder.prototype, 'orWhereNotIn');
                User.orWhereNotIn('first_name', ['tony']);
                expect(orWhereNotInSpy.calledWith('first_name', ['tony'])).toBe(true);
                orWhereNotInSpy.restore();
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
    });
    describe('Eloquent method', function () {
        let id;
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
                    // const setAttributeSpy = Sinon.spy(user, 'setAttribute')
                    user.first_name = user.last_name;
                    // TODO: it not call setAttribute anymore
                    // expect(setAttributeSpy.calledWith('first_name', user.last_name)).toBe(true)
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
});
