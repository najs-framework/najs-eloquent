"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const Eloquent_1 = require("../../lib/model/Eloquent");
const EloquentAttribute_1 = require("../../lib/model/EloquentAttribute");
const EloquentDriverProvider_1 = require("../../lib/drivers/EloquentDriverProvider");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
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
const fakeModel = {
    getReservedProperties() {
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
            attribute.findAccessorsAndMutators(Object.getPrototypeOf(new ClassEmpty()));
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
            attribute.findAccessorsAndMutators(Object.getPrototypeOf(new Class()));
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
    });
    describe('protected .buildKnownAttributes()', function () {
        const attribute = new EloquentAttribute_1.EloquentAttribute(fakeModel, {});
        attribute.buildKnownAttributes(new Model(), Model.prototype);
        it('merges reserved properties defined in .getReservedProperties() of model and driver', function () {
            const props = new Model()['getReservedProperties']();
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
            const props = EloquentProxy_1.GET_FORWARD_TO_DRIVER_FUNCTIONS;
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
        it('merges properties defined GET_QUERY_FUNCTIONS', function () {
            const props = EloquentProxy_1.GET_QUERY_FUNCTIONS;
            for (const name of props) {
                expect(attribute['known'].indexOf(name) !== -1).toBe(true);
            }
        });
    });
});
