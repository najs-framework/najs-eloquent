"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/drivers/memory/MemoryDataSource");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const MemoryDataSourceProviderFacade_1 = require("../../../lib/facades/global/MemoryDataSourceProviderFacade");
describe('MemoryDataSourceProviderFacade', function () {
    it('calls make() to create new instance of MemoryDataSourceFacade as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        MemoryDataSourceProviderFacade_1.MemoryDataSourceProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.MemoryDataSourceProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
