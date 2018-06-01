"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const Helper = require("../../lib/util/helpers");
const Relation_1 = require("../../lib/relations/Relation");
const collect = require('collect.js');
describe('Relation', function () {
    describe('constructor()', function () {
        it('needs rootModel and the name of relation, initialized with type unknown if not passed', function () {
            const rootModel = {};
            const name = 'test';
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, name]);
            expect(relation['rootModel'] === rootModel).toBe(true);
            expect(relation['name'] === 'test').toBe(true);
            expect(relation['type'] === 'unknown').toBe(true);
        });
        it('initialized with type is a string in third param', function () {
            const rootModel = {};
            const name = 'test';
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, name, 'belongs-to']);
            expect(relation['rootModel'] === rootModel).toBe(true);
            expect(relation['name'] === 'test').toBe(true);
            expect(relation['type'] === 'belongs-to').toBe(true);
        });
    });
    describe('.relationData', function () {
        it('returns rootModel["relations"][this.name]', function () {
            const info = {};
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.relationData === info).toBe(true);
        });
    });
    describe('.with()', function () {
        it('simply flattens and assigns value to "loadChain"', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation['loadChain']).toBeUndefined();
            relation.with('test');
            expect(relation['loadChain']).toEqual(['test']);
            relation.with('a', 'b');
            expect(relation['loadChain']).toEqual(['a', 'b']);
            relation.with('a', ['b', 'c']);
            expect(relation['loadChain']).toEqual(['a', 'b', 'c']);
        });
    });
    describe('.getType()', function () {
        it('simply returns type property', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.getType()).toEqual('unknown');
            relation['type'] = 'has-many';
            expect(relation.getType()).toEqual('has-many');
        });
    });
    describe('.getAttachedPropertyName()', function () {
        it('returns this.name value', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.getAttachedPropertyName()).toEqual('test');
        });
    });
    describe('.isLoaded()', function () {
        it('returns true if the info data contains property "isLoaded" with value === true', function () {
            const info = {
                isLoaded: true
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isLoaded()).toBe(true);
        });
        it('returns true if the info data contains property "isLoaded" with value === false', function () {
            const info = {
                isLoaded: false
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isLoaded()).toBe(false);
        });
        it('returns false if the info data does not contain property "isLoaded"', function () {
            const info = {};
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isLoaded()).toBe(false);
        });
    });
    describe('.isBuilt()', function () {
        it('returns true if the info data contains property "isBuilt" with value === true', function () {
            const info = {
                isBuilt: true
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isBuilt()).toBe(true);
        });
        it('returns true if the info data contains property "isBuilt" with value === false', function () {
            const info = {
                isBuilt: false
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isBuilt()).toBe(false);
        });
        it('returns false if the info data does not contain property "isBuilt"', function () {
            const info = {};
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.isBuilt()).toBe(false);
        });
    });
    describe('.markLoad()', function () {
        it('set loaded status of the relation, and it is chainable', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{ relations: { test: {} } }, 'test']);
            expect(relation.markLoad(true) === relation).toBe(true);
            expect(relation.isLoaded()).toBe(true);
            expect(relation.markLoad(false) === relation).toBe(true);
            expect(relation.isLoaded()).toBe(false);
        });
    });
    describe('.markBuild()', function () {
        it('set built status of the relation, and it is chainable', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{ relations: { test: {} } }, 'test']);
            expect(relation.markBuild(true) === relation).toBe(true);
            expect(relation.isBuilt()).toBe(true);
            expect(relation.markBuild(false) === relation).toBe(true);
            expect(relation.isBuilt()).toBe(false);
        });
    });
    describe('.compareRelationInfo()', function () {
        it('returns true if model, table and key are equals', function () {
            const dataset = [
                { a: { model: 'a', key: 'a', table: 'a' }, b: { model: 'b', key: 'b', table: 'b' }, result: false },
                { a: { model: '', key: 'a', table: 'a' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'a', key: '', table: 'a' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'a', key: 'a', table: '' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'A', key: 'a', table: 'a' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'a', key: 'A', table: 'a' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'a', key: 'a', table: 'A' }, b: { model: 'a', key: 'a', table: 'a' }, result: false },
                { a: { model: 'a', key: 'a', table: 'a' }, b: { model: 'a', key: 'a', table: 'a' }, result: true }
            ];
            const relation = Reflect.construct(Relation_1.Relation, [{ relations: { test: {} } }, 'test']);
            for (const data of dataset) {
                expect(relation.compareRelationInfo(data['a'], data['b'])).toBe(data['result']);
            }
        });
    });
    describe('.makeModelOrCollectionFromRecords()', function () {
        it('calls and returns relationDataBucket.makeCollectionFromRecords() if makeCollection is true', function () {
            const relationDataBucket = {
                makeCollectionFromRecords(name, records) {
                    return 'anything-' + name + '-' + records.join('-');
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.makeModelOrCollectionFromRecords(relationDataBucket, 'test', true, ['a', 'b'])).toEqual('anything-test-a-b');
        });
        it('returns undefined if makeCollection is false and records is empty', function () {
            const relationDataBucket = {};
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.makeModelOrCollectionFromRecords(relationDataBucket, 'test', false, [])).toBeUndefined();
        });
        it('calls and returns relationDataBucket.makeModelFromRecord() with records[0] if makeCollection is false and records not empty', function () {
            const relationDataBucket = {
                makeModelFromRecord(name, record) {
                    return 'anything-' + name + '-' + record;
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.makeModelOrCollectionFromRecords(relationDataBucket, 'test', false, ['a', 'b'])).toEqual('anything-test-a');
        });
    });
    describe('.getDataBucket()', function () {
        it('returns property "relationDataBucket" in this.rootModel', function () {
            const relationDataBucket = {};
            const rootModel = {
                relationDataBucket: relationDataBucket
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.getDataBucket() === relationDataBucket).toBe(true);
        });
    });
    describe('.getModelByName()', function () {
        it('simply uses make() to create new model by model name', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns('anything');
            expect(relation.getModelByName('Test')).toEqual('anything');
            expect(makeStub.calledWith('Test')).toBe(true);
            makeStub.restore();
        });
    });
    describe('.getKeysInDataBucket()', function () {
        it('returns an empty array if there is no relationDataBucket in rootModel', function () {
            const rootModel = {
                relations: {
                    test: {}
                },
                getRelationDataBucket() {
                    return undefined;
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.getKeysInDataBucket('test', 'attribute')).toEqual([]);
        });
        it('calls and returns relationDataBucket.getAttributes() if it is attached to rootModel', function () {
            const relationDataBucket = {
                getAttributes(name, attribute) {
                    return `anything-${name}-${attribute}`;
                }
            };
            const rootModel = {
                relations: {
                    test: {}
                },
                getRelationDataBucket() {
                    return relationDataBucket;
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.getKeysInDataBucket('test', 'attribute')).toEqual('anything-test-attribute');
        });
    });
    describe('.getData()', function () {
        it('returns undefined if .isLoaded() returns false', function () {
            const info = {};
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation.getData()).toBeUndefined();
        });
        it('returns .relationData.data if .isLoaded() returns true and .isBuilt() return true', function () {
            const info = {
                isLoaded: true,
                isBuilt: true,
                data: 'anything'
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return {};
                }
                async eagerLoad() {
                    return {};
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(relation.getData()).toEqual('anything');
        });
        it('returns .buildData() if .isLoaded() returns true and .isBuilt() return false', function () {
            const info = {
                isLoaded: true,
                isBuilt: false
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return {};
                }
                async eagerLoad() {
                    return {};
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(relation.getData()).toEqual('build-data');
        });
    });
    describe('.hasInverseData()', function () {
        it('calls and returns .isInverseOf()', function () {
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return {};
                }
                async eagerLoad() {
                    return {};
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return 'anything';
                }
            }
            const relation = new ChildRelation({}, 'test');
            expect(relation.hasInverseData({})).toEqual('anything');
        });
    });
    describe('.setInverseRelationsLoadedStatus()', function () {
        it('always returns result even result is null or undefined', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.setInverseRelationsLoadedStatus(undefined)).toBeUndefined();
        });
        it('calls .findAndMarkLoadedInverseRelations() with result if the result is model', function () {
            const isModelStub = Sinon.stub(Helper, 'isModel');
            isModelStub.returns(true);
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            const findAndMarkLoadedInverseRelationsStub = Sinon.stub(relation, 'findAndMarkLoadedInverseRelations');
            const model = {};
            expect(relation.setInverseRelationsLoadedStatus(model) === model).toBe(true);
            expect(findAndMarkLoadedInverseRelationsStub.calledWith(model));
            isModelStub.restore();
        });
        it('calls .takeAndRunSampleModelInCollection() and map samples to .findAndMarkLoadedInverseRelations()', function () {
            const isCollectionStub = Sinon.stub(Helper, 'isCollection');
            isCollectionStub.returns(true);
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            const findAndMarkLoadedInverseRelationsStub = Sinon.stub(relation, 'findAndMarkLoadedInverseRelations');
            const model = {
                getModelName() {
                    return 'test';
                }
            };
            const collection = {
                isEmpty() {
                    return false;
                },
                count() {
                    return 1;
                },
                get() {
                    return model;
                }
            };
            expect(relation.setInverseRelationsLoadedStatus(collection) === collection).toBe(true);
            expect(findAndMarkLoadedInverseRelationsStub.calledWith(model));
            isCollectionStub.restore();
        });
    });
    describe('.findAndMarkLoadedInverseRelations()', function () {
        it('does nothing if the rootModel has no relation data bucket', function () {
            const relation = Reflect.construct(Relation_1.Relation, [
                {
                    getRelationDataBucket() {
                        return undefined;
                    }
                },
                'test'
            ]);
            const model = {
                bindRelationMapIfNeeded() { }
            };
            const bindRelationMapIfNeededSpy = Sinon.spy(model, 'bindRelationMapIfNeeded');
            relation.findAndMarkLoadedInverseRelations(model);
            expect(bindRelationMapIfNeededSpy.called).toBe(false);
        });
        it('always calls model.bindRelationMapIfNeeded() before loops relationsMap of model', function () {
            const relation = Reflect.construct(Relation_1.Relation, [
                {
                    getRelationDataBucket() {
                        return {};
                    }
                },
                'test'
            ]);
            const model = {
                bindRelationMapIfNeeded() { }
            };
            const bindRelationMapIfNeededSpy = Sinon.spy(model, 'bindRelationMapIfNeeded');
            const hasInverseDataStub = Sinon.stub(relation, 'hasInverseData');
            hasInverseDataStub.returns(false);
            relation.findAndMarkLoadedInverseRelations(model);
            expect(bindRelationMapIfNeededSpy.called).toBe(true);
        });
        it('loops all relations in model.relationsMap and call dataBucket.markRelationLoaded() if .hasInverseData() returns true', function () {
            const model = {
                relationsMap: {
                    a: 'test',
                    b: 'test'
                },
                getModelName() {
                    return 'test';
                },
                bindRelationMapIfNeeded() { },
                getRelationByName(name) {
                    return name;
                }
            };
            const dataBucket = {
                markRelationLoaded() { }
            };
            const relation = Reflect.construct(Relation_1.Relation, [
                {
                    getRelationDataBucket() {
                        return dataBucket;
                    }
                },
                'test'
            ]);
            const hasInverseDataStub = Sinon.stub(relation, 'hasInverseData');
            hasInverseDataStub.callsFake(function () {
                return arguments[0] === 'a';
            });
            const markRelationLoadedSpy = Sinon.spy(dataBucket, 'markRelationLoaded');
            relation.findAndMarkLoadedInverseRelations(model);
            expect(markRelationLoadedSpy.calledWith('test', 'a')).toBe(true);
        });
    });
    describe('.load()', function () {
        it('returns this.relationData.data if .isLoaded() and .isBuilt() returns true', async function () {
            const info = {
                isLoaded: true,
                isBuilt: true,
                data: 'anything'
            };
            const rootModel = {
                relations: {
                    test: info
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return {};
                }
                async eagerLoad() {
                    return {};
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(await relation.load()).toEqual('anything');
        });
        it('calls .lazyLoad() if there is no relationDataBucket in rootModel', async function () {
            const rootModel = {
                relations: {
                    test: {}
                },
                getRelationDataBucket() {
                    return undefined;
                },
                isNew() {
                    return false;
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return 'lazyLoad';
                }
                async eagerLoad() {
                    return 'eagerLoad';
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(await relation.load()).toEqual('lazyLoad');
        });
        it('throws an Error if there is no relationDataBucket and the rootModel.isNew() returns true', async function () {
            const rootModel = {
                relations: {
                    test: {}
                },
                getModelName() {
                    return 'Test';
                },
                getRelationDataBucket() {
                    return undefined;
                },
                isNew() {
                    return true;
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return 'lazyLoad';
                }
                async eagerLoad() {
                    return 'eagerLoad';
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            try {
                await relation.load();
            }
            catch (error) {
                expect(error.message).toEqual('Can not load relation "test" in a new instance of "Test".');
                return;
            }
            expect('should not reach this line').toEqual('Hm');
        });
        it('calls .eagerLoad() if there is a relationDataBucket in rootModel', async function () {
            const rootModel = {
                relations: {
                    test: {}
                },
                getModelName() {
                    return 'Test';
                },
                getRelationDataBucket() {
                    return { markRelationLoaded() { } };
                },
                isNew() {
                    return false;
                }
            };
            class ChildRelation extends Relation_1.Relation {
                getClassName() {
                    return 'ChildRelation';
                }
                async lazyLoad() {
                    return 'lazyLoad';
                }
                async eagerLoad() {
                    return 'eagerLoad';
                }
                buildData() {
                    return 'build-data';
                }
                isInverseOf(relation) {
                    return false;
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(await relation.load()).toEqual('eagerLoad');
        });
    });
    describe('.loadChainRelations()', function () {
        it('does nothing and return result (the first param) if loadChain is not found', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(await relation.loadChainRelations('test')).toEqual('test');
        });
        it('does nothing and return result (the first param) if loadChain is empty', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            relation['loadChain'] = [];
            expect(await relation.loadChainRelations('test')).toEqual('test');
        });
        it('does nothing and return result (the first param) if it is null or undefined', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            // tslint:disable-next-line
            expect(await relation.loadChainRelations(null)).toBeNull();
            expect(await relation.loadChainRelations(undefined)).toBeUndefined();
        });
        it('does nothing and return result (the first param) if it is not Model or Collection', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(await relation.loadChainRelations(123)).toEqual(123);
            expect(await relation.loadChainRelations('string')).toEqual('string');
            const array = [];
            expect((await relation.loadChainRelations(array)) === array).toBe(true);
            const object = {};
            expect((await relation.loadChainRelations(object)) === object).toBe(true);
        });
        it('calls result.load() and pass loadChain if it is a Model', async function () {
            const isModelStub = Sinon.stub(Helper, 'isModel');
            isModelStub.returns(true);
            const model = {
                load(arg) {
                    return arg;
                }
            };
            const loadSpy = Sinon.spy(model, 'load');
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            relation['loadChain'] = ['a', 'b'];
            expect((await relation.loadChainRelations(model)) === model).toBe(true);
            expect(loadSpy.calledWith(['a', 'b'])).toBe(true);
            isModelStub.restore();
        });
        it('does nothing and return result (the first param) if it is Collection but empty', async function () {
            const isCollectionStub = Sinon.stub(Helper, 'isCollection');
            isCollectionStub.returns(true);
            const model = {
                load(arg) {
                    return arg;
                }
            };
            const collection = {
                isEmpty() {
                    return true;
                },
                first() {
                    return model;
                }
            };
            const loadSpy = Sinon.spy(model, 'load');
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            relation['loadChain'] = ['a', 'b'];
            expect((await relation.loadChainRelations(collection)) === collection).toBe(true);
            expect(loadSpy.calledWith(['a', 'b'])).toBe(false);
            isCollectionStub.restore();
        });
        it('calls result.first().load() and pass loadChain if result is a Collection and not empty', async function () {
            const isCollectionStub = Sinon.stub(Helper, 'isCollection');
            isCollectionStub.returns(true);
            const model = {
                getModelName() {
                    return 'Test';
                },
                load(arg) {
                    return arg;
                }
            };
            const collection = {
                isEmpty() {
                    return false;
                },
                count() {
                    return 1;
                },
                get() {
                    return model;
                }
            };
            const loadSpy = Sinon.spy(model, 'load');
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            relation['loadChain'] = ['a', 'b'];
            expect((await relation.loadChainRelations(collection)) === collection).toBe(true);
            expect(loadSpy.calledWith(['a', 'b'])).toBe(true);
            isCollectionStub.restore();
        });
    });
    describe('.takeAndRunSampleModelInCollectionAsync()', function () {
        it('calls .getSampleModelsInCollection() to get samples and loops with handle', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            const handle = async function (input) {
                return input;
            };
            const getSampleModelsInCollectionStub = Sinon.stub(relation, 'getSampleModelsInCollection');
            getSampleModelsInCollectionStub.returns(['a', 'b']);
            const handleSpy = Sinon.spy(handle);
            await relation.takeAndRunSampleModelInCollectionAsync({}, handleSpy);
            expect(handleSpy.callCount).toBe(2);
            expect(handleSpy.firstCall.args[0]).toBe('a');
            expect(handleSpy.secondCall.args[0]).toBe('b');
        });
    });
    describe('.takeAndRunSampleModelInCollection()', function () {
        it('calls .getSampleModelsInCollection() to get samples and loops with handle', async function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            const handle = async function (input) {
                return input;
            };
            const getSampleModelsInCollectionStub = Sinon.stub(relation, 'getSampleModelsInCollection');
            getSampleModelsInCollectionStub.returns(['a', 'b']);
            const handleSpy = Sinon.spy(handle);
            await relation.takeAndRunSampleModelInCollection({}, handleSpy);
            expect(handleSpy.callCount).toBe(2);
            expect(handleSpy.firstCall.args[0]).toBe('a');
            expect(handleSpy.secondCall.args[0]).toBe('b');
        });
    });
    describe('.getSampleModelsInCollection()', function () {
        it('returns an empty array if param is not collection', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.getSampleModelsInCollection({})).toEqual([]);
        });
        it('returns an empty array if collection is empty', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
            expect(relation.getSampleModelsInCollection(collect([]))).toEqual([]);
        });
        it('groups returns an array by .getModelName()', function () {
            const relation = Reflect.construct(Relation_1.Relation, [{}, 'test']);
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
            const result = relation.getSampleModelsInCollection(collect([modelA1, modelA2, modelB1, modelB2]));
            expect(result).toHaveLength(2);
            expect(result[0] === modelA1).toBe(true);
            expect(result[1] === modelB1).toBe(true);
        });
    });
});
