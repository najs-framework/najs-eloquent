"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/MongodbProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const MongodbProviderFacade_1 = require("../../../lib/facades/global/MongodbProviderFacade");
describe('MongodbProviderFacade', function () {
    it('calls make() to create new instance of MongodbProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        MongodbProviderFacade_1.MongodbProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.MongodbProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
