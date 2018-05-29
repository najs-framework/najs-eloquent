"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const RelationDataBucket_1 = require("../../lib/relations/RelationDataBucket");
const bson_1 = require("bson");
describe('RelationDataBucket', function () {
    it('implements IAutoload and returns class name "NajsEloquent.Relation.RelationDataBucket"', function () {
        const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
        expect(relationDataBucket.getClassName()).toEqual('NajsEloquent.Relation.RelationDataBucket');
    });
    describe('.newInstance()', function () {
        it('throws a ReferenceError if the name is not mapped to any model', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            try {
                relationDataBucket.newInstance('test', {});
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('"test" is not found or not registered yet.');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    describe('.getAttributes()', function () {
        it('returns an empty array if there is no name in bucket', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(relationDataBucket.getAttributes('test', 'attribute')).toEqual([]);
        });
        it('loops all this.bucket[name] and get the attribute then push them to the list', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {
                test: {
                    1: { a: 'a1', b: 'b1' },
                    2: { a: 'a2', b: 'b2' },
                    3: { a: 'a3', b: 'b2' }
                }
            };
            expect(relationDataBucket.getAttributes('test', 'a')).toEqual(['a1', 'a2', 'a3']);
        });
        it('loops all this.bucket[name] and skip if the value is undefined or null', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {
                test: {
                    1: { a: 'a1', b: 'b1' },
                    2: { a: undefined, b: 'b2' },
                    // tslint:disable-next-line
                    3: { a: null, b: 'b2' },
                    4: { a: 'a4', b: 'b2' }
                }
            };
            expect(relationDataBucket.getAttributes('test', 'a')).toEqual(['a1', 'a4']);
        });
        it('remove repetition if the third param is false, otherwise it does not', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {
                test: {
                    1: { a: 'a1', b: 'b1' },
                    2: { a: 'a2', b: 'b2' },
                    3: { a: 'a3', b: 'b2' }
                }
            };
            expect(relationDataBucket.getAttributes('test', 'b')).toEqual(['b1', 'b2']);
            expect(relationDataBucket.getAttributes('test', 'b', true)).toEqual(['b1', 'b2', 'b2']);
        });
    });
    describe('.makeModelFromRecord()', function () {
        it('calls make() with model name from modelMap', function () {
            const instance = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(instance);
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['modelMap'] = {
                test: 'Model'
            };
            const param = {};
            expect(relationDataBucket.makeModelFromRecord('test', param) === instance).toBe(true);
            expect(instance['relationDataBucket'] === relationDataBucket).toBe(true);
            expect(makeStub.calledWith('Model', [param])).toBe(true);
            makeStub.restore();
        });
    });
    describe('.makeCollectionFromRecords()', function () {
        it('creates new Collection by mapping records with .makeModelFromRecord()', function () {
            const instance = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(instance);
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['modelMap'] = {
                test: 'Model'
            };
            const result = relationDataBucket.makeCollectionFromRecords('test', [{}, {}]);
            expect(result.count()).toBe(2);
            expect(result.items[0] === instance).toBe(true);
            expect(result.items[1] === instance).toBe(true);
            makeStub.restore();
        });
    });
    describe('.filter()', function () {
        it('returns an empty array if there is no name in bucket', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {};
            expect(relationDataBucket.filter('test', 'id', 'any')).toEqual([]);
        });
        it('loops for all value in the bucket and use Lodash.eq() to compare data', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {
                test: {
                    1: { a: 'a1', b: 'b1' },
                    2: { a: 'a2', b: 'b2' },
                    3: { a: 'a3', b: 'b2' }
                }
            };
            expect(relationDataBucket.filter('test', 'a', 'a1')).toEqual([{ a: 'a1', b: 'b1' }]);
            expect(relationDataBucket.filter('test', 'b', 'b2')).toEqual([{ a: 'a2', b: 'b2' }, { a: 'a3', b: 'b2' }]);
        });
        it('returns the first record if 4th params is true', function () {
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            relationDataBucket['bucket'] = {
                test: {
                    1: { a: 'a1', b: 'b1' },
                    2: { a: 'a2', b: 'b2' },
                    3: { a: 'a3', b: 'b2' }
                }
            };
            expect(relationDataBucket.filter('test', 'b', 'b2', true)).toEqual([{ a: 'a2', b: 'b2' }]);
        });
    });
    describe('.convertToStringIfValueIsObjectID()', function () {
        it('converts ObjectID to hex string', function () {
            const objectId = bson_1.ObjectID.createFromTime(new Date().getTime());
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(typeof relationDataBucket.convertToStringIfValueIsObjectID(objectId)).toEqual('string');
            expect(relationDataBucket.convertToStringIfValueIsObjectID(objectId) === objectId.toHexString()).toBe(true);
        });
        it('returns original value if it is not ObjectId', function () {
            const value = {};
            const relationDataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(relationDataBucket.convertToStringIfValueIsObjectID('test')).toEqual('test');
            expect(relationDataBucket.convertToStringIfValueIsObjectID(value) === value).toBe(true);
        });
    });
});
