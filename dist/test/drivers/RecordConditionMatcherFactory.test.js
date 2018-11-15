"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const najs_binding_1 = require("najs-binding");
const RecordConditionMatcherFactory_1 = require("../../lib/drivers/RecordConditionMatcherFactory");
const RecordConditionMatcher_1 = require("../../lib/drivers/RecordConditionMatcher");
describe('RecordConditionMatcherFactory', function () {
    it('implements Autoload with singleton under name "NajsEloquent.Driver.Memory.RecordConditionMatcherFactory"', function () {
        const factory = najs_binding_1.make(RecordConditionMatcherFactory_1.RecordConditionMatcherFactory);
        expect(factory.getClassName()).toEqual('NajsEloquent.Driver.Memory.RecordConditionMatcherFactory');
        const anotherInstance = najs_binding_1.make(RecordConditionMatcherFactory_1.RecordConditionMatcherFactory);
        expect(anotherInstance === factory).toBe(true);
    });
    describe('.make()', function () {
        it('simply returns an instance of RecordConditionMatcher', function () {
            const factory = najs_binding_1.make(RecordConditionMatcherFactory_1.RecordConditionMatcherFactory);
            expect(factory.make({ bool: 'and', field: 'test', operator: '=', value: 'any' })).toBeInstanceOf(RecordConditionMatcher_1.RecordConditionMatcher);
        });
    });
    describe('.transform()', function () {
        it('does nothing, returns the matcher', function () {
            const factory = najs_binding_1.make(RecordConditionMatcherFactory_1.RecordConditionMatcherFactory);
            const data = {};
            expect(factory.transform(data) === data).toBe(true);
        });
    });
});
