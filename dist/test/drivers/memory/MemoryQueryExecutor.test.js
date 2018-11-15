"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ExecutorBase_1 = require("../../../lib/drivers/ExecutorBase");
const ExecutorUtils_1 = require("../../../lib/query-builders/shared/ExecutorUtils");
const Record_1 = require("../../../lib/drivers/Record");
const QueryLogFacade_1 = require("../../../lib/facades/global/QueryLogFacade");
const DataCollector_1 = require("../../../lib/data/DataCollector");
const MemoryDataSource_1 = require("../../../lib/drivers/memory/MemoryDataSource");
const MemoryDataSourceProviderFacade_1 = require("../../../lib/facades/global/MemoryDataSourceProviderFacade");
const MemoryQueryBuilder_1 = require("../../../lib/drivers/memory/MemoryQueryBuilder");
const MemoryQueryBuilderHandler_1 = require("../../../lib/drivers/memory/MemoryQueryBuilderHandler");
const MomentProviderFacade_1 = require("../../../lib/facades/global/MomentProviderFacade");
const RecordDataReader_1 = require("../../../lib/drivers/RecordDataReader");
MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.register(MemoryDataSource_1.MemoryDataSource, 'memory', true);
const User = {
    getModelName() {
        return 'User';
    },
    getPrimaryKeyName() {
        return 'id';
    }
};
const Role = {
    getModelName() {
        return 'Role';
    },
    getPrimaryKeyName() {
        return 'id';
    }
};
const UserDataSource = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.create(User);
const RoleDataSource = MemoryDataSourceProviderFacade_1.MemoryDataSourceProvider.create(Role);
describe('MemoryQueryExecutor', function () {
    const dataset = [
        { first_name: 'john', last_name: 'doe', age: 30 },
        { first_name: 'jane', last_name: 'doe', age: 25 },
        { first_name: 'tony', last_name: 'stark', age: 40 },
        { first_name: 'thor', last_name: 'god', age: 1000 },
        { first_name: 'captain', last_name: 'american', age: 100 },
        { first_name: 'tony', last_name: 'stewart', age: 40 },
        { first_name: 'peter', last_name: 'parker', age: 15 }
    ];
    beforeAll(async function () {
        for (const data of dataset) {
            UserDataSource.add(new Record_1.Record(data));
        }
        await UserDataSource.write();
        for (let i = 0; i < 10; i++) {
            RoleDataSource.add(new Record_1.Record({
                name: 'role-' + i,
                deleted_at: new Date()
            }));
        }
        await RoleDataSource.write();
    });
    beforeEach(function () {
        QueryLogFacade_1.QueryLog.clear().enable();
    });
    function expect_match_user(result, expected) {
        for (const name in expected) {
            expect(result.getAttribute(name)).toEqual(expected[name]);
        }
    }
    function expect_query_log(data, result = undefined, index = 0) {
        const logData = QueryLogFacade_1.QueryLog.pull()[index]['data'];
        if (typeof result !== undefined) {
            expect(logData['result'] === result).toBe(true);
        }
        expect(logData).toMatchObject(data);
    }
    function makeQueryBuilderHandler(model) {
        let fakeModel;
        if (typeof model === 'string') {
            fakeModel = {
                getModelName() {
                    return model;
                },
                getPrimaryKeyName() {
                    return 'id';
                },
                getDriver() {
                    return {
                        getSoftDeletesFeature() {
                            return {
                                hasSoftDeletes() {
                                    return false;
                                }
                            };
                        },
                        getTimestampsFeature() {
                            return {
                                hasTimestamps() {
                                    return false;
                                }
                            };
                        }
                    };
                },
                getRecordName() {
                    return model;
                }
            };
        }
        else {
            fakeModel = model;
        }
        return new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler(fakeModel);
    }
    function makeQueryBuilder(handler) {
        return new MemoryQueryBuilder_1.MemoryQueryBuilder(handler);
    }
    it('extends ExecutorBase', function () {
        const executor = makeQueryBuilderHandler('User').getQueryExecutor();
        expect(executor).toBeInstanceOf(ExecutorBase_1.ExecutorBase);
    });
    describe('.get()', function () {
        it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function () {
            const handler = makeQueryBuilderHandler('User');
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: 'MemoryDataSourceProvider.create("User").getCollector().exec()',
                action: 'get'
            }, result);
            expect(result.length).toEqual(7);
            for (let i = 0; i < 7; i++) {
                expect_match_user(result[i], dataset[i]);
            }
        });
        it('returns an empty collection if no result', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'no-one');
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'no-one' }]
                })}).exec()`
            }, result);
            expect(result.length === 0).toBe(true);
        });
        it('can get data by query builder, case 1', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 1000);
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 1000 }]
                })}).exec()`,
                action: 'get'
            }, result);
            expect(result.length).toEqual(1);
            expect_match_user(result[0], dataset[3]);
        });
        it('can get data by query builder, case 2', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 40);
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 40 }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'get'
            }, result);
            expect(result.length).toEqual(2);
            expect_match_user(result[0], dataset[2]);
            expect_match_user(result[1], dataset[5]);
        });
        it('can get data by query builder, case 3', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .where('last_name', 'stark');
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 40 }, { field: 'last_name', operator: '=', value: 'stark' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'get'
            }, result);
            expect(result.length).toEqual(1);
            expect_match_user(result[0], dataset[2]);
        });
        it('can get data by query builder, case 4', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .orWhere('first_name', 'peter');
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 40 }, { field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'get'
            }, result);
            expect(result.length).toEqual(3);
            expect_match_user(result[0], dataset[2]);
            expect_match_user(result[1], dataset[5]);
            expect_match_user(result[2], dataset[6]);
        });
        it('can get data by query builder, case 5', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .orWhere('first_name', 'peter')
                .orderBy('id', 'desc');
            const result = await handler.getQueryExecutor().get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().orderBy(${JSON.stringify([
                    ['id', 'desc']
                ])}).filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 40 }, { field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'get'
            }, result);
            expect(result.length).toEqual(3);
            expect_match_user(result[0], dataset[6]);
            expect_match_user(result[1], dataset[5]);
            expect_match_user(result[2], dataset[2]);
        });
        it('returns an empty array if executeMode is disabled', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .orWhere('first_name', 'peter')
                .orderBy('id', 'desc');
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .get();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().orderBy(${JSON.stringify([
                    ['id', 'desc']
                ])}).filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 40 }, { field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'get'
            }, result);
            expect(result).toEqual([]);
        });
    });
    describe('.first()', function () {
        it('finds first document of collection and return an instance of Eloquent<T>', async function () {
            const handler = makeQueryBuilderHandler('User');
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect_match_user(result, dataset[0]);
        });
        it('finds first document of collection and return an instance of Eloquent<T>', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).orderBy('id', 'desc');
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().orderBy(${JSON.stringify([
                    ['id', 'desc']
                ])}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect_match_user(result, dataset[6]);
        });
        it('returns undefined if no result', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'no-one');
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'no-one' }]
                })}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect(result).toBeUndefined();
        });
        it('can find data by query builder, case 1', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 1000);
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 1000 }]
                })}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect_match_user(result, dataset[3]);
        });
        it('can find data by query builder, case 2', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .orWhere('first_name', 'jane');
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 40 }, { field: 'first_name', operator: '=', value: 'jane' }]
                })}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect_match_user(result, dataset[1]);
        });
        it('can find data by query builder, case 3', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const result = await handler.getQueryExecutor().first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [
                        { field: 'first_name', operator: '=', value: 'tony' },
                        { field: 'last_name', operator: '=', value: 'stewart' }
                    ]
                })}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect_match_user(result, dataset[5]);
        });
        // it('can find data by .native() before using query functions of query builder', async function() {
        //   const handler = makeQueryBuilderHandler('users')
        //   const result = await makeQueryBuilder(handler)
        //     .native(function(collection) {
        //       return collection.findOne({
        //         first_name: 'tony'
        //       })
        //     })
        //     .execute()
        //   expect_match_user(result, dataset[2])
        // })
        // it('can find data by native() after using query functions of query builder', async function() {
        //   const handler = makeQueryBuilderHandler('users')
        //   const result = await makeQueryBuilder(handler)
        //     .where('age', 40)
        //     .orWhere('age', 1000)
        //     .native(function(collection, conditions) {
        //       return collection.findOne(conditions, { sort: [['last_name', -1]] })
        //     })
        //     .execute()
        //   expect_match_user(result, dataset[5])
        // })
        // it('can find data by native() and modified after using query functions of query builder', async function() {
        //   const handler = makeQueryBuilderHandler('users')
        //   const result = await await makeQueryBuilder(handler)
        //     .where('age', 40)
        //     .orWhere('age', 1000)
        //     .native(function(collection) {
        //       return collection.findOne({
        //         first_name: 'thor'
        //       })
        //     })
        //     .execute()
        //   expect_match_user(result, dataset[3])
        // })
        it('returns an undefined if executeMode is disabled', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 40)
                .orWhere('first_name', 'jane');
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .first();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 40 }, { field: 'first_name', operator: '=', value: 'jane' }]
                })}).limit(1).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'first'
            }, result);
            expect(result).toBeUndefined();
        });
    });
    describe('.count()', function () {
        it('counts all data of records and returns a number', async function () {
            const handler = makeQueryBuilderHandler('User');
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(7);
        });
        it('returns 0 if no result', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'no-one');
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'no-one' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(0);
        });
        it('overrides select even .select was used', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).select('abc', 'def');
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(7);
        });
        it('overrides ordering even .orderBy was used', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).orderBy('abc');
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(7);
        });
        it('can count items by query builder, case 1', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 18)
                .orWhere('first_name', 'tony');
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $or: [{ field: 'age', operator: '=', value: 18 }, { field: 'first_name', operator: '=', value: 'tony' }]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(2);
        });
        it('can count items by query builder, case 2', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 1000)
                .orWhere('first_name', 'captain')
                .orderBy('last_name')
                .limit(10);
            const result = await handler.getQueryExecutor().count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().limit(10).filterBy(${JSON.stringify({
                    $or: [
                        { field: 'age', operator: '=', value: 1000 },
                        { field: 'first_name', operator: '=', value: 'captain' }
                    ]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(2);
        });
        it('returns 0 if executeMode is disabled', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('age', 1000)
                .orWhere('first_name', 'captain')
                .orderBy('last_name')
                .limit(10);
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .count();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().limit(10).filterBy(${JSON.stringify({
                    $or: [
                        { field: 'age', operator: '=', value: 1000 },
                        { field: 'first_name', operator: '=', value: 'captain' }
                    ]
                })}).exec()`,
                dataSource: 'NajsEloquent.Driver.Memory.MemoryDataSource',
                action: 'count'
            }, result);
            expect(result).toEqual(0);
        });
    });
    describe('.update()', function () {
        it('can update data of collection, returns result of dataSource.write()', async function () {
            let handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const result = await handler.getQueryExecutor().update({ age: 19 });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'update',
                records: [
                    {
                        origin: Object.assign({}, dataset[6], { age: 15 }),
                        modified: true,
                        updated: Object.assign({}, dataset[6], { age: 19 })
                    }
                ]
            }, result);
            expect(result).toEqual(true);
            handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const updatedResult = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }));
        });
        it('does not call dataSource.push() if the record is not modified', async function () {
            let handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const result = await handler.getQueryExecutor().update({ age: 19 });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'update',
                records: [
                    {
                        origin: Object.assign({}, dataset[6], { age: 19 }),
                        modified: false,
                        updated: Object.assign({}, dataset[6], { age: 19 })
                    }
                ]
            }, result);
            expect(result).toEqual(true);
            handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const updatedResult = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }));
        });
        it('returns empty update result if no row matched', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'no-one');
            const result = await handler.getQueryExecutor().update({ $set: { age: 19 } });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'no-one' }]
                })}).exec() >> empty, do nothing`,
                action: 'update'
            }, result);
            expect(result).toEqual(true);
        });
        it('can update data by query builder, case 1', async function () {
            let handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 1000);
            const result = await handler.getQueryExecutor().update({ age: 1001 });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 1000 }]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'update'
            }, result);
            expect(result).toEqual(true);
            handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'thor');
            const updatedResult = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }));
        });
        it('can update data by query builder, case 2: multiple documents', async function () {
            let handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 40);
            const result = await handler.getQueryExecutor().update({ age: 41 });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 40 }]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'update'
            }, result);
            expect(result).toEqual(true);
            handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 41);
            const updatedResults = await handler.getQueryExecutor().get();
            expect_match_user(updatedResults[0], Object.assign({}, dataset[2], { age: 41 }));
            expect_match_user(updatedResults[1], Object.assign({}, dataset[5], { age: 41 }));
        });
        it('auto add updatedAt field to $set if timestamps options is on', async function () {
            const now = new Date(1988, 4, 16);
            MomentProviderFacade_1.MomentProvider.setNow(() => now);
            function makeHandler() {
                return new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler({
                    getDriver() {
                        return {
                            getSoftDeletesFeature() {
                                return {
                                    hasSoftDeletes() {
                                        return false;
                                    }
                                };
                            },
                            getTimestampsFeature() {
                                return {
                                    hasTimestamps() {
                                        return true;
                                    },
                                    getTimestampsSetting() {
                                        return { createdAt: 'created_at', updatedAt: 'updated_at' };
                                    }
                                };
                            }
                        };
                    },
                    getModelName() {
                        return 'User';
                    },
                    getPrimaryKey() {
                        return 'id';
                    }
                });
            }
            let handler = makeHandler();
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const result = await handler.getQueryExecutor().update({ age: 43 });
            expect(result).toEqual(true);
            handler = makeHandler();
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const updatedResult = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 43, updated_at: now }));
            handler = makeHandler();
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const result2 = await handler.getQueryExecutor().update({ age: 44 });
            expect(result2).toEqual(true);
            handler = makeHandler();
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const updatedResult2 = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult2, Object.assign({}, dataset[5], { age: 44, updated_at: now }));
        });
        it('returns an true and do nothing if executeMode is disabled', async function () {
            let handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .update({ $inc: { age: 1 } });
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [
                        { field: 'first_name', operator: '=', value: 'tony' },
                        { field: 'last_name', operator: '=', value: 'stewart' }
                    ]
                })}).exec() >> empty, do nothing`,
                action: 'update'
            }, result);
            expect(result).toEqual(true);
            handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .where('last_name', 'stewart');
            const updatedResult = await handler.getQueryExecutor().first();
            expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 44 }));
        });
    });
    describe('.delete()', function () {
        it('can delete data of collection, returns result of dataSource.write()', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const result = await handler.getQueryExecutor().delete();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'first_name', operator: '=', value: 'peter' }]
                })}).exec() >> delete records >> dataSource.write()`,
                action: 'delete'
            }, result);
            expect(result).toEqual(true);
            const count = await makeQueryBuilderHandler('User')
                .getQueryExecutor()
                .count();
            expect(count).toEqual(6);
        });
        it('returns true and do nothing if executeMode is disabled', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'john')
                .where('last_name', 'doe');
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .delete();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [
                        { field: 'first_name', operator: '=', value: 'john' },
                        { field: 'last_name', operator: '=', value: 'doe' }
                    ]
                })}).exec() >> empty, do nothing`,
                action: 'delete'
            }, result);
            expect(result).toEqual(true);
            const count = await makeQueryBuilderHandler('User')
                .getQueryExecutor()
                .count();
            expect(count).toEqual(6);
        });
        it('can delete data by query builder, case 1', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('age', 1001);
            const result = await handler.getQueryExecutor().delete();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [{ field: 'age', operator: '=', value: 1001 }]
                })}).exec() >> delete records >> dataSource.write()`,
                action: 'delete'
            }, result);
            expect(result).toEqual(true);
            const count = await makeQueryBuilderHandler('User')
                .getQueryExecutor()
                .count();
            expect(count).toEqual(5);
        });
        it('can delete data by query builder, case 2: multiple documents', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'tony')
                .orWhere('first_name', 'jane');
            const result = await handler.getQueryExecutor().delete();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $or: [
                        { field: 'first_name', operator: '=', value: 'tony' },
                        { field: 'first_name', operator: '=', value: 'jane' }
                    ]
                })}).exec() >> delete records >> dataSource.write()`,
                action: 'delete'
            }, result);
            expect(result).toEqual(true);
            const count = await makeQueryBuilderHandler('User')
                .getQueryExecutor()
                .count();
            expect(count).toEqual(2);
        });
        it('can delete data by query builder, case 3', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('first_name', 'john')
                .where('last_name', 'doe');
            const result = await handler.getQueryExecutor().delete();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("User").getCollector().filterBy(${JSON.stringify({
                    $and: [
                        { field: 'first_name', operator: '=', value: 'john' },
                        { field: 'last_name', operator: '=', value: 'doe' }
                    ]
                })}).exec() >> delete records >> dataSource.write()`,
                action: 'delete'
            }, result);
            expect(result).toEqual(true);
            const count = await makeQueryBuilderHandler('User')
                .getQueryExecutor()
                .count();
            expect(count).toEqual(1);
        });
        it('can not call delete without using any .where() statement', async function () {
            const handler = makeQueryBuilderHandler('User');
            const result = await handler.getQueryExecutor().delete();
            expect(result).toEqual(false);
        });
        it('can not call delete if query is empty', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).select('any');
            const result = await handler.getQueryExecutor().delete();
            expect(result).toEqual(false);
        });
        // it('can delete by native() function', async function() {
        //   const handler = makeQueryBuilderHandler('users')
        //   const result = await makeQueryBuilder(handler)
        //     .native(function(collection) {
        //       return collection.remove({})
        //     })
        //     .execute()
        //   expect(result).toEqual({ n: 1, ok: 1 })
        //   const count = await makeQueryBuilderHandler('users')
        //     .getQueryExecutor()
        //     .count()
        //   expect(count).toEqual(0)
        // })
    });
    describe('.restore()', function () {
        it('does nothing if Model do not support SoftDeletes', async function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).where('first_name', 'peter');
            const result = await handler.getQueryExecutor().restore();
            expect(QueryLogFacade_1.QueryLog.pull()).toHaveLength(0);
            expect(result).toEqual(false);
        });
        function makeHandler() {
            return new MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler({
                getDriver() {
                    return {
                        getSoftDeletesFeature() {
                            return {
                                hasSoftDeletes() {
                                    return true;
                                },
                                getSoftDeletesSetting() {
                                    return { deletedAt: 'deleted_at' };
                                }
                            };
                        },
                        getTimestampsFeature() {
                            return {
                                hasTimestamps() {
                                    return false;
                                }
                            };
                        }
                    };
                },
                getModelName() {
                    return 'Role';
                },
                getPrimaryKeyName() {
                    return 'id';
                }
            });
        }
        it('can not call restore if query is empty', async function () {
            const handler = makeHandler();
            makeQueryBuilder(handler).withTrashed();
            const result = await handler.getQueryExecutor().restore();
            expect(QueryLogFacade_1.QueryLog.pull()).toHaveLength(0);
            expect(result).toEqual(false);
        });
        it('can restore data by query builder, case 1', async function () {
            let handler = makeHandler();
            makeQueryBuilder(handler)
                .onlyTrashed()
                .where('name', 'role-0');
            const result = await handler.getQueryExecutor().restore();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("Role").getCollector().filterBy(${JSON.stringify({
                    $and: [
                        // tslint:disable-next-line
                        { field: 'deleted_at', operator: '<>', value: null },
                        { field: 'name', operator: '=', value: 'role-0' }
                    ]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'restore'
            }, result);
            expect(result).toEqual(true);
            handler = makeHandler();
            const count = await handler.getQueryExecutor().count();
            expect(count).toEqual(1);
        });
        it('returns true and do nothing if executeMode is disabled', async function () {
            let handler = makeHandler();
            makeQueryBuilder(handler)
                .withTrashed()
                .where('name', 'role-1')
                .orWhere('name', 'role-2')
                .orWhere('name', 'role-3');
            const result = await handler
                .getQueryExecutor()
                .setExecuteMode('disabled')
                .restore();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("Role").getCollector().filterBy(${JSON.stringify({
                    $or: [
                        { field: 'name', operator: '=', value: 'role-1' },
                        { field: 'name', operator: '=', value: 'role-2' },
                        { field: 'name', operator: '=', value: 'role-3' }
                    ]
                })}).exec() >> empty, do nothing`,
                action: 'restore'
            }, result);
            expect(result).toEqual(true);
            handler = makeHandler();
            const count = await handler.getQueryExecutor().count();
            expect(count).toEqual(1);
        });
        it('can restore data by query builder, case 2: multiple documents', async function () {
            let handler = makeHandler();
            makeQueryBuilder(handler)
                .withTrashed()
                .where('name', 'role-1')
                .orWhere('name', 'role-2')
                .orWhere('name', 'role-3');
            const result = await handler.getQueryExecutor().restore();
            expect_query_log({
                raw: `MemoryDataSourceProvider.create("Role").getCollector().filterBy(${JSON.stringify({
                    $or: [
                        { field: 'name', operator: '=', value: 'role-1' },
                        { field: 'name', operator: '=', value: 'role-2' },
                        { field: 'name', operator: '=', value: 'role-3' }
                    ]
                })}).exec() >> update records >> dataSource.write()`,
                action: 'restore'
            }, result);
            expect(result).toEqual(true);
            handler = makeHandler();
            const count = await handler.getQueryExecutor().count();
            expect(count).toEqual(4);
        });
    });
    describe('.execute()', function () {
        it('simply calls and returns .get()', async function () {
            const handler = makeQueryBuilderHandler('User');
            const executor = handler.getQueryExecutor();
            const stub = Sinon.stub(executor, 'get');
            stub.returns(Promise.resolve('anything'));
            expect(await executor.execute()).toEqual('anything');
            expect(stub.called).toBe(true);
        });
    });
    describe('.getUpdateRecordInfo()', function () {
        it('returns an updateRecordInfo which contain origin, updated and modified property', function () {
            const handler = makeQueryBuilderHandler('User');
            const record = new Record_1.Record({ a: 1, b: 2 });
            const executor = handler.getQueryExecutor();
            const info = executor.getUpdateRecordInfo(record, {});
            expect(info.modified).toBe(false);
            expect(info.updated === record.toObject()).toBe(true);
            expect(info.origin === record.toObject()).toBe(false);
            expect(info.origin).toEqual(record.toObject());
        });
        it('sets modified of info to true if there is a changed in data', function () {
            const handler = makeQueryBuilderHandler('User');
            const record = new Record_1.Record({ a: 1, b: 2 });
            const executor = handler.getQueryExecutor();
            const info = executor.getUpdateRecordInfo(record, { a: '1' });
            expect(info.modified).toBe(true);
            expect(info.updated === record.toObject()).toBe(true);
            expect(info.origin === record.toObject()).toBe(false);
            expect(info.origin).not.toEqual(record.toObject());
            expect(info.updated).toEqual({ a: '1', b: 2 });
        });
    });
    describe('.collectResult()', function () {
        it('calls DataSource.read(), then calls and returns collector.exec()', async function () {
            const readSpy = Sinon.spy(UserDataSource, 'read');
            const handler = makeQueryBuilderHandler('User');
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            const collectorExecStub = Sinon.stub(collector, 'exec');
            collectorExecStub.returns('anything');
            expect(await executor.collectResult(collector)).toEqual('anything');
            expect(readSpy.called).toBe(true);
            expect(collectorExecStub.called).toBe(true);
        });
    });
    describe('.makeCollector()', function () {
        it('makes and return a DataCollector instance which using the DataSource', function () {
            const handler = makeQueryBuilderHandler('User');
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            expect(collector['dataBuffer'] === UserDataSource).toBe(true);
        });
        it('calls collector.limit() if query builder has limit data', function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler).limit(5);
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            expect(collector['limited']).toEqual(5);
        });
        it('calls collector.orderBy() if query builder has ordering data', function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .orderBy('a')
                .orderBy('b', 'desc');
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            expect(collector).toBeInstanceOf(DataCollector_1.DataCollector);
            expect(collector['sortedBy']).toEqual([['a', 'asc'], ['b', 'desc']]);
        });
        it('calls collector.select() if query builder has selected data', function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .select('a')
                .select('b', ['c', 'd']);
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            expect(collector['selected']).toEqual(['a', 'b', 'c', 'd']);
        });
        it('calls collector.filterBy() if query builder has conditions data', function () {
            const handler = makeQueryBuilderHandler('User');
            makeQueryBuilder(handler)
                .where('a', 1)
                .orWhere('b', 2);
            const executor = handler.getQueryExecutor();
            const collector = executor.makeCollector();
            expect(collector['conditions']).toEqual({
                $or: [
                    { field: 'a', operator: '=', value: 1, reader: RecordDataReader_1.RecordDataReader },
                    { field: 'b', operator: '=', value: 2, reader: RecordDataReader_1.RecordDataReader }
                ]
            });
        });
    });
    describe('.getFilterConditions()', function () {
        it('calls ExecutorUtils.addSoftDeleteConditionIfNeeded() to add softDeletes conditions', function () {
            const spy = Sinon.spy(ExecutorUtils_1.ExecutorUtils, 'addSoftDeleteConditionIfNeeded');
            const handler = makeQueryBuilderHandler('User');
            const query = makeQueryBuilder(handler);
            query.where('a', 1).where('b', 2);
            const executor = handler.getQueryExecutor();
            executor.getFilterConditions();
            expect(spy.calledWith(handler)).toBe(true);
        });
        it('converts BasicQuery to conditions object by BasicQueryConverter', function () {
            const handler = makeQueryBuilderHandler('User');
            const query = makeQueryBuilder(handler);
            query.where('a', 1).where('b', 2);
            const executor = handler.getQueryExecutor();
            const conditions = executor.getFilterConditions();
            expect(conditions).toEqual({
                $and: [
                    { field: 'a', operator: '=', value: 1, reader: RecordDataReader_1.RecordDataReader },
                    { field: 'b', operator: '=', value: 2, reader: RecordDataReader_1.RecordDataReader }
                ]
            });
        });
    });
});
