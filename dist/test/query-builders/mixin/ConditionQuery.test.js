"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ConditionQuery_1 = require("../../../lib/query-builders/mixin/ConditionQuery");
describe('ConditionQuery', function () {
    const conditions = {
        where: [['a', 'b'], ['a', '<>', 'c'], [function () { }]],
        andWhere: [['a', 'b'], ['a', '<>', 'c'], [function () { }]],
        orWhere: [['a', 'b'], ['a', '<>', 'c'], [function () { }]],
        whereNot: [['a', 'b']],
        andWhereNot: [['a', 'b']],
        orWhereNot: [['a', 'b']],
        whereIn: [['a', ['1', '2', '3']]],
        andWhereIn: [['a', ['1', '2', '3']]],
        orWhereIn: [['a', ['1', '2', '3']]],
        whereNotIn: [['a', ['1', '2', '3']]],
        andWhereNotIn: [['a', ['1', '2', '3']]],
        orWhereNotIn: [['a', ['1', '2', '3']]],
        whereNull: [['a']],
        andWhereNull: [['a']],
        orWhereNull: [['a']],
        whereNotNull: [['a']],
        andWhereNotNull: [['a']],
        orWhereNotNull: [['a']],
        whereBetween: [['a', [0, 100]]],
        andWhereBetween: [['a', [0, 100]]],
        orWhereBetween: [['a', [0, 100]]],
        whereNotBetween: [['a', [0, 100]]],
        andWhereNotBetween: [['a', [0, 100]]],
        orWhereNotBetween: [['a', [0, 100]]]
    };
    for (const condition in conditions) {
        const data = conditions[condition];
        describe(`.${condition}()`, function () {
            it(`is chainable, passes params to .${condition}()`, function () {
                const conditionQuery = {
                    [condition]: function () { }
                };
                const handler = {
                    getConditionQuery() {
                        return conditionQuery;
                    },
                    markUsed() { }
                };
                const markUsedSpy = Sinon.spy(handler, 'markUsed');
                const spy = Sinon.spy(conditionQuery, condition);
                const queryBuilder = {
                    handler: handler
                };
                for (const item of data) {
                    expect(ConditionQuery_1.ConditionQuery[condition].call(queryBuilder, ...item) === queryBuilder).toBe(true);
                    expect(markUsedSpy.called).toBe(true);
                    expect(spy.calledWith(...item)).toBe(true);
                    markUsedSpy.resetHistory();
                    spy.resetHistory();
                }
            });
        });
    }
});
