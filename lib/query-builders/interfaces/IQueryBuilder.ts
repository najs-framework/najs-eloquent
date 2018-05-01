/// <reference path="IBasicQuery.ts" />
/// <reference path="IConditionQuery.ts" />
/// <reference path="IFetchResultQuery.ts" />

namespace NajsEloquent.QueryBuilder {
  export interface IQueryBuilder extends IBasicQuery, IConditionQuery {}
}
