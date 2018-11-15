"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const Model_1 = require("../../../lib/model/Model");
const MemoryDriver_1 = require("../../../lib/drivers/memory/MemoryDriver");
const DriverProviderFacade_1 = require("../../../lib/facades/global/DriverProviderFacade");
DriverProviderFacade_1.DriverProvider.register(MemoryDriver_1.MemoryDriver, 'memory', true);
describe('Model Fillable Feature', function () {
    describe('No Setting', function () {
        class ModelFillableNoSetting extends Model_1.Model {
            getClassName() {
                return 'ModelFillableNoSetting';
            }
        }
        najs_binding_1.register(ModelFillableNoSetting);
        it('does not allow to .fill() any data because default guarded = ["*"]', function () {
            const model = new ModelFillableNoSetting();
            model.fill({
                a: 1,
                b: 2,
                _test: 3
            });
            expect(model.toObject()).toEqual({});
        });
        it('could add config fillable programmatically via .addFillable()', function () {
            const model = new ModelFillableNoSetting();
            model.addFillable('a', ['b', 'c']).fill({
                a: 1,
                b: 2,
                _test: 3
            });
            expect(model.getFillable()).toEqual(['a', 'b', 'c']);
            expect(model.toObject()).toEqual({ a: 1, b: 2 });
        });
        it('could add config guarded programmatically via .addGuarded()', function () {
            const model = new ModelFillableNoSetting();
            model.addGuarded('a', ['c']).fill({
                a: 1,
                b: 2,
                _test: 3
            });
            expect(model.getGuarded()).toEqual(['a', 'c']);
            expect(model.toObject()).toEqual({ b: 2 });
        });
    });
    describe('Static Setting', function () {
        class ModelStaticSetting extends Model_1.Model {
            getClassName() {
                return 'ModelStaticSetting';
            }
        }
        ModelStaticSetting.fillable = ['a'];
        Model_1.Model.register(ModelStaticSetting);
        it('should work with static fillable', function () {
            const model = new ModelStaticSetting();
            expect(model.getFillable()).toEqual(['a']);
        });
        it('can be extended programmatically via .addFillable()', function () {
            const model = new ModelStaticSetting();
            model.addFillable('b');
            expect(model.getFillable()).toEqual(['a', 'b']);
        });
        it('can be reset programmatically via .setFillable()', function () {
            const model = new ModelStaticSetting();
            model.setFillable(['replaced']);
            expect(model.getFillable()).toEqual(['replaced']);
        });
    });
});
