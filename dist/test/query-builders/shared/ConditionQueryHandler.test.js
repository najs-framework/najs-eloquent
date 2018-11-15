"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const BasicQuery_1 = require("../../../lib/query-builders/shared/BasicQuery");
const DefaultConvention_1 = require("../../../lib/query-builders/shared/DefaultConvention");
const ConditionQueryHandler_1 = require("../../../lib/query-builders/shared/ConditionQueryHandler");
describe('ConditionQueryHandle', function () {
    const convention = new DefaultConvention_1.DefaultConvention();
    const basicQuery = new BasicQuery_1.BasicQuery(convention);
    describe('constructor()', function () {
        it('requires basicConditionQuery and convention to create an instance', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            expect(query['basicConditionQuery'] === basicQuery).toBe(true);
            expect(query['convention'] === convention).toBe(true);
        });
    });
    describe('.where()', function () {
        it('simply forwards all params and return current instance for chaining', function () {
            const spy = Sinon.spy(basicQuery, 'where');
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            expect(query.where('a', '=', 'b') === query).toBe(true);
            expect(spy.calledWith('a', '=', 'b')).toBe(true);
            spy.restore();
        });
    });
    describe('.orWhere()', function () {
        it('simply forwards all params and return current instance for chaining', function () {
            const spy = Sinon.spy(basicQuery, 'orWhere');
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            expect(query.orWhere('a', '=', 'b') === query).toBe(true);
            expect(spy.calledWith('a', '=', 'b')).toBe(true);
            spy.restore();
        });
    });
    describe('.andWhere()', function () {
        it('is an alias of .where()', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            expect(query.andWhere('a', '=', 'b') === query).toBe(true);
            expect(spy.calledWith('a', '=', 'b')).toBe(true);
        });
    });
    describe('.whereNot()', function () {
        it('calls .where() with Operator.NotEquals', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            expect(query.whereNot('a', 'b') === query).toBe(true);
            expect(spy.calledWith('a', '<>', 'b')).toBe(true);
        });
    });
    describe('.andWhereNot()', function () {
        it('is an alias of .whereNot', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereNot');
            expect(query.andWhereNot('a', 'b') === query).toBe(true);
            expect(spy.calledWith('a', 'b')).toBe(true);
        });
    });
    describe('.orWhereNot()', function () {
        it('calls .orWhere() with Operator.NotEquals', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'orWhere');
            expect(query.orWhereNot('a', 'b') === query).toBe(true);
            expect(spy.calledWith('a', '<>', 'b')).toBe(true);
        });
    });
    describe('.whereIn()', function () {
        it('calls .where() with Operator.In', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            expect(query.whereIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', 'in', ['b'])).toBe(true);
        });
    });
    describe('.andWhereIn()', function () {
        it('is an alias of .whereIn', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereIn');
            expect(query.andWhereIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', ['b'])).toBe(true);
        });
    });
    describe('.orWhereIn()', function () {
        it('calls .orWhere() with Operator.In', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'orWhere');
            expect(query.orWhereIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', 'in', ['b'])).toBe(true);
        });
    });
    describe('.whereNotIn()', function () {
        it('calls .where() with Operator.NotIn', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            expect(query.whereNotIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', 'not-in', ['b'])).toBe(true);
        });
    });
    describe('.andWhereNotIn()', function () {
        it('is an alias of .whereNotIn', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereNotIn');
            expect(query.andWhereNotIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', ['b'])).toBe(true);
        });
    });
    describe('.orWhereNotIn()', function () {
        it('calls .orWhere() with Operator.NotIn', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'orWhere');
            expect(query.orWhereNotIn('a', ['b']) === query).toBe(true);
            expect(spy.calledWith('a', 'not-in', ['b'])).toBe(true);
        });
    });
    describe('.whereNull()', function () {
        it('calls .where() with Operator.Equals and null value from convention', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            const stub = Sinon.stub(convention, 'getNullValueFor');
            stub.returns('NULL');
            expect(query.whereNull('a') === query).toBe(true);
            expect(spy.calledWith('a', '=', 'NULL')).toBe(true);
            expect(stub.calledWith('a')).toBe(true);
            stub.restore();
        });
    });
    describe('.andWhereNull()', function () {
        it('is an alias of .whereNull', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereNull');
            expect(query.andWhereNull('a') === query).toBe(true);
            expect(spy.calledWith('a')).toBe(true);
        });
    });
    describe('.orWhereNull()', function () {
        it('calls .orWhere() with Operator.Equals and null value from convention', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'orWhere');
            const stub = Sinon.stub(convention, 'getNullValueFor');
            stub.returns('NULL');
            expect(query.orWhereNull('a') === query).toBe(true);
            expect(spy.calledWith('a', '=', 'NULL')).toBe(true);
            expect(stub.calledWith('a')).toBe(true);
            stub.restore();
        });
    });
    describe('.whereNotNull()', function () {
        it('calls .where() with Operator.NotEquals and null value from convention', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            const stub = Sinon.stub(convention, 'getNullValueFor');
            stub.returns('NULL');
            expect(query.whereNotNull('a') === query).toBe(true);
            expect(spy.calledWith('a', '<>', 'NULL')).toBe(true);
            expect(stub.calledWith('a')).toBe(true);
            stub.restore();
        });
    });
    describe('.andWhereNotNull()', function () {
        it('is an alias of .whereNull', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereNotNull');
            expect(query.andWhereNotNull('a') === query).toBe(true);
            expect(spy.calledWith('a')).toBe(true);
        });
    });
    describe('.orWhereNotNull()', function () {
        it('calls .orWhere() with Operator.NotEquals and null value from convention', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'orWhere');
            const stub = Sinon.stub(convention, 'getNullValueFor');
            stub.returns('NULL');
            expect(query.orWhereNotNull('a') === query).toBe(true);
            expect(spy.calledWith('a', '<>', 'NULL')).toBe(true);
            expect(stub.calledWith('a')).toBe(true);
            stub.restore();
        });
    });
    describe('.whereBetween()', function () {
        it('calls .where() 2 times to setup field >= range[0] && field <= range[1]', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'where');
            expect(query.whereBetween('a', [0, 1000]) === query).toBe(true);
            expect(spy.firstCall.calledWith('a', '>=', 0)).toBe(true);
            expect(spy.secondCall.calledWith('a', '<=', 1000)).toBe(true);
        });
    });
    describe('.andWhereBetween()', function () {
        it('is an alias of .whereBetween', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereBetween');
            expect(query.andWhereBetween('a', [0, 1000]) === query).toBe(true);
            expect(spy.calledWith('a', [0, 1000])).toBe(true);
        });
    });
    describe('.orWhereBetween()', function () {
        it('calls .where() 2 times in a subQuery of .orWhere to setup field >= range[0] && field <= range[1]', function () {
            const basicQuery = new BasicQuery_1.BasicQuery(convention);
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const orWhereSpy = Sinon.spy(query, 'orWhere');
            // const whereSpy = Sinon.spy(query, 'where')
            expect(query.orWhereBetween('a', [0, 1000]) === query).toBe(true);
            expect(orWhereSpy.called).toBe(true);
            const conditions = basicQuery['conditions'];
            expect(conditions).toHaveLength(1);
            expect(conditions[0].bool).toEqual('or');
            expect(conditions[0].queries[0].field).toEqual('a');
            expect(conditions[0].queries[0].operator).toEqual('>=');
            expect(conditions[0].queries[0].value).toEqual(0);
            expect(conditions[0].queries[0].bool).toEqual('and');
            expect(conditions[0].queries[1].field).toEqual('a');
            expect(conditions[0].queries[1].operator).toEqual('<=');
            expect(conditions[0].queries[1].value).toEqual(1000);
            expect(conditions[0].queries[1].bool).toEqual('and');
        });
    });
    describe('.whereNotBetween()', function () {
        it('setups field < range[0] || field > range[1] in subQuery .where', function () {
            const basicQuery = new BasicQuery_1.BasicQuery(convention);
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            expect(query.whereNotBetween('a', [0, 1000]) === query).toBe(true);
            const conditions = basicQuery['conditions'];
            expect(conditions).toHaveLength(1);
            expect(conditions[0].bool).toEqual('and');
            expect(conditions[0].queries[0].field).toEqual('a');
            expect(conditions[0].queries[0].operator).toEqual('<');
            expect(conditions[0].queries[0].value).toEqual(0);
            expect(conditions[0].queries[0].bool).toEqual('and');
            expect(conditions[0].queries[1].field).toEqual('a');
            expect(conditions[0].queries[1].operator).toEqual('>');
            expect(conditions[0].queries[1].value).toEqual(1000);
            expect(conditions[0].queries[1].bool).toEqual('or');
        });
    });
    describe('.andWhereNotBetween()', function () {
        it('is an alias of .whereNotBetween', function () {
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            const spy = Sinon.spy(query, 'whereNotBetween');
            expect(query.andWhereNotBetween('a', [0, 1000]) === query).toBe(true);
            expect(spy.calledWith('a', [0, 1000])).toBe(true);
        });
    });
    describe('.whereNotBetween()', function () {
        it('setups field < range[0] || field > range[1] in subQuery .orWhere', function () {
            const basicQuery = new BasicQuery_1.BasicQuery(convention);
            const query = new ConditionQueryHandler_1.ConditionQueryHandler(basicQuery, convention);
            expect(query.orWhereNotBetween('a', [0, 1000]) === query).toBe(true);
            const conditions = basicQuery['conditions'];
            expect(conditions).toHaveLength(1);
            expect(conditions[0].bool).toEqual('or');
            expect(conditions[0].queries[0].field).toEqual('a');
            expect(conditions[0].queries[0].operator).toEqual('<');
            expect(conditions[0].queries[0].value).toEqual(0);
            expect(conditions[0].queries[0].bool).toEqual('and');
            expect(conditions[0].queries[1].field).toEqual('a');
            expect(conditions[0].queries[1].operator).toEqual('>');
            expect(conditions[0].queries[1].value).toEqual(1000);
            expect(conditions[0].queries[1].bool).toEqual('or');
        });
    });
});
