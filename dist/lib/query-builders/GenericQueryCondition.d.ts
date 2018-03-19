import { IQueryConvention } from './interfaces/IQueryConvention';
import { IConditionQuery, SubCondition, Operator } from './interfaces/IConditionQuery';
export declare class GenericQueryCondition implements IConditionQuery {
    convention: IQueryConvention;
    isSubQuery: boolean;
    bool: 'and' | 'or';
    operator: Operator;
    field: string;
    value: string;
    queries: GenericQueryCondition[];
    protected constructor();
    static create(convention: IQueryConvention, operator: 'and' | 'or', arg0: string | SubCondition, arg1: Operator | any, arg2: any): GenericQueryCondition;
    toObject(): Object;
    protected buildQuery(bool: 'and' | 'or', arg0: string | SubCondition, arg1: Operator | any, arg2: any): this;
    protected buildSubQuery(queryCondition: GenericQueryCondition, arg0: Function): this;
    where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this;
    orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): this;
    whereIn(field: string, values: Array<any>): this;
    whereNotIn(field: string, values: Array<any>): this;
    orWhereIn(field: string, values: Array<any>): this;
    orWhereNotIn(field: string, values: Array<any>): this;
    whereNull(field: string): this;
    whereNotNull(field: string): this;
    orWhereNull(field: string): this;
    orWhereNotNull(field: string): this;
}
