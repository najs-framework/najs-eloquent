"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const SettingFeature_1 = require("../../lib/features/SettingFeature");
const ClassSetting_1 = require("../../lib/util/ClassSetting");
describe('SettingFeature', function () {
    const settingFeature = new SettingFeature_1.SettingFeature();
    it('implements Najs.Contracts.Autoload under name NajsEloquent.Feature.SettingFeature', function () {
        expect(settingFeature.getClassName()).toEqual('NajsEloquent.Feature.SettingFeature');
    });
    describe('.attachPublicApi()', function () {
        it('does nothing', function () {
            settingFeature.attachPublicApi({}, [{}], {});
        });
    });
    describe('.getFeatureName()', function () {
        it('returns literally string "Setting"', function () {
            expect(settingFeature.getFeatureName()).toEqual('Setting');
        });
    });
    describe('.getClassSetting()', function () {
        it('creates the instance via ClassSetting.of() if not found, otherwise it returns property "internalData"."classSettings"', function () {
            class ModelForGetClassSetting {
                constructor() {
                    this.internalData = {};
                }
                getClassName() {
                    return 'ModelForGetClassSetting';
                }
            }
            najs_binding_1.register(ModelForGetClassSetting);
            const model = new ModelForGetClassSetting();
            expect(model['internalData']['classSettings']).toBeUndefined();
            settingFeature.getClassSetting(model);
            expect(model['internalData']['classSettings']).toBeInstanceOf(ClassSetting_1.ClassSetting);
        });
    });
    describe('.getSettingProperty()', function () {
        it('returns the static version before checking sample version. If not found will return default value', function () {
            class ModelForGetSettingProperty {
                constructor() {
                    this.internalData = {};
                    this.sample = 'sample';
                    this.both = 'sample-both';
                }
                getClassName() {
                    return 'ModelForGetSettingProperty';
                }
            }
            ModelForGetSettingProperty.property = 'test';
            ModelForGetSettingProperty.both = 'static-both';
            najs_binding_1.register(ModelForGetSettingProperty);
            const model = new ModelForGetSettingProperty();
            expect(settingFeature.getSettingProperty(model, 'property', 'default')).toEqual('test');
            expect(settingFeature.getSettingProperty(model, 'sample', 'default')).toEqual('sample');
            expect(settingFeature.getSettingProperty(model, 'both', 'default')).toEqual('static-both');
            expect(settingFeature.getSettingProperty(model, 'any', 'default')).toEqual('default');
        });
    });
    describe('.hasSetting()', function () {
        it('returns true if the property is exists and not have falsy values', function () {
            class ModelForHasSetting {
                constructor() {
                    this.internalData = {};
                    this.a = false;
                    this.b = '';
                    this.c = 0;
                    this.d = {};
                    this.e = [];
                }
                getClassName() {
                    return 'ModelForHasSetting';
                }
            }
            najs_binding_1.register(ModelForHasSetting);
            const model = new ModelForHasSetting();
            expect(settingFeature.hasSetting(model, 'a')).toBe(false);
            expect(settingFeature.hasSetting(model, 'b')).toBe(false);
            expect(settingFeature.hasSetting(model, 'c')).toBe(false);
            expect(settingFeature.hasSetting(model, 'd')).toBe(true);
            expect(settingFeature.hasSetting(model, 'e')).toBe(true);
            expect(settingFeature.hasSetting(model, 'f')).toBe(false);
        });
    });
    describe('.getSettingWithDefaultForTrueValue()', function () {
        it('has the same functionality of .getSettingProperty(), just returns the default value if setting === true', function () {
            class ModelForGetSettingWithDefaultForTrueValue {
                constructor() {
                    this.internalData = {};
                    this.a = false;
                    this.b = '';
                    this.c = 0;
                    this.d = {};
                    this.e = [];
                    this.f = true;
                }
                getClassName() {
                    return 'ModelForGetSettingWithDefaultForTrueValue';
                }
            }
            najs_binding_1.register(ModelForGetSettingWithDefaultForTrueValue);
            const model = new ModelForGetSettingWithDefaultForTrueValue();
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'a', 'default')).toEqual(false);
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'b', 'default')).toEqual('');
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'c', 'default')).toEqual(0);
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'd', 'default')).toEqual({});
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'e', 'default')).toEqual([]);
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'f', 'default')).toEqual('default');
            expect(settingFeature.getSettingWithDefaultForTrueValue(model, 'g', 'default')).toEqual('default');
        });
    });
    describe('.getArrayUniqueSetting()', function () {
        it('reads the settings in static/sample and instance version, then merge and unique them', function () {
            class ModelForGetArrayUniqueSetting {
                constructor() {
                    this.internalData = {};
                    this.a = ['a1', 'a2'];
                    this.b = ['b2'];
                }
                getClassName() {
                    return 'ModelForGetArrayUniqueSetting';
                }
            }
            ModelForGetArrayUniqueSetting.a = ['a1'];
            ModelForGetArrayUniqueSetting.b = ['b1'];
            najs_binding_1.register(ModelForGetArrayUniqueSetting);
            const model = new ModelForGetArrayUniqueSetting();
            model['b'] = ['b3', 'b4'];
            expect(settingFeature.getArrayUniqueSetting(model, 'a', ['test'])).toEqual(['a1', 'a2']);
            expect(settingFeature.getArrayUniqueSetting(model, 'b', ['test'])).toEqual(['b1', 'b2', 'b3', 'b4']);
            expect(settingFeature.getArrayUniqueSetting(model, 'not-found', ['test'])).toEqual(['test']);
        });
    });
    describe('.pushToUniqueArraySetting()', function () {
        it('simply pushes the items to an array defined in property and unique the array', function () {
            class ModelForPushToUniqueArraySetting {
                constructor() {
                    this.a = ['a1', 'a2'];
                }
                getClassName() {
                    return 'ModelForPushToUniqueArraySetting';
                }
            }
            ModelForPushToUniqueArraySetting.a = ['a1'];
            najs_binding_1.register(ModelForPushToUniqueArraySetting);
            const model = new ModelForPushToUniqueArraySetting();
            settingFeature.pushToUniqueArraySetting(model, 'a', ['a1', 'a3', ['a1', 'a4']]);
            expect(model.a).toEqual(['a1', 'a2', 'a3', 'a4']);
            settingFeature.pushToUniqueArraySetting(model, 'not-found', ['1', '2', '3', ['1', '4']]);
            expect(model['not-found']).toEqual(['1', '2', '3', '4']);
        });
    });
    describe('.isInWhiteList()', function () {
        it('flattens list and returns true if .isKeyInWhiteList() returns true for all keys', function () {
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return {
                                getKnownAttributes() {
                                    return ['known_a', 'known_b'];
                                }
                            };
                        }
                    };
                }
            };
            expect(settingFeature.isInWhiteList(model, ['a', 'b'], ['a', 'b', 'c'], ['*'])).toBe(true);
            expect(settingFeature.isInWhiteList(model, ['a', 'c'], ['a', 'b', 'c'], ['*'])).toBe(true);
            expect(settingFeature.isInWhiteList(model, ['a', 'c'], [], [])).toBe(true);
            expect(settingFeature.isInWhiteList(model, ['a', 'c'], [], ['a'])).toBe(false);
            expect(settingFeature.isInWhiteList(model, ['a', 'c'], [], ['c'])).toBe(false);
        });
    });
    describe('.isKeyInWhiteList()', function () {
        it('returns true if white list has length > 0 and contains key, despite the key also found in blacklist', function () {
            const model = {};
            expect(settingFeature.isKeyInWhiteList(model, 'a', ['a'], ['*'])).toBe(true);
            expect(settingFeature.isKeyInWhiteList(model, 'a', ['a'], ['a'])).toBe(true);
        });
        it('returns false if .isKeyInBlackList() returns true', function () {
            const model = {};
            expect(settingFeature.isKeyInWhiteList(model, 'a', [], ['*'])).toBe(false);
            expect(settingFeature.isKeyInWhiteList(model, 'a', [], ['a'])).toBe(false);
        });
        it('returns true if whitelist has length = 0, key not in knownAttribute and not start with _', function () {
            const model = {
                getDriver() {
                    return {
                        getRecordManager() {
                            return {
                                getKnownAttributes() {
                                    return ['known_a', 'known_b'];
                                }
                            };
                        }
                    };
                }
            };
            expect(settingFeature.isKeyInWhiteList(model, 'a', ['test'], [])).toBe(false);
            expect(settingFeature.isKeyInWhiteList(model, 'a', [], [])).toBe(true);
            expect(settingFeature.isKeyInWhiteList(model, 'known_a', [], [])).toBe(false);
            expect(settingFeature.isKeyInWhiteList(model, 'known_b', [], [])).toBe(false);
            expect(settingFeature.isKeyInWhiteList(model, '_a', [], [])).toBe(false);
        });
    });
    describe('.isInBlackList()', function () {
        it('always returns true if the blacklist = ["*"]', function () {
            const model = {};
            expect(settingFeature.isInBlackList(model, ['a', 'b'], ['*'])).toBe(true);
            expect(settingFeature.isInBlackList(model, [], ['*'])).toBe(true);
        });
        it('returns true if ALL keys is found in blacklist', function () {
            const model = {};
            expect(settingFeature.isInBlackList(model, ['a', 'b'], ['a'])).toBe(false);
            expect(settingFeature.isInBlackList(model, ['a', 'b'], ['b', 'a'])).toBe(true);
            expect(settingFeature.isInBlackList(model, ['a', ['b']], ['b', 'a', 'c'])).toBe(true);
            expect(settingFeature.isInBlackList(model, ['a', ['b', 'test']], ['b', 'a', 'c'])).toBe(false);
            expect(settingFeature.isInBlackList(model, ['a', 'b'], [])).toBe(false);
        });
    });
    describe('.isKeyInBlackList()', function () {
        it('returns true if the blackList = ["*"] or the key in blacklist', function () {
            const model = {};
            expect(settingFeature.isKeyInBlackList(model, 'a', ['*'])).toBe(true);
            expect(settingFeature.isKeyInBlackList(model, 'b', ['*'])).toBe(true);
            expect(settingFeature.isKeyInBlackList(model, 'test', ['*'])).toBe(true);
            expect(settingFeature.isKeyInBlackList(model, 'a', [])).toBe(false);
            expect(settingFeature.isKeyInBlackList(model, 'a', ['a', 'b'])).toBe(true);
            expect(settingFeature.isKeyInBlackList(model, 'b', ['a', 'b'])).toBe(true);
            expect(settingFeature.isKeyInBlackList(model, 'test', ['a', 'b'])).toBe(false);
        });
    });
});
