/// <reference path="../model/IModel.d.ts" />
/// <reference path="../query-builders/IQueryBuilderHandler.d.ts" />
declare namespace NajsEloquent.Driver {
    interface IExecutorFactory {
        makeRecordExecutor(model: Model.ModelInternal, record: any): Feature.IRecordExecutor;
        makeQueryExecutor(handler: QueryBuilder.IQueryBuilderHandler): QueryBuilder.IQueryExecutor;
    }
}
