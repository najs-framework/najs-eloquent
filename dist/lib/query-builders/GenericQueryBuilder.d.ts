/// <reference path="interfaces/IBasicQuery.d.ts" />
/// <reference path="interfaces/IConditionQuery.d.ts" />
/// <reference path="interfaces/ISoftDeleteQuery.d.ts" />
/// <reference path="interfaces/IQueryConvention.d.ts" />
import { GenericQueryCondition } from './GenericQueryCondition';
export declare type QueryBuilderSoftDelete = {
    deletedAt: string;
};
export interface GenericQueryBuilder extends NajsEloquent.QueryBuilder.IConditionQuery {
}
export declare class GenericQueryBuilder implements NajsEloquent.QueryBuilder.IBasicQuery, NajsEloquent.QueryBuilder.ISoftDeleteQuery {
    protected isUsed: boolean;
    protected name: string;
    protected fields: {
        select?: string[];
        distinct?: string[];
    };
    protected selectedFields: string[];
    protected distinctFields: string[];
    protected ordering: Object;
    protected limitNumber: number;
    protected conditions: GenericQueryCondition[];
    protected convention: NajsEloquent.QueryBuilder.IQueryConvention;
    protected softDelete?: QueryBuilderSoftDelete;
    protected addSoftDeleteCondition: boolean;
    protected logGroup: string;
    constructor(softDelete?: QueryBuilderSoftDelete);
    protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention;
    protected getConditions(): Object[];
    protected flattenFieldNames(type: string, fields: ArrayLike<any>): this;
    queryName(name: string): this;
    getPrimaryKeyName(): string;
    setLogGroup(group: string): this;
    select(field: string): this;
    select(fields: string[]): this;
    select(...fields: Array<string | string[]>): this;
    orderBy(field: string, direction?: 'asc' | 'desc'): this;
    orderByAsc(field: string): this;
    orderByDesc(field: string): this;
    limit(records: number): this;
    protected createConditionQuery(operator: 'and' | 'or', arg0: string | NajsEloquent.QueryBuilder.SubCondition, arg1?: NajsEloquent.QueryBuilder.Operator | any, arg2?: any): this;
    where(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this;
    where(field: string, value: any): this;
    where(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this;
    orWhere(conditionBuilder: NajsEloquent.QueryBuilder.SubCondition): this;
    orWhere(field: string, value: any): this;
    orWhere(field: string, operator: NajsEloquent.QueryBuilder.Operator, value: any): this;
    withTrashed(): this;
    onlyTrashed(): this;
}
