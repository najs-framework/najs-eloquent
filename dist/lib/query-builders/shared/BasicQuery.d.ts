/// <reference path="../../definitions/query-builders/IConvention.d.ts" />
/// <reference path="../../definitions/query-grammars/IBasicQuery.d.ts" />
/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.d.ts" />
import IConvention = NajsEloquent.QueryBuilder.IConvention;
import IBasicQuery = NajsEloquent.QueryGrammar.IBasicQuery;
import IBasicConditionQuery = NajsEloquent.QueryGrammar.IBasicConditionQuery;
import SubCondition = NajsEloquent.QueryGrammar.SubCondition;
import OperatorType = NajsEloquent.QueryGrammar.Operator;
import { QueryCondition } from './QueryCondition';
export declare type QueryBuilderSoftDelete = {
    deletedAt: string;
};
export declare class BasicQuery implements IBasicQuery, IBasicConditionQuery {
    protected fields: {
        select?: string[];
        distinct?: string[];
    };
    protected ordering: Map<string, string>;
    protected limitNumber: number;
    protected conditions: QueryCondition[];
    protected convention: IConvention;
    constructor(convention: IConvention);
    getConditions(): object[];
    getRawConditions(): QueryCondition[];
    getLimit(): number;
    getOrdering(): Map<string, string>;
    getSelect(): string[] | undefined;
    clearSelect(): void;
    clearOrdering(): void;
    select(...fields: Array<string | string[]>): this;
    orderBy(field: string, direction?: 'asc' | 'desc'): this;
    limit(records: number): this;
    where(conditionBuilder: SubCondition): this;
    where(field: string, value: any): this;
    where(field: string, operator: OperatorType, value: any): this;
    orWhere(conditionBuilder: SubCondition): this;
    orWhere(field: string, value: any): this;
    orWhere(field: string, operator: OperatorType, value: any): this;
}
