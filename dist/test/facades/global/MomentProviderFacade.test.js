"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/MomentProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const MomentProviderFacade_1 = require("../../../lib/facades/global/MomentProviderFacade");
describe('MomentProviderFacade', function () {
    it('calls make() to create new instance of MomentFacade as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        MomentProviderFacade_1.MomentProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.MomentProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
