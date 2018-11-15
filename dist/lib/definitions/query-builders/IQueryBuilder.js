/// <reference path="IQueryBuilderHandler.ts" />
/// <reference path="../model/IModel.ts" />
/// <reference path="../query-grammars/IQuery.ts" />
/// <reference path="../query-grammars/IRelationQuery.ts" />
/// <reference path="../query-grammars/IConditionQuery.ts" />
var NajsEloquent;
(function (NajsEloquent) {
    var QueryBuilder;
    (function (QueryBuilder) {
        // export type OmittedResult<T, K> = Pick<T, Exclude<keyof T, (keyof QueryBuilder.IQueryBuilder<any>) | (keyof K)>>
        // export type OmittedQueryBuilderResult<T> = Pick<T, Exclude<keyof T, keyof QueryBuilder.IQueryBuilder<any>>>
    })(QueryBuilder = NajsEloquent.QueryBuilder || (NajsEloquent.QueryBuilder = {}));
})(NajsEloquent || (NajsEloquent = {}));
