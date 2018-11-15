/// <reference path="../QueryBuilder.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />
import QueryBuilder = NajsEloquent.QueryBuilder.QueryBuilderInternal
import Range = NajsEloquent.QueryGrammar.Range

export const ConditionQuery: NajsEloquent.QueryGrammar.IConditionQuery = {
  where(this: QueryBuilder, arg0?: any, arg1?: any, arg2?: any) {
    const conditionQuery = this.handler.getConditionQuery()
    conditionQuery.where.apply(conditionQuery, arguments)

    this.handler.markUsed()
    return this
  },

  orWhere(this: QueryBuilder, arg0?: any, arg1?: any, arg2?: any) {
    const conditionQuery = this.handler.getConditionQuery()
    conditionQuery.orWhere.apply(conditionQuery, arguments)

    this.handler.markUsed()
    return this
  },

  andWhere(this: QueryBuilder, arg0?: any, arg1?: any, arg2?: any) {
    const conditionQuery = this.handler.getConditionQuery()
    conditionQuery.andWhere.apply(conditionQuery, arguments)
    this.handler.markUsed()
    return this
  },

  whereNot(this: QueryBuilder, field: string, value: any) {
    this.handler.getConditionQuery().whereNot(field, value)
    this.handler.markUsed()
    return this
  },

  andWhereNot(this: QueryBuilder, field: string, value: any) {
    this.handler.getConditionQuery().andWhereNot(field, value)
    this.handler.markUsed()
    return this
  },

  orWhereNot(this: QueryBuilder, field: string, value: any) {
    this.handler.getConditionQuery().orWhereNot(field, value)
    this.handler.markUsed()
    return this
  },

  whereIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().whereIn(field, values)
    this.handler.markUsed()
    return this
  },

  andWhereIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().andWhereIn(field, values)
    this.handler.markUsed()
    return this
  },

  orWhereIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().orWhereIn(field, values)
    this.handler.markUsed()
    return this
  },

  whereNotIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().whereNotIn(field, values)
    this.handler.markUsed()
    return this
  },

  andWhereNotIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().andWhereNotIn(field, values)
    this.handler.markUsed()
    return this
  },

  orWhereNotIn(this: QueryBuilder, field: string, values: Array<any>) {
    this.handler.getConditionQuery().orWhereNotIn(field, values)
    this.handler.markUsed()
    return this
  },

  whereNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().whereNull(field)
    this.handler.markUsed()
    return this
  },

  andWhereNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().andWhereNull(field)
    this.handler.markUsed()
    return this
  },

  orWhereNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().orWhereNull(field)
    this.handler.markUsed()
    return this
  },

  whereNotNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().whereNotNull(field)
    this.handler.markUsed()
    return this
  },

  andWhereNotNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().andWhereNotNull(field)
    this.handler.markUsed()
    return this
  },

  orWhereNotNull(this: QueryBuilder, field: string) {
    this.handler.getConditionQuery().orWhereNotNull(field)
    this.handler.markUsed()
    return this
  },

  whereBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().whereBetween(field, range)
    this.handler.markUsed()
    return this
  },

  andWhereBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().andWhereBetween(field, range)
    this.handler.markUsed()
    return this
  },

  orWhereBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().orWhereBetween(field, range)
    this.handler.markUsed()
    return this
  },

  whereNotBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().whereNotBetween(field, range)
    this.handler.markUsed()
    return this
  },

  andWhereNotBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().andWhereNotBetween(field, range)
    this.handler.markUsed()
    return this
  },

  orWhereNotBetween(this: QueryBuilder, field: string, range: Range) {
    this.handler.getConditionQuery().orWhereNotBetween(field, range)
    this.handler.markUsed()
    return this
  }
}
