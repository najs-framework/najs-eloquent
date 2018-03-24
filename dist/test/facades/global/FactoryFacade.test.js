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
        expect(makeSpy.calledWith(constants_1.NajsEloquentClass.FactoryManager)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
    describe('factory()', function () {
        it('is a shortcut to create a FactoryBuilder', function () {
            const result = FactoryFacade_1.factory('Test');
            expect(result).toBeInstanceOf(FactoryBuilder_1.FactoryBuilder);
        });
    });
});
