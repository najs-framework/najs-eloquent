"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const Helper = require("../../lib/util/helpers");
const Model_1 = require("../../lib/model/Model");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
const HasOne_1 = require("../../lib/relations/relationships/HasOne");
const RelationUtilities_1 = require("../../lib/relations/RelationUtilities");
const RelationNotFoundInNewInstanceError_1 = require("../../lib/errors/RelationNotFoundInNewInstanceError");
const Relationship_1 = require("../../lib/relations/Relationship");
DriverProviderFacade_1.DriverProvider.register(MemoryDriver_1.MemoryDriver, 'memory', true);
describe('Relation', function () {
    function makeRelation(model, name) {
        return new HasOne_1.HasOne(model, name, {}, '', '');
    }
    describe('constructor()', function () {
        it('assigns rootModel, name properties respectively and create default RelationUtilities if not provided', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            expect(relation['rootModel'] === rootModel).toBe(true);
            expect(relation['name']).toEqual('test');
            expect(relation['chains']).toEqual([]);
        });
    });
    describe('.targetModel', function () {
        it('calls make() to creates an instance of Target model, then assigns to reuse property "targetModelInstance"', function () {
            const instance = {};
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(instance);
            const relation = makeRelation({}, 'test');
            relation['targetDefinition'] = 'Target';
            expect(relation['targetModel'] === instance).toBe(true);
            expect(makeStub.calledWith('Target')).toBe(true);
            makeStub.resetHistory();
            expect(relation['targetModel'] === instance).toBe(true);
            expect(makeStub.calledWith('Target')).toBe(false);
            makeStub.restore();
        });
    });
    describe('.with()', function () {
        it('is chainable, flattens arguments then append to property "chains"', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            expect(relation.with('a', 'b', ['c', 'd']) === relation).toBe(true);
            expect(relation['chains']).toEqual(['a', 'b', 'c', 'd']);
            expect(relation.with(['a', 'e'], 'b', 'f', ['c', 'd']) === relation).toBe(true);
            expect(relation['chains']).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
    });
    describe('.query()', function () {
        it('is chainable, simply assigns the callback to property "customQueryFn"', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const cb = function () { };
            expect(relation.query(cb) === relation).toBe(true);
            expect(relation['customQueryFn'] === cb).toBe(true);
            const anotherCb = function () { };
            expect(relation.query(anotherCb) === relation).toBe(true);
            expect(relation['customQueryFn'] === anotherCb).toBe(true);
        });
    });
    describe('.createTargetQuery()', function () {
        it('returns a queryBuilder from targetModel, which also contains the dataBucket of relation', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const queryBuilder = {
                handler: {
                    setRelationDataBucket() { }
                }
            };
            const targetModel = {
                newQuery() {
                    return queryBuilder;
                }
            };
            relation['targetModelInstance'] = targetModel;
            const dataBucket = {};
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket');
            const newQuerySpy = Sinon.spy(targetModel, 'newQuery');
            expect(relation.createTargetQuery('name') === queryBuilder).toBe(true);
            expect(newQuerySpy.calledWith('name')).toBe(true);
            expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true);
        });
        it('passes the queryBuilder to .applyCustomQuery() then returns the result', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const queryBuilder = {
                handler: {
                    setRelationDataBucket() { }
                }
            };
            const targetModel = {
                newQuery() {
                    return queryBuilder;
                }
            };
            relation['targetModelInstance'] = targetModel;
            const dataBucket = {};
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(dataBucket);
            const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket');
            const newQuerySpy = Sinon.spy(targetModel, 'newQuery');
            const applyCustomQueryStub = Sinon.stub(relation, 'applyCustomQuery');
            applyCustomQueryStub.returns('anything');
            expect(relation.createTargetQuery('name')).toEqual('anything');
            expect(newQuerySpy.calledWith('name')).toBe(true);
            expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true);
            expect(applyCustomQueryStub.calledWith(queryBuilder)).toBe(true);
        });
    });
    describe('.applyCustomQuery()', function () {
        it('returns the given queryBuilder if property "customQueryFn" is not a function', function () {
            const rootModel = {};
            const queryBuilder = {};
            const relation = makeRelation(rootModel, 'test');
            expect(relation.applyCustomQuery(queryBuilder) === queryBuilder).toBe(true);
        });
        it('calls "customQueryFn" if it is a function, then still returns the queryBuilder', function () {
            const queryBuilder = {};
            const fn = function () { };
            const spy = Sinon.spy(fn);
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            relation.query(spy);
            expect(relation.applyCustomQuery(queryBuilder) === queryBuilder).toBe(true);
            expect(spy.calledWith(queryBuilder)).toBe(true);
            expect(spy.lastCall.thisValue === queryBuilder).toBe(true);
        });
    });
    describe('.getName()', function () {
        it('simply returns the name property', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const name = {};
            relation['name'] = name;
            expect(relation.getName() === name).toBe(true);
        });
    });
    describe('.getChains()', function () {
        it('simply returns the "chains" property', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const chains = {};
            relation['chains'] = chains;
            expect(relation.getChains() === chains).toBe(true);
        });
    });
    describe('.getRelationData()', function () {
        it('calls and returns RelationFeature.findDataByName()', function () {
            const relationFeature = {
                findDataByName() {
                    return 'anything';
                }
            };
            const rootModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const spy = Sinon.spy(relationFeature, 'findDataByName');
            expect(relation.getRelationData()).toEqual('anything');
            expect(spy.calledWith(rootModel, 'test')).toBe(true);
        });
    });
    describe('.getDataBucket()', function () {
        it('calls and returns RelationFeature.getDataBucket()', function () {
            const relationFeature = {
                getDataBucket() {
                    return 'anything';
                }
            };
            const rootModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const spy = Sinon.spy(relationFeature, 'getDataBucket');
            expect(relation.getDataBucket()).toEqual('anything');
            expect(spy.calledWith(rootModel)).toBe(true);
        });
    });
    describe('.isLoaded()', function () {
        it('return true if getRelationData().isLoaded() is true', function () {
            const relationFeature = {
                findDataByName() {
                    return {
                        isLoaded() {
                            return true;
                        }
                    };
                }
            };
            const rootModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const relation = makeRelation(rootModel, 'test');
            expect(relation.isLoaded()).toBe(true);
        });
        it('return true if RelationUtilities.isLoadedInDataBucket() is true', function () {
            const relationFeature = {
                findDataByName() {
                    return {
                        isLoaded() {
                            return false;
                        }
                    };
                }
            };
            const rootModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'isLoadedInDataBucket');
            stub.returns(true);
            expect(relation.isLoaded()).toBe(true);
            expect(stub.calledWith(relation, rootModel, 'test')).toBe(true);
            stub.restore();
        });
        it('return false if both case above return false', function () {
            const relationFeature = {
                findDataByName() {
                    return {
                        isLoaded() {
                            return false;
                        }
                    };
                }
            };
            const rootModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'isLoadedInDataBucket');
            stub.returns(false);
            expect(relation.isLoaded()).toBe(false);
            expect(stub.calledWith(relation, rootModel, 'test')).toBe(true);
            stub.restore();
        });
    });
    describe('.getData()', function () {
        it('returns undefined if .isLoaded() returns false', function () {
            const relationData = {
                hasData() {
                    return false;
                },
                getData() {
                    return 'anything';
                },
                setData(data) {
                    return data;
                }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'isLoaded');
            stub.returns(false);
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const collectDataStub = Sinon.stub(relation, 'collectData');
            collectDataStub.returns('collected-data');
            const setDataSpy = Sinon.spy(relationData, 'setData');
            const markInverseRelationshipsToLoadedSpy = Sinon.spy(relation, 'markInverseRelationshipsToLoaded');
            expect(relation.getData()).toBeUndefined();
            expect(getRelationDataStub.called).toBe(false);
            expect(setDataSpy.called).toBe(false);
            expect(collectDataStub.called).toBe(false);
            expect(markInverseRelationshipsToLoadedSpy.called).toBe(false);
        });
        it('returns getRelationData().getData() if the relation has data', function () {
            const relationData = {
                hasData() {
                    return true;
                },
                getData() {
                    return 'anything';
                },
                setData(data) {
                    return data;
                }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'isLoaded');
            stub.returns(true);
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const collectDataStub = Sinon.stub(relation, 'collectData');
            collectDataStub.returns('collected-data');
            const setDataSpy = Sinon.spy(relationData, 'setData');
            const markInverseRelationshipsToLoadedSpy = Sinon.spy(relation, 'markInverseRelationshipsToLoaded');
            expect(relation.getData()).toEqual('anything');
            expect(getRelationDataStub.called).toBe(true);
            expect(setDataSpy.called).toBe(false);
            expect(collectDataStub.called).toBe(false);
            expect(markInverseRelationshipsToLoadedSpy.called).toBe(false);
        });
        it('calls .collectData(), then RelationData.setData() then calls and returns .markInverseRelationshipsToLoaded()', function () {
            const relationData = {
                hasData() {
                    return false;
                },
                getData() {
                    return 'anything';
                },
                setData(data) {
                    return data;
                }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'isLoaded');
            stub.returns(true);
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const collectDataStub = Sinon.stub(relation, 'collectData');
            collectDataStub.returns('collected-data');
            const setDataSpy = Sinon.spy(relationData, 'setData');
            const markInverseRelationshipsToLoadedStub = Sinon.stub(relation, 'markInverseRelationshipsToLoaded');
            markInverseRelationshipsToLoadedStub.returns('collected-data');
            expect(relation.getData()).toEqual('collected-data');
            expect(getRelationDataStub.called).toBe(true);
            expect(setDataSpy.calledWith('collected-data')).toBe(true);
            expect(collectDataStub.called).toBe(true);
            expect(markInverseRelationshipsToLoadedStub.calledWith('collected-data')).toBe(true);
        });
    });
    describe('.lazyLoad()', function () {
        it('calls and return .loadData() with type = "lazy"', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'loadData');
            stub.returns('anything');
            const result = await relation.lazyLoad();
            expect(result).toEqual('anything');
            expect(stub.calledWith('lazy')).toBe(true);
        });
    });
    describe('.eagerLoad()', function () {
        it('calls and return .loadData() with type = "eager"', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'loadData');
            stub.returns('anything');
            const result = await relation.eagerLoad();
            expect(result).toEqual('anything');
            expect(stub.calledWith('eager')).toBe(true);
        });
    });
    describe('.markInverseRelationshipsToLoaded()', function () {
        it('returns the result immediately if result is falsy', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'getDataBucket');
            stub.returns({});
            const dataset = [false, undefined, 0, ''];
            for (const item in dataset) {
                expect(relation.markInverseRelationshipsToLoaded(item) === item).toBe(true);
            }
        });
        it('returns the result immediately if there is no dataBucket', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(relation, 'getDataBucket');
            stub.returns(undefined);
            const dataset = [true, 1, {}, []];
            for (const item in dataset) {
                expect(relation.markInverseRelationshipsToLoaded(item) === item).toBe(true);
            }
        });
        it('calls .getInverseRelationships() and loops then call Utils.markLoadedInDataBucket() if the result isModel()', function () {
            const distinctModelByClassInCollectionStub = Sinon.stub(Helper, 'distinctModelByClassInCollection');
            distinctModelByClassInCollectionStub.returns('anything');
            const isModelStub = Sinon.stub(Helper, 'isModel');
            isModelStub.returns(true);
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const dataBucketStub = Sinon.stub(relation, 'getDataBucket');
            dataBucketStub.returns({});
            const relations = [
                {
                    getName() {
                        return 'a';
                    }
                },
                {
                    getName() {
                        return 'b';
                    }
                }
            ];
            const getInverseRelationshipsStub = Sinon.stub(relation, 'getInverseRelationships');
            getInverseRelationshipsStub.returns(relations);
            const markLoadedInDataBucketStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'markLoadedInDataBucket');
            markLoadedInDataBucketStub.returns('anything');
            const result = {};
            expect(relation.markInverseRelationshipsToLoaded(result) === result).toBe(true);
            expect(distinctModelByClassInCollectionStub.called).toBe(false);
            expect(isModelStub.called).toBe(true);
            expect(getInverseRelationshipsStub.calledWith(result)).toBe(true);
            expect(markLoadedInDataBucketStub.calledTwice).toBe(true);
            expect(markLoadedInDataBucketStub.firstCall.calledWith(relation, result, 'a')).toBe(true);
            expect(markLoadedInDataBucketStub.secondCall.calledWith(relation, result, 'b')).toBe(true);
            markLoadedInDataBucketStub.restore();
            isModelStub.restore();
            distinctModelByClassInCollectionStub.restore();
        });
        it('uses .distinctModelByClassInCollection() to get sample Model then calls .getInverseRelationships() and loops then call Utils.markLoadedInDataBucket() if the result', function () {
            const distinctModelByClassInCollectionStub = Sinon.stub(Helper, 'distinctModelByClassInCollection');
            const modelA = { model: 'a' };
            const modelB = { model: 'b' };
            distinctModelByClassInCollectionStub.returns([modelA, modelB]);
            const isModelStub = Sinon.stub(Helper, 'isModel');
            isModelStub.returns(false);
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const dataBucketStub = Sinon.stub(relation, 'getDataBucket');
            dataBucketStub.returns({});
            const relations = [
                {
                    getName() {
                        return 'a';
                    }
                },
                {
                    getName() {
                        return 'b';
                    }
                }
            ];
            const getInverseRelationshipsStub = Sinon.stub(relation, 'getInverseRelationships');
            getInverseRelationshipsStub.returns(relations);
            const markLoadedInDataBucketStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'markLoadedInDataBucket');
            markLoadedInDataBucketStub.returns('anything');
            const result = {};
            expect(relation.markInverseRelationshipsToLoaded(result) === result).toBe(true);
            expect(isModelStub.called).toBe(true);
            expect(distinctModelByClassInCollectionStub.called).toBe(true);
            expect(getInverseRelationshipsStub.calledTwice).toBe(true);
            expect(getInverseRelationshipsStub.firstCall.calledWith(modelA)).toBe(true);
            expect(getInverseRelationshipsStub.secondCall.calledWith(modelB)).toBe(true);
            expect(markLoadedInDataBucketStub.callCount).toEqual(4);
            expect(markLoadedInDataBucketStub.getCall(0).calledWith(relation, modelA, 'a')).toBe(true);
            expect(markLoadedInDataBucketStub.getCall(1).calledWith(relation, modelA, 'b')).toBe(true);
            expect(markLoadedInDataBucketStub.getCall(2).calledWith(relation, modelB, 'a')).toBe(true);
            expect(markLoadedInDataBucketStub.getCall(3).calledWith(relation, modelB, 'b')).toBe(true);
            markLoadedInDataBucketStub.restore();
            isModelStub.restore();
            distinctModelByClassInCollectionStub.restore();
        });
    });
    describe('.getInverseRelationships()', function () {
        it('loops all relation in relationDefinitions of given model, then filters out which one matched by .isInverseOf()', function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const data = {
                a: { name: 'a' },
                b: { name: 'b' },
                c: { name: 'c' }
            };
            const relationFeature = {
                getDefinitions() {
                    return { a: {}, b: {}, c: {} };
                }
            };
            const giveModel = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                },
                getRelation(name) {
                    return data[name];
                }
            };
            const stub = Sinon.stub(relation, 'isInverseOf');
            stub.callsFake(function (relation) {
                if (relation['name'] === 'b') {
                    return false;
                }
                return true;
            });
            const result = relation.getInverseRelationships(giveModel);
            expect(result[0] === data.a).toBe(true);
            expect(result[1] === data.c).toBe(true);
        });
    });
    describe('.loadData()', function () {
        it('always sets load type to relationData', async function () {
            const relationData = {
                setLoadType() {
                    return this;
                },
                setData() { }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const markLoadedInDataBucketStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'markLoadedInDataBucket');
            markLoadedInDataBucketStub.returns('anything');
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const spy = Sinon.spy(relationData, 'setLoadType');
            const fetchDataStub = Sinon.stub(relation, 'fetchData');
            fetchDataStub.returns('anything');
            await relation.lazyLoad();
            expect(spy.calledWith('lazy')).toBe(true);
            spy.resetHistory();
            await relation.eagerLoad();
            expect(spy.calledWith('eager')).toBe(true);
            markLoadedInDataBucketStub.restore();
        });
        it('calls .fetchData() to get result, then calls and returns .loadChains(result)', async function () {
            const relationData = {
                setLoadType() {
                    return this;
                },
                setData() { }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const markLoadedInDataBucketStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'markLoadedInDataBucket');
            markLoadedInDataBucketStub.returns('anything');
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const fetchDataStub = Sinon.stub(relation, 'fetchData');
            fetchDataStub.returns('anything');
            const loadChainsStub = Sinon.stub(relation, 'loadChains');
            loadChainsStub.returns('modified');
            expect(await relation.lazyLoad()).toEqual('modified');
            markLoadedInDataBucketStub.restore();
        });
        it('call RelationData.setData() if the load type is "lazy", calls RelationUtilities.markLoadedInDataBucket() if type is "eager"', async function () {
            const relationData = {
                setLoadType() {
                    return this;
                },
                setData() { }
            };
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const markLoadedInDataBucketStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'markLoadedInDataBucket');
            markLoadedInDataBucketStub.returns('anything');
            const getRelationDataStub = Sinon.stub(relation, 'getRelationData');
            getRelationDataStub.returns(relationData);
            const spy = Sinon.spy(relationData, 'setData');
            const fetchDataStub = Sinon.stub(relation, 'fetchData');
            fetchDataStub.returns('anything');
            await relation.lazyLoad();
            expect(spy.calledWith('anything')).toBe(true);
            expect(markLoadedInDataBucketStub.called).toBe(false);
            spy.resetHistory();
            await relation.eagerLoad();
            expect(spy.called).toBe(false);
            expect(markLoadedInDataBucketStub.calledWith(relation, rootModel, 'test')).toBe(true);
            markLoadedInDataBucketStub.restore();
        });
    });
    describe('.loadChains()', function () {
        it('returns result if the result is falsy', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const dataset = [false, undefined, 0, ''];
            for (const item in dataset) {
                expect((await relation.loadChains(item)) === item).toBe(true);
            }
        });
        it('returns result when the "chains" is undefined or has length = 0', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const result = {};
            relation['chains'] = undefined;
            expect((await relation.loadChains(result)) === result).toBe(true);
            relation['chains'] = [];
            expect((await relation.loadChains(result)) === result).toBe(true);
        });
        it('calls Model.load() then returns the result if result is a Model instance', async function () {
            class TestModel extends Model_1.Model {
                getClassName() {
                    return 'TestModel';
                }
            }
            NajsBinding.register(TestModel);
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const result = new TestModel();
            const chains = 'test';
            relation.with(chains);
            const stub = Sinon.stub(result, 'load');
            stub.returns('anything');
            expect((await relation.loadChains(result)) === result).toBe(true);
            expect(stub.calledWith(['test'])).toBe(true);
        });
        it('calls helpers.distinctModelByClassInCollection() then do nothing and returns result if distinctModelByClassInCollection() is empty', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(Helper, 'distinctModelByClassInCollection');
            stub.returns([]);
            const result = {};
            relation.with('chains');
            expect((await relation.loadChains(result)) === result).toBe(true);
            stub.restore();
        });
        it('calls helpers.distinctModelByClassInCollection() then calls and wait all result via Promise.all() and finally returns result', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const stub = Sinon.stub(Helper, 'distinctModelByClassInCollection');
            const model1 = {
                load() {
                    return Promise.resolve('1');
                }
            };
            const model2 = {
                load() {
                    return Promise.resolve('2');
                }
            };
            stub.returns([model1, model2]);
            const result = {};
            relation.with('chains');
            const spy1 = Sinon.spy(model1, 'load');
            const spy2 = Sinon.spy(model2, 'load');
            expect((await relation.loadChains(result)) === result).toBe(true);
            expect(spy1.calledWith(['chains'])).toBe(true);
            expect(spy2.calledWith(['chains'])).toBe(true);
            stub.restore();
        });
    });
    describe('.load()', function () {
        it('calls and returns this.getData() if the relation is loaded', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const isLoadedStub = Sinon.stub(relation, 'isLoaded');
            isLoadedStub.returns(true);
            const getDataStub = Sinon.stub(relation, 'getData');
            getDataStub.returns('get-data-result');
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns({});
            const lazyLoadStub = Sinon.stub(relation, 'lazyLoad');
            lazyLoadStub.returns(Promise.resolve('lazy-load-result'));
            const eagerLoadStub = Sinon.stub(relation, 'eagerLoad');
            eagerLoadStub.returns(Promise.resolve('eager-load-result'));
            expect(await relation.load()).toEqual('get-data-result');
        });
        it('calls and returns this.eagerLoad() if the relation is not loaded and dataBucket is found', async function () {
            const rootModel = {};
            const relation = makeRelation(rootModel, 'test');
            const isLoadedStub = Sinon.stub(relation, 'isLoaded');
            isLoadedStub.returns(false);
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns({});
            const lazyLoadStub = Sinon.stub(relation, 'lazyLoad');
            lazyLoadStub.returns(Promise.resolve('lazy-load-result'));
            const eagerLoadStub = Sinon.stub(relation, 'eagerLoad');
            eagerLoadStub.returns(Promise.resolve('eager-load-result'));
            expect(await relation.load()).toEqual('eager-load-result');
        });
        it('calls and returns this.lazyLoad() if the relation is not loaded and dataBucket is NOT found', async function () {
            const rootModel = {
                isNew() {
                    return false;
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const isLoadedStub = Sinon.stub(relation, 'isLoaded');
            isLoadedStub.returns(false);
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(undefined);
            const lazyLoadStub = Sinon.stub(relation, 'lazyLoad');
            lazyLoadStub.returns(Promise.resolve('lazy-load-result'));
            const eagerLoadStub = Sinon.stub(relation, 'eagerLoad');
            eagerLoadStub.returns(Promise.resolve('eager-load-result'));
            expect(await relation.load()).toEqual('lazy-load-result');
        });
        it('throws an RelationNotFoundInNewInstanceError if the dataBucket NOT found and the model is new instance', async function () {
            const rootModel = {
                isNew() {
                    return true;
                },
                getModelName() {
                    return 'ModelName';
                }
            };
            const relation = makeRelation(rootModel, 'test');
            const isLoadedStub = Sinon.stub(relation, 'isLoaded');
            isLoadedStub.returns(false);
            const getDataBucketStub = Sinon.stub(relation, 'getDataBucket');
            getDataBucketStub.returns(undefined);
            const lazyLoadStub = Sinon.stub(relation, 'lazyLoad');
            lazyLoadStub.returns(Promise.resolve('lazy-load-result'));
            const eagerLoadStub = Sinon.stub(relation, 'eagerLoad');
            eagerLoadStub.returns(Promise.resolve('eager-load-result'));
            try {
                await relation.load();
            }
            catch (error) {
                expect(error).toBeInstanceOf(RelationNotFoundInNewInstanceError_1.RelationNotFoundInNewInstanceError);
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    describe('Morph Static Functions', function () {
        describe('.morphMap()', function () {
            it('set the type and model name to "morphMapData" if there are 2 strings given in argument', function () {
                expect(Relationship_1.Relationship.morphMap('type-1', 'model-1') === Relationship_1.Relationship).toBe(true);
                expect(Relationship_1.Relationship.morphMap('type-2', 'model-2') === Relationship_1.Relationship).toBe(true);
                expect(Relationship_1.Relationship.morphMap('type-1', 'model-1') === Relationship_1.Relationship).toBe(true);
                expect(Relationship_1.Relationship.getMorphMap()).toEqual({ 'type-1': 'model-1', 'type-2': 'model-2' });
            });
            it('set the type and model name to "morphMapData" with className of model if the definition is a function', function () {
                class Test {
                    getClassName() {
                        return 'Namespace.Test';
                    }
                }
                expect(Relationship_1.Relationship.morphMap('type', Test) === Relationship_1.Relationship).toBe(true);
                expect(Relationship_1.Relationship.getMorphMap()).toEqual({
                    'type-1': 'model-1',
                    'type-2': 'model-2',
                    type: 'Namespace.Test'
                });
            });
            it('merges the given object to "morphMapData" if arg1 is an object', function () {
                expect(Relationship_1.Relationship.morphMap({ a: 'Class.A', type: 'Class.Override' }) === Relationship_1.Relationship).toBe(true);
                expect(Relationship_1.Relationship.getMorphMap()).toEqual({
                    'type-1': 'model-1',
                    'type-2': 'model-2',
                    a: 'Class.A',
                    type: 'Class.Override'
                });
            });
        });
        describe('.getMorphMap()', function () {
            it('simply returns "morphMapData"', function () {
                const data = {};
                Relationship_1.Relationship['morphMapData'] = data;
                expect(Relationship_1.Relationship.getMorphMap() === data).toBe(true);
            });
        });
        describe('.findModelName()', function () {
            it('simply returns a given type of there is no data in "morphMapData", otherwise returns the mapped class name', function () {
                Relationship_1.Relationship.morphMap({
                    a: 'Class.A',
                    b: 'Class.B',
                    c: 'Class.C'
                });
                expect(Relationship_1.Relationship.findModelName('a')).toEqual('Class.A');
                expect(Relationship_1.Relationship.findModelName('b')).toEqual('Class.B');
                expect(Relationship_1.Relationship.findModelName('c')).toEqual('Class.C');
                expect(Relationship_1.Relationship.findModelName('not-found')).toEqual('not-found');
            });
        });
        describe('.findMorphType()', function () {
            it('finds the modelName in "morphMapData" then returns type if found, otherwise returns modelName, case 1: string', function () {
                expect(Relationship_1.Relationship.findMorphType('Class.A')).toEqual('a');
                expect(Relationship_1.Relationship.findMorphType('not-found')).toEqual('not-found');
            });
            it('finds the modelName in "morphMapData" then returns type if found, otherwise returns modelName, case 2: function', function () {
                class B {
                    getClassName() {
                        return 'Class.B';
                    }
                }
                expect(Relationship_1.Relationship.findMorphType(B)).toEqual('b');
                class NotFound {
                    getClassName() {
                        return 'Class.NotFound';
                    }
                    getModelName() {
                        return 'ModelName';
                    }
                }
                expect(Relationship_1.Relationship.findMorphType(NotFound)).toEqual('Class.NotFound');
            });
            it('finds the modelName in "morphMapData" then returns type if found, otherwise returns modelName, case 3: model instance', function () {
                // instance of Model case
                const model = {
                    getModelName() {
                        return 'Class.C';
                    }
                };
                const notFoundModel = {
                    getModelName() {
                        return 'ModelName';
                    }
                };
                const isModelStub = Sinon.stub(Helper, 'isModel');
                isModelStub.returns(true);
                expect(Relationship_1.Relationship.findMorphType(model)).toEqual('c');
                expect(Relationship_1.Relationship.findMorphType(notFoundModel)).toEqual('ModelName');
                isModelStub.restore();
            });
        });
    });
});
