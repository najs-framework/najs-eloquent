"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/providers/MongooseProvider");
const NajsBinding = require("najs-binding");
const Sinon = require("sinon");
const constants_1 = require("../../../lib/constants");
const MongooseProviderFacade_1 = require("../../../lib/facades/global/MongooseProviderFacade");
const mongoose_1 = require("mongoose");
describe('MongooseProviderFacade', function () {
    it('calls make() to create new instance of MongooseProvider as a facade root', function () {
        const makeSpy = Sinon.spy(NajsBinding, 'make');
        MongooseProviderFacade_1.MongooseProviderFacade.reloadFacadeRoot();
        expect(makeSpy.calledWith(constants_1.NajsEloquent.Provider.MongooseProvider)).toBe(true);
        expect(makeSpy.calledOnce).toBe(true);
    });
    describe('.getMongooseInstance()', function () {
        it('returns mongoose instance', function () {
            MongooseProviderFacade_1.MongooseProviderFacade.getMongooseInstance();
            MongooseProviderFacade_1.MongooseProviderFacade.createModelFromSchema('Test', new mongoose_1.Schema({}));
        });
    });
});
