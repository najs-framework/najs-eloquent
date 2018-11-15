"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
const TimestampsFeature_1 = require("../../lib/features/TimestampsFeature");
const TimestampsPublicApi_1 = require("../../lib/features/mixin/TimestampsPublicApi");
describe('TimestampsFeature', function () {
    const timestampFeature = new TimestampsFeature_1.TimestampsFeature();
    it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.TimestampsFeature', function () {
        expect(timestampFeature).toBeInstanceOf(FeatureBase_1.FeatureBase);
        expect(timestampFeature.getClassName()).toEqual('NajsEloquent.Feature.TimestampsFeature');
    });
    describe('.attachPublicApi()', function () {
        it('simply assigns all functions in FillablePublicApi to the prototype', function () {
            const prototype = {};
            timestampFeature.attachPublicApi(prototype, [{}], {});
            for (const name in TimestampsPublicApi_1.TimestampsPublicApi) {
                expect(prototype[name] === TimestampsPublicApi_1.TimestampsPublicApi[name]).toBe(true);
            }
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Timestamps"', function () {
            expect(timestampFeature.getFeatureName()).toEqual('Timestamps');
        });
    });
    describe('.hasTimestamps()', function () {
        it('calls and returns SettingFeature.hasSetting() with property "timestamps"', function () {
            const settingFeature = {
                hasSetting() {
                    return 'result';
                }
            };
            const model = {
                getDriver() {
                    return {
                        getSettingFeature() {
                            return settingFeature;
                        }
                    };
                }
            };
            const stub = Sinon.stub(settingFeature, 'hasSetting');
            stub.returns('anything');
            expect(timestampFeature.hasTimestamps(model)).toEqual('anything');
            expect(stub.calledWith(model, 'timestamps')).toBe(true);
        });
    });
    describe('.getTimestampsSetting()', function () {
        it('calls and returns SettingFeature.getSettingWithDefaultForTrueValue() with property "timestamps", default = TimestampsFeature.DefaultSetting', function () {
            const settingFeature = {
                getSettingWithDefaultForTrueValue() {
                    return 'result';
                }
            };
            const model = {
                getDriver() {
                    return {
                        getSettingFeature() {
                            return settingFeature;
                        }
                    };
                }
            };
            const stub = Sinon.stub(settingFeature, 'getSettingWithDefaultForTrueValue');
            stub.returns('anything');
            expect(timestampFeature.getTimestampsSetting(model)).toEqual('anything');
            expect(stub.calledWith(model, 'timestamps', TimestampsFeature_1.TimestampsFeature.DefaultSetting)).toBe(true);
        });
    });
    describe('.touch()', function () {
        it('does nothing if .hasTimestamps() return false', function () {
            const hasTimestampsStub = Sinon.stub(timestampFeature, 'hasTimestamps');
            const getTimestampsSettingStub = Sinon.stub(timestampFeature, 'getTimestampsSetting');
            const model = {
                markModified() { }
            };
            const spy = Sinon.spy(model, 'markModified');
            hasTimestampsStub.returns(false);
            timestampFeature.touch(model);
            expect(getTimestampsSettingStub.called).toBe(false);
            expect(spy.called).toBe(false);
            hasTimestampsStub.restore();
            getTimestampsSettingStub.restore();
        });
        it('calls model.markModified() with updatedAt from .getTimestampsSetting() if .hasTimestamps() return true', function () {
            const hasTimestampsStub = Sinon.stub(timestampFeature, 'hasTimestamps');
            const getTimestampsSettingStub = Sinon.stub(timestampFeature, 'getTimestampsSetting');
            const model = {
                markModified() { }
            };
            const spy = Sinon.spy(model, 'markModified');
            hasTimestampsStub.returns(true);
            getTimestampsSettingStub.returns({ updatedAt: 'update field name' });
            timestampFeature.touch(model);
            expect(getTimestampsSettingStub.called).toBe(true);
            expect(spy.calledWith('update field name')).toBe(true);
            hasTimestampsStub.restore();
            getTimestampsSettingStub.restore();
        });
    });
});
