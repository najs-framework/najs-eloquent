/// <reference path="IBasicQuery.d.ts" />
/// <reference path="IConditionQuery.d.ts" />
/// <reference path="IFetchResultQuery.d.ts" />
declare namespace NajsEloquent.QueryBuilder {
    interface IQueryBuilder extends IBasicQuery, IConditionQuery {
    }
}
