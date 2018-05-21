"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const Relation_1 = require("../../lib/relations/Relation");
describe('Relation', function () {
    describe('constructor()', function () {
        it('needs rootModel and the name of relation', function () {
            const rootModel = {};
            const name = 'test';
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, name]);
            expect(relation['rootModel'] === rootModel).toBe(true);
            expect(relation['name'] === 'test').toBe(true);
        });
    });
    describe('protected getRelationInfo()', function () {
        it('returns rootModel["relations"][this.name]', function () {
            const info = {};
            const rootModel = {
                relations: {
                    test: info
                }
            };
            const relation = Reflect.construct(Relation_1.Relation, [rootModel, 'test']);
            expect(relation['getRelationInfo']() === info).toBe(true);
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
        it('returns .buildData() if .isLoaded() returns true', function () {
            const info = {
                isLoaded: true
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
                async lazyLoad() { }
                async eagerLoad() { }
                buildData() {
                    return 'build-data';
                }
            }
            const relation = new ChildRelation(rootModel, 'test');
            expect(relation.getData()).toEqual('build-data');
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
});
