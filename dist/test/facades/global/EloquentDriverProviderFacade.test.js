"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/DriverProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
describe('EloquentDriverProviderFacade', function () {
    it('calls make() to create new instance of DriverProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        EloquentDriverProviderFacade_1.EloquentDriverProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.DriverProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
