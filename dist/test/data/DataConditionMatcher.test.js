"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Lodash = require("lodash");
const DataConditionMatcher_1 = require("../../lib/data/DataConditionMatcher");
const reader = {
    getAttribute(data, field) {
        return data[field];
    },
    pick(data, fields) {
        return data;
    },
    toComparable(value) {
        return value;
    }
};
describe('DataConditionMatcher', function () {
    describe('constructor()', function () {
        it('calls reader.toComparable() and assigns to value, but does not assigned to originalValue if the value and comparable value are the same', function () {
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            expect(matcher['value']).toEqual('compared');
            expect(matcher['originalValue']).toBeUndefined();
        });
        it('calls reader.toComparable() and assigns to value, given value will be assigned to originalValue', function () {
            const customReader = {
                getAttribute(data, field) {
                    return data[field];
                },
                pick(data, fields) {
                    return data;
                },
                toComparable(value) {
                    return 'comparable-' + value;
                }
            };
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', customReader);
            expect(matcher['value']).toEqual('comparable-compared');
            expect(matcher['originalValue']).toEqual('compared');
        });
    });
    describe('.isMatch', function () {
        const dataset = [
            { operator: '=', calls: 'isEqual', inverse: false },
            { operator: '==', calls: 'isEqual', inverse: false },
            { operator: '!=', calls: 'isEqual', inverse: true },
            { operator: '<>', calls: 'isEqual', inverse: true },
            { operator: '<', calls: 'isLessThan', inverse: false },
            { operator: '<=', calls: 'isLessThanOrEqual', inverse: false },
            { operator: '=<', calls: 'isLessThanOrEqual', inverse: false },
            { operator: '>', calls: 'isGreaterThan', inverse: false },
            { operator: '>=', calls: 'isGreaterThanOrEqual', inverse: false },
            { operator: '=>', calls: 'isGreaterThanOrEqual', inverse: false },
            { operator: 'in', calls: 'isInArray', inverse: false },
            { operator: 'not-in', calls: 'isInArray', inverse: true },
            { operator: 'hum', calls: false, inverse: true }
        ];
        for (const data of dataset) {
            if (data.calls === false) {
                it('returns false if the operator is not match', function () {
                    const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', data.operator, 'compared', reader);
                    const record = {
                        getAttribute() {
                            return 'record-value';
                        }
                    };
                    expect(matcher.isMatch(record)).toBe(false);
                });
                continue;
            }
            it('returns false if the operator is not match', function () {
                const record = {
                    getAttribute() {
                        return 'record-value';
                    }
                };
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', data.operator, 'compared', reader);
                const stub = Sinon.stub(matcher, data.calls);
                stub.returns(true);
                expect(matcher.isMatch(record)).toBe(data.inverse ? false : true);
                expect(stub.calledWith(record)).toBe(true);
                stub.resetHistory();
                stub.returns(false);
                expect(matcher.isMatch(record)).toBe(data.inverse ? true : false);
                expect(stub.calledWith(record)).toBe(true);
                stub.resetHistory();
            });
        }
    });
    describe('.isEqual()', function () {
        const dataset = [
            { a: undefined, b: undefined, match: true },
            { a: 1, b: 1, match: true },
            { a: -1, b: -1, match: true },
            { a: 0, b: 0, match: true },
            { a: '1', b: '1', match: true },
            { a: '', b: '', match: true },
            { a: {}, b: {}, match: true },
            { a: [], b: [], match: true },
            { a: { a: 'x' }, b: { a: 'x' }, match: true },
            { a: new Date(2018, 1, 1, 0, 0, 0, 10000), b: new Date(2018, 1, 1, 0, 0, 0, 10000), match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.isEqual() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'isEqual');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isEqual(record);
            expect(spy.calledWith('record-value', 'compared')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isEqual(record)).toBe(dataset[i].match);
            });
        }
    });
    describe('.isLessThan()', function () {
        const dataset = [
            { a: 1, b: 2, match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.lt() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'lt');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isLessThan(record);
            expect(spy.calledWith('record-value', 'compared')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isLessThan(record)).toBe(dataset[i].match);
            });
        }
    });
    describe('.isLessThanOrEqual()', function () {
        const dataset = [
            { a: 1, b: 2, match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.lte() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'lte');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isLessThanOrEqual(record);
            expect(spy.calledWith('record-value', 'compared')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isLessThanOrEqual(record)).toBe(dataset[i].match);
            });
        }
    });
    describe('.isGreaterThan()', function () {
        const dataset = [
            { a: 2, b: 1, match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.gt() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'gt');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isGreaterThan(record);
            expect(spy.calledWith('record-value', 'compared')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isGreaterThan(record)).toBe(dataset[i].match);
            });
        }
    });
    describe('.isGreaterThanOrEqual()', function () {
        const dataset = [
            { a: 2, b: 1, match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.gte() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'gte');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'compared', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isGreaterThanOrEqual(record);
            expect(spy.calledWith('record-value', 'compared')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isGreaterThanOrEqual(record)).toBe(dataset[i].match);
            });
        }
    });
    describe('.isInArray()', function () {
        const dataset = [
            { a: 1, b: [1, 2, 3], match: true }
            // TODO: add more cases
        ];
        it('calls Lodash.includes() to compare values', function () {
            const spy = Sinon.spy(Lodash, 'includes');
            const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', 'array', reader);
            const record = {
                test: 'record-value'
            };
            matcher.isInArray(record);
            expect(spy.calledWith('array', 'record-value')).toBe(true);
            spy.restore();
        });
        for (let i = 0; i < dataset.length; i++) {
            const description = `case #${i}` + (typeof dataset[i].desc === 'undefined' ? '' : dataset[i].desc);
            it(description, function () {
                const matcher = new DataConditionMatcher_1.DataConditionMatcher('test', '=', dataset[i].b, reader);
                const record = {
                    test: dataset[i].a
                };
                expect(matcher.isInArray(record)).toBe(dataset[i].match);
            });
        }
    });
});
