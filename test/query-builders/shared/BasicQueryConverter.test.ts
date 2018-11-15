import 'jest'
import { ConditionQueryHandler } from '../../../lib/query-builders/shared/ConditionQueryHandler'
import { BasicQuery } from '../../../lib/query-builders/shared/BasicQuery'
import { BasicQueryConverter } from '../../../lib/query-builders/shared/BasicQueryConverter'
import { QueryBuilder } from '../../../lib/query-builders/QueryBuilder'
import { QueryBuilderHandlerBase } from '../../../lib/query-builders/QueryBuilderHandlerBase'
import { DefaultConvention } from '../../../lib/query-builders/shared/DefaultConvention'

class Matcher {
  operator: string
  field: string
  value: any

  constructor(field: string, operator: string, value: string) {
    this.field = field
    this.operator = operator
    this.value = value
  }
}

type TestData = {
  skip?: boolean
  desc: string
  query: (qb: QueryBuilder<any>) => void
  expected: object
}

const factory = {
  make(data: any): any {
    return new Matcher(data.field, data.operator, data.value)
  },

  transform(matcher: any) {
    return matcher
  }
}

class TestQueryBuilderHandler extends QueryBuilderHandlerBase {
  protected basicQuery: BasicQuery
  protected conditionQuery: ConditionQueryHandler
  protected convention: DefaultConvention

  constructor(model: any) {
    super(model, {} as any)
    this.convention = new DefaultConvention()
    this.basicQuery = new BasicQuery(this.convention)
    this.conditionQuery = new ConditionQueryHandler(this.basicQuery, this.convention)
  }

  getBasicQuery() {
    return this.basicQuery
  }

  getConditionQuery() {
    return this.conditionQuery
  }

  getQueryConvention() {
    return this.convention
  }
}

function make_converter(cb: ((qb: QueryBuilder<any>) => void)) {
  const handler = new TestQueryBuilderHandler({})
  const queryBuilder = new QueryBuilder(handler)
  cb(queryBuilder)

  return new BasicQueryConverter(handler.getBasicQuery(), factory)
}

function get_converted_condition_queries(cb: ((qb: QueryBuilder<any>) => void)) {
  return make_converter(cb).getConvertedQuery()
}

describe('BasicQueryConverter', function() {
  const dataset: TestData[] = [
    {
      desc: 'it returns empty object if there is no condition',
      query: qb => {},
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
      query: qb =>
        qb
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
      query: qb =>
        qb
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
      query: qb =>
        qb
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
      query: qb =>
        qb.where(subQuery => subQuery.where('a', 1)).orWhere(subQuery => subQuery.where('b', 2).where('c', 3)),
      expected: {
        $or: [
          { field: 'a', operator: '=', value: 1 },
          { $and: [{ field: 'b', operator: '=', value: 2 }, { field: 'c', operator: '=', value: 3 }] }
        ]
      }
    }
  ]

  for (const data of dataset) {
    if (data.skip) {
      it.skip(data.desc, function() {
        expect(get_converted_condition_queries(data.query)).toEqual(data.expected)
      })
    } else {
      it(data.desc, function() {
        expect(get_converted_condition_queries(data.query)).toEqual(data.expected)
      })
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
})
