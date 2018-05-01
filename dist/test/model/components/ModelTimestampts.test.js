"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelTimestamps_1 = require("../../../lib/model/components/ModelTimestamps");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model/Fillable', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelTimestamps" as class name', function () {
                const timestamps = new ModelTimestamps_1.ModelTimestamps();
                expect(timestamps.getClassName()).toEqual('NajsEloquent.Model.Component.ModelTimestamps');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 8 functions', function () {
                const functions = ['touch', 'hasTimestamps', 'getTimestampsSetting'];
                const prototype = {};
                const timestamps = new ModelTimestamps_1.ModelTimestamps();
                timestamps.extend(prototype, [], {});
                for (const name of functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === ModelTimestamps_1.ModelTimestamps[name]).toBe(true);
                }
            });
        });
    });
    describe('Integration', function () {
        class NotUse extends Eloquent_1.Eloquent {
        }
        NotUse.className = 'NotUse';
        class StaticTrue extends Eloquent_1.Eloquent {
        }
        StaticTrue.className = 'StaticTrue';
        StaticTrue.timestamps = true;
        class MemberTrue extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.timestamps = true;
            }
        }
        MemberTrue.className = 'MemberTrue';
        class StaticFalse extends Eloquent_1.Eloquent {
        }
        StaticFalse.className = 'StaticFalse';
        StaticFalse.timestamps = false;
        class MemberFalse extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.timestamps = false;
            }
        }
        MemberFalse.className = 'MemberFalse';
        class StaticCustom extends Eloquent_1.Eloquent {
        }
        StaticCustom.className = 'StaticCustom';
        StaticCustom.timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' };
        class MemberCustom extends Eloquent_1.Eloquent {
        }
        MemberCustom.className = 'MemberCustom';
        MemberCustom.timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' };
        class Both extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' };
            }
        }
        Both.className = 'Both';
        Both.timestamps = true;
        describe('.hasTimestamps()', function () {
            it('determines timestamps settings is exist or not', function () {
                expect(new NotUse().hasTimestamps()).toEqual(false);
                expect(new StaticTrue().hasTimestamps()).toEqual(true);
                expect(new MemberTrue().hasTimestamps()).toEqual(true);
                expect(new StaticFalse().hasTimestamps()).toEqual(false);
                expect(new MemberFalse().hasTimestamps()).toEqual(false);
                expect(new StaticCustom().hasTimestamps()).toEqual(true);
                expect(new MemberCustom().hasTimestamps()).toEqual(true);
                expect(new Both().hasTimestamps()).toEqual(true);
            });
        });
        describe('.getTimestampsSetting()', function () {
            it('always returns DEFAULT_TIMESTAMPS despite the .hasTimestamps() returns false', function () {
                expect(new NotUse().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
                expect(new StaticTrue().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
                expect(new MemberTrue().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
                expect(new StaticFalse().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
                expect(new MemberFalse().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
                expect(new Both().getTimestampsSetting()).toEqual(ModelTimestamps_1.ModelTimestamps.DefaultSetting);
            });
            it('returns custom settings instead of default if defined', function () {
                expect(new StaticCustom().getTimestampsSetting()).toEqual({ createdAt: 'createdAt', updatedAt: 'updatedAt' });
                expect(new MemberCustom().getTimestampsSetting()).toEqual({ createdAt: 'createdAt', updatedAt: 'updatedAt' });
            });
        });
        describe('.touch()', function () {
            it('is chainable', function () {
                const enabled = new StaticTrue();
                expect(enabled.touch() === enabled).toBe(true);
                const disabled = new NotUse();
                expect(disabled.touch() === disabled).toBe(true);
            });
            it('calls .driver.markModified() if there .hasTimestamps() returns true', function () {
                const driver = {
                    markModified() { }
                };
                const markModifiedSpy = Sinon.spy(driver, 'markModified');
                const staticTrue = new StaticTrue();
                staticTrue['driver'] = driver;
                staticTrue.touch();
                expect(markModifiedSpy.calledWith('updated_at')).toBe(true);
                markModifiedSpy.resetHistory();
                const staticFalse = new StaticFalse();
                staticFalse['driver'] = driver;
                staticFalse.touch();
                expect(markModifiedSpy.calledWith('updated_at')).toBe(false);
                markModifiedSpy.resetHistory();
                const staticCustom = new StaticCustom();
                staticCustom['driver'] = driver;
                staticCustom.touch();
                expect(markModifiedSpy.calledWith('updatedAt')).toBe(true);
            });
        });
    });
});
