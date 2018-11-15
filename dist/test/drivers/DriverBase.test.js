"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const ClassSetting_1 = require("../../lib/util/ClassSetting");
const DriverBase_1 = require("../../lib/drivers/DriverBase");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
const SettingFeature_1 = require("../../lib/features/SettingFeature");
const EventFeature_1 = require("../../lib/features/EventFeature");
const QueryFeature_1 = require("../../lib/features/QueryFeature");
const FillableFeature_1 = require("../../lib/features/FillableFeature");
const SerializationFeature_1 = require("../../lib/features/SerializationFeature");
const TimestampsFeature_1 = require("../../lib/features/TimestampsFeature");
const SoftDeletesFeature_1 = require("../../lib/features/SoftDeletesFeature");
describe('DriverBase', function () {
    function createDriver() {
        return new MemoryDriver_1.MemoryDriver();
    }
    const driver = createDriver();
    describe('constructor()', function () {
        it('creates instance of common features via NajsBinding.make()', function () {
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const driverBase = createDriver();
            const stub = Sinon.stub(driverBase, 'makeQueryBuilderFactory');
            stub.returns('anything');
            expect(driverBase['settingFeature']).toBeInstanceOf(SettingFeature_1.SettingFeature);
            expect(driverBase['eventFeature']).toBeInstanceOf(EventFeature_1.EventFeature);
            expect(driverBase['queryFeature']).toBeInstanceOf(QueryFeature_1.QueryFeature);
            expect(driverBase['fillableFeature']).toBeInstanceOf(FillableFeature_1.FillableFeature);
            expect(driverBase['serializationFeature']).toBeInstanceOf(SerializationFeature_1.SerializationFeature);
            expect(driverBase['timestampsFeature']).toBeInstanceOf(TimestampsFeature_1.TimestampsFeature);
            expect(driverBase['softDeletesFeature']).toBeInstanceOf(SoftDeletesFeature_1.SoftDeletesFeature);
            expect(makeSpy.getCall(0).calledWith('NajsEloquent.Feature.SettingFeature')).toBe(true);
            expect(makeSpy.getCall(1).calledWith('NajsEloquent.Feature.EventFeature')).toBe(true);
            // 2 is MemoryQueryBuilderFactory => QueryFeature is called at 3
            expect(makeSpy.getCall(2).calledWith('NajsEloquent.Driver.Memory.MemoryQueryBuilderFactory')).toBe(true);
            expect(makeSpy.getCall(3).calledWith('NajsEloquent.Feature.QueryFeature')).toBe(true);
            expect(makeSpy.getCall(4).calledWith('NajsEloquent.Feature.FillableFeature')).toBe(true);
            expect(makeSpy.getCall(5).calledWith('NajsEloquent.Feature.SerializationFeature')).toBe(true);
            expect(makeSpy.getCall(6).calledWith('NajsEloquent.Feature.TimestampsFeature')).toBe(true);
            expect(makeSpy.getCall(7).calledWith('NajsEloquent.Feature.SoftDeletesFeature')).toBe(true);
            makeSpy.restore();
        });
    });
    describe('.getSettingFeature()', function () {
        it('simply returns "settingFeature" property', function () {
            const settingFeature = {};
            const driverBase = createDriver();
            driverBase['settingFeature'] = settingFeature;
            expect(driverBase.getSettingFeature() === settingFeature).toBe(true);
        });
    });
    describe('.getSettingFeature()', function () {
        it('simply returns "settingFeature" property', function () {
            const eventFeature = {};
            const driverBase = createDriver();
            driverBase['eventFeature'] = eventFeature;
            expect(driverBase.getEventFeature() === eventFeature).toBe(true);
        });
    });
    describe('.getFillableFeature()', function () {
        it('simply returns "fillableFeature" property', function () {
            const fillableFeature = {};
            const driverBase = createDriver();
            driverBase['fillableFeature'] = fillableFeature;
            expect(driverBase.getFillableFeature() === fillableFeature).toBe(true);
        });
    });
    describe('.getSerializationFeature()', function () {
        it('simply returns "serializationFeature" property', function () {
            const serializationFeature = {};
            const driverBase = createDriver();
            driverBase['serializationFeature'] = serializationFeature;
            expect(driverBase.getSerializationFeature() === serializationFeature).toBe(true);
        });
    });
    describe('.getTimestampsFeature()', function () {
        it('simply returns "timestampsFeature" property', function () {
            const timestampsFeature = {};
            const driverBase = createDriver();
            driverBase['timestampsFeature'] = timestampsFeature;
            expect(driverBase.getTimestampsFeature() === timestampsFeature).toBe(true);
        });
    });
    describe('.getSoftDeletesFeature()', function () {
        it('simply returns "softDeletesFeature" property', function () {
            const softDeletesFeature = {};
            const driverBase = createDriver();
            driverBase['softDeletesFeature'] = softDeletesFeature;
            expect(driverBase.getSoftDeletesFeature() === softDeletesFeature).toBe(true);
        });
    });
    describe('.getRelationFeature()', function () {
        it('simply returns "relationFeature" property', function () {
            const relationFeature = {};
            const driverBase = createDriver();
            driverBase['relationFeature'] = relationFeature;
            expect(driverBase.getRelationFeature() === relationFeature).toBe(true);
        });
    });
    describe('.getGlobalEventEmitter()', function () {
        it('simply returns the DriverBase.globalEventEmitter', function () {
            const globalEventEmitter = {};
            const driverBase = createDriver();
            DriverBase_1.DriverBase['globalEventEmitter'] = globalEventEmitter;
            expect(driverBase.getGlobalEventEmitter() === globalEventEmitter).toBe(true);
            delete DriverBase_1.DriverBase['globalEventEmitter'];
        });
    });
    describe('.makeModel()', function () {
        it('does nothing, just returns model if the data is "create-sample"', function () {
            const model = {};
            const initializeSpy = Sinon.spy(driver.getRecordManager(), 'initialize');
            const attachPublicApiIfNeededSpy = Sinon.spy(driver, 'attachPublicApiIfNeeded');
            driver.makeModel(model, ClassSetting_1.CREATE_SAMPLE);
            expect(initializeSpy.called).toBe(false);
            expect(attachPublicApiIfNeededSpy.called).toBe(false);
            initializeSpy.restore();
            attachPublicApiIfNeededSpy.restore();
        });
        it('calls RecordManager.initialize() and .attachPublicApiIfNeeded() then returns the model', function () {
            const initializeStub = Sinon.stub(driver.getRecordManager(), 'initialize');
            const attachPublicApiIfNeededStub = Sinon.stub(driver, 'attachPublicApiIfNeeded');
            const data = {};
            const model = {};
            driver.makeModel(model);
            expect(initializeStub.calledWith(model, true)).toBe(true);
            expect(attachPublicApiIfNeededStub.calledWith(model)).toBe(true);
            initializeStub.reset();
            attachPublicApiIfNeededStub.reset();
            driver.makeModel(model, data);
            expect(initializeStub.calledWith(model, true, data)).toBe(true);
            expect(attachPublicApiIfNeededStub.calledWith(model)).toBe(true);
            initializeStub.reset();
            attachPublicApiIfNeededStub.reset();
            driver.makeModel(model, data, false);
            expect(initializeStub.calledWith(model, false, data)).toBe(true);
            expect(attachPublicApiIfNeededStub.calledWith(model)).toBe(true);
            initializeStub.reset();
            attachPublicApiIfNeededStub.reset();
            driver.makeModel(model, data, true);
            expect(initializeStub.calledWith(model, true, data)).toBe(true);
            expect(attachPublicApiIfNeededStub.calledWith(model)).toBe(true);
            initializeStub.restore();
            attachPublicApiIfNeededStub.restore();
        });
    });
    describe('.applyProxy()', function () {
        it('creates an proxy which wrap given model instance', function () {
            const model = {
                driver: driver
            };
            const shouldBeProxiedStub = Sinon.stub(driver, 'shouldBeProxied');
            shouldBeProxiedStub.returns(false);
            // No way to test Proxy instance :(
            expect(driver.applyProxy(model) === model).toBe(false);
            shouldBeProxiedStub.restore();
        });
    });
    describe('.shouldBeProxied()', function () {
        it('returns false if the name is Symbol', function () {
            const model = {};
            expect(driver.shouldBeProxied(model, Symbol.for('test'))).toBe(false);
        });
        it('returns false if the name is defined in knownAttributes', function () {
            const model = {
                sharedMetadata: {
                    knownAttributes: ['a', 'b']
                }
            };
            expect(driver.shouldBeProxied(model, 'a')).toBe(false);
            expect(driver.shouldBeProxied(model, 'b')).toBe(false);
            expect(driver.shouldBeProxied(model, 'c')).toBe(true);
        });
        it('returns false if the name is relation definition', function () {
            const model = {
                sharedMetadata: {
                    knownAttributes: [],
                    relationDefinitions: {
                        a: {},
                        b: {}
                    }
                }
            };
            expect(driver.shouldBeProxied(model, 'a')).toBe(false);
            expect(driver.shouldBeProxied(model, 'b')).toBe(false);
            expect(driver.shouldBeProxied(model, 'c')).toBe(true);
        });
    });
    describe('.proxify()', function () {
        it('simply calls and returns RecordManager.getAttribute() if type is "get"', function () {
            const recordManager = {
                getAttribute() {
                    return 'get-anything';
                },
                setAttribute() {
                    return 'set-anything';
                }
            };
            const getRecordManagerStub = Sinon.stub(driver, 'getRecordManager');
            getRecordManagerStub.returns(recordManager);
            const model = {};
            const getAttributeSpy = Sinon.spy(recordManager, 'getAttribute');
            const setAttributeSpy = Sinon.spy(recordManager, 'setAttribute');
            expect(driver.proxify('get', model, 'key')).toEqual('get-anything');
            expect(getAttributeSpy.calledWith(model, 'key')).toBe(true);
            expect(setAttributeSpy.called).toBe(false);
            getRecordManagerStub.restore();
        });
        it('simply calls and returns RecordManager.setAttribute() if type is "set"', function () {
            const recordManager = {
                getAttribute() {
                    return 'get-anything';
                },
                setAttribute() {
                    return 'set-anything';
                }
            };
            const getRecordManagerStub = Sinon.stub(driver, 'getRecordManager');
            getRecordManagerStub.returns(recordManager);
            const model = {};
            const getAttributeSpy = Sinon.spy(recordManager, 'getAttribute');
            const setAttributeSpy = Sinon.spy(recordManager, 'setAttribute');
            expect(driver.proxify('set', model, 'key', 'value')).toEqual('set-anything');
            expect(getAttributeSpy.called).toBe(false);
            expect(setAttributeSpy.calledWith(model, 'key', 'value')).toBe(true);
            getRecordManagerStub.restore();
        });
    });
    describe('.attachPublicApiIfNeeded()', function () {
        it('does nothing if the model is not in property "attachedModels"', function () {
            const getFeaturesSpy = Sinon.spy(driver, 'getFeatures');
            driver['attachedModels']['Test'] = true;
            const model = {
                getModelName() {
                    return 'Test';
                }
            };
            driver.attachPublicApiIfNeeded(model);
            getFeaturesSpy.restore();
        });
        it('finds prototype and bases by find_base_prototypes() then loops all features and calls .attachFeatureIfNeeded()', function () {
            class A {
            }
            class Test extends A {
                getModelName() {
                    return 'Test';
                }
            }
            const definePropertiesBeforeAttachFeaturesSpy = Sinon.spy(driver, 'definePropertiesBeforeAttachFeatures');
            const definePropertiesAfterAttachFeatures = Sinon.spy(driver, 'definePropertiesAfterAttachFeatures');
            const attachFeatureIfNeededSpy = Sinon.spy(driver, 'attachFeatureIfNeeded');
            const bases = [A.prototype, Object.prototype];
            driver['attachedModels'] = {};
            driver.attachPublicApiIfNeeded(new Test());
            expect(driver['attachedModels']['Test']).toEqual({
                prototype: Test.prototype,
                bases: bases
            });
            expect(attachFeatureIfNeededSpy.callCount).toEqual(9);
            expect(attachFeatureIfNeededSpy.lastCall.calledWith(driver.getRecordManager(), Test.prototype, bases)).toBe(true);
            expect(definePropertiesBeforeAttachFeaturesSpy.called).toBe(true);
            expect(definePropertiesAfterAttachFeatures.called).toBe(true);
            definePropertiesBeforeAttachFeaturesSpy.restore();
            definePropertiesAfterAttachFeatures.restore();
            attachFeatureIfNeededSpy.restore();
        });
    });
    describe('.definePropertiesBeforeAttachFeatures()', function () {
        it('defines an empty object to prototype.sharedMetadata.features', function () {
            const prototype = {};
            driver.definePropertiesBeforeAttachFeatures({}, prototype, []);
            expect(prototype).toEqual({
                sharedMetadata: { features: {} }
            });
        });
        it('defines an empty object to prototype.sharedMetadata.features if needed case 1', function () {
            const prototype = { sharedMetadata: {} };
            driver.definePropertiesBeforeAttachFeatures({}, prototype, []);
            expect(prototype).toEqual({
                sharedMetadata: { features: {} }
            });
        });
        it('defines an empty object to prototype.sharedMetadata.features if needed case 2', function () {
            const prototype = { sharedMetadata: { features: { test: 1 } } };
            driver.definePropertiesBeforeAttachFeatures({}, prototype, []);
            expect(prototype).toEqual({
                sharedMetadata: { features: { test: 1 } }
            });
        });
    });
    describe('.definePropertiesAfterAttachFeatures()', function () {
        it('calls RelationFeature.buildDefinitions() then define a property "relationDefinitions" to prototype.sharedMetadata', function () {
            const getRelationFeatureStub = Sinon.stub(driver, 'getRelationFeature');
            getRelationFeatureStub.returns({
                buildDefinitions() {
                    return 'anything';
                }
            });
            const prototype = { sharedMetadata: {} };
            driver.definePropertiesAfterAttachFeatures({}, prototype, []);
            expect(Object.getOwnPropertyDescriptor(prototype['sharedMetadata'], 'relationDefinitions')).toEqual({
                value: 'anything',
                writable: false,
                enumerable: false,
                configurable: false
            });
            expect(prototype['sharedMetadata']['relationDefinitions']).toEqual('anything');
            getRelationFeatureStub.restore();
        });
    });
    describe('.getSharedFeatures()', function () {
        it('simply returns an array of shared features', function () {
            expect(driver.getSharedFeatures()).toEqual([
                driver['settingFeature'],
                driver['eventFeature'],
                driver['queryFeature'],
                driver['fillableFeature'],
                driver['serializationFeature'],
                driver['timestampsFeature'],
                driver['softDeletesFeature'],
                driver['relationFeature']
            ]);
        });
    });
    describe('.getCustomFeatures()', function () {
        it('simply returns an empty array, the concrete driver can provide the custom features by overwrite it', function () {
            expect(driver.getCustomFeatures()).toEqual([]);
        });
    });
    describe('.getFeatures()', function () {
        it('merges and returns the new array with order shared features > custom features > RecordManager', function () {
            const getSharedFeaturesStub = Sinon.stub(driver, 'getSharedFeatures');
            getSharedFeaturesStub.returns(['shared']);
            const getCustomFeatureStub = Sinon.stub(driver, 'getCustomFeatures');
            getCustomFeatureStub.returns(['custom']);
            expect(driver.getFeatures()).toEqual(['shared', 'custom', driver.getRecordManager()]);
            expect(getSharedFeaturesStub.called).toBe(true);
            expect(getCustomFeatureStub.called).toBe(true);
            getSharedFeaturesStub.restore();
            getCustomFeatureStub.restore();
        });
    });
    describe('.attachFeatureIfNeeded()', function () {
        const featureOne = {
            getFeatureName() {
                return 'one';
            },
            attachPublicApi() { }
        };
        const featureTwo = {
            getFeatureName() {
                return 'two';
            },
            attachPublicApi() { }
        };
        it('initialize the sharedMetadata/sharedMetadata.features if needed', function () {
            const prototype = {};
            driver.definePropertiesBeforeAttachFeatures({}, prototype, []);
            driver.attachFeatureIfNeeded(featureOne, prototype, []);
            expect(prototype['sharedMetadata']['features']).toEqual({ one: true });
            driver.attachFeatureIfNeeded(featureTwo, prototype, []);
            expect(prototype['sharedMetadata']['features']).toEqual({ one: true, two: true });
        });
        it('never call IFeature.attachPublicApi() if it already attached', function () {
            const attachPublicApiSpy = Sinon.spy(featureOne, 'attachPublicApi');
            const prototype = {};
            const bases = [];
            driver.definePropertiesBeforeAttachFeatures({}, prototype, bases);
            driver.attachFeatureIfNeeded(featureOne, prototype, bases);
            driver.attachFeatureIfNeeded(featureOne, prototype, bases);
            driver.attachFeatureIfNeeded(featureOne, prototype, bases);
            expect(attachPublicApiSpy.calledOnce).toBe(true);
            attachPublicApiSpy.restore();
        });
    });
});
