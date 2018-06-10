"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ModelEvent_1 = require("../../../lib/model/components/ModelEvent");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
const EVENT_EMITTER_FUNCTIONS = {
    on: true,
    off: true,
    once: true,
    emit: false
};
describe('ModelEvent', function () {
    it('implements Autoload with class name "NajsEloquent.Model.Component.ModelEvent"', function () {
        const modelEvent = new ModelEvent_1.ModelEvent();
        expect(modelEvent.getClassName()).toEqual('NajsEloquent.Model.Component.ModelEvent');
    });
    for (const name in EVENT_EMITTER_FUNCTIONS) {
        class Test extends Eloquent_1.Eloquent {
        }
        Test.className = 'Test';
        describe(`.${name}()`, function () {
            it(`passes all argument to this.eventEmitter.${name}()`, function () {
                const instance = new Test();
                // eventEmitter is initialize dynamically
                instance.on('something', function () { });
                const stub = Sinon.stub(instance['eventEmitter'], name);
                stub.returns('anything');
                if (EVENT_EMITTER_FUNCTIONS[name]) {
                    expect(instance[name]('a', 'b', 'c') === instance).toBe(true);
                }
                else {
                    expect(instance[name]('a', 'b', 'c')).toEqual('anything');
                }
                expect(stub.calledWith('a', 'b', 'c')).toBe(true);
            });
        });
    }
});
