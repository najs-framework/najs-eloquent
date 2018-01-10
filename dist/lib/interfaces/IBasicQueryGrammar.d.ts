import { IQueryFetchResult } from './IQueryFetchResult';
export declare type NativeQueryHandler = (native: any) => any;
export declare type OrderDirection = 'asc' | 'desc';
export declare type Operator = '=' | '==' | '!=' | '<>' | '<' | '<=' | '=<' | '>' | '>=' | '=>' | 'in' | 'not-in';
export declare type SubCondition = (query: IBasicQueryConditionGrammar) => any;
export interface IBasicQueryConditionGrammar {
    toObject(): Object;
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
export interface IBasicQueryGrammar<T> extends IBasicQueryConditionGrammar {
    native(handler: NativeQueryHandler): IQueryFetchResult<T>;
    select(field: string): this;
    select(fields: string[]): this;
    select(...fields: Array<string | string[]>): this;
    distinct(field: string): this;
    distinct(field: Array<string>): this;
    distinct(...fields: Array<string>): this;
    orderBy(field: string): this;
    orderBy(field: string, direction: OrderDirection): this;
    orderByAsc(field: string): this;
    orderByDesc(field: string): this;
    limit(record: number): this;
}
