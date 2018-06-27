"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const util_1 = require("../util");
const QueryLogFacade_1 = require("../../lib/facades/global/QueryLogFacade");
const KnexQueryBuilder_1 = require("../../lib/query-builders/KnexQueryBuilder");
const KnexProviderFacade_1 = require("../../lib/facades/global/KnexProviderFacade");
describe('KnexQueryBuilder', function () {
    beforeAll(async function () {
        return util_1.init_knex('najs_eloquent_knex_query_builder');
    });
    it('implements Autoload under name "NajsEloquent.QueryBuilder.KnexQueryBuilder"', function () {
        const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
        expect(query.getClassName()).toEqual('NajsEloquent.QueryBuilder.KnexQueryBuilder');
    });
    const methods = [
        'orderBy',
        'select',
        'limit',
        'where',
        'andWhere',
        'orWhere',
        'whereNot',
        'andWhereNot',
        'orWhereNot',
        'whereIn',
        'andWhereIn',
        'orWhereIn',
        'whereNotIn',
        'andWhereNotIn',
        'orWhereNotIn',
        'whereNull',
        'andWhereNull',
        'orWhereNull',
        'whereNotNull',
        'andWhereNotNull',
        'orWhereNotNull',
        'whereBetween',
        'andWhereBetween',
        'orWhereBetween',
        'whereNotBetween',
        'andWhereNotBetween',
        'orWhereNotBetween'
    ];
    for (const method of methods) {
        describe(`.${method}()`, function () {
            it(`sets isUsed to true, and forwards all params to this.knexQueryBuilder.${method}()`, function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const knex = {
                    [method]: function () {
                        return 'anything';
                    }
                };
                query['knexQueryBuilder'] = knex;
                const spy = Sinon.spy(knex, method);
                expect(query['isUsed']).toBe(false);
                expect(query[method]('a') === query).toBe(true);
                expect(spy.calledWith('a')).toBe(true);
                expect(query['isUsed']).toBe(true);
                expect(query[method]('a', 'b') === query).toBe(true);
                expect(spy.calledWith('a', 'b')).toBe(true);
            });
        });
    }
    describe('.withTrashed()', function () {
        it('does nothing if there is no softDelete setting', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
            expect(query['isUsed']).toBe(false);
            expect(query.withTrashed() === query).toBe(true);
            expect(query['isUsed']).toBe(false);
        });
        it('sets this.addSoftDeleteCondition = false and this.isUsed = false', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id', 'default', { deletedAt: 'deleted_at' });
            expect(query['isUsed']).toBe(false);
            expect(query['addSoftDeleteCondition']).toBe(true);
            expect(query.withTrashed() === query).toBe(true);
            expect(query['isUsed']).toBe(true);
            expect(query['addSoftDeleteCondition']).toBe(false);
        });
    });
    describe('.onlyTrashed()', function () {
        it('does nothing if there is no softDelete setting', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
            expect(query['isUsed']).toBe(false);
            expect(query.onlyTrashed() === query).toBe(true);
            expect(query['isUsed']).toBe(false);
        });
        it('sets this.addSoftDeleteCondition = false and this.isUsed = false but it already call this.whereNotNull()', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id', 'default', { deletedAt: 'deleted_at' });
            expect(query['isUsed']).toBe(false);
            expect(query['addSoftDeleteCondition']).toBe(true);
            expect(query.onlyTrashed() === query).toBe(true);
            expect(query['isUsed']).toBe(true);
            expect(query['addSoftDeleteCondition']).toBe(false);
            expect(query['knexQueryBuilder'].toQuery()).toEqual('select * from `users` where `deleted_at` is not null');
        });
    });
    describe('.native()', function () {
        it('calls .getKnexQueryBuilder() and passes the result to handle (the first param)', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
            const getKnexQueryBuilderSpy = Sinon.spy(query, 'getKnexQueryBuilder');
            query.native(function (queryBuilder) {
                queryBuilder.where('test', '<>', 1);
            });
            expect(getKnexQueryBuilderSpy.called).toBe(true);
            expect(query.getKnexQueryBuilder().toQuery()).toEqual('select * from `users` where `test` <> 1');
        });
    });
    describe('.getKnexQueryBuilder()', function () {
        it('creates this.knexQueryBuilder if it not found and keep returning that instance', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
            expect(query['knexQueryBuilder']).toBeUndefined();
            const result = query.getKnexQueryBuilder();
            expect(query['knexQueryBuilder']).not.toBeUndefined();
            expect(result === query.getKnexQueryBuilder()).toBe(true);
        });
        it('adds .whereNull() to query builder if the query has soft delete and have not added soft delete condition', function () {
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id', 'default', { deletedAt: 'deleted_at' });
            expect(query.getKnexQueryBuilder().toQuery()).toEqual('select * from `users` where `deleted_at` is null');
            const newQuery = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id', 'default', { deletedAt: 'deleted_at' });
            newQuery['addedSoftDeleteCondition'] = true;
            expect(newQuery.getKnexQueryBuilder().toQuery()).toEqual('select * from `users`');
        });
    });
    describe('implements IFetchResultQuery', function () {
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
            await util_1.init_knex('najs_eloquent_knex_query_builder');
            await util_1.knex_run_sql(`CREATE TABLE users (
          id INT NOT NULL AUTO_INCREMENT,
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          age INT,
          PRIMARY KEY (id)
        )`);
            for (const item of dataset) {
                await util_1.knex_run_sql(`
          INSERT INTO users
          (first_name, last_name, age)
          VALUES
          ('${item.first_name}', '${item.last_name}', ${item.age})
          `);
            }
            await util_1.knex_run_sql(`CREATE TABLE roles (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255),
          deleted_at DATETIME,
          PRIMARY KEY (id)
        )`);
            for (let i = 0; i < 10; i++) {
                await util_1.knex_run_sql(`
          INSERT INTO roles
          (name, deleted_at)
          VALUES
          ('role-${i}', '2018-06-01 00:00:00')
          `);
            }
        });
        beforeEach(function () {
            QueryLogFacade_1.QueryLog.clear().enable();
        });
        function expect_match_user(result, expected) {
            for (const name in expected) {
                expect(result[name]).toEqual(expected[name]);
            }
        }
        function expect_query_log(query, attribute = 'sql', index = 0) {
            expect(QueryLogFacade_1.QueryLog.pull()[index]['query'][attribute]).toEqual(query);
        }
        describe('.get()', function () {
            it('gets all data of collection and return an instance of Collection<Eloquent<T>>', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.get();
                expect_query_log('select * from `users`');
                expect(result.length).toEqual(7);
                for (let i = 0; i < 7; i++) {
                    expect_match_user(result[i], dataset[i]);
                }
            });
            it('returns an empty collection if no result', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'no-one').get();
                expect_query_log("select * from `users` where `first_name` = 'no-one'");
                expect(result.length === 0).toBe(true);
            });
            it('can get data by query builder, case 1', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('age', 1000).get();
                expect_query_log('select * from `users` where `age` = 1000');
                expect(result.length).toEqual(1);
                expect_match_user(result[0], dataset[3]);
            });
            it('can get data by query builder, case 2', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('age', 40).get();
                expect_query_log('select * from `users` where `age` = 40');
                expect(result.length).toEqual(2);
                expect_match_user(result[0], dataset[2]);
                expect_match_user(result[1], dataset[5]);
            });
            it('can get data by query builder, case 3', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 40)
                    .where('last_name', 'stark')
                    .get();
                expect_query_log("select * from `users` where `age` = 40 and `last_name` = 'stark'");
                expect(result.length).toEqual(1);
                expect_match_user(result[0], dataset[2]);
            });
            it('can get data by query builder, case 4', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'peter')
                    .get();
                expect_query_log("select * from `users` where `age` = 40 or `first_name` = 'peter'");
                expect(result.length).toEqual(3);
                expect_match_user(result[0], dataset[2]);
                expect_match_user(result[1], dataset[5]);
                expect_match_user(result[2], dataset[6]);
            });
            it('can get data by query builder, case 5', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'peter')
                    .orderBy('id', 'desc')
                    .get();
                expect_query_log("select * from `users` where `age` = 40 or `first_name` = 'peter' order by `id` desc");
                expect(result.length).toEqual(3);
                expect_match_user(result[0], dataset[6]);
                expect_match_user(result[1], dataset[5]);
                expect_match_user(result[2], dataset[2]);
            });
        });
        describe('.first()', function () {
            it('finds first document of collection and return an instance of Eloquent<T>', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.first();
                expect_query_log('select * from `users` limit 1');
                expect_match_user(result, dataset[0]);
            });
            it('finds first document of collection and return an instance of Eloquent<T>', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.orderBy('id', 'desc').first();
                expect_query_log('select * from `users` order by `id` desc limit 1');
                expect_match_user(result, dataset[6]);
            });
            it('returns null if no result', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'no-one').first();
                expect_query_log("select * from `users` where `first_name` = 'no-one' limit 1");
                expect(result).toBeNull();
            });
            it('can find data by query builder, case 1', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('age', 1000).first();
                expect_query_log('select * from `users` where `age` = 1000 limit 1');
                expect_match_user(result, dataset[3]);
            });
            it('can find data by query builder, case 2', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 40)
                    .orWhere('first_name', 'jane')
                    .first();
                expect_query_log("select * from `users` where `age` = 40 or `first_name` = 'jane' limit 1");
                expect_match_user(result, dataset[1]);
            });
            it('can find data by query builder, case 3', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_query_log("select * from `users` where `first_name` = 'tony' and `last_name` = 'stewart' limit 1");
                expect_match_user(result, dataset[5]);
            });
            it('can find data by .native() before using query functions of query builder', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .native(function (queryBuilder) {
                    queryBuilder.where('first_name', 'tony');
                })
                    .first();
                expect_query_log("select * from `users` where `first_name` = 'tony' limit 1");
                expect_match_user(result, dataset[2]);
            });
            it('can find data by native() after using query functions of query builder', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 40)
                    .orWhere('age', 1000)
                    .native(function (queryBuilder) {
                    return queryBuilder.orderBy('last_name', 'desc');
                })
                    .first();
                expect_query_log('select * from `users` where `age` = 40 or `age` = 1000 order by `last_name` desc limit 1');
                expect_match_user(result, dataset[5]);
            });
        });
        describe('.count()', function () {
            it('counts all data of collection and returns a Number', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.count();
                expect_query_log('select count(*) from `users`');
                expect(result).toEqual(7);
            });
            it('returns 0 if no result', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'no-one').count();
                expect_query_log("select count(*) from `users` where `first_name` = 'no-one'");
                expect(result).toEqual(0);
            });
            it('overrides select even .select was used', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.select('id', 'first_name').count();
                expect_query_log('select count(*) from `users`');
                expect(result).toEqual(7);
            });
            it('can count items by query builder', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('age', 18)
                    .orWhere('first_name', 'tony')
                    .count();
                expect_query_log("select count(*) from `users` where `age` = 18 or `first_name` = 'tony'");
                expect(result).toEqual(2);
            });
        });
        describe('.update()', function () {
            it('can update data of collection, returns update result of mongoose', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'peter').update({ age: 19 });
                expect_query_log("update `users` set `age` = 19 where `first_name` = 'peter'");
                expect(result).toEqual(1);
                const updatedResult = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').where('first_name', 'peter').first();
                expect_match_user(updatedResult, Object.assign({}, dataset[6], { age: 19 }));
            });
            it('returns empty update result if no row matched', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'no-one').update({ age: 19 });
                expect_query_log("update `users` set `age` = 19 where `first_name` = 'no-one'");
                expect(result).toEqual(0);
            });
            it('can update data by query builder, case 1', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('age', 1000).update({ age: 1001 });
                expect_query_log('update `users` set `age` = 1001 where `age` = 1000');
                expect(result).toEqual(1);
                const updatedResult = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').where('first_name', 'thor').first();
                expect_match_user(updatedResult, Object.assign({}, dataset[3], { age: 1001 }));
            });
            it('can update data by query builder, case 2: multiple documents', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                query.where('first_name', 'tony').orWhere('first_name', 'jane');
                const result = await query.update({ age: KnexProviderFacade_1.KnexProvider.create().raw('`age` + 1') });
                expect_query_log("update `users` set `age` = `age` + 1 where `first_name` = 'tony' or `first_name` = 'jane'");
                expect(result).toEqual(3);
                const updatedResults = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id')
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .get();
                expect_match_user(updatedResults[0], Object.assign({}, dataset[1], { age: 26 }));
                expect_match_user(updatedResults[1], Object.assign({}, dataset[2], { age: 41 }));
                expect_match_user(updatedResults[2], Object.assign({}, dataset[5], { age: 41 }));
            });
            it('can update data by query builder, case 3', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .update({ age: KnexProviderFacade_1.KnexProvider.create().raw('`age` + 1') });
                expect_query_log("update `users` set `age` = `age` + 1 where `first_name` = 'tony' and `last_name` = 'stewart'");
                expect(result).toEqual(1);
                const updatedResult = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id')
                    .where('first_name', 'tony')
                    .where('last_name', 'stewart')
                    .first();
                expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 42 }));
            });
            // it('auto add updatedAt field to $set if timestamps options is on', async function() {
            //   const now = new Date(1988, 4, 16)
            //   Moment.now = () => now
            //   const query = new MongodbQueryBuilder('User', collectionUsers)
            //   query['timestamps'] = { createdAt: 'created_at', updatedAt: 'updated_at' }
            //   const result = await query
            //     .where('first_name', 'tony')
            //     .where('last_name', 'stewart')
            //     .update({ $inc: { age: 1 } })
            //   expect(result).toEqual({ n: 1, nModified: 1, ok: 1 })
            //   const updatedResult = await new MongodbQueryBuilder('User', collectionUsers)
            //     .where('first_name', 'tony')
            //     .where('last_name', 'stewart')
            //     .first()
            //   expect_match_user(updatedResult, Object.assign({}, dataset[5], { age: 43, updated_at: now }))
            //   const result2 = await query
            //     .where('first_name', 'tony')
            //     .where('last_name', 'stewart')
            //     .update({ $set: { age: 44 } })
            //   expect(result2).toEqual({ n: 1, nModified: 1, ok: 1 })
            //   const updatedResult2 = await new MongodbQueryBuilder('User', collectionUsers)
            //     .where('first_name', 'tony')
            //     .where('last_name', 'stewart')
            //     .first()
            //   expect_match_user(updatedResult2, Object.assign({}, dataset[5], { age: 44, updated_at: now }))
            // })
        });
        describe('.delete()', function () {
            it('can delete data of collection, returns delete result of mongoose', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'peter').delete();
                expect_query_log("delete from `users` where `first_name` = 'peter'");
                expect(result).toEqual(1);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').count();
                expect(count).toEqual(6);
            });
            it('can delete data by query builder, case 1', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('age', 1001).delete();
                expect_query_log('delete from `users` where `age` = 1001');
                expect(result).toEqual(1);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').count();
                expect(count).toEqual(5);
            });
            it('can delete data by query builder, case 2: multiple documents', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('first_name', 'tony')
                    .orWhere('first_name', 'jane')
                    .delete();
                expect_query_log("delete from `users` where `first_name` = 'tony' or `first_name` = 'jane'");
                expect(result).toEqual(3);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').count();
                expect(count).toEqual(2);
            });
            it('can delete data by query builder, case 3', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query
                    .where('first_name', 'john')
                    .where('last_name', 'doe')
                    .delete();
                expect_query_log("delete from `users` where `first_name` = 'john' and `last_name` = 'doe'");
                expect(result).toEqual(1);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id').count();
                expect(count).toEqual(1);
            });
            // it('can not call delete without using any .where() statement', async function() {
            //   const query = new MongodbQueryBuilder('User', collectionUsers)
            //   const result = await query.delete()
            //   expect(result).toEqual({ n: 0, ok: 1 })
            // })
            // it('can not call delete if query is empty', async function() {
            //   const query = new MongodbQueryBuilder('User', collectionUsers)
            //   const result = await query.select('any').delete()
            //   expect(result).toEqual({ n: 0, ok: 1 })
            // })
            // it('can delete by native() function', async function() {
            //   const query = new MongodbQueryBuilder('User', collectionUsers)
            //   const result = await query
            //     .native(function(collection) {
            //       return collection.remove({})
            //     })
            //     .execute()
            //   expect(result).toEqual({ n: 1, ok: 1 })
            //   const count = await new MongodbQueryBuilder('User', collectionUsers).count()
            //   expect(count).toEqual(0)
            // })
        });
        describe('.restore()', function () {
            it('does nothing if Model do not support SoftDeletes', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
                const result = await query.where('first_name', 'peter').restore();
                expect(QueryLogFacade_1.QueryLog.pull()).toHaveLength(0);
                expect(result).toEqual(0);
            });
            it('can restore data by query builder, case 1', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('roles', 'id', 'default', { deletedAt: 'deleted_at' });
                const result = await query
                    .onlyTrashed()
                    .where('name', 'role-0')
                    .restore();
                expect_query_log("update `roles` set `deleted_at` = NULL where `deleted_at` is not null and `name` = 'role-0'");
                expect(result).toEqual(1);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('roles', 'id', 'default', { deletedAt: 'deleted_at' }).count();
                expect(count).toEqual(1);
            });
            it('can restore data by query builder, case 2: multiple documents', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('roles', 'id', 'default', { deletedAt: 'deleted_at' });
                const result = await query
                    .withTrashed()
                    .where('name', 'role-1')
                    .orWhere('name', 'role-2')
                    .orWhere('name', 'role-3')
                    .restore();
                expect_query_log("update `roles` set `deleted_at` = NULL where `name` = 'role-1' or `name` = 'role-2' or `name` = 'role-3'");
                expect(result).toEqual(3);
                const count = await new KnexQueryBuilder_1.KnexQueryBuilder('roles', 'id', 'default', { deletedAt: 'deleted_at' }).count();
                expect(count).toEqual(4);
            });
        });
        describe('.execute()', function () {
            it('simply calls .then() from knex query builder and resolve the result', async function () {
                const query = new KnexQueryBuilder_1.KnexQueryBuilder('roles', 'id');
                const result = await query
                    .native(function (queryBuilder) {
                    queryBuilder.limit(10).first();
                })
                    .execute();
                expect(result['name']).toEqual('role-0');
            });
        });
    });
    describe('.resolveKnexQueryLog()', function () {
        it('calls make("NajsEloquent.QueryBuilder.KnexQueryLog") to resolve the instance of KnexQueryLog', function () {
            const makeStub = Sinon.stub(NajsBinding, 'make');
            makeStub.returns('anything');
            const query = new KnexQueryBuilder_1.KnexQueryBuilder('users', 'id');
            query.resolveKnexQueryLog();
            expect(makeStub.calledWith('NajsEloquent.QueryBuilder.KnexQueryLog', [])).toBe(true);
            makeStub.restore();
        });
    });
});
