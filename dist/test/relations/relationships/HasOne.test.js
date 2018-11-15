"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const HasOne_1 = require("../../../lib/relations/relationships/HasOne");
const HasOneOrMany_1 = require("../../../lib/relations/relationships/HasOneOrMany");
const Relationship_1 = require("../../../lib/relations/Relationship");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
const HasOneExecutor_1 = require("../../../lib/relations/relationships/executors/HasOneExecutor");
const RelationUtilities_1 = require("../../../lib/relations/RelationUtilities");
describe('HasOne', function () {
    it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.HasOne"', function () {
        const rootModel = {};
        const hasOne = new HasOne_1.HasOne(rootModel, 'test', 'Target', 'target_id', 'id');
        expect(hasOne).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
        expect(hasOne).toBeInstanceOf(Relationship_1.Relationship);
        expect(hasOne.getClassName()).toEqual('NajsEloquent.Relation.Relationship.HasOne');
    });
    describe('.getType()', function () {
        it('returns literal string "HasOne"', function () {
            const rootModel = {};
            const hasOne = new HasOne_1.HasOne(rootModel, 'test', 'Target', 'target_id', 'id');
            expect(hasOne.getType()).toEqual(RelationshipType_1.RelationshipType.HasOne);
        });
    });
    describe('.getExecutor()', function () {
        it('returns an cached instance of HasOneExecutor in property "executor"', function () {
            const rootModel = {};
            const hasOne = new HasOne_1.HasOne(rootModel, 'test', 'Target', 'target_id', 'id');
            hasOne['targetModelInstance'] = {};
            const getDataBucketStub = Sinon.stub(hasOne, 'getDataBucket');
            getDataBucketStub.returns({});
            expect(hasOne.getExecutor()).toBeInstanceOf(HasOneExecutor_1.HasOneExecutor);
            expect(hasOne.getExecutor() === hasOne['executor']).toBe(true);
        });
    });
    describe('.associate()', function () {
        it('calls RelationUtilities.associateOne() with a setTargetAttributes which sets targetKeyName to target model', function () {
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
            const hasOne = new HasOne_1.HasOne(rootModel, 'test', 'Target', 'target_id', 'id');
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'associateOne');
            hasOne.associate(model);
            expect(spy.calledWith(model, rootModel, 'id')).toBe(true);
            expect(setAttributeSpy.calledOnce).toBe(true);
            expect(setAttributeSpy.calledWith('target_id', 'anything')).toBe(true);
        });
    });
});
