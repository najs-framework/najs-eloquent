"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const FeatureBase_1 = require("../../lib/features/FeatureBase");
const FillableFeature_1 = require("../../lib/features/FillableFeature");
const FillablePublicApi_1 = require("../../lib/features/mixin/FillablePublicApi");
const SettingFeature_1 = require("../../lib/features/SettingFeature");
describe('FillableFeature', function () {
    const fillableFeature = new FillableFeature_1.FillableFeature();
    it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.FillableFeature', function () {
        expect(fillableFeature).toBeInstanceOf(FeatureBase_1.FeatureBase);
        expect(fillableFeature.getClassName()).toEqual('NajsEloquent.Feature.FillableFeature');
    });
    describe('.attachPublicApi()', function () {
        it('simply assigns all functions in FillablePublicApi to the prototype', function () {
            const prototype = {};
            fillableFeature.attachPublicApi(prototype, [{}], {});
            for (const name in FillablePublicApi_1.FillablePublicApi) {
                expect(prototype[name] === FillablePublicApi_1.FillablePublicApi[name]).toBe(true);
            }
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Fillable"', function () {
            expect(fillableFeature.getFeatureName()).toEqual('Fillable');
        });
    });
    describe('.getFillable()', function () {
        it('returns "fillable" property if the overridden.fillable flag is true', function () {
            const model = {
                fillable: 'overridden-value',
                internalData: { overridden: { fillable: true } }
            };
            expect(fillableFeature.getFillable(model)).toEqual('overridden-value');
        });
        it('calls and returns SettingFeature.getArrayUniqueSetting() with property "fillable", default value []', function () {
            const settingFeature = {
                getArrayUniqueSetting() {
                    return 'result';
                }
            };
            const model = {
                internalData: {},
                getDriver() {
                    return {
                        getSettingFeature() {
                            return settingFeature;
                        }
                    };
                }
            };
            const stub = Sinon.stub(settingFeature, 'getArrayUniqueSetting');
            stub.returns('anything');
            expect(fillableFeature.getFillable(model)).toEqual('anything');
            expect(stub.calledWith(model, 'fillable', [])).toBe(true);
        });
    });
    describe('.setFillable()', function () {
        it('simply init internalData.overridden if needed, then fillable = true and assigns given value to "fillable"', function () {
            const modelOne = {
                internalData: {}
            };
            const value = ['a', 'b', 'c'];
            fillableFeature.setFillable(modelOne, value);
            expect(modelOne['internalData']['overridden']['fillable']).toBe(true);
            expect(modelOne['fillable'] === value).toBe(true);
            const modelTwo = {
                internalData: {
                    overridden: { fillable: false }
                }
            };
            fillableFeature.setFillable(modelTwo, value);
            expect(modelTwo['internalData']['overridden']['fillable']).toBe(true);
            expect(modelTwo['fillable'] === value).toBe(true);
        });
    });
    describe('.getGuarded()', function () {
        it('returns "guarded" property if the overridden.guarded flag is true', function () {
            const model = {
                guarded: 'overridden-value',
                internalData: { overridden: { guarded: true } }
            };
            expect(fillableFeature.getGuarded(model)).toEqual('overridden-value');
        });
        it('calls and returns SettingFeature.getArrayUniqueSetting() with property "guarded", default value ["*"]', function () {
            const settingFeature = {
                getArrayUniqueSetting() {
                    return 'result';
                }
            };
            const model = {
                internalData: {},
                getDriver() {
                    return {
                        getSettingFeature() {
                            return settingFeature;
                        }
                    };
                }
            };
            const stub = Sinon.stub(settingFeature, 'getArrayUniqueSetting');
            stub.returns('anything');
            expect(fillableFeature.getGuarded(model)).toEqual('anything');
            expect(stub.calledWith(model, 'guarded', ['*'])).toBe(true);
        });
    });
    describe('.setGuarded()', function () {
        it('simply init internalData.overridden if needed, then guarded = true and assigns given value to "guarded"', function () {
            const modelOne = {
                internalData: {}
            };
            const value = ['a', 'b', 'c'];
            fillableFeature.setGuarded(modelOne, value);
            expect(modelOne['internalData']['overridden']['guarded']).toBe(true);
            expect(modelOne['guarded'] === value).toBe(true);
            const modelTwo = {
                internalData: {
                    overridden: { guarded: false }
                }
            };
            fillableFeature.setGuarded(modelTwo, value);
            expect(modelTwo['internalData']['overridden']['guarded']).toBe(true);
            expect(modelTwo['guarded'] === value).toBe(true);
        });
    });
    describe('.addFillable()', function () {
        it('calls and returns SettingFeature.pushToUniqueArraySetting() with property "fillable" and passed param', function () {
            const settingFeature = {
                pushToUniqueArraySetting() {
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
            const stub = Sinon.stub(settingFeature, 'pushToUniqueArraySetting');
            stub.returns('anything');
            const keys = ['a', ['b', 'c']];
            expect(fillableFeature.addFillable(model, keys)).toEqual('anything');
            expect(stub.calledWith(model, 'fillable', keys)).toBe(true);
        });
    });
    describe('.addGuarded()', function () {
        it('calls and returns SettingFeature.pushToUniqueArraySetting() with property "guarded" and passed param', function () {
            const settingFeature = {
                pushToUniqueArraySetting() {
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
            const stub = Sinon.stub(settingFeature, 'pushToUniqueArraySetting');
            stub.returns('anything');
            const keys = ['a', ['b', 'c']];
            expect(fillableFeature.addGuarded(model, keys)).toEqual('anything');
            expect(stub.calledWith(model, 'guarded', keys)).toBe(true);
        });
    });
    describe('.isFillable()', function () {
        it('calls and returns SettingFeature.isInWhiteList() with params from .getFillable() and .getGuarded()', function () {
            const settingFeature = {
                isInWhiteList() {
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
            const getFillableResult = {};
            const getFillableStub = Sinon.stub(fillableFeature, 'getFillable');
            getFillableStub.returns(getFillableResult);
            const getGuardedResult = {};
            const getGuardedStub = Sinon.stub(fillableFeature, 'getGuarded');
            getGuardedStub.returns(getGuardedResult);
            const stub = Sinon.stub(settingFeature, 'isInWhiteList');
            stub.returns('anything');
            const keys = ['a', ['b', 'c']];
            expect(fillableFeature.isFillable(model, keys)).toEqual('anything');
            expect(getFillableStub.calledWith(model)).toBe(true);
            expect(getGuardedStub.calledWith(model)).toBe(true);
            expect(stub.calledWith(model, keys, getFillableResult, getGuardedResult)).toBe(true);
            getFillableStub.restore();
            getGuardedStub.restore();
        });
    });
    describe('.isGuarded()', function () {
        it('calls and returns SettingFeature.isInBlackList() with params from and .getGuarded()', function () {
            const settingFeature = {
                isInBlackList() {
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
            const getGuardedResult = {};
            const getGuardedStub = Sinon.stub(fillableFeature, 'getGuarded');
            getGuardedStub.returns(getGuardedResult);
            const stub = Sinon.stub(settingFeature, 'isInBlackList');
            stub.returns('anything');
            const keys = ['a', ['b', 'c']];
            expect(fillableFeature.isGuarded(model, keys)).toEqual('anything');
            expect(getGuardedStub.calledWith(model)).toBe(true);
            expect(stub.calledWith(model, keys, getGuardedResult)).toBe(true);
            getGuardedStub.restore();
        });
    });
    describe('.fill()', function () {
        it('loops all keys of data and use RecordManager.setAttribute() to fill if SettingFeature.isKeyInWhiteList() returns true', function () {
            const recordManager = {
                setAttribute() { }
            };
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return recordManager;
                        },
                        getSettingFeature() {
                            return new SettingFeature_1.SettingFeature();
                        }
                    };
                }
            };
            const getFillableResult = ['a', 'c'];
            const getFillableStub = Sinon.stub(fillableFeature, 'getFillable');
            getFillableStub.returns(getFillableResult);
            const getGuardedResult = ['b'];
            const getGuardedStub = Sinon.stub(fillableFeature, 'getGuarded');
            getGuardedStub.returns(getGuardedResult);
            const stub = Sinon.stub(recordManager, 'setAttribute');
            stub.returns('anything');
            const data = { a: 1, b: 2, c: 3, d: 4 };
            expect(fillableFeature.fill(model, data)).toBeUndefined();
            expect(stub.calledTwice).toBe(true);
            expect(stub.firstCall.calledWith(model, 'a', 1)).toBe(true);
            expect(stub.secondCall.calledWith(model, 'c', 3)).toBe(true);
            getFillableStub.restore();
            getGuardedStub.restore();
        });
        it('does not remove keys if fillable is empty', function () {
            const recordManager = {
                setAttribute() { },
                getKnownAttributes() {
                    return [];
                }
            };
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return recordManager;
                        },
                        getSettingFeature() {
                            return new SettingFeature_1.SettingFeature();
                        }
                    };
                }
            };
            const getFillableResult = [];
            const getFillableStub = Sinon.stub(fillableFeature, 'getFillable');
            getFillableStub.returns(getFillableResult);
            const getGuardedResult = ['b'];
            const getGuardedStub = Sinon.stub(fillableFeature, 'getGuarded');
            getGuardedStub.returns(getGuardedResult);
            const stub = Sinon.stub(recordManager, 'setAttribute');
            stub.returns('anything');
            const data = { a: 1, b: 2, c: 3, d: 4 };
            expect(fillableFeature.fill(model, data)).toBeUndefined();
            expect(stub.calledThrice).toBe(true);
            expect(stub.firstCall.calledWith(model, 'a', 1)).toBe(true);
            expect(stub.secondCall.calledWith(model, 'c', 3)).toBe(true);
            expect(stub.thirdCall.calledWith(model, 'd', 4)).toBe(true);
            getFillableStub.restore();
            getGuardedStub.restore();
        });
    });
    describe('.forceFill()', function () {
        it('simply loops all keys of data and use RecordManager.setAttribute() to fill data', function () {
            const data = { a: 1, b: 2 };
            const recordManager = {
                setAttribute() { }
            };
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return recordManager;
                        }
                    };
                }
            };
            const stub = Sinon.stub(recordManager, 'setAttribute');
            stub.returns('anything');
            expect(fillableFeature.forceFill(model, data)).toBeUndefined();
            expect(stub.calledTwice).toBe(true);
            expect(stub.firstCall.calledWith(model, 'a', 1)).toBe(true);
            expect(stub.secondCall.calledWith(model, 'b', 2)).toBe(true);
        });
    });
});
