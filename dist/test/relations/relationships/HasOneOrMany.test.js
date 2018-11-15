"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Relationship_1 = require("../../../lib/relations/Relationship");
const HasOne_1 = require("../../../lib/relations/relationships/HasOne");
const HasOneOrMany_1 = require("../../../lib/relations/relationships/HasOneOrMany");
const DataBuffer_1 = require("../../../lib/data/DataBuffer");
const DataCollector_1 = require("../../../lib/data/DataCollector");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
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
describe('HasOneOrMany', function () {
    function makeRelation(model, name, targetDefinition, targetKey, localKey) {
        return new HasOne_1.HasOne(model, name, targetDefinition, targetKey, localKey);
    }
    it('extends Relation', function () {
        const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
        expect(relation).toBeInstanceOf(Relationship_1.Relationship);
        expect(relation).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
    });
    describe('constructor()', function () {
        it('assign target to "targetDefinition", targetKey to "targetKeyName", rootKey to "rootKeyName"', function () {
            const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            expect(relation['rootKeyName']).toEqual('id');
            expect(relation['targetKeyName']).toEqual('target_id');
            expect(relation['targetDefinition']).toEqual('Target');
        });
    });
    describe('.collectData()', function () {
        it('returns undefined if there is no DataBucket', function () {
            const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(undefined);
            const executor = {
                executeCollector() { }
            };
            const getExecutorStub = Sinon.stub(relation, 'getExecutor');
            getExecutorStub.returns(executor);
            const spy = Sinon.spy(executor, 'executeCollector');
            expect(relation.collectData()).toBe(undefined);
            expect(spy.called).toBe(false);
        });
        it('creates collector which created for DataBuffer of Target then calls and returns .getExecutor().setCollector().executeCollector()', function () {
            const rootModel = {
                getAttribute(name) {
                    return name + '-value';
                }
            };
            const relation = makeRelation(rootModel, 'test', 'Target', 'target_id', 'id');
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            const dataBucket = {
                getDataOf() {
                    return dataBuffer;
                }
            };
            const targetModel = {};
            relation['targetModelInstance'] = targetModel;
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const getDataOfSpy = Sinon.spy(dataBucket, 'getDataOf');
            const executor = {
                setCollector() {
                    return this;
                },
                executeCollector() { }
            };
            const getExecutorStub = Sinon.stub(relation, 'getExecutor');
            getExecutorStub.returns(executor);
            const executeCollectorStub = Sinon.stub(executor, 'executeCollector');
            executeCollectorStub.returns('anything');
            const setCollectorSpy = Sinon.spy(executor, 'setCollector');
            expect(relation.collectData()).toEqual('anything');
            expect(getDataOfSpy.calledWith(targetModel));
            const collector = setCollectorSpy.lastCall.args[0];
            const collectorFilters = setCollectorSpy.lastCall.args[1];
            expect(setCollectorSpy.lastCall.args[2] === reader).toBe(true);
            expect(collectorFilters).toEqual([
                {
                    field: 'target_id',
                    operator: '=',
                    value: 'id-value',
                    reader: reader
                }
            ]);
            expect(collector).toBeInstanceOf(DataCollector_1.DataCollector);
            expect(collector['dataBuffer'] === dataBuffer).toBe(true);
        });
    });
    describe('.fetchData()', function () {
        it('gets query from .createTargetQuery() then pass .where() then calls and returns .getExecutor().setQuery().executeQuery() for lazy load', async function () {
            const query = {
                where() { },
                whereIn() { }
            };
            const rootModel = {
                getAttribute(name) {
                    return name + '-value';
                }
            };
            const relation = makeRelation(rootModel, 'test', 'Target', 'target_id', 'id');
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(undefined);
            const targetModel = {
                getModelName() {
                    return 'Target';
                }
            };
            relation['targetModelInstance'] = targetModel;
            const createTargetQueryStub = Sinon.stub(relation, 'createTargetQuery');
            createTargetQueryStub.returns(query);
            const executor = {
                setQuery() {
                    return this;
                },
                executeQuery() { }
            };
            const getExecutorStub = Sinon.stub(relation, 'getExecutor');
            getExecutorStub.returns(executor);
            const setQuerySpy = Sinon.spy(executor, 'setQuery');
            const executeQueryStub = Sinon.stub(executor, 'executeQuery');
            executeQueryStub.returns('anything');
            const whereSpy = Sinon.spy(query, 'where');
            const whereInSpy = Sinon.spy(query, 'whereIn');
            expect(await relation.fetchData('lazy')).toEqual('anything');
            expect(createTargetQueryStub.calledWith('HasOne:Target')).toBe(true);
            expect(setQuerySpy.calledWith(query)).toBe(true);
            expect(executeQueryStub.calledWith()).toBe(true);
            expect(whereSpy.calledWith('target_id', 'id-value')).toBe(true);
            expect(whereInSpy.called).toBe(false);
        });
        it('gets query from .createTargetQuery() then calls and returns .getExecutor().getEmptyValue() for eager load if there is no dataBucket', async function () {
            const query = {
                where() { },
                whereIn() { }
            };
            const rootModel = {
                getAttribute(name) {
                    return name + '-value';
                }
            };
            const relation = makeRelation(rootModel, 'test', 'Target', 'target_id', 'id');
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(undefined);
            const targetModel = {
                getModelName() {
                    return 'Target';
                }
            };
            relation['targetModelInstance'] = targetModel;
            const createTargetQueryStub = Sinon.stub(relation, 'createTargetQuery');
            createTargetQueryStub.returns(query);
            const executor = {
                executeQuery() { },
                getEmptyValue() { }
            };
            const getExecutorStub = Sinon.stub(relation, 'getExecutor');
            getExecutorStub.returns(executor);
            const executeQueryStub = Sinon.stub(executor, 'executeQuery');
            executeQueryStub.returns('anything');
            const getEmptyValueStub = Sinon.stub(executor, 'getEmptyValue');
            getEmptyValueStub.returns('empty');
            const whereSpy = Sinon.spy(query, 'where');
            const whereInSpy = Sinon.spy(query, 'whereIn');
            expect(await relation.fetchData('eager')).toEqual('empty');
            expect(createTargetQueryStub.calledWith('HasOne:Target')).toBe(true);
            expect(executeQueryStub.calledWith(query)).toBe(false);
            expect(whereSpy.called).toBe(false);
            expect(whereInSpy.called).toBe(false);
        });
        it('gets query from .createTargetQuery() then pass .whereIn() then calls and returns .getExecutor().executeQuery() for eager load', async function () {
            const query = {
                where() { },
                whereIn() { }
            };
            const rootModel = {
                getAttribute(name) {
                    return name + '-value';
                }
            };
            const relation = makeRelation(rootModel, 'test', 'Target', 'target_id', 'field');
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            dataBuffer
                .add({ id: 1, field: 'a' })
                .add({ id: 2, field: 'b' })
                .add({ id: 3, field: 'c' });
            const dataBucket = {
                getDataOf() {
                    return dataBuffer;
                }
            };
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const targetModel = {
                getModelName() {
                    return 'Target';
                }
            };
            relation['targetModelInstance'] = targetModel;
            const createTargetQueryStub = Sinon.stub(relation, 'createTargetQuery');
            createTargetQueryStub.returns(query);
            const executor = {
                setQuery() {
                    return this;
                },
                executeQuery() { },
                getEmptyValue() { }
            };
            const getExecutorStub = Sinon.stub(relation, 'getExecutor');
            getExecutorStub.returns(executor);
            const setQuerySpy = Sinon.spy(executor, 'setQuery');
            const executeQueryStub = Sinon.stub(executor, 'executeQuery');
            executeQueryStub.returns('anything');
            const whereSpy = Sinon.spy(query, 'where');
            const whereInSpy = Sinon.spy(query, 'whereIn');
            expect(await relation.fetchData('eager')).toEqual('anything');
            expect(createTargetQueryStub.calledWith('HasOne:Target')).toBe(true);
            expect(setQuerySpy.calledWith(query)).toBe(true);
            expect(executeQueryStub.calledWith()).toBe(true);
            expect(whereSpy.called).toBe(false);
            expect(whereInSpy.calledWith('target_id', ['a', 'b', 'c'])).toBe(true);
        });
    });
    describe('.isInverseOf()', function () {
        it('returns false if the given relationship is not instance of HasOneOrMany', function () {
            const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            expect(relation.isInverseOf({})).toBe(false);
        });
        it('returns false immediately if the .isInverseOfTypeMatched() returns false', function () {
            const relationA = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            const relationB = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            expect(relationA.isInverseOf(relationB)).toBe(false);
        });
        it('returns true if the rootModel of current relationship is matched with the target of given relationship and vice verse', function () {
            const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            const comparedRelation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            const stub = Sinon.stub(relation, 'isInverseOfTypeMatched');
            stub.returns(true);
            const a = {
                getModelName() {
                    return 'A';
                }
            };
            const b = {
                getModelName() {
                    return 'B';
                }
            };
            const dataset = [
                {
                    current: { rootModel: a, rootKeyName: 'id', targetModel: b, targetKeyName: 'b_id' },
                    compared: { targetModel: a, targetKeyName: 'id', rootModel: b, rootKeyName: 'b_id' },
                    result: true
                },
                {
                    current: { rootModel: a, rootKeyName: 'id', targetModel: b, targetKeyName: 'b_id' },
                    compared: { targetModel: b, targetKeyName: 'id', rootModel: b, rootKeyName: 'b_id' },
                    result: false
                },
                {
                    current: { rootModel: a, rootKeyName: 'id', targetModel: b, targetKeyName: 'b_id' },
                    compared: { targetModel: a, targetKeyName: 'wrong', rootModel: b, rootKeyName: 'b_id' },
                    result: false
                },
                {
                    current: { rootModel: a, rootKeyName: 'id', targetModel: b, targetKeyName: 'b_id' },
                    compared: { targetModel: a, targetKeyName: 'id', rootModel: a, rootKeyName: 'b_id' },
                    result: false
                },
                {
                    current: { rootModel: a, rootKeyName: 'id', targetModel: b, targetKeyName: 'b_id' },
                    compared: { targetModel: a, targetKeyName: 'id', rootModel: b, rootKeyName: 'wrong' },
                    result: false
                }
            ];
            for (const data of dataset) {
                relation['rootModel'] = data.current.rootModel;
                relation['rootKeyName'] = data.current.rootKeyName;
                relation['targetModelInstance'] = data.current.targetModel;
                relation['targetKeyName'] = data.current.targetKeyName;
                comparedRelation['rootModel'] = data.compared.rootModel;
                comparedRelation['rootKeyName'] = data.compared.rootKeyName;
                comparedRelation['targetModelInstance'] = data.compared.targetModel;
                comparedRelation['targetKeyName'] = data.compared.targetKeyName;
                expect(relation.isInverseOf(comparedRelation)).toBe(data.result);
            }
        });
    });
    describe('.isInverseOfTypeMatched()', function () {
        it('detects the inverse of based on type', function () {
            const dataset = [
                { a: RelationshipType_1.RelationshipType.HasOne, b: RelationshipType_1.RelationshipType.HasOne, result: false },
                { a: RelationshipType_1.RelationshipType.HasOne, b: RelationshipType_1.RelationshipType.HasMany, result: false },
                { a: RelationshipType_1.RelationshipType.HasOne, b: RelationshipType_1.RelationshipType.BelongsTo, result: true },
                { a: RelationshipType_1.RelationshipType.BelongsTo, b: RelationshipType_1.RelationshipType.HasOne, result: true },
                { a: RelationshipType_1.RelationshipType.BelongsTo, b: RelationshipType_1.RelationshipType.BelongsTo, result: false },
                { a: RelationshipType_1.RelationshipType.BelongsTo, b: RelationshipType_1.RelationshipType.HasMany, result: true },
                { a: RelationshipType_1.RelationshipType.HasMany, b: RelationshipType_1.RelationshipType.HasOne, result: false },
                { a: RelationshipType_1.RelationshipType.HasMany, b: RelationshipType_1.RelationshipType.BelongsTo, result: true },
                { a: RelationshipType_1.RelationshipType.HasMany, b: RelationshipType_1.RelationshipType.HasMany, result: false }
            ];
            const relation = makeRelation({}, 'test', 'Target', 'target_id', 'id');
            const aStub = Sinon.stub(relation, 'getType');
            for (const data of dataset) {
                aStub.returns(data.a);
                const bRelation = {
                    getType() {
                        return data.b;
                    }
                };
                expect(relation.isInverseOfTypeMatched(bRelation)).toBe(data.result);
            }
        });
    });
});
