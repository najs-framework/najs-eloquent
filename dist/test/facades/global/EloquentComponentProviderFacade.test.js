"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/ComponentProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const EloquentComponentProviderFacade_1 = require("../../../lib/facades/global/EloquentComponentProviderFacade");
describe('EloquentComponentProviderFacade', function () {
    it('calls make() to create new instance of ComponentProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        EloquentComponentProviderFacade_1.EloquentComponentProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.ComponentProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
