"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
const EventFeature_1 = require("../../lib/features/EventFeature");
const EventPublicApi_1 = require("../../lib/features/mixin/EventPublicApi");
describe('EventFeature', function () {
    const eventFeature = new EventFeature_1.EventFeature();
    it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.EventFeature', function () {
        expect(eventFeature).toBeInstanceOf(FeatureBase_1.FeatureBase);
        expect(eventFeature.getClassName()).toEqual('NajsEloquent.Feature.EventFeature');
    });
    describe('.attachPublicApi()', function () {
        it('simply assigns all functions in EventPublicApi to the prototype', function () {
            const prototype = {};
            eventFeature.attachPublicApi(prototype, [{}], {});
            for (const name in EventPublicApi_1.EventPublicApi) {
                expect(prototype[name] === EventPublicApi_1.EventPublicApi[name]).toBe(true);
            }
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Event"', function () {
            expect(eventFeature.getFeatureName()).toEqual('Event');
        });
    });
    describe('.fire()', function () {
        it('calls .getEventEmitter().emit() and wait for it finished, then calls and return globalEventEmitter', async function () {
            const eventEmitter = {
                emit() {
                    return new Promise(function (resolve) {
                        resolve('local');
                    });
                }
            };
            const globalEventEmitter = {
                emit() {
                    return new Promise(function (resolve) {
                        resolve('global');
                    });
                }
            };
            const localEmitSpy = Sinon.spy(eventEmitter, 'emit');
            const globalEmitSpy = Sinon.spy(globalEventEmitter, 'emit');
            const getEventEmitterStub = Sinon.stub(eventFeature, 'getEventEmitter');
            getEventEmitterStub.returns(eventEmitter);
            const getGlobalEventEmitterStub = Sinon.stub(eventFeature, 'getGlobalEventEmitter');
            getGlobalEventEmitterStub.returns(globalEventEmitter);
            const model = {};
            expect(await eventFeature.fire(model, 'test', 'args')).toEqual('global');
            expect(getEventEmitterStub.calledWith(model)).toBe(true);
            expect(getGlobalEventEmitterStub.calledWith(model)).toBe(true);
            expect(localEmitSpy.calledWith('test', 'args')).toBe(true);
            expect(globalEmitSpy.calledWith('test', model, 'args')).toBe(true);
            getEventEmitterStub.restore();
            getGlobalEventEmitterStub.restore();
        });
    });
    describe('.getEventEmitter()', function () {
        it('initialize property model.eventEmitter if not exists then returns it', function () {
            const model = {
                internalData: {}
            };
            const eventEmitter = eventFeature.getEventEmitter(model);
            expect(eventEmitter === model.internalData['eventEmitter']).toBe(true);
            expect(eventEmitter === eventFeature.getEventEmitter(model)).toBe(true);
        });
    });
    describe('.getGlobalEventEmitter()', function () {
        it('simply calls and returns driver.getGlobalEventEmitter()', function () {
            const globalEventEmitter = {};
            const model = {
                getDriver() {
                    return {
                        getGlobalEventEmitter() {
                            return globalEventEmitter;
                        }
                    };
                }
            };
            expect(eventFeature.getGlobalEventEmitter(model) === globalEventEmitter).toBe(true);
        });
    });
});
