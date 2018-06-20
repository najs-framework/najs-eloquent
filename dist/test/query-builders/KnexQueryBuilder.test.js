"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const NajsBinding = require("najs-binding");
const util_1 = require("../util");
const QueryLogFacade_1 = require("../../lib/facades/global/QueryLogFacade");
const KnexQueryBuilder_1 = require("../../lib/query-builders/KnexQueryBuilder");
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
