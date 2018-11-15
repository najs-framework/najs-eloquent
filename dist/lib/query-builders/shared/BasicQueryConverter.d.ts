/// <reference path="../../definitions/query-grammars/IConditionQuery.d.ts" />
import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory;
import SingleQuery = NajsEloquent.QueryBuilder.SingleQueryConditionData;
import GroupQuery = NajsEloquent.QueryBuilder.GroupQueryConditionData;
import { BasicQuery } from './BasicQuery';
export declare enum BoolOperator {
    AND = "and",
    OR = "or"
}
export declare class BasicQueryConverter {
    protected basicQuery: BasicQuery;
    protected matcherFactory: IConditionMatcherFactory;
    constructor(basicQuery: BasicQuery, matcherFactory: IConditionMatcherFactory);
    getConvertedQuery<T>(): {
        $and: T[];
    } | {
        $or: T[];
    } | {};
    protected convertQueries<T>(data: Array<SingleQuery | GroupQuery>): {
        $and: T[];
    } | {
        $or: T[];
    } | {};
    protected convertQuery(data: SingleQuery | GroupQuery): object;
    protected convertSingleQuery<T>(data: SingleQuery): T;
    protected convertGroupQuery(data: GroupQuery): any;
    protected preprocessData(data: SingleQuery[]): GroupQuery | undefined;
    protected fixSyntaxEdgeCasesOfData(data: SingleQuery[]): void;
    protected checkDataHasTheSameBooleanOperator(queries: SingleQuery[]): boolean;
    protected groupAndBooleanQueries(queries: SingleQuery[]): GroupQuery;
}
