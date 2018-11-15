"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const EventPublicApi_1 = require("../../../lib/features/mixin/EventPublicApi");
describe('EventPublicApi', function () {
    const eventEmitter = {
        on() {
            return 'on-result';
        },
        off() {
            return 'off-result';
        },
        once() {
            return 'once-result';
        },
        emit() {
            return 'emit-result';
        }
    };
    const eventFeature = {
        fire() {
            return 'fire-result';
        },
        getEventEmitter() {
            return eventEmitter;
        }
    };
    const model = {
        driver: {
            getEventFeature() {
                return eventFeature;
            }
        }
    };
    describe('.fire()', function () {
        it('calls and returns EventFeature.fire()', function () {
            const stub = Sinon.stub(eventFeature, 'fire');
            stub.returns('anything');
            expect(EventPublicApi_1.EventPublicApi.fire.call(model, 'test', 'args')).toEqual('anything');
            expect(stub.calledWith(model, 'test', 'args')).toBe(true);
            stub.restore();
        });
    });
    describe('.emit()', function () {
        it('calls and returns EventFeature.getEventEmitter().emit()', function () {
            const stub = Sinon.stub(eventEmitter, 'emit');
            stub.returns('anything');
            expect(EventPublicApi_1.EventPublicApi.emit.call(model, 'test', 'data', true)).toEqual('anything');
            expect(stub.calledWith('test', 'data', true)).toBe(true);
            stub.restore();
        });
    });
    describe('.on()', function () {
        it('is chainable, calls EventFeature.getEventEmitter().on()', function () {
            const stub = Sinon.stub(eventEmitter, 'on');
            stub.returns('anything');
            function listener() { }
            expect(EventPublicApi_1.EventPublicApi.on.call(model, 'test', listener) === model).toBe(true);
            expect(stub.calledWith('test', listener)).toBe(true);
            stub.restore();
        });
    });
    describe('.off()', function () {
        it('is chainable, calls EventFeature.getEventEmitter().off()', function () {
            const stub = Sinon.stub(eventEmitter, 'off');
            stub.returns('anything');
            function listener() { }
            expect(EventPublicApi_1.EventPublicApi.off.call(model, 'test', listener) === model).toBe(true);
            expect(stub.calledWith('test', listener)).toBe(true);
            stub.restore();
        });
    });
    describe('.once()', function () {
        it('is chainable, calls EventFeature.getEventEmitter().once()', function () {
            const stub = Sinon.stub(eventEmitter, 'once');
            stub.returns('anything');
            function listener() { }
            expect(EventPublicApi_1.EventPublicApi.once.call(model, 'test', listener) === model).toBe(true);
            expect(stub.calledWith('test', listener)).toBe(true);
            stub.restore();
        });
    });
});
