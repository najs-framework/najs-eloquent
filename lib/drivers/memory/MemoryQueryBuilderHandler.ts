/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-grammars/IBasicQuery.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.ts" />
/// <reference path="../../definitions/query-builders/IConvention.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />

import IModel = NajsEloquent.Model.IModel
import IConvention = NajsEloquent.QueryBuilder.IConvention
import IConditionQuery = NajsEloquent.QueryGrammar.IConditionQuery
import { DefaultConvention } from '../../query-builders/shared/DefaultConvention'
import { make } from 'najs-binding'
import { QueryBuilderHandlerBase } from '../../query-builders/QueryBuilderHandlerBase'
import { BasicQuery } from '../../query-builders/shared/BasicQuery'
import { ConditionQueryHandler } from '../../query-builders/shared/ConditionQueryHandler'
import { MemoryExecutorFactory } from './MemoryExecutorFactory'

export class MemoryQueryBuilderHandler extends QueryBuilderHandlerBase {
  protected basicQuery: BasicQuery
  protected conditionQuery: ConditionQueryHandler
  protected convention: IConvention

  constructor(model: IModel) {
    super(model, make<MemoryExecutorFactory>(MemoryExecutorFactory.className))
    this.convention = new DefaultConvention()
    this.basicQuery = new BasicQuery(this.convention)
    this.conditionQuery = new ConditionQueryHandler(this.basicQuery, this.convention)
  }

  getBasicQuery(): BasicQuery {
    return this.basicQuery
  }

  getConditionQuery(): IConditionQuery {
    return this.conditionQuery
  }

  getQueryConvention(): IConvention {
    return this.convention
  }
}
