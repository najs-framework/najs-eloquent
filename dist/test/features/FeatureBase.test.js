"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const FillableFeature_1 = require("../../lib/features/FillableFeature");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
describe('FeatureBase', function () {
    const featureInstance = new FillableFeature_1.FillableFeature();
    describe('.attachPublicApi()', function () {
        it('assigns to prototype the object get from .getPublicApi()', function () {
            const publicApi = {
                a() { },
                b() { },
                c() { }
            };
            class Any extends FeatureBase_1.FeatureBase {
                getPublicApi() {
                    return publicApi;
                }
            }
            const instance = new Any();
            const prototype = {};
            instance.attachPublicApi(prototype, [], {});
            for (const name in publicApi) {
                expect(prototype[name] === publicApi[name]).toBe(true);
            }
        });
    });
    describe('.useInternalOf()', function () {
        it('is an helper just returns a definition with internal property/methods', function () {
            const model = {};
            expect(featureInstance.useInternalOf(model) === model).toBe(true);
        });
    });
    describe('.useSettingFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns SettingFeature from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getSettingFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useSettingFeatureOf(model) === feature).toBe(true);
        });
    });
    describe('.useRecordManagerOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useRecordManagerOf(model) === feature).toBe(true);
        });
    });
    describe('.useFillableFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getFillableFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useFillableFeatureOf(model) === feature).toBe(true);
        });
    });
    describe('.useSerializationFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getSerializationFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useSerializationFeatureOf(model) === feature).toBe(true);
        });
    });
    describe('.useTimestampsFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getTimestampsFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useTimestampsFeatureOf(model) === feature).toBe(true);
        });
    });
    describe('.useSoftDeletesFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getSoftDeletesFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useSoftDeletesFeatureOf(model) === feature).toBe(true);
        });
    });
    describe('.useRelationFeatureOf()', function () {
        it('is an helper to reduce repetition code. It returns RecordManager from a driver', function () {
            const feature = {};
            const model = {
                getDriver() {
                    return {
                        getRelationFeature() {
                            return feature;
                        }
                    };
                }
            };
            expect(featureInstance.useRelationFeatureOf(model) === feature).toBe(true);
        });
    });
});
