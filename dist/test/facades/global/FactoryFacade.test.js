"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/factory/FactoryManager");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const FactoryFacade_1 = require("../../../lib/facades/global/FactoryFacade");
describe('FactoryFacade', function () {
    it('calls make() to create new instance of FactoryManager as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        FactoryFacade_1.FactoryFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquentClass.FactoryManager)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
