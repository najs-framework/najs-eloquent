"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Eloquent_1 = require("../../lib/model/Eloquent");
const DummyDriver_1 = require("../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model Inheritance', function () {
    describe('Override functions', function () {
        class Test extends Eloquent_1.Eloquent {
            getAttribute(key) {
                const value = super.getAttribute(key);
                return this.doSomething(value);
            }
            doSomething(value) {
                return value + '-overridden';
            }
        }
        Test.className = 'Test';
        it('could override Eloquent function', function () {
            const test = new Test();
            test.forceFill({ any: 'thing' });
            expect(test.getAttribute('any')).toEqual('thing-overridden');
        });
    });
});
