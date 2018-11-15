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
describe('parse_string_with_dot_notation()', function () {
    it('works with empty string', function () {
        const result = functions_1.parse_string_with_dot_notation('');
        expect(result).toEqual({ first: '', last: '', afterFirst: '', beforeLast: '', parts: [] });
    });
    it('works with string has no dot notation', function () {
        const result = functions_1.parse_string_with_dot_notation('name');
        expect(result).toEqual({ first: 'name', last: 'name', afterFirst: '', beforeLast: '', parts: ['name'] });
    });
    it('works with string has dot notation', function () {
        const dataset = {
            'a.b': { first: 'a', last: 'b', afterFirst: 'b', beforeLast: 'a', parts: ['a', 'b'] },
            'a.b.c': { first: 'a', last: 'c', afterFirst: 'b.c', beforeLast: 'a.b', parts: ['a', 'b', 'c'] },
            'a.b.c.d': { first: 'a', last: 'd', afterFirst: 'b.c.d', beforeLast: 'a.b.c', parts: ['a', 'b', 'c', 'd'] },
            'a..b.c': { first: 'a', last: 'c', afterFirst: 'b.c', beforeLast: 'a.b', parts: ['a', 'b', 'c'] },
            'a..b..c..d': { first: 'a', last: 'd', afterFirst: 'b.c.d', beforeLast: 'a.b.c', parts: ['a', 'b', 'c', 'd'] },
            '...': { first: '', last: '', afterFirst: '', beforeLast: '', parts: [] }
        };
        for (const string in dataset) {
            const result = functions_1.parse_string_with_dot_notation(string);
            expect(result).toEqual(dataset[string]);
        }
    });
});
describe('find_base_prototypes', function () {
    class A {
    }
    class B extends A {
    }
    class C extends B {
    }
    class D extends C {
    }
    it('used for finding the base prototypes of class', function () {
        const bases = functions_1.find_base_prototypes(D.prototype, Object.prototype);
        expect(bases).toEqual([C.prototype, B.prototype, A.prototype, Object.prototype]);
    });
    it('used for finding the base prototypes until the root class', function () {
        expect(functions_1.find_base_prototypes(D.prototype, C.prototype)).toEqual([C.prototype]);
        expect(functions_1.find_base_prototypes(D.prototype, B.prototype)).toEqual([C.prototype, B.prototype]);
        expect(functions_1.find_base_prototypes(D.prototype, A.prototype)).toEqual([C.prototype, B.prototype, A.prototype]);
    });
});
