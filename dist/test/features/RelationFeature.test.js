"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
const RelationFeature_1 = require("../../lib/features/RelationFeature");
const RelationDataBucket_1 = require("../../lib/relations/RelationDataBucket");
const RelationPublicApi_1 = require("../../lib/features/mixin/RelationPublicApi");
const RelationData_1 = require("../../lib/relations/RelationData");
const RelationUtilities_1 = require("../../lib/relations/RelationUtilities");
const RelationshipFactory_1 = require("../../lib/relations/RelationshipFactory");
const RelationNotDefinedError_1 = require("../../lib/errors/RelationNotDefinedError");
const RelationDefinitionFinder_1 = require("../../lib/relations/RelationDefinitionFinder");
const RecordDataReader_1 = require("../../lib/drivers/RecordDataReader");
describe('RelationFeature', function () {
    const feature = new RelationFeature_1.RelationFeature();
    it('extends FeatureBase and implements Autoload under name "NajsEloquent.Feature.RelationFeature"', function () {
        expect(feature).toBeInstanceOf(FeatureBase_1.FeatureBase);
        expect(feature.getClassName()).toEqual('NajsEloquent.Feature.RelationFeature');
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Relation"', function () {
            expect(feature.getFeatureName()).toEqual('Relation');
        });
    });
    describe('.getPublicApi()', function () {
        it('returns an RelationPublicApi object', function () {
            expect(feature.getPublicApi() === RelationPublicApi_1.RelationPublicApi).toBe(true);
        });
    });
    describe('.makeDataBucket()', function () {
        it('simply returns an instance of RelationDataBucket', function () {
            const model = {};
            expect(feature.makeDataBucket(model)).toBeInstanceOf(RelationDataBucket_1.RelationDataBucket);
        });
    });
    describe('.makeFactory()', function () {
        it('makes and returns an instance of RelationshipFactory', function () {
            const model = {};
            const factory = feature.makeFactory(model, 'test');
            expect(factory).toBeInstanceOf(RelationshipFactory_1.RelationshipFactory);
            expect(factory['rootModel'] === model).toBe(true);
            expect(factory['name'] === 'test').toBe(true);
        });
    });
    describe('.getDataBucket()', function () {
        it('simply returns an property "relationDataBucket" of model', function () {
            const relationDataBucket = {};
            const model = {
                internalData: {
                    relationDataBucket: relationDataBucket
                }
            };
            expect(feature.getDataBucket(model) === relationDataBucket).toBe(true);
        });
    });
    describe('.setDataBucket()', function () {
        it('simply sets an property "relationDataBucket" of model', function () {
            const relationDataBucket = {};
            const model = {
                internalData: {}
            };
            feature.setDataBucket(model, relationDataBucket);
            expect(model.internalData.relationDataBucket === relationDataBucket).toBe(true);
        });
    });
    describe('.createKeyForDataBucket()', function () {
        it('returns a record name of the Record via .getRecordName()', function () {
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return {
                                getRecordName() {
                                    return 'anything';
                                }
                            };
                        }
                    };
                }
            };
            expect(feature.createKeyForDataBucket(model)).toEqual('anything');
        });
    });
    describe('.getDataReaderForDataBucket()', function () {
        it('returns RecordDataReader', function () {
            expect(feature.getDataReaderForDataBucket() === RecordDataReader_1.RecordDataReader).toBe(true);
        });
    });
    describe('.getRawDataForDataBucket()', function () {
        it('returns a record instance via .getRecord()', function () {
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return {
                                getRecord() {
                                    return 'anything';
                                }
                            };
                        }
                    };
                }
            };
            expect(feature.getRawDataForDataBucket(model)).toEqual('anything');
        });
    });
    describe('.getEmptyValueForRelationshipForeignKey()', function () {
        it('returns null by default', function () {
            const model = {};
            expect(feature.getEmptyValueForRelationshipForeignKey(model, 'test')).toBeNull();
        });
    });
    describe('.getEmptyValueForSerializedRelation()', function () {
        it('returns null by default', function () {
            const model = {};
            expect(feature.getEmptyValueForSerializedRelation(model, 'test')).toBeNull();
        });
    });
    describe('.getDefinitions()', function () {
        it('simply returns an property sharedMetadata."relationDefinitions" of model', function () {
            const relationDefinitions = {};
            const model = {
                sharedMetadata: {
                    relationDefinitions: relationDefinitions
                }
            };
            expect(feature.getDefinitions(model) === relationDefinitions).toBe(true);
        });
    });
    describe('.buildDefinitions()', function () {
        it('creates an instance of RelationDefinitionFinder then calls .getDefinitions()', function () {
            const model = {};
            const prototype = {};
            const bases = [];
            const stub = Sinon.stub(RelationDefinitionFinder_1.RelationDefinitionFinder.prototype, 'getDefinitions');
            stub.returns('anything');
            expect(feature.buildDefinitions(model, prototype, bases)).toEqual('anything');
            stub.restore();
        });
    });
    describe('.findByName()', function () {
        it('throws a RelationNotDefinedError if the relationDefinitions of model is not found', function () {
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            try {
                feature.findByName(model, 'any');
            }
            catch (error) {
                expect(error).toBeInstanceOf(RelationNotDefinedError_1.RelationNotDefinedError);
                expect(error.message).toEqual('Relation any is not defined in model Test.');
                return;
            }
            expect('should not reach here').toEqual('hm');
        });
        it('throws a RelationNotDefinedError if the name is not found in sharedMetadata.relationDefinitions', function () {
            const model = {
                sharedMetadata: {
                    relationDefinitions: {
                        test: true
                    }
                },
                getModelName() {
                    return 'Test';
                }
            };
            try {
                feature.findByName(model, 'any');
            }
            catch (error) {
                expect(error).toBeInstanceOf(RelationNotDefinedError_1.RelationNotDefinedError);
                expect(error.message).toEqual('Relation any is not defined in model Test.');
                return;
            }
            expect('should not reach here').toEqual('hm');
        });
        it('gets definitions in relationDefinition, then trigger the target type "getter"', function () {
            const relation = {};
            const model = {
                sharedMetadata: {
                    relationDefinitions: {
                        test: {
                            accessor: 'test',
                            target: 'relation',
                            targetType: 'getter'
                        }
                    }
                },
                get relation() {
                    return relation;
                }
            };
            expect(feature.findByName(model, 'test') === relation).toBe(true);
        });
        it('gets definitions in relationDefinition, then trigger the target type "function"', function () {
            const relation = {};
            const model = {
                sharedMetadata: {
                    relationDefinitions: {
                        test: {
                            accessor: 'test',
                            target: 'getRelation',
                            targetType: 'function'
                        }
                    }
                },
                getRelation() {
                    return relation;
                }
            };
            expect(feature.findByName(model, 'test') === relation).toBe(true);
        });
        it('splits input by dot, and find the relation by first part, then passes the rest to relation.with()', function () {
            const relation = {
                with() { }
            };
            const model = {
                sharedMetadata: {
                    relationDefinitions: {
                        test: {
                            accessor: 'test',
                            target: 'getRelation',
                            targetType: 'function'
                        }
                    }
                },
                getRelation() {
                    return relation;
                }
            };
            const withSpy = Sinon.spy(relation, 'with');
            expect(feature.findByName(model, 'test.a.b') === relation).toBe(true);
            expect(withSpy.calledWith('a.b')).toBe(true);
        });
    });
    describe('.findDataByName()', function () {
        it('returns an instance if given name is found in "relations" property', function () {
            const data = {};
            const model = {
                internalData: {
                    relations: {
                        test: data
                    }
                }
            };
            expect(feature.findDataByName(model, 'test') === data).toBe(true);
        });
        it('create an instance of RelationData, then call defineAccessor if name not found in "relations"', function () {
            const model = {
                internalData: {
                    relations: {}
                }
            };
            const makeFactorySpy = Sinon.spy(feature, 'makeFactory');
            const defineAccessorSpy = Sinon.spy(feature, 'defineAccessor');
            expect(feature.findDataByName(model, 'test')).toBeInstanceOf(RelationData_1.RelationData);
            expect(makeFactorySpy.calledWith(model, 'test')).toBe(true);
            expect(defineAccessorSpy.calledWith(model, 'test')).toBe(true);
            makeFactorySpy.restore();
            defineAccessorSpy.restore();
        });
    });
    describe('.isLoadedRelation()', function () {
        it('calls and returns this.findByName().isLoaded()', function () {
            const relation = {
                isLoaded() {
                    return 'anything';
                }
            };
            const stub = Sinon.stub(feature, 'findByName');
            stub.returns(relation);
            const model = {};
            expect(feature.isLoadedRelation(model, 'test')).toEqual('anything');
            expect(stub.calledWith(model, 'test')).toBe(true);
            stub.restore();
        });
    });
    describe('.getLoadedRelations()', function () {
        it('get the definition via .getDefinitions(), then loops and returns the loaded relations only and calls RelationUtilities.bundleRelations() to group the relations', function () {
            const definitions = {
                a: {},
                b: {},
                c: {}
            };
            const loadedRelation = {
                isLoaded() {
                    return true;
                }
            };
            const unloadedRelation = {
                isLoaded() {
                    return false;
                }
            };
            const stub = Sinon.stub(feature, 'findByName');
            stub.callsFake(function (model, name) {
                if (name === 'a' || name === 'c') {
                    return loadedRelation;
                }
                return unloadedRelation;
            });
            const model = {
                sharedMetadata: {
                    relationDefinitions: definitions
                }
            };
            const bundleRelationsStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'bundleRelations');
            bundleRelationsStub.returns('anything');
            expect(feature.getLoadedRelations(model)).toEqual('anything');
            expect(bundleRelationsStub.calledWith([loadedRelation, loadedRelation])).toBe(true);
            expect(stub.calledWith('test'));
            bundleRelationsStub.restore();
            stub.restore();
        });
    });
    describe('.defineAccessor()', function () {
        it('does nothing if the accessor already defined in prototype', function () {
            class A {
                get test() {
                    return 'anything';
                }
            }
            const model = new A();
            feature.defineAccessor(model, 'test');
            expect(model.test).toEqual('anything');
        });
        it('defines an accessor which call this.getRelation(accessor).getData() in model prototype', function () {
            class B {
                getRelation(name) {
                    return {
                        getData() {
                            return name + '-data';
                        }
                    };
                }
            }
            const model = new B();
            feature.defineAccessor(model, 'test');
            expect(model.test).toEqual('test-data');
            expect(model['not-found']).toBeUndefined();
        });
    });
});
