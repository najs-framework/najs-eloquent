"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const EloquentComponentProviderFacade_1 = require("../../lib/facades/global/EloquentComponentProviderFacade");
describe('ComponentProvider', function () {
    describe('.register()', function () {
        it('calls NajsBinding.register() for the component if it is a function', function () {
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['components']).toEqual({});
            const registerSpy = Sinon.spy(NajsBinding, 'register');
            class Test {
            }
            Test.className = 'Test';
            const chainable = EloquentComponentProviderFacade_1.EloquentComponentProvider.register(Test, 'test');
            expect(chainable === EloquentComponentProviderFacade_1.EloquentComponentProvider).toBe(true);
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['components']).toEqual({
                test: {
                    className: 'Test',
                    isDefault: false,
                    index: 0
                }
            });
            expect(registerSpy.calledWith(Test)).toBe(true);
            registerSpy.restore();
        });
        it('adds to "components" with the index is current count of Components, isDefault = false if not passed', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider.register('NewComponent', 'new', true);
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['components']).toEqual({
                test: {
                    className: 'Test',
                    isDefault: false,
                    index: 0
                },
                new: {
                    className: 'NewComponent',
                    isDefault: true,
                    index: 1
                }
            });
        });
    });
    describe('.bind()', function () {
        it('auto creates an array for model if the there is no key in "binding"', function () {
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({});
            const chainable = EloquentComponentProviderFacade_1.EloquentComponentProvider.bind('Model', 'test');
            expect(chainable === EloquentComponentProviderFacade_1.EloquentComponentProvider).toBe(true);
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({
                Model: ['test']
            });
        });
        it('pushes the component name to the "binding"[Model] array', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider.bind('Model', 'a');
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({
                Model: ['test', 'a']
            });
        });
        it('auto removes duplicated components', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider.bind('Model', 'a');
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({
                Model: ['test', 'a']
            });
            EloquentComponentProviderFacade_1.EloquentComponentProvider.bind('Model', 'b');
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({
                Model: ['test', 'a', 'b']
            });
            EloquentComponentProviderFacade_1.EloquentComponentProvider.bind('Model', 'b');
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['binding']).toEqual({
                Model: ['test', 'a', 'b']
            });
        });
    });
    describe('.resolve()', function () {
        it('throws ReferenceError if the component name is not register yet', function () {
            try {
                EloquentComponentProviderFacade_1.EloquentComponentProvider.resolve('not-found');
            }
            catch (error) {
                expect(error).toBeInstanceOf(ReferenceError);
                expect(error.message).toEqual('Component "not-found" is not found.');
                return;
            }
            expect('Should not reach this line').toEqual('Hmm');
        });
        it('calls NajsBinding.make() with model and driver in param', function () {
            const makeSpy = Sinon.spy(NajsBinding, 'make');
            const model = {};
            const driver = {};
            EloquentComponentProviderFacade_1.EloquentComponentProvider.resolve('test');
            expect(makeSpy.calledWith('Test', [model, driver]));
            makeSpy.restore();
        });
    });
    describe('.getComponents()', function () {
        it('returns all components which has .isDefault = true if the model is not passed', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider['components'] = {
                a: { className: 'A', isDefault: true, index: 2 },
                b: { className: 'B', isDefault: false, index: 0 },
                c: { className: 'C', isDefault: true, index: 1 }
            };
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider.getComponents()).toEqual(['c', 'a']);
        });
        it('pushes binding components to the list if there is config of model in "binding"', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider['components'] = {
                a: { className: 'A', isDefault: true, index: 2 },
                b: { className: 'B', isDefault: false, index: 0 },
                c: { className: 'C', isDefault: true, index: 1 },
                d: { className: 'D', isDefault: false, index: 3 }
            };
            EloquentComponentProviderFacade_1.EloquentComponentProvider['binding'] = {
                Test: ['d']
            };
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider.getComponents('Test')).toEqual(['c', 'a', 'd']);
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider.getComponents('NotFound')).toEqual(['c', 'a']);
        });
        it('always sort the result by the component index', function () {
            EloquentComponentProviderFacade_1.EloquentComponentProvider['components'] = {
                a: { className: 'A', isDefault: true, index: 2 },
                b: { className: 'B', isDefault: true, index: 0 },
                c: { className: 'C', isDefault: true, index: 1 },
                d: { className: 'D', isDefault: true, index: 3 }
            };
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider.getComponents()).toEqual(['b', 'c', 'a', 'd']);
        });
    });
    describe('.extend()', function () {
        it('calls .resolveComponents() then loops and calls Component.extend()', function () {
            class ComponentA {
                getClassName() {
                    return 'ComponentA';
                }
                extend() { }
            }
            class ComponentB {
                getClassName() {
                    return 'ComponentB';
                }
                extend() { }
            }
            const componentA = new ComponentA();
            const componentB = new ComponentB();
            const extendComponentASpy = Sinon.spy(componentA, 'extend');
            const extendComponentBSpy = Sinon.spy(componentB, 'extend');
            const resolveComponentsStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'resolveComponents');
            resolveComponentsStub.returns([componentA, componentB]);
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            EloquentComponentProviderFacade_1.EloquentComponentProvider.extend(model, {});
            expect(extendComponentASpy.calledWith(Object.getPrototypeOf(model))).toBe(true);
            expect(extendComponentBSpy.calledWith(Object.getPrototypeOf(model))).toBe(true);
            expect(EloquentComponentProviderFacade_1.EloquentComponentProvider['extended']['Test']).toEqual(['ComponentA', 'ComponentB']);
            resolveComponentsStub.restore();
        });
        it('only calls Component.extend() once', function () {
            class ComponentA {
                getClassName() {
                    return 'ComponentA';
                }
                extend() { }
            }
            const componentA = new ComponentA();
            const extendComponentASpy = Sinon.spy(componentA, 'extend');
            const resolveComponentsStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'resolveComponents');
            resolveComponentsStub.returns([componentA]);
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            EloquentComponentProviderFacade_1.EloquentComponentProvider.extend(model, {});
            expect(extendComponentASpy.calledWith(Object.getPrototypeOf(model))).toBe(false);
            resolveComponentsStub.restore();
        });
    });
    describe('private .resolveComponents()', function () {
        it('merges components from .getComponents() and driver.getModelComponentName()', function () {
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            const driver = {
                getModelComponentName() {
                    return 'DriverComponent';
                },
                getModelComponentOrder(components) {
                    return components;
                }
            };
            const getComponentsStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'getComponents');
            getComponentsStub.returns(['A']);
            const resolveStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'resolve');
            resolveStub.callsFake(function (component) {
                return 'resolved:' + component;
            });
            const result = EloquentComponentProviderFacade_1.EloquentComponentProvider['resolveComponents'](model, driver);
            expect(result).toEqual(['resolved:A', 'resolved:DriverComponent']);
            resolveStub.restore();
            getComponentsStub.restore();
        });
        it('skips the driver component if not found, apply driver.getModelComponentOrder(), use .resolve()', function () {
            class Model {
            }
            Model.className = 'Test';
            const model = new Model();
            const driver = {
                getModelComponentName() { },
                getModelComponentOrder(components) {
                    return components.reverse();
                }
            };
            const getComponentsStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'getComponents');
            getComponentsStub.returns(['A', 'B']);
            const resolveStub = Sinon.stub(EloquentComponentProviderFacade_1.EloquentComponentProvider, 'resolve');
            resolveStub.callsFake(function (component) {
                return 'resolved:' + component;
            });
            const result = EloquentComponentProviderFacade_1.EloquentComponentProvider['resolveComponents'](model, driver);
            expect(result).toEqual(['resolved:B', 'resolved:A']);
            expect(resolveStub.callCount).toEqual(2);
            resolveStub.restore();
            getComponentsStub.restore();
        });
    });
});
