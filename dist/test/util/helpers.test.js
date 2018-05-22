"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Eloquent_1 = require("../../lib/model/Eloquent");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const helpers_1 = require("../../lib/util/helpers");
const collect_js_1 = require("collect.js");
EloquentDriverProviderFacade_1.EloquentDriverProviderFacade.register(DummyDriver_1.DummyDriver, 'dummy', true);
class User extends Eloquent_1.Eloquent {
}
User.className = 'User';
describe('isModel()', function () {
    it('determines the value is instanceof Model or not', function () {
        expect(helpers_1.isModel(new User())).toBe(true);
        expect(helpers_1.isModel({})).toBe(false);
    });
});
describe('isCollection()', function () {
    it('determines the value is instanceof Model or not', function () {
        expect(helpers_1.isCollection(collect_js_1.default([]))).toBe(true);
        expect(helpers_1.isCollection([])).toBe(false);
        expect(helpers_1.isCollection(new User())).toBe(false);
        expect(helpers_1.isCollection({})).toBe(false);
    });
});
