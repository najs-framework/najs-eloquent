/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />

import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory
import SingleQuery = NajsEloquent.QueryBuilder.SingleQueryConditionData
import GroupQuery = NajsEloquent.QueryBuilder.GroupQueryConditionData

import { BasicQuery } from './BasicQuery'

export enum BoolOperator {
  AND = 'and',
  OR = 'or'
}

export class BasicQueryConverter {
  protected basicQuery: BasicQuery
  protected matcherFactory: IConditionMatcherFactory

  constructor(basicQuery: BasicQuery, matcherFactory: IConditionMatcherFactory) {
    this.basicQuery = basicQuery
    this.matcherFactory = matcherFactory
  }

  getConvertedQuery<T>(): { $and: T[] } | { $or: T[] } | {} {
    return this.convertQueries<T>(this.basicQuery.getConditions() as any)
  }

  protected convertQueries<T>(data: Array<SingleQuery | GroupQuery>): { $and: T[] } | { $or: T[] } | {} {
    const processedData: GroupQuery | undefined = this.preprocessData(data as any)
    if (!processedData) {
      return {}
    }

    return {
      [`$${processedData.bool}`]: processedData.queries.map(item => this.convertQuery(item))
    }
  }

  protected convertQuery(data: SingleQuery | GroupQuery): object {
    if (typeof data['queries'] === 'undefined') {
      return this.convertSingleQuery(data as SingleQuery)
    }
    return this.convertGroupQuery(data as GroupQuery)
  }

  protected convertSingleQuery<T>(data: SingleQuery): T {
    return this.matcherFactory.transform(this.matcherFactory.make(data))
  }

  protected convertGroupQuery(data: GroupQuery): any {
    if (data.queries.length === 1) {
      return this.convertQuery(data.queries[0])
    }

    return this.convertQueries(data.queries)
  }

  protected preprocessData(data: SingleQuery[]): GroupQuery | undefined {
    if (data.length === 0) {
      return undefined
    }

    if (data.length === 1) {
      return {
        bool: data[0].bool,
        queries: [data[0]]
      }
    }

    this.fixSyntaxEdgeCasesOfData(data)
    if (this.checkDataHasTheSameBooleanOperator(data)) {
      return {
        bool: data[0].bool,
        queries: data
      }
    }

    return this.groupAndBooleanQueries(data)
  }

  protected fixSyntaxEdgeCasesOfData(data: SingleQuery[]) {
    // edge case: .orWhere().where()
    if (data[0].bool === BoolOperator.AND && data[1].bool === BoolOperator.OR) {
      data[0].bool = BoolOperator.OR
    }

    // always group and operator, for example: a | b & c | d => a | (b & c) | d
    for (let i = 1, l = data.length; i < l; i++) {
      if (data[i].bool === BoolOperator.AND && data[i - 1].bool === BoolOperator.OR) {
        data[i - 1].bool = BoolOperator.AND
      }
    }
  }

  protected checkDataHasTheSameBooleanOperator(queries: SingleQuery[]) {
    let currentBool: string = queries[0].bool
    for (let i = 1, l = queries.length; i < l; i++) {
      if (queries[i].bool !== currentBool) {
        return false
      }
      currentBool = queries[i].bool
    }
    return true
  }

  protected groupAndBooleanQueries(queries: SingleQuery[]): GroupQuery {
    const result: Array<SingleQuery | GroupQuery> = []

    for (let i = 0, l = queries.length; i < l; i++) {
      if (queries[i].bool === BoolOperator.OR) {
        result.push(queries[i])
        continue
      }

      if (result.length === 0 || typeof result[result.length - 1]['queries'] === 'undefined') {
        result.push({ bool: BoolOperator.AND, queries: [queries[i]] })
        continue
      }

      result[result.length - 1]['queries'].push(queries[i])
    }

    return { bool: BoolOperator.OR, queries: result }
  }
}
