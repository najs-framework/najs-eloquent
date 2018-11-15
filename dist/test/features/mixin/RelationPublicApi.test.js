"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const RelationPublicApi_1 = require("../../../lib/features/mixin/RelationPublicApi");
const RelationUtilities_1 = require("../../../lib/relations/RelationUtilities");
describe('RelationPublicApi', function () {
    const relationFeature = {
        findByName() {
            return 'findByName-result';
        },
        findDataByName() {
            return 'findDataByName-result';
        },
        isLoadedRelation() {
            return 'isLoadedRelation-result';
        },
        getLoadedRelations() {
            return 'getLoadedRelations-result';
        }
    };
    const model = {
        driver: {
            getRelationFeature() {
                return relationFeature;
            }
        }
    };
    describe('.getRelation()', function () {
        it('calls and returns RelationFeature.findByName()', function () {
            const stub = Sinon.stub(relationFeature, 'findByName');
            stub.returns('anything');
            expect(RelationPublicApi_1.RelationPublicApi.getRelation.call(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.getRelations()', function () {
        it('flattens arguments then maps to .getRelation(), and finally calls RelationUtilities.bundleRelations()', function () {
            const model = {
                getRelation() { }
            };
            const stub = Sinon.stub(model, 'getRelation');
            stub.returns('anything');
            const bundleRelationsStub = Sinon.stub(RelationUtilities_1.RelationUtilities, 'bundleRelations');
            bundleRelationsStub.returns('bundled result');
            expect(RelationPublicApi_1.RelationPublicApi.getRelations.call(model, 'a', ['b'], 'c')).toEqual('bundled result');
            expect(stub.firstCall.calledWith('a')).toBe(true);
            expect(stub.secondCall.calledWith('b')).toBe(true);
            expect(stub.thirdCall.calledWith('c')).toBe(true);
            expect(bundleRelationsStub.calledWith(['anything', 'anything', 'anything']));
            stub.restore();
            bundleRelationsStub.restore();
        });
    });
    describe('.getLoadedRelations()', function () {
        it('calls and returns RelationFeature.getLoadedRelations()', function () {
            const stub = Sinon.stub(relationFeature, 'getLoadedRelations');
            stub.returns('anything');
            expect(RelationPublicApi_1.RelationPublicApi.getLoadedRelations.call(model)).toEqual('anything');
            expect(stub.calledWith(model)).toBe(true);
            stub.restore();
        });
    });
    describe('.defineRelation()', function () {
        it('calls and returns RelationFeature.findDataByName().getFactory()', function () {
            const data = {
                getFactory() {
                    return 'anything';
                }
            };
            const stub = Sinon.stub(relationFeature, 'findDataByName');
            stub.returns(data);
            expect(RelationPublicApi_1.RelationPublicApi.defineRelation.call(model, 'test')).toEqual('anything');
            expect(stub.calledWith(model, 'test')).toBe(true);
            stub.restore();
        });
    });
    describe('.load()', function () {
        it('flattens arguments then runs and returns .getRelation().load() via Promise.all()', async function () {
            const relations = {
                a: {
                    async load() {
                        return new Promise(resolve => {
                            setTimeout(function () {
                                resolve('a');
                            }, 20);
                        });
                    }
                },
                b: {
                    async load() {
                        return new Promise(resolve => {
                            setTimeout(function () {
                                resolve('b');
                            }, 30);
                        });
                    }
                },
                c: {
                    async load() {
                        return new Promise(resolve => {
                            setTimeout(function () {
                                resolve('c');
                            }, 10);
                        });
                    }
                }
            };
            const stub = Sinon.stub(RelationPublicApi_1.RelationPublicApi, 'getRelation');
            stub.callsFake(function (name) {
                return relations[name];
            });
            expect(await RelationPublicApi_1.RelationPublicApi.load(['b'], 'a')).toEqual(['b', 'a']);
            expect(await RelationPublicApi_1.RelationPublicApi.load(['c'], ['a', 'b'])).toEqual(['c', 'a', 'b']);
        });
    });
    describe('.isLoaded()', function () {
        it('calls and returns RelationFeature.isLoadedRelation()', function () {
            const stub = Sinon.stub(relationFeature, 'isLoadedRelation');
            stub.returns('anything');
            expect(RelationPublicApi_1.RelationPublicApi.isLoaded.call(model, 'test')).toEqual('anything');
            expect(stub.calledWith(model, 'test')).toBe(true);
            stub.restore();
        });
    });
    describe('.getLoaded()', function () {
        it('calls .getLoadedRelations() and maps each item with item.getName()', function () {
            const model = {
                getLoadedRelations() {
                    return [
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
                }
            };
            const spy = Sinon.spy(model, 'getLoadedRelations');
            expect(RelationPublicApi_1.RelationPublicApi.getLoaded.call(model)).toEqual(['a', 'b']);
            expect(spy.calledWith()).toBe(true);
            spy.restore();
        });
    });
});
