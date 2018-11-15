/// <reference path="../../definitions/query-grammars/IBasicConditionQuery.d.ts" />
/// <reference path="../../definitions/query-grammars/IConditionQuery.d.ts" />
import SubCondition = NajsEloquent.QueryGrammar.SubCondition;
import Operator = NajsEloquent.QueryGrammar.Operator;
import IBasicConditionQuery = NajsEloquent.QueryGrammar.IBasicConditionQuery;
import IConditionQuery = NajsEloquent.QueryGrammar.IConditionQuery;
import IConvention = NajsEloquent.QueryBuilder.IConvention;
export declare class QueryCondition implements IBasicConditionQuery {
    convention: IConvention;
    isSubQuery: boolean;
    bool: 'and' | 'or';
    operator: Operator;
    field: string;
    value: string;
    queries: QueryCondition[];
    conditionQueryHandle: IConditionQuery;
    protected constructor();
    static create(convention: IConvention, bool: 'and' | 'or', arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): QueryCondition;
    getConditionQueryHandler(): IConditionQuery;
    toObject(): object;
    buildQuery(bool: 'and' | 'or', arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this;
    buildSubQuery(queryCondition: QueryCondition, arg0: SubCondition): this;
    where(conditionBuilder: SubCondition): this;
    where(field: string, value: any): this;
    where(field: string, operator: Operator, value: any): this;
    orWhere(conditionBuilder: SubCondition): this;
    orWhere(field: string, value: any): this;
    orWhere(field: string, operator: Operator, value: any): this;
}
