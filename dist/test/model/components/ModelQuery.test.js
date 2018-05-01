"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ModelQuery_1 = require("../../../lib/model/components/ModelQuery");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const Model_1 = require("../../../lib/model/Model");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Eloquent/ModelQuery', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelQuery" as class name', function () {
                const query = new ModelQuery_1.ModelQuery();
                expect(query.getClassName()).toEqual('NajsEloquent.Model.Component.ModelQuery');
            });
        });
        describe('.extend()', function () {
            it('assigns newQuery to prototype which return driver.newQuery()', function () {
                const prototype = {};
                const query = new ModelQuery_1.ModelQuery();
                query.extend(prototype, [], {});
                expect(prototype['newQuery'] === ModelQuery_1.ModelQuery.newQuery).toBe(true);
            });
            for (const name of ModelQuery_1.ModelQuery.ForwardToQueryBuilderMethods) {
                it('calls .forwardToQueryBuilder() with name = "' + name + '"', function () {
                    const forwardToQueryBuilderStub = Sinon.stub(ModelQuery_1.ModelQuery, 'forwardToQueryBuilder');
                    forwardToQueryBuilderStub.returns('forward-to-' + name);
                    const prototype = {};
                    const query = new ModelQuery_1.ModelQuery();
                    query.extend(prototype, [], {});
                    expect(prototype[name] === 'forward-to-' + name).toBe(true);
                    forwardToQueryBuilderStub.restore();
                });
            }
        });
        describe('ForwardToQueryBuilderMethods', function () {
            it('contains started query functions', function () {
                expect(ModelQuery_1.ModelQuery.ForwardToQueryBuilderMethods.sort()).toEqual([
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
            for (const name of ModelQuery_1.ModelQuery.ForwardToQueryBuilderMethods) {
                expect(typeof Test.prototype[name] !== 'function').toBe(true);
            }
        });
        class User extends Eloquent_1.Eloquent {
        }
        User.className = 'User';
        it('is available for class which extends from Eloquent<T>', function () {
            for (const name of ModelQuery_1.ModelQuery.ForwardToQueryBuilderMethods) {
                expect(typeof User.prototype[name] === 'function').toBe(true);
            }
        });
        it('forwards .newQuery() to driver.newQuery()', function () {
            const driver = {
                newQuery() {
                    return 'anything';
                }
            };
            const user = new User();
            user['driver'] = driver;
            expect(user.newQuery()).toEqual('anything');
        });
        for (const name of ModelQuery_1.ModelQuery.ForwardToQueryBuilderMethods) {
            it('forwards all params to driver.newQuery().' + name + '()', function () {
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
                expect(user[name]('a')).toEqual('anything-a');
                expect(targetSpy.calledWith('a')).toBe(true);
                expect(user[name]('a', 'b')).toEqual('anything-a-b');
                expect(targetSpy.calledWith('a', 'b')).toBe(true);
                expect(user[name](['a', 'b', 'c'])).toEqual('anything-a,b,c');
                expect(targetSpy.calledWith(['a', 'b', 'c'])).toBe(true);
            });
        }
    });
});
