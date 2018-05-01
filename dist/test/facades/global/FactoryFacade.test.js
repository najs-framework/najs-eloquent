"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/factory/FactoryManager");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const FactoryFacade_1 = require("../../../lib/facades/global/FactoryFacade");
const FactoryBuilder_1 = require("../../../lib/factory/FactoryBuilder");
describe('FactoryFacade', function () {
    it('calls make() to create new instance of FactoryManager as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        FactoryFacade_1.FactoryFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Factory.FactoryManager)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
    describe('factory()', function () {
        it('is a shortcut to create a FactoryBuilder', function () {
            const result = FactoryFacade_1.factory('Test');
            expect(result).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(result['className']).toEqual('Test');
            expect(result['name']).toEqual('default');
        });
        it('can create FacadeBuilder with className and name', function () {
            const result = FactoryFacade_1.factory('Test', 'name');
            expect(result).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(result['className']).toEqual('Test');
            expect(result['name']).toEqual('name');
        });
        it('can create FacadeBuilder with className and amount', function () {
            const result = FactoryFacade_1.factory('Test', 10);
            expect(result).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(result['className']).toEqual('Test');
            expect(result['name']).toEqual('default');
            expect(result['amount']).toEqual(10);
        });
        it('can create FacadeBuilder with className, name and amount', function () {
            const result = FactoryFacade_1.factory('Test', 'name', 10);
            expect(result).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(result['className']).toEqual('Test');
            expect(result['name']).toEqual('name');
            expect(result['amount']).toEqual(10);
        });
        it('always call .times() even the amount is less than 1 or 0', function () {
            const a = FactoryFacade_1.factory('Test', 'name', 0);
            expect(a).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(a['className']).toEqual('Test');
            expect(a['name']).toEqual('name');
            expect(a['amount']).toEqual(0);
            const b = FactoryFacade_1.factory('Test', 'name', -1);
            expect(b).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
            expect(b['className']).toEqual('Test');
            expect(b['name']).toEqual('name');
            expect(b['amount']).toEqual(-1);
        });
    });
});
