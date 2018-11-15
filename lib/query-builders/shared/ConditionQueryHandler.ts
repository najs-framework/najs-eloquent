/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.ts" />
/// <reference path="../../definitions/query-builders/IConvention.ts" />

import SubCondition = NajsEloquent.QueryGrammar.SubCondition
import OperatorType = NajsEloquent.QueryGrammar.Operator
import Range = NajsEloquent.QueryGrammar.Range
import IBasicConditionQuery = NajsEloquent.QueryGrammar.IBasicConditionQuery
import IConditionQuery = NajsEloquent.QueryGrammar.IConditionQuery
import IConvention = NajsEloquent.QueryBuilder.IConvention

import { Operator } from './Operator'

export class ConditionQueryHandler implements IConditionQuery {
  protected basicConditionQuery: IBasicConditionQuery
  protected convention: IConvention

  constructor(basicConditionQuery: IBasicConditionQuery, convention: IConvention) {
    this.basicConditionQuery = basicConditionQuery
    this.convention = convention
  }

  where(conditionBuilder: SubCondition): this
  where(field: string, value: any): this
  where(field: string, operator: OperatorType, value: any): this
  where(arg0: any, arg1?: any, arg2?: any): this {
    this.basicConditionQuery.where(arg0, arg1, arg2)

    return this
  }

  orWhere(conditionBuilder: SubCondition): this
  orWhere(field: string, value: any): this
  orWhere(field: string, operator: OperatorType, value: any): this
  orWhere(arg0: any, arg1?: any, arg2?: any): this {
    this.basicConditionQuery.orWhere(arg0, arg1, arg2)

    return this
  }

  andWhere(arg0: any, arg1?: any, arg2?: any): this {
    return this.where(arg0, arg1, arg2)
  }

  whereNot(field: string, values: any): this {
    return this.where(field, Operator.NotEquals, values)
  }

  andWhereNot(field: string, values: any): this {
    return this.whereNot(field, values)
  }

  orWhereNot(field: string, values: any): this {
    return this.orWhere(field, Operator.NotEquals, values)
  }

  whereIn(field: string, values: Array<any>): this {
    return this.where(field, Operator.In, values)
  }

  andWhereIn(field: string, values: Array<any>): this {
    return this.whereIn(field, values)
  }

  orWhereIn(field: string, values: Array<any>): this {
    return this.orWhere(field, Operator.In, values)
  }

  whereNotIn(field: string, values: Array<any>): this {
    return this.where(field, Operator.NotIn, values)
  }

  andWhereNotIn(field: string, values: Array<any>): this {
    return this.whereNotIn(field, values)
  }

  orWhereNotIn(field: string, values: Array<any>): this {
    return this.orWhere(field, Operator.NotIn, values)
  }

  whereNull(field: string) {
    return this.where(field, Operator.Equals, this.convention.getNullValueFor(field))
  }

  andWhereNull(field: string) {
    return this.whereNull(field)
  }

  orWhereNull(field: string) {
    return this.orWhere(field, Operator.Equals, this.convention.getNullValueFor(field))
  }

  whereNotNull(field: string) {
    return this.where(field, Operator.NotEquals, this.convention.getNullValueFor(field))
  }

  andWhereNotNull(field: string) {
    return this.whereNotNull(field)
  }

  orWhereNotNull(field: string) {
    return this.orWhere(field, Operator.NotEquals, this.convention.getNullValueFor(field))
  }

  whereBetween(field: string, range: Range): this {
    return this.where(field, Operator.GreaterThanOrEquals, range[0]).where(field, Operator.LessThanOrEquals, range[1])
  }

  andWhereBetween(field: string, range: Range): this {
    return this.whereBetween(field, range)
  }

  orWhereBetween(field: string, range: Range): this {
    return this.orWhere(function(subQuery) {
      subQuery.where(field, Operator.GreaterThanOrEquals, range[0]).where(field, Operator.LessThanOrEquals, range[1])
    })
  }

  whereNotBetween(field: string, range: Range): this {
    return this.where(function(subQuery) {
      subQuery.where(field, Operator.LessThan, range[0]).orWhere(field, Operator.GreaterThan, range[1])
    })
  }

  andWhereNotBetween(field: string, range: Range): this {
    return this.whereNotBetween(field, range)
  }

  orWhereNotBetween(field: string, range: Range): this {
    return this.orWhere(function(subQuery) {
      subQuery.where(field, Operator.LessThan, range[0]).orWhere(field, Operator.GreaterThan, range[1])
    })
  }
}
