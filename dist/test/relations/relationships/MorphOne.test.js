"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Helpers = require("../../../lib/util/helpers");
const MorphOne_1 = require("../../../lib/relations/relationships/MorphOne");
const HasOneOrMany_1 = require("../../../lib/relations/relationships/HasOneOrMany");
const Relationship_1 = require("../../../lib/relations/Relationship");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
const MorphOneOrManyExecutor_1 = require("../../../lib/relations/relationships/executors/MorphOneOrManyExecutor");
const HasOneExecutor_1 = require("../../../lib/relations/relationships/executors/HasOneExecutor");
const RelationUtilities_1 = require("../../../lib/relations/RelationUtilities");
describe('MorphOne', function () {
    it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphOne"', function () {
        const rootModel = {};
        const morphOne = new MorphOne_1.MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
        expect(morphOne).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
        expect(morphOne).toBeInstanceOf(Relationship_1.Relationship);
        expect(morphOne.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphOne');
    });
    describe('.getType()', function () {
        it('returns literal string "MorphOne"', function () {
            const rootModel = {};
            const morphOne = new MorphOne_1.MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            expect(morphOne.getType()).toEqual(RelationshipType_1.RelationshipType.MorphOne);
        });
    });
    describe('.getExecutor()', function () {
        it('returns an cached instance of MorphOneOrManyExecutor which wrap HasOneExecutor in property "executor"', function () {
            const isModelStub = Sinon.stub(Helpers, 'isModel');
            const findMorphTypeSpy = Sinon.spy(Relationship_1.Relationship, 'findMorphType');
            isModelStub.returns(true);
            const rootModel = {
                getModelName() {
                    return 'Root';
                }
            };
            const morphOne = new MorphOne_1.MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            morphOne['targetModelInstance'] = {};
            const getDataBucketStub = Sinon.stub(morphOne, 'getDataBucket');
            getDataBucketStub.returns({});
            expect(morphOne.getExecutor()).toBeInstanceOf(MorphOneOrManyExecutor_1.MorphOneOrManyExecutor);
            expect(morphOne.getExecutor()['executor']).toBeInstanceOf(HasOneExecutor_1.HasOneExecutor);
            expect(morphOne.getExecutor()['targetMorphTypeName']).toEqual('target_type');
            expect(morphOne.getExecutor()['morphTypeValue']).toEqual('Root');
            expect(morphOne.getExecutor() === morphOne['executor']).toBe(true);
            expect(findMorphTypeSpy.calledWith(rootModel)).toBe(true);
            findMorphTypeSpy.restore();
            isModelStub.restore();
        });
    });
    describe('.associate()', function () {
        it('calls RelationUtilities.associateOne() with a setTargetAttributes which sets targetKeyName and targetMorphTypeName to target model', function () {
            const stub = Sinon.stub(MorphOne_1.MorphOne, 'findMorphType');
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
            const model = {
                setAttribute() { },
                save() {
                    return Promise.resolve(true);
                }
            };
            const morphOne = new MorphOne_1.MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id');
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'associateOne');
            morphOne.associate(model);
            expect(spy.calledWith(model, rootModel, 'id')).toBe(true);
            expect(setAttributeSpy.calledTwice).toBe(true);
            expect(setAttributeSpy.firstCall.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttributeSpy.secondCall.calledWith('target_type', 'MorphType')).toBe(true);
            expect(stub.calledWith('ModelName')).toBe(true);
            stub.restore();
        });
    });
});
