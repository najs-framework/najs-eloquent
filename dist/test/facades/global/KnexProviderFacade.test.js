"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/KnexProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const KnexProviderFacade_1 = require("../../../lib/facades/global/KnexProviderFacade");
describe('KnexProviderFacade', function () {
    it('calls make() to create new instance of KnexProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        KnexProviderFacade_1.KnexProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.KnexProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
