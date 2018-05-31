"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const Helper = require("../../lib/util/helpers");
const Relation_1 = require("../../lib/relations/Relation");
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
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(relation.getData()).toEqual('build-data');
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
                isNotEmpty() {
                    return false;
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
                load(arg) {
                    return arg;
                }
            };
            const collection = {
                isNotEmpty() {
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
            expect(loadSpy.calledWith(['a', 'b'])).toBe(true);
            isCollectionStub.restore();
        });
    });
});
