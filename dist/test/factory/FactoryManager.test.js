"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const chance_1 = require("chance");
const najs_facade_1 = require("najs-facade");
const MemoryDriver_1 = require("../../lib/drivers/memory/MemoryDriver");
const DriverProviderFacade_1 = require("../../lib/facades/global/DriverProviderFacade");
const FactoryManager_1 = require("../../lib/factory/FactoryManager");
const FactoryBuilder_1 = require("../../lib/factory/FactoryBuilder");
DriverProviderFacade_1.DriverProviderFacade.register(MemoryDriver_1.MemoryDriver, 'memory', true);
describe('FactoryManager', function () {
    it('extends Facade and implements IAutoload under name "NajsEloquent.Factory.FactoryManager"', function () {
        const factoryManager = new FactoryManager_1.FactoryManager();
        expect(factoryManager).toBeInstanceOf(najs_facade_1.Facade);
        expect(factoryManager.getClassName()).toEqual('NajsEloquent.Factory.FactoryManager');
    });
    describe('constructor()', function () {
        it('using chance library and creates faker', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager['faker']).toBeInstanceOf(chance_1.Chance);
        });
    });
    describe('protected .getModelName()', function () {
        it('returns if the param is a string', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager['getModelName']('Class')).toEqual('Class');
        });
        it("calls and returns a class's name by getClassName() of NajsBinding if the param is not string", function () {
            class Class {
            }
            Class.className = 'Class';
            najs_binding_1.register(Class);
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager['getModelName'](Class)).toEqual('Class');
        });
    });
    describe('.define()', function () {
        it('is chain-able', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager.define('Test', {}) === factoryManager).toBe(true);
        });
        it('creates definitions object with 2 levels definitions[className][name] = func()', function () {
            const definition = () => { };
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager['definitions']).toEqual({});
            factoryManager.define('Class', definition);
            expect(factoryManager['definitions']).toEqual({
                Class: {
                    default: definition
                }
            });
            factoryManager.define('Class', definition, 'test');
            expect(factoryManager['definitions']).toEqual({
                Class: {
                    test: definition,
                    default: definition
                }
            });
        });
    });
    describe('.defineAs()', function () {
        it('calls .define() and returns result', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            const defineStub = Sinon.stub(factoryManager, 'define');
            defineStub.returns('anything');
            const definition = () => { };
            factoryManager.defineAs('Class', 'test', definition);
            expect(defineStub.calledWith('Class', definition, 'test')).toBe(true);
        });
    });
    describe('.state()', function () {
        it('is chain-able', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager.state('Test', 'test', {}) === factoryManager).toBe(true);
        });
        it('creates states object with 2 levels definitions[className][name] = func()', function () {
            const state = () => { };
            const factoryManager = new FactoryManager_1.FactoryManager();
            expect(factoryManager['states']).toEqual({});
            factoryManager.state('Class', 'test', state);
            expect(factoryManager['states']).toEqual({
                Class: {
                    test: state
                }
            });
            factoryManager.state('Class', 'init', state);
            expect(factoryManager['states']).toEqual({
                Class: {
                    init: state,
                    test: state
                }
            });
        });
    });
    describe('.of()', function () {
        it('creates new instance of FactoryBuilder with all params from FactoryManager', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            const firstInstance = factoryManager.of('Class');
            expect(firstInstance).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(firstInstance['className']).toEqual('Class');
            expect(firstInstance['name']).toEqual('default');
            expect(firstInstance['definitions'] === factoryManager['definitions']).toBe(true);
            expect(firstInstance['definedStates'] === factoryManager['states']).toBe(true);
            expect(firstInstance['faker'] === factoryManager['faker']).toBe(true);
            const secondInstance = factoryManager.of('Class', 'test');
            expect(secondInstance).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(secondInstance['className']).toEqual('Class');
            expect(secondInstance['name']).toEqual('test');
            expect(secondInstance['definitions'] === factoryManager['definitions']).toBe(true);
            expect(secondInstance['definedStates'] === factoryManager['states']).toBe(true);
            expect(secondInstance['faker'] === factoryManager['faker']).toBe(true);
        });
    });
    const CreateByOfForwardToBuilder = {
        create: 'create',
        createAs: 'create',
        make: 'make',
        makeAs: 'make',
        raw: 'raw',
        rawOf: 'raw'
    };
    for (const name in CreateByOfForwardToBuilder) {
        const hasNameParam = CreateByOfForwardToBuilder[name] !== name;
        describe('.' + name + '()', function () {
            it('calls .of() then call .' + CreateByOfForwardToBuilder[name] + '() and returns a result', function () {
                const factoryManager = new FactoryManager_1.FactoryManager();
                const ofStub = Sinon.stub(factoryManager, 'of');
                ofStub.returns({
                    [CreateByOfForwardToBuilder[name]]: function (val) {
                        return 'anything-' + val;
                    }
                });
                if (hasNameParam) {
                    expect(factoryManager[name]('Class', 'name')).toEqual('anything-undefined');
                    expect(ofStub.calledWith('Class', 'name')).toBe(true);
                    expect(factoryManager[name]('Class', 'name', 'test')).toEqual('anything-test');
                    expect(ofStub.calledWith('Class', 'name')).toBe(true);
                }
                else {
                    expect(factoryManager[name]('Class')).toEqual('anything-undefined');
                    expect(ofStub.calledWith('Class')).toBe(true);
                    expect(factoryManager[name]('Class', 'test')).toEqual('anything-test');
                    expect(ofStub.calledWith('Class')).toBe(true);
                }
            });
        });
        it('calls .of().times() then .' + CreateByOfForwardToBuilder[name] + '() and returns a result', function () {
            const factoryManager = new FactoryManager_1.FactoryManager();
            const ofStub = Sinon.stub(factoryManager, 'of');
            ofStub.returns({
                times: function (amount) {
                    this.amount = amount;
                    return this;
                },
                [CreateByOfForwardToBuilder[name]]: function (val) {
                    return 'anything-' + this.amount + '-' + val;
                }
            });
            if (hasNameParam) {
                expect(factoryManager[name]('Class', 'name', 10)).toEqual('anything-10-undefined');
                expect(ofStub.calledWith('Class', 'name')).toBe(true);
                expect(factoryManager[name]('Class', 'name', 10, 'test')).toEqual('anything-10-test');
                expect(ofStub.calledWith('Class', 'name')).toBe(true);
            }
            else {
                expect(factoryManager[name]('Class', 10)).toEqual('anything-10-undefined');
                expect(ofStub.calledWith('Class')).toBe(true);
                expect(factoryManager[name]('Class', 'test')).toEqual('anything-10-test');
                expect(ofStub.calledWith('Class')).toBe(true);
            }
        });
    }
});
