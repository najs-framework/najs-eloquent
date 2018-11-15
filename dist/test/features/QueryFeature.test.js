"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
const QueryFeature_1 = require("../../lib/features/QueryFeature");
describe('QueryFeature', function () {
    const factory = {
        make() { }
    };
    const queryFeature = new QueryFeature_1.QueryFeature(factory);
    it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.QueryFeature', function () {
        expect(queryFeature).toBeInstanceOf(FeatureBase_1.FeatureBase);
        expect(queryFeature.getClassName()).toEqual('NajsEloquent.Feature.QueryFeature');
    });
    describe('.getPublicApi()', function () {
        it('returns undefined', function () {
            expect(queryFeature.getPublicApi()).toBeUndefined();
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Query"', function () {
            expect(queryFeature.getFeatureName()).toEqual('Query');
        });
    });
    describe('.newQuery()', function () {
        it('calls factory.make() then returns an instance if there is no setting property "executeMode"', function () {
            const settingFeature = {
                getSettingProperty() {
                    return 'default';
                }
            };
            const useSettingFeatureOfStub = Sinon.stub(queryFeature, 'useSettingFeatureOf');
            useSettingFeatureOfStub.returns(settingFeature);
            const makeStub = Sinon.stub(factory, 'make');
            makeStub.returns('anything');
            const spy = Sinon.spy(settingFeature, 'getSettingProperty');
            const model = {};
            expect(queryFeature.newQuery(model)).toEqual('anything');
            expect(spy.calledWith(model, 'executeMode', 'default')).toBe(true);
            useSettingFeatureOfStub.restore();
            makeStub.restore();
        });
        it('calls factory.make() then passes "executeMode" to .setExecuteMode() if the setting property exists', function () {
            const settingFeature = {
                getSettingProperty() {
                    return 'disabled';
                }
            };
            const useSettingFeatureOfStub = Sinon.stub(queryFeature, 'useSettingFeatureOf');
            useSettingFeatureOfStub.returns(settingFeature);
            const queryExecutor = {
                setExecuteMode() { }
            };
            const query = {
                handler: {
                    getQueryExecutor() {
                        return queryExecutor;
                    }
                }
            };
            const makeStub = Sinon.stub(factory, 'make');
            makeStub.returns(query);
            const spy = Sinon.spy(queryExecutor, 'setExecuteMode');
            const model = {};
            expect(queryFeature.newQuery(model) === query).toBe(true);
            expect(spy.calledWith('disabled')).toBe(true);
            useSettingFeatureOfStub.restore();
            makeStub.restore();
        });
    });
});
