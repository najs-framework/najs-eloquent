/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.d.ts" />
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import { QueryBuilderHandlerBase } from './QueryBuilderHandlerBase';
export interface QueryBuilder<T, H extends QueryBuilderHandlerBase = QueryBuilderHandlerBase> extends IQueryBuilder<T, H> {
}
export declare class QueryBuilder<T, H extends QueryBuilderHandlerBase = QueryBuilderHandlerBase> {
    protected handler: H;
    constructor(handler: H);
}
