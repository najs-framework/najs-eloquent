"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_facade_1 = require("najs-facade");
const container_1 = require("../../lib/facades/container");
describe('Najs Facade Container', function () {
    it('is an instance of FacadeContainer, it has global reference called "NajsEloquent"', function () {
        expect(container_1.container).toBeInstanceOf(najs_facade_1.FacadeContainer);
        expect(global['NajsEloquent'] === container_1.container).toBe(true);
    });
});
