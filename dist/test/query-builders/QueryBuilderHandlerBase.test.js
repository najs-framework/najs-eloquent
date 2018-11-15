"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const QueryBuilderHandlerBase_1 = require("../../lib/query-builders/QueryBuilderHandlerBase");
describe('QueryBuilderHandlerBase', function () {
    const executorFactory = {
        makeQueryExecutor() { }
    };
    function makeInstance(model, factory) {
        return Reflect.construct(QueryBuilderHandlerBase_1.QueryBuilderHandlerBase, [model, factory || executorFactory]);
    }
    describe('constructor()', function () {
        it('assigns model and executorFactory to properties respectively, init used = false & softDeleteState = should-add', function () {
            const model = {};
            const query = makeInstance(model, executorFactory);
            expect(query.getModel() === model).toBe(true);
            expect(query['executorFactory'] === executorFactory).toBe(true);
            expect(query.isUsed()).toBe(false);
            expect(query.getSoftDeleteState()).toEqual('should-add');
        });
    });
    describe('.getQueryExecutor()', function () {
        it('calls and returns executorFactory.makeQueryExecutor()', function () {
            const stub = Sinon.stub(executorFactory, 'makeQueryExecutor');
            stub.returns('anything');
            const model = {};
            const instance = makeInstance(model);
            expect(instance.getQueryExecutor()).toEqual('anything');
            expect(stub.calledWith(instance)).toBe(true);
            stub.restore();
        });
    });
    describe('.getModel()', function () {
        it('simply returns model', function () {
            const model = {};
            const query = makeInstance(model);
            expect(query.getModel() === model).toBe(true);
        });
    });
    describe('.getPrimaryKeyName()', function () {
        it('simply returns model.getPrimaryKeyName()', function () {
            const model = {
                getPrimaryKeyName() {
                    return 'result';
                }
            };
            const query = makeInstance(model);
            expect(query.getPrimaryKeyName()).toEqual('result');
        });
    });
    describe('.setQueryName()', function () {
        it('sets queryName by passed param value', function () {
            const model = {};
            const query = makeInstance(model);
            query.setQueryName('test');
            expect(query.getQueryName()).toEqual('test');
        });
    });
    describe('.getQueryName()', function () {
        it('simply returns queryName value', function () {
            const model = {};
            const query = makeInstance(model);
            query.setQueryName('test');
            expect(query.getQueryName()).toEqual('test');
        });
    });
    describe('.setLogGroup()', function () {
        it('sets logGroup by passed param value', function () {
            const model = {};
            const query = makeInstance(model);
            query.setLogGroup('test');
            expect(query.getLogGroup()).toEqual('test');
        });
    });
    describe('.getLogGroup()', function () {
        it('simply returns logGroup value', function () {
            const model = {};
            const query = makeInstance(model);
            query.setLogGroup('test');
            expect(query.getLogGroup()).toEqual('test');
        });
    });
    describe('.markUsed()', function () {
        it('assigns true to used property', function () {
            const model = {};
            const query = makeInstance(model);
            query.markUsed();
            expect(query.isUsed()).toBe(true);
        });
    });
    describe('.isUsed()', function () {
        it('simply returns used property', function () {
            const model = {};
            const query = makeInstance(model);
            query.markUsed();
            expect(query.isUsed()).toBe(true);
        });
    });
    describe('.hasSoftDeletes()', function () {
        it('calls .hasSoftDeletes() from SoftDeletesFeature of the model', function () {
            const model = {
                getDriver() {
                    return {
                        getSoftDeletesFeature() {
                            return {
                                hasSoftDeletes() {
                                    return 'result';
                                }
                            };
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.hasSoftDeletes()).toEqual('result');
        });
    });
    describe('.getSoftDeletesSetting()', function () {
        it('calls .getSoftDeletesSetting() from SoftDeletesFeature of the model', function () {
            const model = {
                getDriver() {
                    return {
                        getSoftDeletesFeature() {
                            return {
                                getSoftDeletesSetting() {
                                    return 'result';
                                }
                            };
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.getSoftDeletesSetting()).toEqual('result');
        });
    });
    describe('.hasTimestamps()', function () {
        it('calls .hasTimestamps() from TimestampsFeature of the model', function () {
            const model = {
                getDriver() {
                    return {
                        getTimestampsFeature() {
                            return {
                                hasTimestamps() {
                                    return 'result';
                                }
                            };
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.hasTimestamps()).toEqual('result');
        });
    });
    describe('.getTimestampsSetting()', function () {
        it('calls .getTimestampsSetting() from TimestampsFeature of the model', function () {
            const model = {
                getDriver() {
                    return {
                        getTimestampsFeature() {
                            return {
                                getTimestampsSetting() {
                                    return 'result';
                                }
                            };
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.getTimestampsSetting()).toEqual('result');
        });
    });
    describe('.markSoftDeleteState()', function () {
        it('sets softDeleteState by passed param value', function () {
            const model = {};
            const query = makeInstance(model);
            query.markSoftDeleteState('added');
            expect(query.getSoftDeleteState()).toEqual('added');
        });
    });
    describe('.getSoftDeleteState()', function () {
        it('simply returns logGroup value', function () {
            const model = {};
            const query = makeInstance(model);
            query.markSoftDeleteState('should-not-add');
            expect(query.getSoftDeleteState()).toEqual('should-not-add');
        });
    });
    describe('.shouldAddSoftDeleteCondition()', function () {
        it('returns true if softDeleteState is should-add AND model .hasSoftDeletes', function () {
            const dataset = [
                {
                    state: 'should-add',
                    hasSoftDeletes: false,
                    result: false
                },
                {
                    state: 'should-not-add',
                    hasSoftDeletes: false,
                    result: false
                },
                {
                    state: 'added',
                    hasSoftDeletes: false,
                    result: false
                },
                {
                    state: 'should-add',
                    hasSoftDeletes: true,
                    result: true
                },
                {
                    state: 'should-not-add',
                    hasSoftDeletes: true,
                    result: false
                },
                {
                    state: 'added',
                    hasSoftDeletes: true,
                    result: false
                }
            ];
            for (const data of dataset) {
                const model = {
                    getDriver() {
                        return {
                            getSoftDeletesFeature() {
                                return {
                                    hasSoftDeletes() {
                                        return data.hasSoftDeletes;
                                    }
                                };
                            }
                        };
                    }
                };
                const query = makeInstance(model);
                query.markSoftDeleteState(data.state);
                expect(query.shouldAddSoftDeleteCondition()).toBe(data.result);
            }
        });
    });
    describe('.createCollection()', function () {
        it('simply calls make_collection() with result an this.createInstance as a mapper', function () {
            const model = {};
            const query = makeInstance(model);
            const createInstanceStub = Sinon.stub(query, 'createInstance');
            createInstanceStub.returns({});
            const a = {}, b = {};
            query.createCollection([a, b]);
            expect(createInstanceStub.calledTwice).toBe(true);
            expect(createInstanceStub.firstCall.calledWith(a)).toBe(true);
            expect(createInstanceStub.secondCall.calledWith(b)).toBe(true);
        });
    });
    describe('.setRelationDataBucket()', function () {
        it('simply assigns the dataBucket to property "dataBucket"', function () {
            const model = {};
            const dataBucket = {};
            const query = makeInstance(model);
            query.setRelationDataBucket(dataBucket);
            expect(query['dataBucket'] === dataBucket).toBe(true);
        });
    });
    describe('.getRelationDataBucket()', function () {
        it('returns dataBucket instance in property "dataBucket" if exists', function () {
            const model = {};
            const dataBucket = {};
            const query = makeInstance(model);
            query.setRelationDataBucket(dataBucket);
            expect(query.getRelationDataBucket() === dataBucket).toBe(true);
        });
        it('can reuse dataBucket in model if exists', function () {
            const dataBucket = {};
            const relationFeature = {
                getDataBucket() {
                    return dataBucket;
                },
                makeDataBucket() {
                    return false;
                }
            };
            const model = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.getRelationDataBucket() === dataBucket).toBe(true);
            expect(query['dataBucket'] === dataBucket).toBe(true);
        });
        it('make new dataBucket if exists', function () {
            const dataBucket = {};
            const relationFeature = {
                getDataBucket() {
                    return undefined;
                },
                makeDataBucket() {
                    return dataBucket;
                }
            };
            const model = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const query = makeInstance(model);
            expect(query.getRelationDataBucket() === dataBucket).toBe(true);
            expect(query['dataBucket'] === dataBucket).toBe(true);
        });
    });
    describe('.createInstance()', function () {
        it('calls .getRelationDataBucket() then calls .makeModel from bucket and push the model to bucket', function () {
            const instance = {};
            const dataBucket = {
                makeModel() {
                    return instance;
                },
                add() { }
            };
            const model = {};
            const query = makeInstance(model);
            const stub = Sinon.stub(query, 'getRelationDataBucket');
            stub.returns(dataBucket);
            const makeModelSpy = Sinon.spy(dataBucket, 'makeModel');
            const addSpy = Sinon.spy(dataBucket, 'add');
            const result = {};
            expect(query.createInstance(result) === instance).toBe(true);
            expect(makeModelSpy.calledWith(model, result)).toBe(true);
            expect(addSpy.calledWith(instance)).toBe(true);
        });
    });
    describe('.loadEagerRelations()', function () {
        it('does nothing if the "eagerRelations" not found', function () {
            const model = {
                load() { }
            };
            const loadSpy = Sinon.spy(model, 'load');
            const query = makeInstance(model);
            query.loadEagerRelations(model);
            expect(loadSpy.called).toBe(false);
        });
        it('calls given model.load() if the "eagerRelations" has values', async function () {
            const model = {
                async load() {
                    return true;
                }
            };
            const loadSpy = Sinon.spy(model, 'load');
            const query = makeInstance(model);
            query.setEagerRelations(['a', 'a', 'b', 'b', 'c']);
            await query.loadEagerRelations(model);
            expect(loadSpy.calledWith(['a', 'b', 'c'])).toBe(true);
        });
    });
    describe('.setEagerRelations()', function () {
        it('simply uniques and assigns the given value to "eagerRelations" if "eagerRelations" is not found', function () {
            const model = {};
            const query = makeInstance(model);
            query.setEagerRelations(['a', 'a', 'b', 'b', 'c']);
            expect(query.getEagerRelations()).toEqual(['a', 'b', 'c']);
        });
        it('merges given value if "eagerRelations" already exists', function () {
            const model = {};
            const query = makeInstance(model);
            query.setEagerRelations(['a', 'a', 'b', 'b', 'c']);
            expect(query.getEagerRelations()).toEqual(['a', 'b', 'c']);
            query.setEagerRelations(['a', 'a', 'd', 'd', 'e']);
            expect(query.getEagerRelations()).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });
    describe('.getEagerRelations()', function () {
        it('simply return the property "eagerRelations"', function () {
            const model = {};
            const query = makeInstance(model);
            const eagerRelations = [];
            query['eagerRelations'] = eagerRelations;
            expect(query.getEagerRelations() === eagerRelations).toBe(true);
        });
    });
});
