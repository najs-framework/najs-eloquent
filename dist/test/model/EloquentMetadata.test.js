"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProvider_1 = require("../../lib/drivers/EloquentDriverProvider");
const Eloquent_1 = require("../../lib/model/Eloquent");
const EloquentMetadata_1 = require("../../lib/model/EloquentMetadata");
const EloquentProxy_1 = require("../../lib/model/EloquentProxy");
EloquentDriverProvider_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy');
class Model extends Eloquent_1.Eloquent {
    get accessor() {
        return '';
    }
    set mutator(value) { }
    getClassName() {
        return 'Model';
    }
    modelMethod() { }
}
najs_binding_1.register(Model);
class ChildModel extends Model {
    get child_accessor() {
        return '';
    }
    set child_mutator(value) { }
    getClassName() {
        return 'ChildModel';
    }
    childModelMethod() { }
}
najs_binding_1.register(ChildModel);
describe('EloquentMetadata', function () {
    describe('EloquentMetadata.get()', function () {
        it('returns an instance of EloquentMetadata', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            expect(metadata).toBeInstanceOf(EloquentMetadata_1.EloquentMetadata);
        });
        it('finds an definition of Model and saves in "definition"', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            expect(metadata['definition'] === Model).toBe(true);
        });
    });
    describe('protected .buildKnownAttributes()', function () {
        it('merges reserved properties defined in .getReservedProperties() of model and driver', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const props = new Model()['getReservedProperties']();
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined Eloquent.prototype', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const props = Object.getOwnPropertyNames(Model.prototype);
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined in model', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const props = ['accessor', 'mutator', 'modelMethod'];
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
            // warning: props defined in model is not included in list
            expect(metadata['knownAttributes'].indexOf('props') === -1).toBe(true);
        });
        it('merges properties defined in child model', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ChildModel());
            const props = ['child_accessor', 'child_mutator', 'childModelMethod'];
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
            // warning: props defined in model is not included in list
            expect(metadata['knownAttributes'].indexOf('child_props') === -1).toBe(true);
        });
        it('merges properties defined GET_FORWARD_TO_DRIVER_FUNCTIONS', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const props = EloquentProxy_1.GET_FORWARD_TO_DRIVER_FUNCTIONS;
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined GET_QUERY_FUNCTIONS', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const props = EloquentProxy_1.GET_QUERY_FUNCTIONS;
            for (const name of props) {
                expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true);
            }
        });
    });
    describe('protected .findGettersAndSetters()', function () {
        it('finds all defined getters and put to accessors with type = getter', function () {
            class GetterEmpty extends Eloquent_1.Eloquent {
                getClassName() {
                    return 'GetterEmpty';
                }
            }
            najs_binding_1.register(GetterEmpty);
            expect(EloquentMetadata_1.EloquentMetadata.get(new GetterEmpty())['accessors']).toEqual({});
            class GetterA extends Eloquent_1.Eloquent {
                get a() {
                    return '';
                }
                get b() {
                    return '';
                }
                getClassName() {
                    return 'GetterA';
                }
            }
            najs_binding_1.register(GetterA);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new GetterA());
            expect(metadata['accessors']).toEqual({
                a: { name: 'a', type: 'getter' },
                b: { name: 'b', type: 'getter' }
            });
        });
        it('finds all defined setters and put to mutators with type = setter', function () {
            class SetterEmpty extends Eloquent_1.Eloquent {
                getClassName() {
                    return 'MutatorEmpty';
                }
            }
            najs_binding_1.register(SetterEmpty);
            expect(EloquentMetadata_1.EloquentMetadata.get(new SetterEmpty())['mutators']).toEqual({});
            class SetterA extends Eloquent_1.Eloquent {
                set a(value) { }
                set b(value) { }
                getClassName() {
                    return 'SetterA';
                }
            }
            najs_binding_1.register(SetterA);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new SetterA());
            expect(metadata['mutators']).toEqual({
                a: { name: 'a', type: 'setter' },
                b: { name: 'b', type: 'setter' }
            });
        });
    });
    describe('protected .findAccessorsAndMutators()', function () {
        it('does thing if there is no function with format `get|set...Attribute`', function () {
            class NoAccessorOrMutator extends Eloquent_1.Eloquent {
                getClassName() {
                    return 'NoAccessorOrMutator';
                }
            }
            najs_binding_1.register(NoAccessorOrMutator);
            expect(EloquentMetadata_1.EloquentMetadata.get(new NoAccessorOrMutator())['accessors']).toEqual({});
            expect(EloquentMetadata_1.EloquentMetadata.get(new NoAccessorOrMutator())['mutators']).toEqual({});
        });
        it('puts `get...Attribute` to accessors with type function, but skip if getter of same attribute is defined', function () {
            class AccessorA extends Eloquent_1.Eloquent {
                get a() {
                    return '';
                }
                getAAttribute() { }
                getFirstNameAttribute() { }
                getWrongFormat() { }
                getDoublegetDoubleAttribute() { }
                getClassName() {
                    return 'AccessorA';
                }
            }
            najs_binding_1.register(AccessorA);
            expect(EloquentMetadata_1.EloquentMetadata.get(new AccessorA())['accessors']).toEqual({
                a: {
                    name: 'a',
                    type: 'getter'
                },
                first_name: {
                    name: 'first_name',
                    type: 'function',
                    ref: 'getFirstNameAttribute'
                },
                doubleget_double: {
                    name: 'doubleget_double',
                    type: 'function',
                    ref: 'getDoublegetDoubleAttribute'
                }
            });
        });
        it('puts `set...Attribute` to mutators with type function, but skip if setter of same attribute is defined', function () {
            class MutatorA extends Eloquent_1.Eloquent {
                set a(value) { }
                setAAttribute() { }
                setFirstNameAttribute() { }
                setWrongFormat() { }
                setDoublegetDoubleAttribute() { }
                getClassName() {
                    return 'MutatorA';
                }
            }
            najs_binding_1.register(MutatorA);
            expect(EloquentMetadata_1.EloquentMetadata.get(new MutatorA())['mutators']).toEqual({
                a: {
                    name: 'a',
                    type: 'setter'
                },
                first_name: {
                    name: 'first_name',
                    type: 'function',
                    ref: 'setFirstNameAttribute'
                },
                doubleget_double: {
                    name: 'doubleget_double',
                    type: 'function',
                    ref: 'setDoublegetDoubleAttribute'
                }
            });
        });
    });
    describe('.getSettingProperty()', function () {
        it('returns "static" version of property if it exists found', function () {
            class ClassA extends Eloquent_1.Eloquent {
                getClassName() {
                    return 'ClassA';
                }
            }
            ClassA.test = 'something';
            najs_binding_1.register(ClassA);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ClassA());
            expect(metadata.getSettingProperty('test', 'default')).toEqual('something');
        });
        it('returns "member" version of property if static version not found but member version is defined', function () {
            class ClassB extends Eloquent_1.Eloquent {
                constructor() {
                    super(...arguments);
                    this.test = 'something';
                }
                getClassName() {
                    return 'ClassB';
                }
            }
            najs_binding_1.register(ClassB);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ClassB());
            expect(metadata.getSettingProperty('test', 'default')).toEqual('something');
        });
        it('returns default value if "static" or "member" setting of property are not found', function () {
            class ClassC extends Eloquent_1.Eloquent {
                getClassName() {
                    return 'ClassC';
                }
            }
            najs_binding_1.register(ClassC);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ClassC());
            expect(metadata.getSettingProperty('test', 'default')).toEqual('default');
        });
        it('always returns "static" version if the property is presented in both types', function () {
            class ClassD extends Eloquent_1.Eloquent {
                constructor() {
                    super(...arguments);
                    this.test = 'member';
                }
                getClassName() {
                    return 'ClassD';
                }
            }
            ClassD.test = 'static';
            najs_binding_1.register(ClassD);
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ClassD());
            expect(metadata.getSettingProperty('test', 'default')).toEqual('static');
        });
    });
    describe('.hasSetting()', function () {
        class ClassE extends Eloquent_1.Eloquent {
            getClassName() {
                return 'ClassE';
            }
        }
        najs_binding_1.register(ClassE);
        it('returns false if the setting is not found', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new ClassE());
            expect(metadata.hasSetting('test')).toBe(false);
        });
        it('also returns false if the setting found but has falsy values', function () {
            const falsyValues = ['', 0, false, undefined];
            for (const value of falsyValues) {
                ClassE['test'] = value;
                expect(EloquentMetadata_1.EloquentMetadata.get(new ClassE(), false).hasSetting('test')).toBe(false);
            }
        });
        it('also returns true if the setting found and has truly values', function () {
            const trulyValues = ['a', 1, {}, [], true];
            for (const value of trulyValues) {
                ClassE['test'] = value;
                expect(EloquentMetadata_1.EloquentMetadata.get(new ClassE(), false).hasSetting('test')).toBe(true);
            }
        });
    });
    describe('.getSettingWithDefaultForTrueValue()', function () {
        it('calls .getSettingProperty(), and returns default value if the setting === true', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty');
            getSettingPropertyStub.returns(true);
            expect(metadata.getSettingWithDefaultForTrueValue('test', 'default')).toEqual('default');
            expect(getSettingPropertyStub.calledWith('test', false)).toBe(true);
            getSettingPropertyStub.restore();
        });
        it('calls .getSettingProperty(), and returns default value if the setting not found', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty');
            getSettingPropertyStub.returns(false);
            expect(metadata.getSettingWithDefaultForTrueValue('test', 'default')).toEqual('default');
            expect(getSettingPropertyStub.calledWith('test', false)).toBe(true);
            getSettingPropertyStub.restore();
        });
        it('calls .getSettingProperty(), and returns actually value of the setting', function () {
            const settingValue = {};
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty');
            getSettingPropertyStub.returns(settingValue);
            expect(metadata.getSettingWithDefaultForTrueValue('test', 'default') === settingValue).toBe(true);
            expect(getSettingPropertyStub.calledWith('test', false)).toBe(true);
            getSettingPropertyStub.restore();
        });
    });
    describe('.fillable()', function () {
        it('calls .getSettingProperty() with "fillable" and default value = []', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty');
            getSettingPropertyStub.returns(['test']);
            expect(metadata.fillable()).toEqual(['test']);
            expect(getSettingPropertyStub.calledWith('fillable', [])).toBe(true);
            getSettingPropertyStub.restore();
        });
    });
    describe('.guarded()', function () {
        it('calls .getSettingProperty() with "guarded" and default value = ["*"]', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty');
            getSettingPropertyStub.returns(['*']);
            expect(metadata.guarded()).toEqual(['*']);
            expect(getSettingPropertyStub.calledWith('guarded', ['*'])).toBe(true);
            getSettingPropertyStub.restore();
        });
    });
    describe('.hasTimestamps()', function () {
        it('calls .hasSetting() with key "timestamps" and returns result', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const hasSettingStub = Sinon.stub(metadata, 'hasSetting');
            hasSettingStub.returns('test');
            expect(metadata.hasTimestamps()).toEqual('test');
            expect(hasSettingStub.calledWith('timestamps')).toBe(true);
            hasSettingStub.restore();
        });
    });
    describe('.timestamps()', function () {
        it('calls .getSettingWithDefaultForTrueValue() with "timestamps" and defaultValue', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue');
            getSettingWithDefaultForTrueValueStub.returns('test');
            expect(metadata.timestamps()).toEqual('test');
            expect(getSettingWithDefaultForTrueValueStub.calledWith('timestamps', {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            })).toBe(true);
            getSettingWithDefaultForTrueValueStub.restore();
        });
        it('can call with custom defaultValue', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue');
            getSettingWithDefaultForTrueValueStub.returns('test');
            expect(metadata.timestamps('custom')).toEqual('test');
            expect(getSettingWithDefaultForTrueValueStub.calledWith('timestamps', 'custom')).toBe(true);
            getSettingWithDefaultForTrueValueStub.restore();
        });
    });
    describe('.hasSoftDeletes()', function () {
        it('calls .hasSetting() with key "softDeletes" and returns result', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const hasSettingStub = Sinon.stub(metadata, 'hasSetting');
            hasSettingStub.returns('test');
            expect(metadata.hasSoftDeletes()).toEqual('test');
            expect(hasSettingStub.calledWith('softDeletes')).toBe(true);
            hasSettingStub.restore();
        });
    });
    describe('.softDeletes()', function () {
        it('calls .getSettingWithDefaultForTrueValue() with "softDeletes" and defaultValue', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue');
            getSettingWithDefaultForTrueValueStub.returns('test');
            expect(metadata.softDeletes()).toEqual('test');
            expect(getSettingWithDefaultForTrueValueStub.calledWith('softDeletes', {
                deletedAt: 'deleted_at',
                overrideMethods: false
            })).toBe(true);
            getSettingWithDefaultForTrueValueStub.restore();
        });
        it('can call with custom defaultValue', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue');
            getSettingWithDefaultForTrueValueStub.returns('test');
            expect(metadata.softDeletes('custom')).toEqual('test');
            expect(getSettingWithDefaultForTrueValueStub.calledWith('softDeletes', 'custom')).toBe(true);
            getSettingWithDefaultForTrueValueStub.restore();
        });
    });
    describe('.hasAttribute()', function () {
        it('returns false if the name not in "knownAttributes"', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            metadata['knownAttributes'] = ['test'];
            expect(metadata.hasAttribute('test')).toEqual(true);
            expect(metadata.hasAttribute('not-found')).toEqual(false);
        });
        it('always returns true if typeof name is Symbol', function () {
            const metadata = EloquentMetadata_1.EloquentMetadata.get(new Model());
            metadata['knownAttributes'] = ['test'];
            expect(metadata.hasAttribute(Symbol.for('test'))).toEqual(true);
            expect(metadata.hasAttribute(Symbol.for('not-found'))).toEqual(true);
        });
    });
});
