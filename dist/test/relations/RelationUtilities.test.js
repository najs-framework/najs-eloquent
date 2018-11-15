"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Relationship_1 = require("./../../lib/relations/Relationship");
const RelationUtilities_1 = require("./../../lib/relations/RelationUtilities");
const DataBuffer_1 = require("../../lib/data/DataBuffer");
const factory_1 = require("../../lib/util/factory");
const reader = {
    getAttribute(data, field) {
        return data[field];
    },
    pick(data, fields) {
        return data;
    },
    toComparable(value) {
        return value;
    }
};
describe('RelationUtilities', function () {
    describe('.bundleRelations()', function () {
        it('reduces and groups relation by name, in case it already exist the chains will be passed to previous relation via .with()', function () {
            function make_relation(name, chains) {
                const instance = Reflect.construct(Relationship_1.Relationship, [{}, name]);
                instance['name'] = name;
                instance['chains'] = chains;
                return instance;
            }
            const one = make_relation('one', ['test']);
            const two = make_relation('two', []);
            const three = make_relation('three', ['*', 'x']);
            const four = make_relation('one', ['a']);
            const five = make_relation('one', ['b', 'a']);
            const six = make_relation('two', []);
            const seven = make_relation('three', ['x']);
            const result = RelationUtilities_1.RelationUtilities.bundleRelations([one, two, three, four, five, six, seven]);
            expect(result[0] === one).toBe(true);
            expect(result[1] === two).toBe(true);
            expect(result[2] === three).toBe(true);
            expect(one.getChains()).toEqual(['test', 'a', 'b']);
            expect(two.getChains()).toEqual([]);
            expect(three.getChains()).toEqual(['*', 'x']);
        });
    });
    describe('.isLoadedInDataBucket()', function () {
        it('does nothing and returns false if there is no dataBucket in relation', function () {
            const model = {};
            const relation = {
                getDataBucket() {
                    return undefined;
                }
            };
            expect(RelationUtilities_1.RelationUtilities.isLoadedInDataBucket(relation, model, 'test')).toBe(false);
        });
        it('returns false if the name is not in array DataBucket.metadata."loaded"', function () {
            const dataset = [
                {
                    metadata: { loaded: [] },
                    name: 'a',
                    result: false
                },
                {
                    metadata: { loaded: ['a'] },
                    name: 'a',
                    result: true
                },
                {
                    metadata: { loaded: ['a'] },
                    name: 'b',
                    result: false
                }
            ];
            for (const item of dataset) {
                const model = {};
                const relation = {
                    getDataBucket() {
                        return {
                            getMetadataOf() {
                                return item.metadata;
                            }
                        };
                    }
                };
                expect(RelationUtilities_1.RelationUtilities.isLoadedInDataBucket(relation, model, item.name)).toBe(item.result);
            }
        });
    });
    describe('.markLoadedInDataBucket()', function () {
        it('does nothing if there is no dataBucket in relation', function () {
            const model = {};
            const relation = {
                getDataBucket() {
                    return undefined;
                }
            };
            RelationUtilities_1.RelationUtilities.markLoadedInDataBucket(relation, model, 'test');
        });
        it('pushes name into DataBucket.metadata."loaded" array', function () {
            const dataset = [
                {
                    before: { loaded: [] },
                    name: 'a',
                    after: { loaded: ['a'] }
                },
                {
                    before: { loaded: ['a'] },
                    name: 'a',
                    after: { loaded: ['a', 'a'] }
                },
                {
                    before: { loaded: ['a'] },
                    name: 'b',
                    after: { loaded: ['a', 'b'] }
                }
            ];
            for (const item of dataset) {
                const model = {};
                const relation = {
                    getDataBucket() {
                        return {
                            getMetadataOf() {
                                return item.before;
                            }
                        };
                    }
                };
                RelationUtilities_1.RelationUtilities.markLoadedInDataBucket(relation, model, item.name);
                expect(item.before).toEqual(item.after);
            }
        });
    });
    describe('.getAttributeListInDataBucket()', function () {
        it('simply maps the dataBuffer with reader.getAttribute()', function () {
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            dataBuffer.add({ id: 1, a: 1, b: 2, c: 3 });
            dataBuffer.add({ id: 2, a: 2, b: 4, c: 6 });
            dataBuffer.add({ id: 3, a: 3, b: 6, c: 9 });
            const dataBucket = {
                getDataOf() {
                    return dataBuffer;
                }
            };
            expect(RelationUtilities_1.RelationUtilities.getAttributeListInDataBucket(dataBucket, {}, 'a')).toEqual([1, 2, 3]);
            expect(RelationUtilities_1.RelationUtilities.getAttributeListInDataBucket(dataBucket, {}, 'b')).toEqual([2, 4, 6]);
            expect(RelationUtilities_1.RelationUtilities.getAttributeListInDataBucket(dataBucket, {}, 'c')).toEqual([3, 6, 9]);
        });
    });
    describe('.associateOne()', function () {
        it('calls given setTargetAttributes() then save the model when root model get saved', async function () {
            const rootModel = {
                getAttribute() {
                    return 'anything';
                },
                once() { }
            };
            const model = {
                save() {
                    return Promise.resolve(true);
                }
            };
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const saveSpy = Sinon.spy(model, 'save');
            expect(RelationUtilities_1.RelationUtilities.associateOne(model, rootModel, 'id', setTargetAttributesSpy)).toBeUndefined();
            expect(setTargetAttributesSpy.calledWith(model)).toBe(true);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(saveSpy.called).toBe(false);
            const handler = onceSpy.lastCall.args[1];
            handler();
            expect(saveSpy.called).toBe(true);
        });
        it('calls given setTargetAttributes() after root model get saved if the key in rootModel is not found', function () {
            const rootModel = {
                getAttribute() {
                    return undefined;
                },
                once() { }
            };
            const model = {
                save() {
                    return Promise.resolve(true);
                }
            };
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const saveSpy = Sinon.spy(model, 'save');
            expect(RelationUtilities_1.RelationUtilities.associateOne(model, rootModel, 'id', setTargetAttributesSpy)).toBeUndefined();
            expect(setTargetAttributesSpy.called).toBe(false);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(saveSpy.called).toBe(false);
            const handler = onceSpy.lastCall.args[1];
            handler();
            expect(saveSpy.called).toBe(true);
            expect(setTargetAttributesSpy.called).toBe(true);
        });
    });
    describe('.flattenModels()', function () {
        it('flattens given arguments, if the item is collection it calls item.all()', function () {
            const input = ['a', ['b', 'c'], 'd', factory_1.make_collection(['e']), 'f'];
            expect(RelationUtilities_1.RelationUtilities.flattenModels(input)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
    });
    describe('.associateMany()', function () {
        it('calls .flattenModels() with given models, calls given setTargetAttributes() then save the models when root get saved', function () {
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
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const save1Spy = Sinon.spy(model1, 'save');
            const save2Spy = Sinon.spy(model2, 'save');
            const save3Spy = Sinon.spy(model3, 'save');
            const save4Spy = Sinon.spy(model4, 'save');
            RelationUtilities_1.RelationUtilities.associateMany([model1, [model2], factory_1.make_collection([model3, model4])], rootModel, 'id', setTargetAttributesSpy);
            expect(setTargetAttributesSpy.callCount).toEqual(4);
            expect(setTargetAttributesSpy.getCall(0).calledWith(model1)).toBe(true);
            expect(setTargetAttributesSpy.getCall(1).calledWith(model2)).toBe(true);
            expect(setTargetAttributesSpy.getCall(2).calledWith(model3)).toBe(true);
            expect(setTargetAttributesSpy.getCall(3).calledWith(model4)).toBe(true);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(save1Spy.called).toBe(false);
            expect(save2Spy.called).toBe(false);
            expect(save3Spy.called).toBe(false);
            expect(save4Spy.called).toBe(false);
            const handler = onceSpy.lastCall.args[1];
            handler();
            expect(save1Spy.called).toBe(true);
            expect(save2Spy.called).toBe(true);
            expect(save3Spy.called).toBe(true);
            expect(save4Spy.called).toBe(true);
        });
        it('calls .flattenModels() with given models, calls given setTargetAttributes() after root model get saved if the key in rootModel is not found', function () {
            const rootModel = {
                getAttribute() {
                    return undefined;
                },
                once() { }
            };
            const model1 = {
                setAttribute() {
                    return this;
                },
                save() {
                    return Promise.resolve(true);
                }
            };
            const model2 = {
                setAttribute() {
                    return this;
                },
                save() {
                    return Promise.resolve(true);
                }
            };
            const model3 = {
                setAttribute() {
                    return this;
                },
                save() {
                    return Promise.resolve(true);
                }
            };
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const save1Spy = Sinon.spy(model1, 'save');
            const save2Spy = Sinon.spy(model2, 'save');
            const save3Spy = Sinon.spy(model3, 'save');
            RelationUtilities_1.RelationUtilities.associateMany([model1, [model2], factory_1.make_collection([model3])], rootModel, 'id', setTargetAttributesSpy);
            expect(setTargetAttributesSpy.callCount).toEqual(0);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(save1Spy.called).toBe(false);
            expect(save2Spy.called).toBe(false);
            expect(save3Spy.called).toBe(false);
            const handler = onceSpy.lastCall.args[1];
            handler();
            expect(save1Spy.called).toBe(true);
            expect(save2Spy.called).toBe(true);
            expect(save3Spy.called).toBe(true);
            expect(setTargetAttributesSpy.callCount).toEqual(3);
            expect(setTargetAttributesSpy.getCall(0).calledWith(model1)).toBe(true);
            expect(setTargetAttributesSpy.getCall(1).calledWith(model2)).toBe(true);
            expect(setTargetAttributesSpy.getCall(2).calledWith(model3)).toBe(true);
        });
    });
    describe('.dissociateMany()', function () {
        it('flattens given models with .flattenModels() calls given setTargetAttributes() and calls model.save() when root model get saved if there is root primary key', async function () {
            const model1 = { async save() { } };
            const model2 = { async save() { } };
            const model3 = { async save() { } };
            const rootModel = {
                getAttribute() {
                    return 'id';
                },
                once() { }
            };
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const save1Spy = Sinon.spy(model1, 'save');
            const save2Spy = Sinon.spy(model2, 'save');
            const save3Spy = Sinon.spy(model3, 'save');
            RelationUtilities_1.RelationUtilities.dissociateMany([model1, [model2], factory_1.make_collection([model3])], rootModel, 'id', setTargetAttributesSpy);
            expect(setTargetAttributesSpy.calledThrice).toBe(true);
            expect(setTargetAttributesSpy.firstCall.calledWith(model1)).toBe(true);
            expect(setTargetAttributesSpy.secondCall.calledWith(model2)).toBe(true);
            expect(setTargetAttributesSpy.thirdCall.calledWith(model3)).toBe(true);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(save1Spy.called).toBe(false);
            expect(save2Spy.called).toBe(false);
            expect(save3Spy.called).toBe(false);
            const handler = onceSpy.firstCall.args[1];
            await handler();
            expect(save1Spy.called).toBe(true);
            expect(save2Spy.called).toBe(true);
            expect(save3Spy.called).toBe(true);
        });
        it('flattens given models with .flattenModels() calls given setTargetAttributes() and calls model.save() when root model get saved if there is no root primary key', async function () {
            const model1 = { async save() { } };
            const model2 = { async save() { } };
            const model3 = { async save() { } };
            const rootModel = {
                getAttribute() {
                    return undefined;
                },
                once() { }
            };
            function setTargetAttributes() { }
            const setTargetAttributesSpy = Sinon.spy(setTargetAttributes);
            const onceSpy = Sinon.spy(rootModel, 'once');
            const save1Spy = Sinon.spy(model1, 'save');
            const save2Spy = Sinon.spy(model2, 'save');
            const save3Spy = Sinon.spy(model3, 'save');
            RelationUtilities_1.RelationUtilities.dissociateMany([model1, [model2], factory_1.make_collection([model3])], rootModel, 'id', setTargetAttributesSpy);
            expect(setTargetAttributesSpy.calledThrice).toBe(false);
            expect(onceSpy.calledWith('saved')).toBe(true);
            expect(save1Spy.called).toBe(false);
            expect(save2Spy.called).toBe(false);
            expect(save3Spy.called).toBe(false);
            const handler = onceSpy.firstCall.args[1];
            await handler();
            expect(setTargetAttributesSpy.calledThrice).toBe(true);
            expect(setTargetAttributesSpy.firstCall.calledWith(model1)).toBe(true);
            expect(setTargetAttributesSpy.secondCall.calledWith(model2)).toBe(true);
            expect(setTargetAttributesSpy.thirdCall.calledWith(model3)).toBe(true);
            expect(save1Spy.called).toBe(true);
            expect(save2Spy.called).toBe(true);
            expect(save3Spy.called).toBe(true);
        });
    });
});
