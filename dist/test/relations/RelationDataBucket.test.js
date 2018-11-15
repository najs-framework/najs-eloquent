"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const lodash_1 = require("lodash");
const RelationDataBucket_1 = require("../../lib/relations/RelationDataBucket");
const DataBuffer_1 = require("../../lib/data/DataBuffer");
const helpers_1 = require("../../lib/util/helpers");
const reader = {
    getAttribute(data, field) {
        return data[field];
    },
    pick(data, fields) {
        return lodash_1.pick(data, fields);
    },
    toComparable(value) {
        return value;
    }
};
describe('RelationDataBucket', function () {
    it('implements Autoload under name "NajsEloquent.Relation.RelationDataBucket"', function () {
        const dataBucket = new RelationDataBucket_1.RelationDataBucket();
        expect(dataBucket.getClassName()).toEqual('NajsEloquent.Relation.RelationDataBucket');
    });
    describe('constructor()', function () {
        it('initialize bucket as an empty object', function () {
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(dataBucket['bucket']).toEqual({});
        });
    });
    describe('.add()', function () {
        it('is chainable, it calls this.getDataOf() then .add() the rawData for data bucket of model', function () {
            const rawData = {
                id: 'key'
            };
            const model = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return {
                                getRawDataForDataBucket() {
                                    return rawData;
                                }
                            };
                        }
                    };
                }
            };
            const dataBuffer = new DataBuffer_1.DataBuffer('id', reader);
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            const getDataOfStub = Sinon.stub(dataBucket, 'getDataOf');
            getDataOfStub.returns(dataBuffer);
            expect(dataBucket.add(model) === dataBucket).toBe(true);
            expect(Array.from(dataBuffer.getBuffer().entries())).toEqual([['key', rawData]]);
        });
    });
    describe('.makeModel()', function () {
        it('uses make() to create model instance then assign the relationDataBucket to it', function () {
            const relationFeature = {
                setDataBucket(model, bucket) {
                    model['internalData'] = {
                        relationDataBucket: bucket
                    };
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
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(model);
            class ModelClass {
                getClassName() {
                    return 'ModelClassName';
                }
            }
            const record = {};
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            const result = dataBucket.makeModel(ModelClass, record);
            expect(result === model).toBe(true);
            expect(result['internalData']['relationDataBucket'] === dataBucket).toBe(true);
            expect(makeStub.calledWith('ModelClassName')).toBe(true);
            makeStub.restore();
        });
    });
    describe('.makeCollection()', function () {
        it('creates an collection based on .makeModel() function', function () {
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            const makeModelStub = Sinon.stub(dataBucket, 'makeModel');
            makeModelStub.returns('anything');
            const data = [{ a: 1 }, { b: 2 }, { c: 3 }];
            const model = {};
            const result = dataBucket.makeCollection(model, data);
            expect(helpers_1.isCollection(result)).toBe(true);
            expect(makeModelStub.getCall(0).calledWith(model, { a: 1 })).toBe(true);
            expect(makeModelStub.getCall(1).calledWith(model, { b: 2 })).toBe(true);
            expect(makeModelStub.getCall(2).calledWith(model, { c: 3 })).toBe(true);
        });
    });
    describe('.getDataOf()', function () {
        it('simply returns property data in .bucket[key] with the key created from .createKey()', function () {
            const relationFeature = {
                createKeyForDataBucket(model) {
                    return 'anything';
                },
                getDataReaderForDataBucket() {
                    return reader;
                }
            };
            const model = {
                getPrimaryKeyName() {
                    return 'id';
                },
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(dataBucket.getDataOf(model) === dataBucket['bucket']['anything'].data).toBe(true);
        });
    });
    describe('.getMetadata()', function () {
        it('simply returns property meta in .bucket[key] with the key created from .createKey()', function () {
            const relationFeature = {
                createKeyForDataBucket(model) {
                    return 'anything';
                },
                getDataReaderForDataBucket() {
                    return reader;
                }
            };
            const model = {
                getPrimaryKeyName() {
                    return 'id';
                },
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(dataBucket.getMetadataOf(model)).toEqual({ loaded: [] });
            expect(dataBucket.getMetadataOf(model) === dataBucket['bucket']['anything'].meta).toBe(true);
        });
    });
    describe('.createKey()', function () {
        it('calls RelationFeature.createKeyForDataBucket() to create key, then init data in bucket and returns a key', function () {
            const relationFeature = {
                createKeyForDataBucket(model) {
                    return 'anything';
                },
                getDataReaderForDataBucket() {
                    return reader;
                }
            };
            const model = {
                getPrimaryKeyName() {
                    return 'id';
                },
                getDriver() {
                    return {
                        getRelationFeature() {
                            return relationFeature;
                        }
                    };
                }
            };
            const dataBucket = new RelationDataBucket_1.RelationDataBucket();
            expect(dataBucket.createKey(model)).toEqual('anything');
            expect(dataBucket['bucket']['anything']).not.toBeUndefined();
        });
    });
});
