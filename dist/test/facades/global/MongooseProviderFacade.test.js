"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/BuiltinMongooseProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const MongooseProviderFacade_1 = require("../../../lib/facades/global/MongooseProviderFacade");
describe('MongooseProviderFacade', function () {
    it('calls make() to create new instance of BuiltinMongooseProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        MongooseProviderFacade_1.MongooseProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquentClass.MongooseProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
});
