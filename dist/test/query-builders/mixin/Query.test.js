"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Query_1 = require("../../../lib/query-builders/mixin/Query");
describe('Query', function () {
    const basicQuery = {
        select() {
            return 'select-result';
        },
        limit() {
            return 'limit-result';
        },
        orderBy() {
            return 'orderBy-result';
        }
    };
    const handler = {
        getBasicQuery() {
            return basicQuery;
        },
        markUsed() {
            return 'markUsed-result';
        },
        setQueryName() {
            return 'setQueryName-result';
        },
        setLogGroup() {
            return 'setLogGroup-result';
        },
        hasSoftDeletes() {
            return 'hasSoftDeletes-result';
        },
        getSoftDeletesSetting() {
            return { deletedAt: 'something' };
        },
        markSoftDeleteState() {
            return 'markSoftDeleteState-result';
        }
    };
    const queryBuilder = {
        handler: handler,
        orderBy() { },
        whereNotNull() { }
    };
    describe('.select()', function () {
        it('is chainable, passes all params to handler.getBasicQuery().select(), then markUsed()', function () {
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(basicQuery, 'select');
            expect(Query_1.Query.select.call(queryBuilder, '1', ['2'], '3') === queryBuilder).toBe(true);
            expect(spy.calledWith('1', ['2'], '3')).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.limit()', function () {
        it('is chainable, passes all params to handler.getBasicQuery().limit(), then markUsed()', function () {
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(basicQuery, 'limit');
            expect(Query_1.Query.limit.call(queryBuilder, 1000) === queryBuilder).toBe(true);
            expect(spy.calledWith(1000)).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.orderBy()', function () {
        it('is chainable, passes all params to handler.getBasicQuery().orderBy(), then markUsed()', function () {
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(basicQuery, 'orderBy');
            expect(Query_1.Query.orderBy.call(queryBuilder, 'test', 'desc') === queryBuilder).toBe(true);
            expect(spy.calledWith('test', 'desc')).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.queryName()', function () {
        it('is chainable, passes all params to handler.setQueryName(), then markUsed()', function () {
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(handler, 'setQueryName');
            expect(Query_1.Query.queryName.call(queryBuilder, 'test') === queryBuilder).toBe(true);
            expect(spy.calledWith('test')).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.setLogGroup()', function () {
        it('is chainable, passes all params to handler.setLogGroup(), then markUsed()', function () {
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(handler, 'setLogGroup');
            expect(Query_1.Query.setLogGroup.call(queryBuilder, 'test') === queryBuilder).toBe(true);
            expect(spy.calledWith('test')).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.orderByAsc()', function () {
        it('calls this.orderBy() with direction asc', function () {
            const spy = Sinon.spy(queryBuilder, 'orderBy');
            Query_1.Query.orderByAsc.call(queryBuilder, 'test');
            expect(spy.calledWith('test', 'asc')).toBe(true);
            spy.restore();
        });
    });
    describe('.orderByDesc()', function () {
        it('calls this.orderBy() with direction asc', function () {
            const spy = Sinon.spy(queryBuilder, 'orderBy');
            Query_1.Query.orderByDesc.call(queryBuilder, 'test');
            expect(spy.calledWith('test', 'desc')).toBe(true);
            spy.restore();
        });
    });
    describe('.withTrashed()', function () {
        it('is chainable, does nothing if the handler.hasSoftDeletes() return false', function () {
            const stub = Sinon.stub(handler, 'hasSoftDeletes');
            stub.returns(false);
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(handler, 'markSoftDeleteState');
            expect(Query_1.Query.withTrashed.call(queryBuilder) === queryBuilder).toBe(true);
            expect(markUsedSpy.called).toBe(false);
            expect(spy.called).toBe(false);
            stub.restore();
            markUsedSpy.restore();
            spy.restore();
        });
        it('is chainable, marks soft delete state to "should-not-add" if handler.hasSoftDeletes() return false', function () {
            const stub = Sinon.stub(handler, 'hasSoftDeletes');
            stub.returns(true);
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const spy = Sinon.spy(handler, 'markSoftDeleteState');
            expect(Query_1.Query.withTrashed.call(queryBuilder) === queryBuilder).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            expect(spy.calledWith('should-not-add')).toBe(true);
            stub.restore();
            markUsedSpy.restore();
            spy.restore();
        });
    });
    describe('.onlyTrashed()', function () {
        it('is chainable, does nothing if the handler.hasSoftDeletes() return false', function () {
            const stub = Sinon.stub(handler, 'hasSoftDeletes');
            stub.returns(false);
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const whereSpy = Sinon.spy(queryBuilder, 'whereNotNull');
            const spy = Sinon.spy(handler, 'markSoftDeleteState');
            expect(Query_1.Query.onlyTrashed.call(queryBuilder) === queryBuilder).toBe(true);
            expect(markUsedSpy.called).toBe(false);
            expect(whereSpy.called).toBe(false);
            expect(spy.called).toBe(false);
            stub.restore();
            markUsedSpy.restore();
            whereSpy.restore();
            spy.restore();
        });
        it('is chainable, marks soft delete state to "should-not-add" then add condition via .whereNotNull()', function () {
            const stub = Sinon.stub(handler, 'hasSoftDeletes');
            stub.returns(true);
            const markUsedSpy = Sinon.spy(handler, 'markUsed');
            const whereSpy = Sinon.spy(queryBuilder, 'whereNotNull');
            const spy = Sinon.spy(handler, 'markSoftDeleteState');
            expect(Query_1.Query.onlyTrashed.call(queryBuilder) === queryBuilder).toBe(true);
            expect(markUsedSpy.called).toBe(true);
            expect(whereSpy.calledWith('something')).toBe(true);
            expect(spy.calledWith('should-not-add')).toBe(true);
            stub.restore();
            markUsedSpy.restore();
            whereSpy.restore();
            spy.restore();
        });
    });
});
