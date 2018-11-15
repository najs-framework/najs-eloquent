"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const HasMany_1 = require("../../../lib/relations/relationships/HasMany");
const HasOneOrMany_1 = require("../../../lib/relations/relationships/HasOneOrMany");
const Relationship_1 = require("../../../lib/relations/Relationship");
const RelationshipType_1 = require("../../../lib/relations/RelationshipType");
const HasManyExecutor_1 = require("../../../lib/relations/relationships/executors/HasManyExecutor");
const factory_1 = require("../../../lib/util/factory");
const RelationUtilities_1 = require("../../../lib/relations/RelationUtilities");
describe('HasMany', function () {
    it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.HasMany"', function () {
        const rootModel = {};
        const hasMany = new HasMany_1.HasMany(rootModel, 'test', 'Target', 'target_id', 'id');
        expect(hasMany).toBeInstanceOf(HasOneOrMany_1.HasOneOrMany);
        expect(hasMany).toBeInstanceOf(Relationship_1.Relationship);
        expect(hasMany.getClassName()).toEqual('NajsEloquent.Relation.Relationship.HasMany');
    });
    describe('.getType()', function () {
        it('returns literal string "HasMany"', function () {
            const rootModel = {};
            const hasMany = new HasMany_1.HasMany(rootModel, 'test', 'Target', 'target_id', 'id');
            expect(hasMany.getType()).toEqual(RelationshipType_1.RelationshipType.HasMany);
        });
    });
    describe('.getExecutor()', function () {
        it('returns an cached instance of HasManyExecutor in property "executor"', function () {
            const rootModel = {};
            const hasMany = new HasMany_1.HasMany(rootModel, 'test', 'Target', 'target_id', 'id');
            hasMany['targetModelInstance'] = {};
            const getDataBucketStub = Sinon.stub(hasMany, 'getDataBucket');
            getDataBucketStub.returns({});
            expect(hasMany.getExecutor()).toBeInstanceOf(HasManyExecutor_1.HasManyExecutor);
            expect(hasMany.getExecutor() === hasMany['executor']).toBe(true);
        });
    });
    describe('.associate()', function () {
        it('is chainable, calls RelationUtilities.associateMany() with a setTargetAttributes which sets targetKeyName to target model', function () {
            const rootModel = {
                getAttribute() {
                    return 'anything';
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
            const hasMany = new HasMany_1.HasMany(rootModel, 'test', 'Target', 'target_id', 'id');
            const setAttribute1Spy = Sinon.spy(model1, 'setAttribute');
            const setAttribute2Spy = Sinon.spy(model2, 'setAttribute');
            const setAttribute3Spy = Sinon.spy(model3, 'setAttribute');
            const setAttribute4Spy = Sinon.spy(model4, 'setAttribute');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'associateMany');
            expect(hasMany.associate(model1, [model2], factory_1.make_collection([model3, model4])) === hasMany).toBe(true);
            expect(spy.calledWith([model1, [model2], factory_1.make_collection([model3, model4])], rootModel, 'id')).toBe(true);
            expect(setAttribute1Spy.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute2Spy.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute3Spy.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute4Spy.calledWith('target_id', 'anything')).toBe(true);
        });
    });
    describe('.dissociate()', function () {
        it('is chainable, calls RelationUtilities.dissociateMany() with setTargetAttributes which sets the targetKeyName to EmptyValue via RelationFeature.getEmptyValueForRelationshipForeignKey()', async function () {
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
            const hasMany = new HasMany_1.HasMany(rootModel, 'test', 'Target', 'target_id', 'id');
            const spy = Sinon.spy(RelationUtilities_1.RelationUtilities, 'dissociateMany');
            expect(hasMany.dissociate(model1, [model2]) === hasMany).toBe(true);
            expect(spy.calledWith([model1, [model2]], rootModel)).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.calledTwice).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.firstCall.calledWith(model1, 'target_id')).toBe(true);
            expect(getEmptyValueForRelationshipForeignKeySpy.secondCall.calledWith(model2, 'target_id')).toBe(true);
            expect(setAttribute1Spy.calledWith('target_id', 'anything')).toBe(true);
            expect(setAttribute2Spy.calledWith('target_id', 'anything')).toBe(true);
        });
    });
});
