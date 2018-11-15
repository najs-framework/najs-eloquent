"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ModelProxyHandler_1 = require("../../lib/model/ModelProxyHandler");
describe('ModelProxyHandler', function () {
    describe('.get()', function () {
        it('calls and returns driver.proxify() with get if driver.shouldBeProxied() returns true', function () {
            const driver = {
                shouldBeProxied() {
                    return true;
                },
                proxify() {
                    return 'anything';
                }
            };
            const model = {
                driver: driver
            };
            const proxifySpy = Sinon.spy(driver, 'proxify');
            expect(ModelProxyHandler_1.ModelProxyHandler.get.call(undefined, model, 'key')).toEqual('anything');
            expect(proxifySpy.calledWith('get', model, 'key')).toBe(true);
        });
        it('returns target[key] with get if driver.shouldBeProxied() returns false', function () {
            const driver = {
                shouldBeProxied() {
                    return false;
                },
                proxify() {
                    return 'anything';
                }
            };
            const model = {
                driver: driver,
                key: 'value'
            };
            const proxifySpy = Sinon.spy(driver, 'proxify');
            expect(ModelProxyHandler_1.ModelProxyHandler.get.call(undefined, model, 'key')).toEqual('value');
            expect(proxifySpy.calledWith('get', model, 'key')).toBe(false);
        });
    });
    describe('.set()', function () {
        it('calls and returns driver.proxify() with get if driver.shouldBeProxied() returns true', function () {
            const driver = {
                shouldBeProxied() {
                    return true;
                },
                proxify() {
                    return 'anything';
                }
            };
            const model = {
                driver: driver
            };
            const proxifySpy = Sinon.spy(driver, 'proxify');
            expect(ModelProxyHandler_1.ModelProxyHandler.set.call(undefined, model, 'key', 'value')).toEqual('anything');
            expect(proxifySpy.calledWith('set', model, 'key', 'value')).toBe(true);
        });
        it('assigns value to target[key] with get if driver.shouldBeProxied() returns false', function () {
            const driver = {
                shouldBeProxied() {
                    return false;
                },
                proxify() {
                    return 'anything';
                }
            };
            const model = {
                driver: driver
            };
            const proxifySpy = Sinon.spy(driver, 'proxify');
            ModelProxyHandler_1.ModelProxyHandler.set.call(undefined, model, 'key', 'value');
            expect(model['key']).toEqual('value');
            expect(proxifySpy.calledWith('get', model, 'key')).toBe(false);
        });
    });
});
