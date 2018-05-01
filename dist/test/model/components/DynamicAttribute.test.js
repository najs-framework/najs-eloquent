"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const DynamicAttribute_1 = require("../../../lib/model/components/DynamicAttribute");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model/DynamicAttribute', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.DynamicAttribute" as class name', function () {
                const dynamicAttribute = new DynamicAttribute_1.DynamicAttribute();
                expect(dynamicAttribute.getClassName()).toEqual('NajsEloquent.Model.Component.DynamicAttribute');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 1 function', function () {
                class Test {
                }
                const prototype = Test.prototype;
                const functions = ['hasAttribute'];
                const dynamicAttribute = new DynamicAttribute_1.DynamicAttribute();
                dynamicAttribute.extend(prototype, [], new DummyDriver_1.DummyDriver());
                for (const name of functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === DynamicAttribute_1.DynamicAttribute[name]).toBe(true);
                }
            });
            it('define 2 properties which in prototype and shared to all instances', function () {
                class Test {
                }
                const prototype = Test.prototype;
                const dynamicAttribute = new DynamicAttribute_1.DynamicAttribute();
                dynamicAttribute.extend(prototype, [], new DummyDriver_1.DummyDriver());
                const a = new Test();
                const b = new Test();
                expect(a['knownAttributes']).not.toBeUndefined();
                expect(b['dynamicAttributes']).not.toBeUndefined();
                expect(a['knownAttributes'] === b['knownAttributes']).toBe(true);
                expect(a['dynamicAttributes'] === b['dynamicAttributes']).toBe(true);
            });
            it('defines knownAttributes with the result of .buildKnownAttributes()', function () {
                class Test {
                }
                const prototype = Test.prototype;
                const bases = ['a', 'b'];
                const driver = new DummyDriver_1.DummyDriver();
                const buildKnownAttributesStub = Sinon.stub(DynamicAttribute_1.DynamicAttribute, 'buildKnownAttributes');
                buildKnownAttributesStub.returns('anything');
                const dynamicAttribute = new DynamicAttribute_1.DynamicAttribute();
                dynamicAttribute.extend(prototype, bases, driver);
                const instance = new Test();
                expect(instance['knownAttributes']).toEqual('anything');
                expect(buildKnownAttributesStub.calledWith(prototype, bases)).toBe(true);
                buildKnownAttributesStub.restore();
            });
            it('defines dynamicAttributes with the result of .buildDynamicAttributes()', function () {
                class Test {
                }
                const prototype = Test.prototype;
                const bases = ['a', 'b'];
                const driver = new DummyDriver_1.DummyDriver();
                const buildDynamicAttributesStub = Sinon.stub(DynamicAttribute_1.DynamicAttribute, 'buildDynamicAttributes');
                buildDynamicAttributesStub.returns('anything');
                const dynamicAttribute = new DynamicAttribute_1.DynamicAttribute();
                dynamicAttribute.extend(prototype, bases, driver);
                const instance = new Test();
                expect(instance['dynamicAttributes']).toEqual('anything');
                expect(buildDynamicAttributesStub.calledWith(prototype, bases, driver)).toBe(true);
                buildDynamicAttributesStub.restore();
            });
        });
        describe('static .createDynamicAttributeIfNeeded()', function () {
            it('create new property with dynamicAttribute structure if needed', function () {
                const container = {};
                DynamicAttribute_1.DynamicAttribute.createDynamicAttributeIfNeeded(container, 'test');
                expect(container['test']).toEqual({ name: 'test', getter: false, setter: false });
                DynamicAttribute_1.DynamicAttribute.createDynamicAttributeIfNeeded(container, 'test');
                expect(container['test']).toEqual({ name: 'test', getter: false, setter: false });
            });
        });
        describe('static .findGettersAndSetters()', function () {
            class Model extends Eloquent_1.Eloquent {
                get first_name() {
                    return 'test';
                }
                set last_name(value) { }
                get password() {
                    return 'password';
                }
                set password(value) { }
                doSomething() { }
            }
            it('loops all properties of class prototype and sets getter or setter variable in structure', function () {
                const result = {};
                DynamicAttribute_1.DynamicAttribute.findGettersAndSetters(result, Model.prototype);
                expect(result).toEqual({
                    first_name: { name: 'first_name', getter: true, setter: false },
                    last_name: { name: 'last_name', getter: false, setter: true },
                    password: { name: 'password', getter: true, setter: true }
                });
            });
        });
        describe('static .findAccessorsAndMutators()', function () {
            class Model extends Eloquent_1.Eloquent {
                setFirstNameAttribute() { }
                getFullNameAttribute() { }
                setPasswordAttribute() { }
                getPasswordAttribute() { }
            }
            it('loops all properties of class prototype and sets accessor or mutator variable in structure', function () {
                const result = {};
                DynamicAttribute_1.DynamicAttribute.findAccessorsAndMutators(result, Model.prototype, new DummyDriver_1.DummyDriver());
                expect(result).toEqual({
                    first_name: { name: 'first_name', getter: false, setter: false, mutator: 'setFirstNameAttribute' },
                    full_name: { name: 'full_name', getter: false, setter: false, accessor: 'getFullNameAttribute' },
                    password: {
                        name: 'password',
                        getter: false,
                        setter: false,
                        accessor: 'getPasswordAttribute',
                        mutator: 'setPasswordAttribute'
                    }
                });
            });
        });
        describe('static .buildDynamicAttributes()', function () {
            class Parent extends Eloquent_1.Eloquent {
                get first_name() {
                    return 'test';
                }
                set last_name(value) { }
                get password() {
                    return 'password';
                }
                set password(value) { }
                setFirstNameAttribute() { }
                getFullNameAttribute() { }
                setPasswordAttribute() { }
                getPasswordAttribute() { }
            }
            class Child extends Parent {
                getAnythingAttribute() { }
            }
            it('calls .findGettersAndSetters()/.findAccessorsAndMutators() for prototypes and bases', function () {
                const result = DynamicAttribute_1.DynamicAttribute.buildDynamicAttributes(Parent.prototype, [], new DummyDriver_1.DummyDriver());
                expect(result).toEqual({
                    first_name: { name: 'first_name', getter: true, setter: false, mutator: 'setFirstNameAttribute' },
                    last_name: { name: 'last_name', getter: false, setter: true },
                    full_name: { name: 'full_name', getter: false, setter: false, accessor: 'getFullNameAttribute' },
                    password: {
                        name: 'password',
                        getter: true,
                        setter: true,
                        accessor: 'getPasswordAttribute',
                        mutator: 'setPasswordAttribute'
                    }
                });
            });
            it('works with class inheritance', function () {
                const result = DynamicAttribute_1.DynamicAttribute.buildDynamicAttributes(Child.prototype, [Parent.prototype], new DummyDriver_1.DummyDriver());
                expect(result).toEqual({
                    first_name: { name: 'first_name', getter: true, setter: false, mutator: 'setFirstNameAttribute' },
                    last_name: { name: 'last_name', getter: false, setter: true },
                    full_name: { name: 'full_name', getter: false, setter: false, accessor: 'getFullNameAttribute' },
                    anything: { name: 'anything', getter: false, setter: false, accessor: 'getAnythingAttribute' },
                    password: {
                        name: 'password',
                        getter: true,
                        setter: true,
                        accessor: 'getPasswordAttribute',
                        mutator: 'setPasswordAttribute'
                    }
                });
            });
        });
    });
    describe('Integration', function () {
        class Model extends Eloquent_1.Eloquent {
            get first_name() {
                return 'first_name';
            }
            set last_name(value) {
                this.attributes['last_name'] = value;
            }
            get both() {
                return this.attributes['both'];
            }
            set both(value) {
                this.attributes['both'] = value;
            }
            getAccessorAttribute() {
                return 'accessor';
            }
            setMutatorAttribute(value) {
                this.attributes['mutator'] = value;
            }
            getAccessorAndMutatorAttribute() {
                return this.attributes['accessor_and_mutator'];
            }
            setAccessorAndMutatorAttribute(value) {
                this.attributes['accessor_and_mutator'] = value;
            }
            getFirstNameAttribute() {
                return 'first_name_accessor';
            }
            setFirstNameAttribute(value) {
                this.attributes['first_name'] = value;
            }
            getLastNameAttribute() {
                return this.attributes['last_name'];
            }
            setLastNameAttribute(value) {
                this.attributes['last_name'] = value;
            }
        }
        Model.className = 'Model';
        it('returns the value of getter, never calls .getAttribute()', function () {
            const model = new Model();
            const getAttributeSpy = Sinon.spy(model, 'getAttribute');
            expect(model.first_name).toEqual('first_name');
            expect(getAttributeSpy.called).toBe(false);
        });
        it('calls setter, never calls .setAttribute()', function () {
            const model = new Model();
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            model.last_name = 'test';
            expect(model.getAttribute('last_name')).toEqual('test');
            expect(setAttributeSpy.called).toBe(false);
        });
        it('calls getter & setter, never calls .getAttribute()/.setAttribute()', function () {
            const model = new Model();
            const getAttributeSpy = Sinon.spy(model, 'getAttribute');
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            model.both = 'test';
            expect(model.both).toEqual('test');
            expect(getAttributeSpy.called).toBe(false);
            expect(setAttributeSpy.called).toBe(false);
        });
        it('calls Accessor function if it is defined', function () {
            const model = new Model();
            const getAccessorAttributeSpy = Sinon.spy(model, 'getAccessorAttribute');
            const getAttributeSpy = Sinon.spy(model, 'getAttribute');
            expect(model.accessor).toEqual('accessor');
            expect(getAccessorAttributeSpy.called).toBe(true);
            expect(getAttributeSpy.called).toBe(false);
        });
        it('calls Mutator function if it is defined', function () {
            const model = new Model();
            const setMutatorAttributeSpy = Sinon.spy(model, 'setMutatorAttribute');
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            model.mutator = 'test';
            expect(model.getAttribute('mutator')).toEqual('test');
            expect(setMutatorAttributeSpy.called).toBe(true);
            expect(setAttributeSpy.called).toBe(false);
        });
        it('calls Accessor/Mutator function if it is defined', function () {
            const model = new Model();
            const getAccessorAndMutatorAttributeSpy = Sinon.spy(model, 'getAccessorAndMutatorAttribute');
            const setAccessorAndMutatorAttributeSpy = Sinon.spy(model, 'setAccessorAndMutatorAttribute');
            const getAttributeSpy = Sinon.spy(model, 'getAttribute');
            const setAttributeSpy = Sinon.spy(model, 'setAttribute');
            model.accessor_and_mutator = 'test';
            expect(model.accessor_and_mutator).toEqual('test');
            expect(getAccessorAndMutatorAttributeSpy.called).toBe(true);
            expect(setAccessorAndMutatorAttributeSpy.called).toBe(true);
            expect(getAttributeSpy.called).toBe(false);
            expect(setAttributeSpy.called).toBe(false);
        });
        it('never calls accessor if there is a getter with the same name', function () {
            const model = new Model();
            const getFirstNameAttributeSpy = Sinon.spy(model, 'getFirstNameAttribute');
            expect(model.first_name).toEqual('first_name');
            expect(getFirstNameAttributeSpy.called).toBe(false);
        });
        it('never calls mutator if there is a setter with the same name', function () {
            const model = new Model();
            const setLastNameAttributeSpy = Sinon.spy(model, 'setLastNameAttribute');
            model.last_name = 'test';
            expect(model.getAttribute('last_name')).toEqual('test');
            expect(setLastNameAttributeSpy.called).toBe(false);
        });
        it('can be use mutator and getter together', function () {
            const model = new Model();
            const setLastNameAttributeSpy = Sinon.spy(model, 'setLastNameAttribute');
            model.last_name = 'test';
            expect(model.last_name).toEqual('test');
            expect(setLastNameAttributeSpy.called).toBe(false);
        });
    });
});
