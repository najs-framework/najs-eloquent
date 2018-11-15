"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ExecuteQuery_1 = require("../../../lib/query-builders/mixin/ExecuteQuery");
const isPromise_1 = require("../../../lib/util/isPromise");
describe('ExecuteQuery', function () {
    const functions = ['count', 'update', 'delete', 'restore', 'execute'];
    for (const func of functions) {
        describe(`.${func}()`, function () {
            it(`calls and returns to handler.getQueryExecutor().${func}()`, async function () {
                const result = {};
                const queryExecutor = {
                    [func]: async function () {
                        return result;
                    }
                };
                const handler = {
                    getQueryExecutor() {
                        return queryExecutor;
                    }
                };
                const spy = Sinon.spy(queryExecutor, func);
                const queryBuilder = {
                    handler: handler
                };
                const callResult = ExecuteQuery_1.ExecuteQuery[func].call(queryBuilder);
                expect(isPromise_1.isPromise(callResult)).toBe(true);
                expect((await callResult) === result).toBe(true);
                expect(spy.calledWith()).toBe(true);
            });
        });
    }
});
