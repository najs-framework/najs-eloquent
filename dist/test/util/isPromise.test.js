"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const isPromise_1 = require("../../lib/util/isPromise");
const promise = { then: function () { } };
const asyncResult = async function () { };
describe('isPromise', function () {
    describe('called with a promise', function () {
        it('returns true', function () {
            expect(isPromise_1.isPromise(promise)).toBe(true);
        });
    });
    describe('called with a asyncResult', function () {
        it('returns true', function () {
            expect(isPromise_1.isPromise(asyncResult())).toBe(true);
        });
    });
    describe('called with null', function () {
        it('returns false', function () {
            // tslint:disable-next-line
            expect(isPromise_1.isPromise(null)).toBe(false);
        });
    });
    describe('called with undefined', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise(undefined)).toBe(false);
        });
    });
    describe('called with a number', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise(0)).toBe(false);
            expect(isPromise_1.isPromise(-42)).toBe(false);
            expect(isPromise_1.isPromise(42)).toBe(false);
        });
    });
    describe('called with a string', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise('')).toBe(false);
            expect(isPromise_1.isPromise('then')).toBe(false);
        });
    });
    describe('called with a bool', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise(false)).toBe(false);
            expect(isPromise_1.isPromise(true)).toBe(false);
        });
    });
    describe('called with an object', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise({})).toBe(false);
            expect(isPromise_1.isPromise({ then: true })).toBe(false);
        });
    });
    describe('called with an array', function () {
        it('returns false', function () {
            expect(isPromise_1.isPromise([])).toBe(false);
            expect(isPromise_1.isPromise([true])).toBe(false);
        });
    });
});
