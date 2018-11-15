"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const lib_1 = require("../../lib");
const bson_1 = require("bson");
const helpers_1 = require("../../lib/util/helpers");
const factory_1 = require("../../lib/util/factory");
class TestModel extends lib_1.Model {
    getClassName() {
        return 'TestModel';
    }
}
najs_binding_1.register(TestModel);
describe('.isModel()', function () {
    it('returns true if the given value is Model instance', function () {
        expect(helpers_1.isModel(0)).toBe(false);
        expect(helpers_1.isModel('test')).toBe(false);
        expect(helpers_1.isModel({})).toBe(false);
        expect(helpers_1.isModel(new Date())).toBe(false);
        expect(helpers_1.isModel(factory_1.make_collection([]))).toBe(false);
        expect(helpers_1.isModel(new TestModel())).toBe(true);
    });
    it('returns true if the given value is object and has _isNajsEloquentModel === true', function () {
        expect(helpers_1.isModel({ _isNajsEloquentModel: true })).toBe(true);
        expect(helpers_1.isModel({ _isNajsEloquentModel: false })).toBe(false);
        expect(helpers_1.isModel({ _isNajsEloquentModel: '1' })).toBe(false);
    });
});
describe('.isCollection()', function () {
    it('returns true if the given value is Collection instance', function () {
        expect(helpers_1.isCollection(0)).toBe(false);
        expect(helpers_1.isCollection('test')).toBe(false);
        expect(helpers_1.isCollection({})).toBe(false);
        expect(helpers_1.isCollection(new Date())).toBe(false);
        expect(helpers_1.isCollection(new TestModel())).toBe(false);
        expect(helpers_1.isCollection(factory_1.make_collection([]))).toBe(true);
    });
});
describe('.isObjectId()', function () {
    it('returns true if the given value is ObjectId instance', function () {
        expect(helpers_1.isObjectId(0)).toBe(false);
        expect(helpers_1.isObjectId('test')).toBe(false);
        expect(helpers_1.isObjectId({})).toBe(false);
        // tslint:disable-next-line
        expect(helpers_1.isObjectId(null)).toBe(false);
        expect(helpers_1.isObjectId(undefined)).toBe(false);
        expect(helpers_1.isObjectId(new Date())).toBe(false);
        expect(helpers_1.isObjectId(new TestModel())).toBe(false);
        expect(helpers_1.isObjectId(new bson_1.ObjectId())).toBe(true);
    });
    it('returns true if the given value is object and has .toHexString is function', function () {
        expect(helpers_1.isObjectId({ toHexString: 'value' })).toBe(false);
        expect(helpers_1.isObjectId({ toHexString: 1 })).toBe(false);
        expect(helpers_1.isObjectId({ toHexString: undefined })).toBe(false);
        expect(helpers_1.isObjectId({ toHexString: new Date() })).toBe(false);
        expect(helpers_1.isObjectId({ toHexString: 'value' })).toBe(false);
        expect(helpers_1.isObjectId({ toHexString: function () { } })).toBe(true);
    });
    it('returns true if the given value is object and has _bsontype is ObjectId or ObjectID', function () {
        expect(helpers_1.isObjectId({ _bsontype: 'objectid' })).toBe(false);
        expect(helpers_1.isObjectId({ _bsontype: 'ObjectId' })).toBe(true);
        expect(helpers_1.isObjectId({ _bsontype: 'ObjectID' })).toBe(true);
    });
});
describe('.distinctModelByClassInCollection()', function () {
    it('returns an empty array if param is not collection', function () {
        expect(helpers_1.distinctModelByClassInCollection({})).toEqual([]);
    });
    it('returns an empty array if collection is empty', function () {
        expect(helpers_1.distinctModelByClassInCollection(factory_1.make_collection([]))).toEqual([]);
    });
    it('groups returns an array by .getModelName()', function () {
        const modelA1 = {
            getModelName() {
                return 'A';
            }
        };
        const modelA2 = {
            getModelName() {
                return 'A';
            }
        };
        const modelB1 = {
            getModelName() {
                return 'B';
            }
        };
        const modelB2 = {
            getModelName() {
                return 'B';
            }
        };
        const result = helpers_1.distinctModelByClassInCollection(factory_1.make_collection([modelA1, modelA2, modelB1, modelB2]));
        expect(result).toHaveLength(2);
        expect(result[0] === modelA1).toBe(true);
        expect(result[1] === modelB1).toBe(true);
    });
});
