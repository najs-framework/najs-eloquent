"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const lodash_1 = require("lodash");
const najs_binding_1 = require("najs-binding");
const Eloquent_1 = require("../../lib/model/Eloquent");
const EloquentAttribute_1 = require("../../lib/model/EloquentAttribute");
const EloquentDriverProvider_1 = require("../../lib/drivers/EloquentDriverProvider");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
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
const fakeModel = {
    driver: {
        getDriverProxyMethods() {
            return [];
        },
        getQueryProxyMethods() {
            return [];
        }
    },
    getReservedNames() {
        return [];
    }
};
describe('EloquentAttribute', function () {
    describe('.findGettersAndSetters()', function () {
        it('finds all defined getters and put to accessors with type = getter', function () {
            class ClassEmpty {
            }
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, {});
            attribute.findGettersAndSetters(Object.getPrototypeOf(new ClassEmpty()));
            expect(attribute['dynamic']).toEqual({});
            class Class {
                get a() {
                    return '';
                }
                set a(value) { }
                get b() {
                    return '';
                }
            }
            attribute.findGettersAndSetters(Object.getPrototypeOf(new Class()));
            expect(attribute['dynamic']).toEqual({
                a: { name: 'a', getter: true, setter: true },
                b: { name: 'b', getter: true, setter: false }
            });
        });
    });
    describe('.findAccessorsAndMutators()', function () {
        it('finds all defined getters and put to accessors with type = getter', function () {
            class ClassEmpty {
            }
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, {});
            attribute.findAccessorsAndMutators(new Model(), Object.getPrototypeOf(new ClassEmpty()));
            expect(attribute['dynamic']).toEqual({});
            class Class {
                get a() {
                    return '';
                }
                getAAttribute() { }
                getFirstNameAttribute() { }
                getWrongFormat() { }
                set b(value) { }
                setBAttribute() { }
                setWrongFormat() { }
                setDoublegetDoubleAttribute() { }
                get c() {
                    return '';
                }
                set c(value) { }
                getCAttribute() { }
                setCAttribute() { }
            }
            attribute.findGettersAndSetters(Object.getPrototypeOf(new Class()));
            attribute.findAccessorsAndMutators(new Model(), Object.getPrototypeOf(new Class()));
            expect(attribute['dynamic']).toEqual({
                a: { name: 'a', getter: true, setter: false, accessor: 'getAAttribute' },
                b: { name: 'b', getter: false, setter: true, mutator: 'setBAttribute' },
                c: { name: 'c', getter: true, setter: true, accessor: 'getCAttribute', mutator: 'setCAttribute' },
                first_name: { name: 'first_name', getter: false, setter: false, accessor: 'getFirstNameAttribute' },
                doubleget_double: {
                    name: 'doubleget_double',
                    getter: false,
                    setter: false,
                    mutator: 'setDoublegetDoubleAttribute'
                }
            });
        });
        it('calls driver.formatAttributeName() to get the name of property', function () {
            class Class {
                getFirstNameAttribute() { }
                setCustomNameConventionAttribute() { }
            }
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, {});
            const customConventionModel = {
                driver: {
                    getDriverProxyMethods() {
                        return [];
                    },
                    getQueryProxyMethods() {
                        return [];
                    },
                    formatAttributeName(name) {
                        return lodash_1.camelCase(name);
                    }
                },
                getReservedNames() {
                    return [];
                }
            };
            attribute.findAccessorsAndMutators(customConventionModel, Object.getPrototypeOf(new Class()));
            expect(attribute['dynamic']).toEqual({
                firstName: { name: 'firstName', getter: false, setter: false, accessor: 'getFirstNameAttribute' },
                customNameConvention: {
                    name: 'customNameConvention',
                    getter: false,
                    setter: false,
                    mutator: 'setCustomNameConventionAttribute'
                }
            });
        });
    });
    describe('protected .buildKnownAttributes()', function () {
        const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, {});
        attribute.buildKnownAttributes(new Model(), Model.prototype);
        it('merges reserved properties defined in .getReservedNames() of model and driver', function () {
            const props = new Model()['getReservedNames']();
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined Eloquent.prototype', function () {
            const props = Object.getOwnPropertyNames(Model.prototype);
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined in model', function () {
            const props = ['accessor', 'mutator', 'modelMethod'];
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
            // warning: props defined in model is not included in list
            expect(attribute['known'].indexOf('props') === -1).toBe(true);
        });
        it('merges properties defined in child model', function () {
            const childAttribute = new EloquentAttribute_1.EloquentAttribute(new ChildModel(), ChildModel.prototype);
            const props = ['child_accessor', 'child_mutator', 'childModelMethod'];
            for (const name of props) {
                expect(childAttribute['known'].indexOf(name) !== -1).toBe(true);
            }
            // warning: props defined in model is not included in list
            expect(childAttribute['known'].indexOf('child_props') === -1).toBe(true);
        });
        it('merges properties defined GET_FORWARD_TO_DRIVER_FUNCTIONS', function () {
            const props = new Model()['driver'].getDriverProxyMethods();
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined GET_QUERY_FUNCTIONS', function () {
            const props = new Model()['driver'].getQueryProxyMethods();
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
    });
    describe('.isKnownAttribute()', function () {
        it('returns false if the name not in "knownAttributes"', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            attribute['known'] = ['test'];
            expect(attribute.isKnownAttribute('test')).toEqual(true);
            expect(attribute.isKnownAttribute('not-found')).toEqual(false);
        });
        it('always returns true if typeof name is Symbol', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            attribute['known'] = ['test'];
            expect(attribute.isKnownAttribute(Symbol.for('test'))).toEqual(true);
            expect(attribute.isKnownAttribute(Symbol.for('not-found'))).toEqual(true);
        });
    });
    describe('.getAttribute()', function () {
        it('calls target.getAttribute() if the attribute is not dynamic attribute', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                getAttribute(key) {
                    return 'target-value-' + key;
                }
            };
            attribute['known'] = ['something'];
            expect(attribute.getAttribute(target, 'something')).toEqual('target-value-something');
        });
        it('calls target.getAttribute() if the attribute is dynamic but there is no getter or accessor', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                getAttribute(key) {
                    return 'target-value-' + key;
                }
            };
            attribute['dynamic'] = {
                something: {
                    name: 'something',
                    getter: false,
                    setter: false
                }
            };
            expect(attribute.getAttribute(target, 'something')).toEqual('target-value-something');
        });
        it('calls and returns getter even accessor is provided', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                get first_name() {
                    return 'getter-value';
                },
                getFirstNameAttribute() {
                    return 'accessor-value';
                }
            };
            attribute['known'] = [];
            attribute['dynamic'] = {
                first_name: {
                    name: 'first_name',
                    getter: true,
                    setter: false,
                    accessor: 'getFirstNameAttribute'
                }
            };
            expect(attribute.getAttribute(target, 'first_name')).toEqual('getter-value');
        });
        it('calls accessor if the accessor is defined and getter not found', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                getFirstNameAttribute() {
                    return 'accessor-value';
                }
            };
            attribute['known'] = [];
            attribute['dynamic'] = {
                first_name: {
                    name: 'first_name',
                    getter: false,
                    setter: false,
                    accessor: 'getFirstNameAttribute'
                }
            };
            expect(attribute.getAttribute(target, 'first_name')).toEqual('accessor-value');
        });
    });
    describe('.setAttribute()', function () {
        it('calls target.setAttribute() if the attribute is not dynamic attribute', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                val: '',
                setAttribute(key, value) {
                    this.val = 'target-' + key + '-' + value;
                    return true;
                }
            };
            attribute['known'] = ['something'];
            expect(attribute.setAttribute(target, 'something', 'value')).toBe(true);
            expect(target.val).toEqual('target-something-value');
        });
        it('calls target.setAttribute() if the attribute is dynamic but there is no setter or mutator', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                val: '',
                setAttribute(key, value) {
                    this.val = 'target-' + key + '-' + value;
                    return true;
                }
            };
            attribute['dynamic'] = {
                something: {
                    name: 'something',
                    getter: false,
                    setter: false
                }
            };
            expect(attribute.setAttribute(target, 'something', 'value')).toBe(true);
            expect(target.val).toEqual('target-something-value');
        });
        it('calls and returns setter even accessor is provided', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                val: '',
                set first_name(value) {
                    this.val = 'setter-' + value;
                },
                setFirstNameAttribute(value) {
                    this.val = 'mutator-' + value;
                }
            };
            attribute['known'] = [];
            attribute['dynamic'] = {
                first_name: {
                    name: 'first_name',
                    getter: false,
                    setter: true,
                    mutator: 'setFirstNameAttribute'
                }
            };
            expect(attribute.setAttribute(target, 'first_name', 'value')).toBe(true);
            expect(target.val).toEqual('setter-value');
        });
        it('calls mutator if the mutator is defined and setter not found', function () {
            const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, Model.prototype);
            const target = {
                val: '',
                setFirstNameAttribute(value) {
                    this.val = 'mutator-' + value;
                }
            };
            attribute['known'] = [];
            attribute['dynamic'] = {
                first_name: {
                    name: 'first_name',
                    getter: false,
                    setter: false,
                    mutator: 'setFirstNameAttribute'
                }
            };
            expect(attribute.setAttribute(target, 'first_name', 'value')).toBe(true);
            expect(target.val).toEqual('mutator-value');
        });
    });
});
