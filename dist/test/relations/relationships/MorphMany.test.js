"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Helpers = require("../../../lib/util/helpers");
const MorphMany_1 = require("../../../lib/relations/relationships/MorphMany");
const HasOneOrMany_1 = require("../../../lib/relations/relationships/HasOneOrMany");
const Relationship_1 = require("../../../lib/relations/Relationship");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
const MorphOneOrManyExecutor_1 = require("../../../lib/relations/relationships/executors/MorphOneOrManyExecutor");
const HasManyExecutor_1 = require("../../../lib/relations/relationships/executors/HasManyExecutor");
const factory_1 = require("../../../lib/util/factory");
const RelationUtilities_1 = require("../../../lib/relations/RelationUtilities");
describe('MorphMany', function () {
    it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphMany"', function () {
        const rootModel = {};
        const morphMany = new MorphMany_1.MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
        expect(morphMany).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
        expect(morphMany).toBeInstanceOf(Relationship_1.Relationship);
        expect(morphMany.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphMany');
    });
    describe('.getType()', function () {
        it('returns literal string "MorphMany"', function () {
            const rootModel = {};
            const morphMany = new MorphMany_1.MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            expect(morphMany.getType()).toEqual(RelationshipType_1.RelationshipType.MorphMany);
        });
    });
    describe('.getExecutor()', function () {
        it('returns an cached instance of MorphOneOrManyExecutor which wrap HasManyExecutor in property "executor"', function () {
            const isModelStub = Sinon.stub(Helpers, 'isModel');
            const findMorphTypeSpy = Sinon.spy(Relationship_1.Relationship, 'findMorphType');
            isModelStub.returns(true);
            const rootModel = {
                getModelName() {
                    return 'Root';
                }
            };
            const morphMany = new MorphMany_1.MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            morphMany['targetModelInstance'] = {};
            const getDataBucketStub = Sinon.stub(morphMany, 'getDataBucket');
            getDataBucketStub.returns({});
            expect(morphMany.getExecutor()).toBeInstanceOf(MorphOneOrManyExecutor_1.MorphOneOrManyExecutor);
            expect(morphMany.getExecutor()['executor']).toBeInstanceOf(HasManyExecutor_1.HasManyExecutor);
            expect(morphMany.getExecutor()['targetMorphTypeName']).toEqual('target_type');
            expect(morphMany.getExecutor()['morphTypeValue']).toEqual('Root');
            expect(morphMany.getExecutor() === morphMany['executor']).toBe(true);
            expect(findMorphTypeSpy.calledWith(rootModel)).toBe(true);
            findMorphTypeSpy.restore();
            isModelStub.restore();
        });
    });
    describe('.associate()', function () {
        it('is chainable, calls RelationUtilities.associateMany() with a setTargetAttributes which sets targetKeyName and targetMorphTypeName to target model', function () {
            const stub = Sinon.stub(MorphMany_1.MorphMany, 'findMorphType');
            stub.returns('MorphType');
            const rootModel = {
                getAttribute() {
                    return 'anything';
                },
                getModelName() {
                    return 'ModelName';
                },
                once() { }
            };
            const model1 = {
                setAttribute() { },
                save() {
                    return Promise.resolve(true);
                }
            };
            const model2 = {
                setAttribute() { },
                save() {
                    return Promise.resolve(true);
                }
            };
            const model3 = {
                setAttribute() { },
                save() {
                    return Promise.resolve(true);
                }
            };
            const model4 = {
                setAttribute() { },
                save() {
                    return Promise.resolve(true);
                }
            };
            const morphMany = new MorphMany_1.MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            const setAttribute1Spy = Sinon.spy(model1, 'setAttribute');
            const setAttribute2Spy = Sinon.spy(model2, 'setAttribute');
            const setAttribute3Spy = Sinon.spy(model3, 'setAttribute');
            const setAttribute4Spy = Sinon.spy(model4, 'setAttribute');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'associateMany');
            expect(morphMany.associate(model1, [model2], factory_1.make_collection([model3, model4])) === morphMany).toBe(true);
            expect(stub.calledWith('ModelName')).toBe(true);
            expect(spy.calledWith([model1, [model2], factory_1.make_collection([model3, model4])], rootModel, 'id')).toBe(true);
            expect(setAttribute1Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute1Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true);
            expect(setAttribute2Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute2Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true);
            expect(setAttribute3Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute3Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true);
            expect(setAttribute4Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute4Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true);
            stub.restore();
        });
    });
    describe('.dissociate()', function () {
        it('is chainable, calls RelationUtilities.dissociateMany() with setTargetAttributes which sets the targetKeyName/targetMorphTypeName to EmptyValue via RelationFeature.getEmptyValueForRelationshipForeignKey()', async function () {
            const relationFeature = {
                getEmptyValueForRelationshipForeignKey() {
                    return 'anything';
                }
            };
            const model1 = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                },
                setAttribute() {
                    return undefined;
                }
            };
            const model2 = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                },
                setAttribute() {
                    return undefined;
                }
            };
            const getEmptyValueForRelationshipForeignKeySpy = Sinon.spy(relationFeature, 'getEmptyValueForRelationshipForeignKey');
            const setAttribute1Spy = Sinon.spy(model1, 'setAttribute');
            const setAttribute2Spy = Sinon.spy(model2, 'setAttribute');
            const rootModel = {
                getAttribute() {
                    return 'id-value';
                },
                once() { }
            };
            const morphMany = new MorphMany_1.MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'dissociateMany');
            expect(morphMany.dissociate(model1, [model2]) === morphMany).toBe(true);
            expect(spy.calledWith([model1, [model2]], rootModel)).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.callCount).toEqual(4);
            expect(getEmptyValueForRelationshipForeignKeySpy.getCall(0).calledWith(model1, 'target_id')).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.getCall(1).calledWith(model1, 'target_type')).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.getCall(2).calledWith(model2, 'target_id')).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.getCall(3).calledWith(model2, 'target_type')).toBe(true);
            expect(setAttribute1Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute1Spy.secondCall.calledWith('target_type', 'anything')).toBe(true);
            expect(setAttribute2Spy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute2Spy.secondCall.calledWith('target_type', 'anything')).toBe(true);
        });
    });
});
