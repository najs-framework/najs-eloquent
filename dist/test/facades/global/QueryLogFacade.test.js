"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/query-log/FlipFlopQueryLog");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const QueryLogFacade_1 = require("../../../lib/facades/global/QueryLogFacade");
describe('QueryLogFacade', function () {
    it('calls make() to create new instance of FlipFlopQueryLog as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        QueryLogFacade_1.QueryLogFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.QueryLog.FlipFlopQueryLog)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
