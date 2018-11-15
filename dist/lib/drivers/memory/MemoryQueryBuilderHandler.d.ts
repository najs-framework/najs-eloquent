/// <reference path="../../definitions/model/IModel.d.ts" />
/// <reference path="../../definitions/query-grammars/IBasicQuery.d.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.d.ts" />
/// <reference path="../../definitions/query-builders/IConvention.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import IConvention = NajsEloquent.QueryBuilder.IConvention;
import IConditionQuery = NajsEloquent.QueryGrammar.IConditionQuery;
import { QueryBuilderHandlerBase } from '../../query-builders/QueryBuilderHandlerBase';
import { BasicQuery } from '../../query-builders/shared/BasicQuery';
import { ConditionQueryHandler } from '../../query-builders/shared/ConditionQueryHandler';
export declare class MemoryQueryBuilderHandler extends QueryBuilderHandlerBase {
    protected basicQuery: BasicQuery;
    protected conditionQuery: ConditionQueryHandler;
    protected convention: IConvention;
    constructor(model: IModel);
    getBasicQuery(): BasicQuery;
    getConditionQuery(): IConditionQuery;
    getQueryConvention(): IConvention;
}
