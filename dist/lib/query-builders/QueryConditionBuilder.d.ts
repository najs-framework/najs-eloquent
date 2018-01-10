import { IBasicQueryConditionGrammar, SubCondition, Operator } from './../interfaces/IBasicQueryGrammar';
export declare class QueryCondition implements IBasicQueryConditionGrammar {
    isSubQuery: boolean;
    bool: 'and' | 'or';
    operator: Operator;
    field: string;
    value: string;
    queries: QueryCondition[];
    constructor();
    toObject(): Object;
    private buildQuery(bool, arg0, arg1, arg2);
    where(conditionBuilder: SubCondition): this;
    where(field: string, value: any): this;
    where(field: string, operator: Operator, value: any): this;
    orWhere(conditionBuilder: SubCondition): this;
    orWhere(field: string, value: any): this;
    orWhere(field: string, operator: Operator, value: any): this;
    whereIn(field: string, values: Array<any>): this;
    whereNotIn(field: string, values: Array<any>): this;
    orWhereIn(field: string, values: Array<any>): this;
    orWhereNotIn(field: string, values: Array<any>): this;
}
