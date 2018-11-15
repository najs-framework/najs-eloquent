/// <reference path="IQueryBuilderHandler.d.ts" />
/// <reference path="../model/IModel.d.ts" />
/// <reference path="../query-grammars/IQuery.d.ts" />
/// <reference path="../query-grammars/IRelationQuery.d.ts" />
/// <reference path="../query-grammars/IConditionQuery.d.ts" />
declare namespace NajsEloquent.QueryBuilder {
    class IQueryBuilder<T, Handler extends IQueryBuilderHandler = IQueryBuilderHandler> {
        protected handler: Handler;
    }
    interface IQueryBuilder<T, Handler extends IQueryBuilderHandler = IQueryBuilderHandler> extends QueryGrammar.IQuery, QueryGrammar.IConditionQuery, QueryGrammar.IExecuteQuery, QueryGrammar.IAdvancedQuery<T>, QueryGrammar.IRelationQuery {
    }
    type QueryBuilderInternal = IQueryBuilder<any> & {
        handler: NajsEloquent.QueryBuilder.IQueryBuilderHandler;
    };
}
