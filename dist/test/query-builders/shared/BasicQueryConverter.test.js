"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const ConditionQueryHandler_1 = require("../../../lib/query-builders/shared/ConditionQueryHandler");
const BasicQuery_1 = require("../../../lib/query-builders/shared/BasicQuery");
const BasicQueryConverter_1 = require("../../../lib/query-builders/shared/BasicQueryConverter");
const QueryBuilder_1 = require("../../../lib/query-builders/QueryBuilder");
const QueryBuilderHandlerBase_1 = require("../../../lib/query-builders/QueryBuilderHandlerBase");
const DefaultConvention_1 = require("../../../lib/query-builders/shared/DefaultConvention");
class Matcher {
    constructor(field, operator, value) {
        this.field = field;
        this.operator = operator;
        this.value = value;
    }
}
const factory = {
    make(data) {
        return new Matcher(data.field, data.operator, data.value);
    },
    transform(matcher) {
        return matcher;
    }
};
class TestQueryBuilderHandler extends QueryBuilderHandlerBase_1.QueryBuilderHandlerBase {
    constructor(model) {
        super(model, {});
        this.convention = new DefaultConvention_1.DefaultConvention();
        this.basicQuery = new BasicQuery_1.BasicQuery(this.convention);
        this.conditionQuery = new ConditionQueryHandler_1.ConditionQueryHandler(this.basicQuery, this.convention);
    }
    getBasicQuery() {
        return this.basicQuery;
    }
    getConditionQuery() {
        return this.conditionQuery;
    }
    getQueryConvention() {
        return this.convention;
    }
}
function make_converter(cb) {
    const handler = new TestQueryBuilderHandler({});
    const queryBuilder = new QueryBuilder_1.QueryBuilder(handler);
    cb(queryBuilder);
    return new BasicQueryConverter_1.BasicQueryConverter(handler.getBasicQuery(), factory);
}
function get_converted_condition_queries(cb) {
    return make_converter(cb).getConvertedQuery();
}
describe('BasicQueryConverter', function () {
    const dataset = [
        {
            desc: 'it returns empty object if there is no condition',
            query: qb => { },
            expected: {}
        },
        {
            desc: 'case #1, add condition under $and array',
            query: qb => qb.where('a', 1),
            expected: {
                $and: [{ field: 'a', operator: '=', value: 1 }]
            }
        },
        {
            desc: 'case #2, add conditions under $and array',
            query: qb => qb.where('a', 1).where('b', 2),
            expected: {
                $and: [{ field: 'a', operator: '=', value: 1 }, { field: 'b', operator: '=', value: 2 }]
            }
        },
        {
            desc: 'case #3, .where().where().orWhere()',
            query: qb => qb
                .where('a', 1)
                .where('b', 2)
                .orWhere('c', 3),
            expected: {
                $or: [
                    { $and: [{ field: 'a', operator: '=', value: 1 }, { field: 'b', operator: '=', value: 2 }] },
                    { field: 'c', operator: '=', value: 3 }
                ]
            }
        },
        {
            desc: 'case #4, (.where().where()).orWhere()',
            query: qb => qb.where(subQuery => subQuery.where('a', 1).where('b', 2)).orWhere('c', 3),
            expected: {
                $or: [
                    {
                        $and: [{ field: 'a', operator: '=', value: 1 }, { field: 'b', operator: '=', value: 2 }]
                    },
                    { field: 'c', operator: '=', value: 3 }
                ]
            }
        },
        {
            desc: 'case #5, .where(.where().where()).orWhere(.where().where())',
            query: qb => qb
                .where(subQuery => subQuery.where('a', 1).where('b', 2))
                .orWhere(subQuery => subQuery.where('c', 3).where('d', 4)),
            expected: {
                $or: [
                    { $and: [{ field: 'a', operator: '=', value: 1 }, { field: 'b', operator: '=', value: 2 }] },
                    { $and: [{ field: 'c', operator: '=', value: 3 }, { field: 'd', operator: '=', value: 4 }] }
                ]
            }
        },
        {
            desc: 'case #6, .where.orWhere.where.orWhere',
            query: qb => qb
                .where('a', 1)
                .orWhere('b', 2)
                .where('c', 3)
                .orWhere('d', 4),
            expected: {
                $or: [
                    { field: 'a', operator: '=', value: 1 },
                    { $and: [{ field: 'b', operator: '=', value: 2 }, { field: 'c', operator: '=', value: 3 }] },
                    { field: 'd', operator: '=', value: 4 }
                ]
            }
        },
        {
            desc: 'case #7 single group query, .where(.where()).orWhere(.where().where())',
            query: qb => qb.where(subQuery => subQuery.where('a', 1)).orWhere(subQuery => subQuery.where('b', 2).where('c', 3)),
            expected: {
                $or: [
                    { field: 'a', operator: '=', value: 1 },
                    { $and: [{ field: 'b', operator: '=', value: 2 }, { field: 'c', operator: '=', value: 3 }] }
                ]
            }
        }
    ];
    for (const data of dataset) {
        if (data.skip) {
            it.skip(data.desc, function () {
                expect(get_converted_condition_queries(data.query)).toEqual(data.expected);
            });
        }
        else {
            it(data.desc, function () {
                expect(get_converted_condition_queries(data.query)).toEqual(data.expected);
            });
        }
    }
    // it('should work', function() {
    //   // console.log(
    //   //   get_converted_condition_queries(qb => {
    //   //     qb.where('a', 1).orWhere('b', 2)
    //   //   })
    //   // )
    //   // log(get_converted_condition_queries(qb => {}))
    //   log(
    //     get_converted_condition_queries(qb => {
    //       qb.where(sqb => {
    //         sqb.where('a', 1)
    //       })
    //         .andWhere(sqb => sqb.where('c', 1).orWhere('d', 1))
    //         .where('a', 1)
    //         .orWhere('b', 1)
    //         .where('c', 1)
    //         .orWhere('d', 1)
    //     })
    //   )
    // })
});
