"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const StaticQuery_1 = require("../../../lib/model/components/StaticQuery");
const Model_1 = require("../../../lib/model/Model");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('DriverComponents/StaticQuery', function () {
    describe('Unit', function () {
        it('implements IAutoload and returns "NajsEloquent.Driver.Component.StaticQuery" as class name', function () {
            const staticQuery = new StaticQuery_1.StaticQuery();
            expect(staticQuery.getClassName()).toEqual('NajsEloquent.Driver.Component.StaticQuery');
        });
        describe('.extend()', function () {
            it('assigns newQuery to prototype which return driver.newQuery()', function () {
                class Test {
                }
                const prototype = Test.prototype;
                const query = new StaticQuery_1.StaticQuery();
                query.extend(prototype, [], {});
                expect(Test['newQuery'] === StaticQuery_1.StaticQuery.newQuery).toBe(true);
            });
            for (const name of StaticQuery_1.StaticQuery.ForwardToNewQueryMethods) {
                it('calls .forwardToNewQuery() with name = "' + name + '"', function () {
                    const forwardToNewQueryStub = Sinon.stub(StaticQuery_1.StaticQuery, 'forwardToNewQuery');
                    forwardToNewQueryStub.returns('forward-to-' + name);
                    class Test {
                    }
                    const prototype = Test.prototype;
                    const query = new StaticQuery_1.StaticQuery();
                    query.extend(prototype, [], {});
                    expect(Test[name] === 'forward-to-' + name).toBe(true);
                    forwardToNewQueryStub.restore();
                });
            }
        });
        describe('ForwardToNewQueryMethods', function () {
            it('contains started query functions', function () {
                expect(StaticQuery_1.StaticQuery.ForwardToNewQueryMethods.sort()).toEqual([
                    'queryName',
                    'setLogGroup',
                    'select',
                    'limit',
                    'orderBy',
                    'orderByAsc',
                    'orderByDesc',
                    'where',
                    'whereNot',
                    'whereIn',
                    'whereNotIn',
                    'whereNull',
                    'whereNotNull',
                    'whereBetween',
                    'whereNotBetween',
                    'withTrashed',
                    'onlyTrashed',
                    'first',
                    'find',
                    'get',
                    'all',
                    'count',
                    'pluck',
                    'findById',
                    'findOrFail',
                    'firstOrFail'
                ].sort());
            });
        });
    });
    describe('Integration', function () {
        it('is not available for class which extends from Model<T>', function () {
            class Test extends Model_1.Model {
            }
            for (const name of StaticQuery_1.StaticQuery.ForwardToNewQueryMethods) {
                expect(typeof Test[name] !== 'function').toBe(true);
            }
        });
        class User extends Eloquent_1.Eloquent {
        }
        User.className = 'User';
        it('create new instance by make(Class) and calls instance.newQuery()', function () {
            const driver = {
                newQuery() {
                    return 'anything';
                }
            };
            const user = new User();
            user['driver'] = driver;
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns(user);
            expect(User['newQuery']()).toEqual('anything');
            expect(makeStub.calledWith(User)).toBe(true);
            makeStub.restore();
        });
        for (const name of StaticQuery_1.StaticQuery.ForwardToNewQueryMethods) {
            it('forwards all params to this.newQuery().' + name + '()', function () {
                const target = function () {
                    return 'anything-' + Array.from(arguments).join('-');
                };
                const targetSpy = Sinon.spy(target);
                const driver = {
                    newQuery() {
                        return {
                            [name]: targetSpy
                        };
                    }
                };
                const user = new User();
                user['driver'] = driver;
                const makeStub = Sinon.stub(NajsBinding, 'make');
                makeStub.returns(user);
                expect(User[name]('a')).toEqual('anything-a');
                expect(targetSpy.calledWith('a')).toBe(true);
                expect(User[name]('a', 'b')).toEqual('anything-a-b');
                expect(targetSpy.calledWith('a', 'b')).toBe(true);
                expect(User[name](['a', 'b', 'c'])).toEqual('anything-a,b,c');
                expect(targetSpy.calledWith(['a', 'b', 'c'])).toBe(true);
                makeStub.restore();
            });
        }
    });
});
