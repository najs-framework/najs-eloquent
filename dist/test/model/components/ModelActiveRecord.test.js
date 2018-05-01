"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelActiveRecord_1 = require("../../../lib/model/components/ModelActiveRecord");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model/Fillable', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelActiveRecord" as class name', function () {
                const activeRecord = new ModelActiveRecord_1.ModelActiveRecord();
                expect(activeRecord.getClassName()).toEqual('NajsEloquent.Model.Component.ModelActiveRecord');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 8 functions', function () {
                const functions = ['isNew', 'delete', 'save', 'fresh'];
                const prototype = {};
                const activeRecord = new ModelActiveRecord_1.ModelActiveRecord();
                activeRecord.extend(prototype, [], {});
                for (const name of functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === ModelActiveRecord_1.ModelActiveRecord[name]).toBe(true);
                }
            });
        });
    });
    describe('Integration', function () {
        class Model extends Eloquent_1.Eloquent {
        }
        Model.className = 'Model';
        describe('.isNew()', function () {
            it('simply calls driver.isNew()', function () {
                const driver = {
                    isNew() {
                        return 'anything';
                    }
                };
                const model = new Model();
                model['driver'] = driver;
                expect(model.isNew()).toEqual('anything');
            });
        });
        describe('.delete()', function () {
            it('simply calls driver.delete() with param from this.hasSoftDeletes()', async function () {
                const driver = {
                    async delete() {
                        return 'anything';
                    }
                };
                const deleteSpy = Sinon.spy(driver, 'delete');
                const model = new Model();
                const hasSoftDeletesStub = Sinon.stub(model, 'hasSoftDeletes');
                hasSoftDeletesStub.returns('value');
                model['driver'] = driver;
                expect(await model.delete()).toEqual('anything');
                expect(deleteSpy.calledWith('value')).toBe(true);
            });
        });
        describe('.save()', function () {
            it('simply calls driver.save() and returns a Promise which contains this', async function () {
                const driver = {
                    async save() {
                        return 'anything';
                    }
                };
                const saveSpy = Sinon.spy(driver, 'save');
                const model = new Model();
                model['driver'] = driver;
                expect((await model.save()) === model).toBe(true);
                expect(saveSpy.called).toBe(true);
            });
        });
        describe('.fresh()', function () {
            it('always returns null if the this.isNew() returns true', async function () {
                const model = new Model();
                const isNew = Sinon.stub(model, 'isNew');
                isNew.returns(true);
                const findByIdStub = Sinon.stub(model, 'findById');
                findByIdStub.callsFake(async function () {
                    return 'anything';
                });
                expect(await model.fresh()).toBeNull();
                expect(findByIdStub.called).toBe(false);
            });
            it('returns result of .findById() if the this.isNew() returns false', async function () {
                const model = new Model();
                const isNew = Sinon.stub(model, 'isNew');
                isNew.returns(false);
                const getPrimaryKeyStub = Sinon.stub(model, 'getPrimaryKey');
                getPrimaryKeyStub.returns('primary-key');
                const findByIdStub = Sinon.stub(model, 'findById');
                findByIdStub.callsFake(async function () {
                    return 'anything';
                });
                expect(await model.fresh()).toEqual('anything');
                expect(findByIdStub.calledWith('primary-key')).toBe(true);
            });
        });
    });
});
