"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NotFoundError_1 = require("../../../lib/errors/NotFoundError");
const AdvancedQuery_1 = require("../../../lib/query-builders/mixin/AdvancedQuery");
describe('AdvancedQuery', function () {
    describe('.first()', function () {
        it('calls this.handler.getQueryExecutor().first() to find result, and returns if result is falsy', async function () {
            const queryExecutor = {
                first() {
                    return 'first-result';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createInstance() {
                        return 'instance';
                    }
                },
                where() { }
            };
            const whereSpy = Sinon.spy(builder, 'where');
            const createInstanceSpy = Sinon.spy(builder.handler, 'createInstance');
            const firstStub = Sinon.stub(queryExecutor, 'first');
            firstStub.returns(Promise.resolve(undefined));
            expect(await AdvancedQuery_1.AdvancedQuery.first.call(builder)).toBeUndefined();
            expect(whereSpy.called).toBe(false);
            expect(firstStub.calledWith()).toBe(true);
            expect(createInstanceSpy.called).toBe(false);
        });
        it('calls this.handler.createInstance() then this.handler.loadEagerRelations() if result is not falsy', async function () {
            const queryExecutor = {
                first() {
                    return 'first-result';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createInstance() {
                        return 'instance';
                    },
                    loadEagerRelations() { }
                },
                where() { }
            };
            const whereSpy = Sinon.spy(builder, 'where');
            const createInstanceSpy = Sinon.spy(builder.handler, 'createInstance');
            const loadEagerRelationsSpy = Sinon.spy(builder.handler, 'loadEagerRelations');
            const firstStub = Sinon.stub(queryExecutor, 'first');
            firstStub.returns(Promise.resolve('any'));
            expect(await AdvancedQuery_1.AdvancedQuery.first.call(builder)).toEqual('instance');
            expect(whereSpy.called).toBe(false);
            expect(firstStub.calledWith()).toBe(true);
            expect(createInstanceSpy.calledWith('any')).toBe(true);
            expect(loadEagerRelationsSpy.calledWith('instance')).toBe(true);
        });
        it('calls .where() and passes id if param exist', async function () {
            const queryExecutor = {
                first() {
                    return 'first-result';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createInstance() {
                        return 'instance';
                    },
                    loadEagerRelations() { }
                },
                where() { }
            };
            const whereSpy = Sinon.spy(builder, 'where');
            const createInstanceSpy = Sinon.spy(builder.handler, 'createInstance');
            const loadEagerRelationsSpy = Sinon.spy(builder.handler, 'loadEagerRelations');
            const firstStub = Sinon.stub(queryExecutor, 'first');
            firstStub.returns(Promise.resolve('any'));
            expect(await AdvancedQuery_1.AdvancedQuery.first.call(builder, 'test')).toEqual('instance');
            expect(whereSpy.calledWith('primary-key', 'test')).toBe(true);
            expect(firstStub.calledWith()).toBe(true);
            expect(createInstanceSpy.calledWith('any')).toBe(true);
            expect(loadEagerRelationsSpy.calledWith('instance')).toBe(true);
        });
    });
    describe('.find()', function () {
        it('just an alias of .first()', async function () {
            const stub = Sinon.stub(AdvancedQuery_1.AdvancedQuery, 'first');
            stub.returns('result');
            expect(await AdvancedQuery_1.AdvancedQuery.find('any')).toEqual('result');
            expect(stub.calledWith('any')).toBe(true);
            stub.restore();
        });
    });
    describe('.get()', function () {
        it('calls handler.getQueryExecutor().get() to get results and calls handler.createCollection() to create collection', async function () {
            const queryExecutor = {
                get() {
                    return 'get-result';
                }
            };
            const collection = {
                count() {
                    return 0;
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createCollection() {
                        return collection;
                    }
                },
                select() { }
            };
            const selectSpy = Sinon.spy(builder, 'select');
            const createCollectionSpy = Sinon.spy(builder.handler, 'createCollection');
            const getStub = Sinon.stub(queryExecutor, 'get');
            getStub.returns(Promise.resolve('any'));
            expect((await AdvancedQuery_1.AdvancedQuery.get.call(builder)) === collection).toBe(true);
            expect(selectSpy.called).toBe(false);
            expect(getStub.calledWith()).toBe(true);
            expect(createCollectionSpy.calledWith('any')).toBe(true);
        });
        it('calls this.handler.loadEagerRelations() with the first item in case the collection is not empty', async function () {
            const queryExecutor = {
                get() {
                    return 'get-result';
                }
            };
            const collection = {
                count() {
                    return 1;
                },
                first() {
                    return 'first item';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createCollection() {
                        return collection;
                    },
                    loadEagerRelations() { }
                },
                select() { }
            };
            const selectSpy = Sinon.spy(builder, 'select');
            const loadEagerRelationsSpy = Sinon.spy(builder.handler, 'loadEagerRelations');
            const createCollectionSpy = Sinon.spy(builder.handler, 'createCollection');
            const getStub = Sinon.stub(queryExecutor, 'get');
            getStub.returns(Promise.resolve('any'));
            expect((await AdvancedQuery_1.AdvancedQuery.get.call(builder)) === collection).toBe(true);
            expect(selectSpy.called).toBe(false);
            expect(getStub.calledWith()).toBe(true);
            expect(createCollectionSpy.calledWith('any')).toBe(true);
            expect(loadEagerRelationsSpy.calledWith('first item')).toBe(true);
        });
        it('calls this.select() if params is not empty', async function () {
            const queryExecutor = {
                get() {
                    return 'get-result';
                }
            };
            const collection = {
                count() {
                    return 0;
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createCollection() {
                        return collection;
                    }
                },
                select() { }
            };
            const selectSpy = Sinon.spy(builder, 'select');
            const createCollectionSpy = Sinon.spy(builder.handler, 'createCollection');
            const getStub = Sinon.stub(queryExecutor, 'get');
            getStub.returns(Promise.resolve('any'));
            expect((await AdvancedQuery_1.AdvancedQuery.get.call(builder, '1', '2', '3')) === collection).toBe(true);
            expect(selectSpy.calledWith('1', '2', '3')).toBe(true);
            expect(getStub.calledWith()).toBe(true);
            expect(createCollectionSpy.calledWith('any')).toBe(true);
        });
    });
    describe('.all()', function () {
        it('just an alias of .get()', async function () {
            const stub = Sinon.stub(AdvancedQuery_1.AdvancedQuery, 'get');
            stub.returns('result');
            expect(await AdvancedQuery_1.AdvancedQuery.all()).toEqual('result');
            expect(stub.calledWith()).toBe(true);
            stub.restore();
        });
    });
    describe('.pluck()', function () {
        it('calls .select() with valueKey and indexKey, then calls .executor().get() and reduce the result', async function () {
            const queryExecutor = {
                get() {
                    return 'get-result';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'primary-key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createCollection() {
                        return 'collection';
                    }
                },
                select() { }
            };
            const selectSpy = Sinon.spy(builder, 'select');
            const createCollectionSpy = Sinon.spy(builder.handler, 'createCollection');
            const getPrimaryKeyNameSpy = Sinon.spy(builder.handler, 'getPrimaryKeyName');
            const getStub = Sinon.stub(queryExecutor, 'get');
            getStub.returns(Promise.resolve([{ value: '1', key: 'a' }, { value: '2', key: 'b' }, { value: '3', key: 'a' }]));
            expect(await AdvancedQuery_1.AdvancedQuery.pluck.call(builder, 'value', 'key')).toEqual({
                a: '3',
                b: '2'
            });
            expect(selectSpy.calledWith('value', 'key')).toBe(true);
            expect(getStub.calledWith()).toBe(true);
            expect(getPrimaryKeyNameSpy.calledWith()).toBe(false);
            expect(createCollectionSpy.called).toBe(false);
        });
        it('uses .getPrimaryKeyName() if the indexKey not provided', async function () {
            const queryExecutor = {
                get() {
                    return 'get-result';
                }
            };
            const builder = {
                handler: {
                    getPrimaryKeyName() {
                        return 'key';
                    },
                    getQueryExecutor() {
                        return queryExecutor;
                    },
                    createCollection() {
                        return 'collection';
                    }
                },
                select() { }
            };
            const selectSpy = Sinon.spy(builder, 'select');
            const createCollectionSpy = Sinon.spy(builder.handler, 'createCollection');
            const getPrimaryKeyNameSpy = Sinon.spy(builder.handler, 'getPrimaryKeyName');
            const getStub = Sinon.stub(queryExecutor, 'get');
            getStub.returns(Promise.resolve([{ value: '1', key: 'a' }, { value: '2', key: 'b' }, { value: '3', key: 'a' }]));
            expect(await AdvancedQuery_1.AdvancedQuery.pluck.call(builder, 'value')).toEqual({
                a: '3',
                b: '2'
            });
            expect(selectSpy.calledWith('value', 'key')).toBe(true);
            expect(getStub.calledWith()).toBe(true);
            expect(getPrimaryKeyNameSpy.calledWith()).toBe(true);
            expect(createCollectionSpy.called).toBe(false);
        });
    });
    describe('.findById()', function () {
        it('just an alias of .first()', async function () {
            const stub = Sinon.stub(AdvancedQuery_1.AdvancedQuery, 'first');
            stub.returns('result');
            expect(await AdvancedQuery_1.AdvancedQuery.findById('any')).toEqual('result');
            expect(stub.calledWith('any')).toBe(true);
            stub.restore();
        });
    });
    describe('.firstOrFail()', function () {
        it('calls this.first() and returns the result if exists', async function () {
            const stub = Sinon.stub(AdvancedQuery_1.AdvancedQuery, 'first');
            stub.returns('result');
            expect(await AdvancedQuery_1.AdvancedQuery.firstOrFail('any')).toEqual('result');
            expect(stub.calledWith('any')).toBe(true);
            stub.restore();
        });
        it('calls this.first() and throws NotFoundError if there is no result', async function () {
            const builder = {
                handler: {
                    getModel() {
                        return {
                            getModelName() {
                                return 'Model';
                            }
                        };
                    }
                },
                first() { }
            };
            try {
                await AdvancedQuery_1.AdvancedQuery.firstOrFail.call(builder, 'any');
            }
            catch (error) {
                expect(error).toBeInstanceOf(NotFoundError_1.NotFoundError);
                expect(error.model).toEqual('Model');
                return;
            }
            expect('should not reach this line').toEqual('hm');
        });
    });
    describe('.findOrFail()', function () {
        it('just an alias of .findOrFail()', async function () {
            const stub = Sinon.stub(AdvancedQuery_1.AdvancedQuery, 'firstOrFail');
            stub.returns('result');
            expect(await AdvancedQuery_1.AdvancedQuery.findOrFail('any')).toEqual('result');
            expect(stub.calledWith('any')).toBe(true);
            stub.restore();
        });
    });
});
