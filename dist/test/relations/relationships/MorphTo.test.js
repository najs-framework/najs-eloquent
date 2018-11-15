"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const MorphTo_1 = require("../../../lib/relations/relationships/MorphTo");
const Relationship_1 = require("../../../lib/relations/Relationship");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
const DataBuffer_1 = require("../../../lib/data/DataBuffer");
const helpers_1 = require("../../../lib/util/helpers");
const reader = {
    getAttribute(data, field) {
        return data[field];
    },
    pick(data, fields) {
        return data;
    },
    toComparable(value) {
        return value;
    }
};
describe('MorphTo', function () {
    it('extends Relationship and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphTo"', function () {
        const rootModel = {};
        const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
        expect(morphTo).toBeInstanceOf(MorphTo_1.MorphTo);
        expect(morphTo).toBeInstanceOf(Relationship_1.Relationship);
        expect(morphTo.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphTo');
    });
    describe('.getType()', function () {
        it('returns literal string "MorphTo"', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            expect(morphTo.getType()).toEqual(RelationshipType_1.RelationshipType.MorphTo);
        });
    });
    describe('.makeTargetModel()', function () {
        it('creates targetModel by make() then cache it in "targetModelInstances"', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const model = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(model);
            expect(morphTo['targetModelInstances']).toEqual({});
            expect(morphTo.makeTargetModel('ModelName') === model).toBe(true);
            expect(morphTo['targetModelInstances']['ModelName'] === model).toBe(true);
            expect(makeStub.calledWith('ModelName')).toBe(true);
            makeStub.resetHistory();
            expect(morphTo.makeTargetModel('ModelName') === model).toBe(true);
            expect(makeStub.calledWith('ModelName')).toBe(false);
            makeStub.resetHistory();
            makeStub.restore();
        });
    });
    describe('.createQueryForTarget()', function () {
        it('returns a queryBuilder from given targetModel, which also contains the dataBucket of relation', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const queryBuilder = {
                handler: {
                    setRelationDataBucket() { }
                }
            };
            const targetModel = {
                newQuery() {
                    return queryBuilder;
                },
                getModelName() {
                    return 'Target';
                }
            };
            const dataBucket = {};
            const getDataBucketStub = Sinon.stub(morphTo, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket');
            const newQuerySpy = Sinon.spy(targetModel, 'newQuery');
            expect(morphTo.createQueryForTarget(targetModel) === queryBuilder).toBe(true);
            expect(newQuerySpy.calledWith('MorphTo:Target')).toBe(true);
            expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true);
        });
        it('passes the queryBuilder to .applyCustomQuery() then returns the result', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const queryBuilder = {
                handler: {
                    setRelationDataBucket() { }
                }
            };
            const targetModel = {
                newQuery() {
                    return queryBuilder;
                },
                getModelName() {
                    return 'Target';
                }
            };
            const dataBucket = {};
            const getDataBucketStub = Sinon.stub(morphTo, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket');
            const newQuerySpy = Sinon.spy(targetModel, 'newQuery');
            const applyCustomQueryStub = Sinon.stub(morphTo, 'applyCustomQuery');
            applyCustomQueryStub.returns('anything');
            expect(morphTo.createQueryForTarget(targetModel)).toEqual('anything');
            expect(newQuerySpy.calledWith('MorphTo:Target')).toBe(true);
            expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true);
            expect(applyCustomQueryStub.calledWith(queryBuilder)).toBe(true);
        });
    });
    describe('.findTargetKeyName()', function () {
        it('returns the value in "targetKeyNameMap" if the modelName is in there', function () {
            const map = {
                modelA: 'custom_id',
                typeA: 'custom_id'
            };
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', map);
            const targetModel = {
                getModelName() {
                    return 'modelA';
                }
            };
            expect(morphTo.findTargetKeyName(targetModel)).toEqual('custom_id');
        });
        it('returns the value in "targetKeyNameMap" if the morphType get from modelName is in there', function () {
            const map = {
                modelA: 'custom_id',
                typeA: 'custom_type_id'
            };
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', map);
            const findMorphTypeStub = Sinon.stub(Relationship_1.Relationship, 'findMorphType');
            findMorphTypeStub.returns('typeA');
            const targetModel = {
                getModelName() {
                    return 'model';
                }
            };
            expect(morphTo.findTargetKeyName(targetModel)).toEqual('custom_type_id');
            expect(findMorphTypeStub.calledWith('model')).toBe(true);
            findMorphTypeStub.restore();
        });
        it('returns the targetModel.getPrimaryKeyName() if there is no data in "targetKeyNameMap"', function () {
            const map = {
                modelA: 'custom_id',
                typeA: 'custom_type_id'
            };
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', map);
            const findMorphTypeStub = Sinon.stub(Relationship_1.Relationship, 'findMorphType');
            findMorphTypeStub.returns('type');
            const targetModel = {
                getModelName() {
                    return 'not-found';
                },
                getPrimaryKeyName() {
                    return 'pk_name';
                }
            };
            expect(morphTo.findTargetKeyName(targetModel)).toEqual('pk_name');
            expect(findMorphTypeStub.calledWith('not-found')).toBe(true);
            findMorphTypeStub.restore();
        });
    });
    describe('.collectDataInBucket()', function () {
        it('collect dataBuffer in dataBucket of Target model', function () {
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            dataBuffer.add({ id: 1, target_type: 'User', target_id: 1 });
            dataBuffer.add({ id: 2, target_type: 'User', target_id: 2 });
            dataBuffer.add({ id: 3, target_type: 'Post', target_id: 'a' });
            dataBuffer.add({ id: 4, target_type: 'Post', target_id: 'b' });
            const dataBucket = {
                getDataOf() {
                    return dataBuffer;
                }
            };
            const rootModel = {
                getAttribute() {
                    return 2;
                }
            };
            const targetModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'a', 'b', 'c', {});
            const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName');
            findTargetKeyNameStub.returns('target_id');
            const result = morphTo.collectDataInBucket(dataBucket, targetModel);
            expect(result).toEqual([{ id: 2, target_type: 'User', target_id: 2 }]);
        });
    });
    describe('.collectData()', function () {
        it('returns undefined if there is no data bucket', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const stub = Sinon.stub(morphTo, 'getDataBucket');
            stub.returns(undefined);
            expect(morphTo.collectData()).toBeUndefined();
        });
        it('finds data via .collectDataInBucket() then returns undefined if the result is empty', function () {
            const findModelNameStub = Sinon.stub(Relationship_1.Relationship, 'findModelName');
            findModelNameStub.returns('ModelName');
            const targetModel = {};
            const rootModel = {
                getAttribute() {
                    return 'TargetModelType';
                }
            };
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'target_type', 'target_id', {});
            const dataBucket = {};
            const stub = Sinon.stub(morphTo, 'getDataBucket');
            stub.returns(dataBucket);
            const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel');
            makeTargetModelStub.returns(targetModel);
            const collectDataInBucketStub = Sinon.stub(morphTo, 'collectDataInBucket');
            collectDataInBucketStub.returns([]);
            expect(morphTo.collectData()).toBeUndefined();
            expect(findModelNameStub.calledWith('TargetModelType')).toBe(true);
            expect(collectDataInBucketStub.calledWith(dataBucket, targetModel)).toBe(true);
            expect(makeTargetModelStub.calledWith('ModelName')).toBe(true);
            findModelNameStub.restore();
        });
        it('finds data via .collectDataInBucket() then returns model via dataBucket.makeModel() with the first result', function () {
            const findModelNameStub = Sinon.stub(Relationship_1.Relationship, 'findModelName');
            findModelNameStub.returns('ModelName');
            const targetModel = {};
            const rootModel = {
                getAttribute() {
                    return 'TargetModelType';
                }
            };
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'target_type', 'target_id', {});
            const firstResult = {};
            const secondResult = {};
            const dataBucket = {
                makeModel() { }
            };
            const stub = Sinon.stub(morphTo, 'getDataBucket');
            stub.returns(dataBucket);
            const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel');
            makeTargetModelStub.returns(targetModel);
            const collectDataInBucketStub = Sinon.stub(morphTo, 'collectDataInBucket');
            collectDataInBucketStub.returns([firstResult, secondResult]);
            const makeModelStub = Sinon.stub(dataBucket, 'makeModel');
            makeModelStub.returns('anything');
            expect(morphTo.collectData()).toEqual('anything');
            expect(findModelNameStub.calledWith('TargetModelType')).toBe(true);
            expect(collectDataInBucketStub.calledWith(dataBucket, targetModel)).toBe(true);
            expect(makeTargetModelStub.calledWith('ModelName')).toBe(true);
            expect(makeModelStub.calledWith(firstResult)).toBe(true);
            findModelNameStub.restore();
        });
    });
    describe('.getEagerFetchInfo()', function () {
        it('reads all items in dataBuffer of RootModel, then reduce to an object keyed by modelName', function () {
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            dataBuffer.add({ id: 1, target_type: 'User', target_id: 1 });
            dataBuffer.add({ id: 2, target_type: 'User', target_id: 2 });
            dataBuffer.add({ id: 3, target_type: 'Post', target_id: 'a' });
            dataBuffer.add({ id: 4, target_type: 'Post', target_id: 'b' });
            const dataBucket = {
                getDataOf() {
                    return dataBuffer;
                }
            };
            const findModelNameStub = Sinon.stub(Relationship_1.Relationship, 'findModelName');
            findModelNameStub.callsFake(function (type) {
                return type.toLowerCase();
            });
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'target_type', 'target_id', {});
            expect(morphTo.getEagerFetchInfo(dataBucket)).toEqual({
                user: [1, 2],
                post: ['a', 'b']
            });
            findModelNameStub.restore();
        });
    });
    describe('.eagerFetchData()', function () {
        it('returns an empty collection if there is no data bucket', async function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const stub = Sinon.stub(morphTo, 'getDataBucket');
            stub.returns(undefined);
            const result = await morphTo.eagerFetchData();
            expect(helpers_1.isCollection(result)).toBe(true);
            expect(result.all()).toEqual([]);
        });
        it('finds modelName by morphType value, then creates query via .createQueryForTarget() and add conditions then returns query.first()', async function () {
            const targetModel = {};
            const rootModel = {
                data: {
                    target_id: '1',
                    target_type: 'Type'
                },
                getAttribute(name) {
                    return this.data[name];
                }
            };
            const query = {
                whereIn() { },
                first() {
                    return Promise.resolve('anything');
                }
            };
            const whereInSpy = Sinon.spy(query, 'whereIn');
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'target_type', 'target_id', {});
            const stub = Sinon.stub(morphTo, 'getDataBucket');
            stub.returns({});
            const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel');
            makeTargetModelStub.returns(targetModel);
            const getEagerFetchInfoStub = Sinon.stub(morphTo, 'getEagerFetchInfo');
            getEagerFetchInfoStub.returns({
                ModelName: [1, 2]
            });
            const createQueryForTargetStub = Sinon.stub(morphTo, 'createQueryForTarget');
            createQueryForTargetStub.returns(query);
            const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName');
            findTargetKeyNameStub.returns('found_id');
            expect(await morphTo.eagerFetchData()).toEqual(['anything']);
            expect(makeTargetModelStub.calledWith('ModelName')).toBe(true);
            expect(createQueryForTargetStub.calledWith(targetModel)).toBe(true);
            expect(findTargetKeyNameStub.calledWith(targetModel)).toBe(true);
            expect(whereInSpy.calledWith('found_id', [1, 2])).toBe(true);
        });
    });
    describe('.fetchData()', function () {
        it('calls and returns .eagerFetchData() if type is "eager"', async function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            const stub = Sinon.stub(morphTo, 'eagerFetchData');
            stub.returns(Promise.resolve('anything'));
            expect(await morphTo.fetchData('eager')).toEqual('anything');
        });
        it('finds modelName by morphType value, then creates query via .createQueryForTarget() and add conditions then returns query.first() for "lazy" type', async function () {
            const findModelNameStub = Sinon.stub(Relationship_1.Relationship, 'findModelName');
            findModelNameStub.returns('ModelName');
            const targetModel = {};
            const rootModel = {
                data: {
                    target_id: '1',
                    target_type: 'Type'
                },
                getAttribute(name) {
                    return this.data[name];
                }
            };
            const query = {
                where() { },
                first() {
                    return Promise.resolve('anything');
                }
            };
            const whereSpy = Sinon.spy(query, 'where');
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'target_type', 'target_id', {});
            const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel');
            makeTargetModelStub.returns(targetModel);
            const createQueryForTargetStub = Sinon.stub(morphTo, 'createQueryForTarget');
            createQueryForTargetStub.returns(query);
            const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName');
            findTargetKeyNameStub.returns('found_id');
            expect(await morphTo.fetchData('lazy')).toEqual('anything');
            expect(findModelNameStub.calledWith('Type')).toBe(true);
            expect(makeTargetModelStub.calledWith('ModelName')).toBe(true);
            expect(createQueryForTargetStub.calledWith(targetModel)).toBe(true);
            expect(findTargetKeyNameStub.calledWith(targetModel)).toBe(true);
            expect(whereSpy.calledWith('found_id', '1')).toBe(true);
            findModelNameStub.restore();
        });
    });
    describe('.isInverseOf()', function () {
        it('always returns false', function () {
            const rootModel = {};
            const morphTo = new MorphTo_1.MorphTo(rootModel, 'test', 'root_type', 'root_id', {});
            expect(morphTo.isInverseOf({})).toBe(false);
        });
    });
});
