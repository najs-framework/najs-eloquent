/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.ts" />
// import IModel = NajsEloquent.Model.IModel
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder

import { Query } from './mixin/Query'
import { ConditionQuery } from './mixin/ConditionQuery'
import { ExecuteQuery } from './mixin/ExecuteQuery'
import { AdvancedQuery } from './mixin/AdvancedQuery'
import { RelationQuery } from './mixin/RelationQuery'
import { QueryBuilderHandlerBase } from './QueryBuilderHandlerBase'

export interface QueryBuilder<T, H extends QueryBuilderHandlerBase = QueryBuilderHandlerBase>
  extends IQueryBuilder<T, H> {}
export class QueryBuilder<T, H extends QueryBuilderHandlerBase = QueryBuilderHandlerBase> {
  protected handler: H

  constructor(handler: H) {
    this.handler = handler
  }
}
Object.assign(QueryBuilder.prototype, Query, ConditionQuery, ExecuteQuery, AdvancedQuery, RelationQuery)
