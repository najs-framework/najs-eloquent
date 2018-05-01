"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const functions_1 = require("../../lib/util/functions");
describe('in_array()', function () {
    it('returns false if haystack is not found', function () {
        expect(functions_1.in_array('needle')).toBe(false);
    });
    it('returns true if the needle in haystack', function () {
        expect(functions_1.in_array('a', ['a', 'b'])).toBe(true);
    });
    it('returns false if needle not in haystack', function () {
        expect(functions_1.in_array('e', ['c', 'd'], ['a', 'b'])).toBe(false);
    });
    it('works with multiple array', function () {
        expect(functions_1.in_array('a', ['c', 'd'], ['a', 'b'])).toBe(true);
    });
});
