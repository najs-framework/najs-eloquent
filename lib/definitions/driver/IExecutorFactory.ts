/// <reference path="../model/IModel.ts" />
/// <reference path="../query-builders/IQueryBuilderHandler.ts" />

namespace NajsEloquent.Driver {
  export interface IExecutorFactory {
    makeRecordExecutor(model: Model.ModelInternal, record: any): Feature.IRecordExecutor

    makeQueryExecutor(handler: QueryBuilder.IQueryBuilderHandler): QueryBuilder.IQueryExecutor
  }
}
