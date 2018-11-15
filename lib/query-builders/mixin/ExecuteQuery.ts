/// <reference path="../QueryBuilder.ts" />
/// <reference path="../../definitions/query-grammars/IExecuteQuery.ts" />

import QueryBuilder = NajsEloquent.QueryBuilder.QueryBuilderInternal

export const ExecuteQuery: NajsEloquent.QueryGrammar.IExecuteQuery = {
  async count(this: QueryBuilder): Promise<number> {
    return this.handler.getQueryExecutor().count()
  },

  async update(this: QueryBuilder, data: Object): Promise<any> {
    return this.handler.getQueryExecutor().update(this)
  },

  async delete(this: QueryBuilder): Promise<any> {
    return this.handler.getQueryExecutor().delete()
  },

  async restore(this: QueryBuilder): Promise<any> {
    return this.handler.getQueryExecutor().restore()
  },

  async execute(this: QueryBuilder): Promise<any> {
    return this.handler.getQueryExecutor().execute()
  }
}
