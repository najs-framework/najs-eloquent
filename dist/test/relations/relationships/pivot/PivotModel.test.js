"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const Model_1 = require("../../../../lib/model/Model");
const PivotModel_1 = require("../../../../lib/relations/relationships/pivot/PivotModel");
const DriverProviderFacade_1 = require("../../../../lib/facades/global/DriverProviderFacade");
const MemoryDriver_1 = require("../../../../lib/drivers/memory/MemoryDriver");
const najs_binding_1 = require("najs-binding");
DriverProviderFacade_1.DriverProviderFacade.register(MemoryDriver_1.MemoryDriver, 'memory', true);
describe('PivotModel', function () {
    describe('static .createPivotClass()', function () {
        it('creates an ModelClass which is extends from PivotModel', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const classDefinition = PivotModel_1.PivotModel.createPivotClass('test', { name: 'test', foreignKeys: ['a', 'b'] });
            expect(typeof classDefinition).toBe('function');
            const instance = Reflect.construct(classDefinition, []);
            expect(instance).toBeInstanceOf(classDefinition);
            expect(instance).toBeInstanceOf(PivotModel_1.PivotModel);
            expect(instance).toBeInstanceOf(Model_1.Model);
            expect(instance
                .getDriver()
                .getSettingFeature()
                .getSettingProperty(instance, 'options', {})).toEqual({
                name: 'test',
                foreignKeys: ['a', 'b']
            });
            expect(najs_binding_1.ClassRegistry.has('NajsEloquent.Pivot.test')).toBe(true);
            expect(najs_binding_1.ClassRegistry.findOrFail('NajsEloquent.Pivot.test').instanceConstructor === classDefinition).toBe(true);
            expect(registerSpy.calledWith(classDefinition, 'NajsEloquent.Pivot.test')).toBe(true);
            registerSpy.restore();
        });
        it('never recreates if the class already created', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const classDefinition = PivotModel_1.PivotModel.createPivotClass('test', { name: 'test', foreignKeys: ['a', 'b'] });
            expect(typeof classDefinition).toBe('function');
            expect(registerSpy.called).toBe(false);
            registerSpy.restore();
        });
        it('can create with custom className', function () {
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            const classDefinition = PivotModel_1.PivotModel.createPivotClass('test', { name: 'test', foreignKeys: ['a', 'b'] }, 'CustomClassName');
            expect(typeof classDefinition).toBe('function');
            expect(registerSpy.calledWith(classDefinition, 'CustomClassName')).toBe(true);
            registerSpy.restore();
        });
    });
    // this should be at the end of this test suite
    it('extends Model', function () {
        const pivot = new PivotModel_1.PivotModel();
        expect(pivot).toBeInstanceOf(Model_1.Model);
    });
});
