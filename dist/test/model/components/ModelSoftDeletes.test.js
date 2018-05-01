"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelSoftDeletes_1 = require("../../../lib/model/components/ModelSoftDeletes");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model/Fillable', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelSoftDeletes" as class name', function () {
                const softDeletes = new ModelSoftDeletes_1.ModelSoftDeletes();
                expect(softDeletes.getClassName()).toEqual('NajsEloquent.Model.Component.ModelSoftDeletes');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 8 functions', function () {
                const functions = ['hasSoftDeletes', 'getSoftDeletesSetting', 'trashed', 'forceDelete', 'restore'];
                const prototype = {};
                const softDeletes = new ModelSoftDeletes_1.ModelSoftDeletes();
                softDeletes.extend(prototype, [], {});
                for (const name of functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === ModelSoftDeletes_1.ModelSoftDeletes[name]).toBe(true);
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
        StaticTrue.softDeletes = true;
        class MemberTrue extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.softDeletes = true;
            }
        }
        MemberTrue.className = 'MemberTrue';
        class StaticFalse extends Eloquent_1.Eloquent {
        }
        StaticFalse.className = 'StaticFalse';
        StaticFalse.softDeletes = false;
        class MemberFalse extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.softDeletes = false;
            }
        }
        MemberFalse.className = 'MemberFalse';
        class StaticCustom extends Eloquent_1.Eloquent {
        }
        StaticCustom.className = 'StaticCustom';
        StaticCustom.softDeletes = { deletedAt: 'deletedAt', overrideMethods: true };
        class MemberCustom extends Eloquent_1.Eloquent {
        }
        MemberCustom.className = 'MemberCustom';
        MemberCustom.softDeletes = { deletedAt: 'deletedAt', overrideMethods: true };
        class Both extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.softDeletes = { deletedAt: 'deletedAt', overrideMethods: true };
            }
        }
        Both.className = 'Both';
        Both.softDeletes = true;
        describe('.hasSoftDeletes()', function () {
            it('determines softDeletes settings is exist or not', function () {
                expect(new NotUse().hasSoftDeletes()).toEqual(false);
                expect(new StaticTrue().hasSoftDeletes()).toEqual(true);
                expect(new MemberTrue().hasSoftDeletes()).toEqual(true);
                expect(new StaticFalse().hasSoftDeletes()).toEqual(false);
                expect(new MemberFalse().hasSoftDeletes()).toEqual(false);
                expect(new StaticCustom().hasSoftDeletes()).toEqual(true);
                expect(new MemberCustom().hasSoftDeletes()).toEqual(true);
                expect(new Both().hasSoftDeletes()).toEqual(true);
            });
        });
        describe('.getSoftDeletesSetting()', function () {
            it('always returns DEFAULT_TIMESTAMPS despite the .hasSoftDeletes() returns false', function () {
                expect(new NotUse().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
                expect(new StaticTrue().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
                expect(new MemberTrue().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
                expect(new StaticFalse().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
                expect(new MemberFalse().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
                expect(new Both().getSoftDeletesSetting()).toEqual(ModelSoftDeletes_1.ModelSoftDeletes.DefaultSetting);
            });
            it('returns custom settings instead of default if defined', function () {
                expect(new StaticCustom().getSoftDeletesSetting()).toEqual({ deletedAt: 'deletedAt', overrideMethods: true });
                expect(new MemberCustom().getSoftDeletesSetting()).toEqual({ deletedAt: 'deletedAt', overrideMethods: true });
            });
        });
        describe('.trashed()', function () {
            it('always returns false if the model has no soft-deleted setting, otherwise it calls driver.isSoftDeleted()', function () {
                expect(new NotUse().trashed()).toEqual(false);
                expect(new StaticFalse().trashed()).toEqual(false);
                expect(new MemberFalse().trashed()).toEqual(false);
                const driver = {
                    isSoftDeleted() {
                        return 'anything';
                    }
                };
                const staticTrue = new StaticTrue();
                staticTrue['driver'] = driver;
                expect(staticTrue.trashed()).toEqual('anything');
            });
        });
        describe('.forceDelete()', function () {
            it('simply calls driver.delete() with option = false', async function () {
                const driver = {
                    async delete() {
                        return false;
                    }
                };
                const deleteSpy = Sinon.spy(driver, 'delete');
                const staticFalse = new StaticTrue();
                staticFalse['driver'] = driver;
                expect(await staticFalse.forceDelete()).toEqual(false);
                expect(deleteSpy.calledWith(false)).toBe(true);
                deleteSpy.resetHistory();
                const staticTrue = new StaticTrue();
                staticTrue['driver'] = driver;
                expect(await staticTrue.forceDelete()).toEqual(false);
                expect(deleteSpy.calledWith(false)).toBe(true);
            });
        });
        describe('.restore()', function () {
            it('simply calls driver.restore()', async function () {
                const driver = {
                    async restore() {
                        return false;
                    }
                };
                const restoreSpy = Sinon.spy(driver, 'restore');
                const staticFalse = new StaticTrue();
                staticFalse['driver'] = driver;
                expect(await staticFalse.restore()).toEqual(false);
                expect(restoreSpy.calledWith()).toBe(true);
                restoreSpy.resetHistory();
                const staticTrue = new StaticTrue();
                staticTrue['driver'] = driver;
                expect(await staticTrue.restore()).toEqual(false);
                expect(restoreSpy.calledWith()).toBe(true);
            });
        });
    });
});
