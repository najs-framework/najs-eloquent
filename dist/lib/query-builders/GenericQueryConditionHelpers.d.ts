/// <reference path="interfaces/IQueryConvention.d.ts" />
export interface GenericQueryConditionHelpers {
    convention: NajsEloquent.QueryBuilder.IQueryConvention;
    where(subQuery: (subQuery: GenericQueryConditionHelpers) => void): any;
    where(field: string, operator: string, value: any): any;
    orWhere(subQuery: (subQuery: GenericQueryConditionHelpers) => void): any;
    orWhere(field: string, operator: string, value: any): any;
}
export declare class GenericQueryConditionHelpers {
    andWhere(arg0: any, arg1?: any, arg2?: any): this;
    whereNot(field: string, values: any): this;
    andWhereNot(field: string, values: any): this;
    orWhereNot(field: string, values: any): this;
    whereIn(field: string, values: Array<any>): this;
    andWhereIn(field: string, values: Array<any>): this;
    orWhereIn(field: string, values: Array<any>): this;
    whereNotIn(field: string, values: Array<any>): this;
    andWhereNotIn(field: string, values: Array<any>): this;
    orWhereNotIn(field: string, values: Array<any>): this;
    whereNull(field: string): any;
    andWhereNull(field: string): any;
    orWhereNull(field: string): any;
    whereNotNull(field: string): any;
    andWhereNotNull(field: string): any;
    orWhereNotNull(field: string): any;
    whereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    andWhereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    orWhereBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    whereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    andWhereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    orWhereNotBetween(field: string, range: NajsEloquent.QueryBuilder.Range): this;
    static readonly FUNCTIONS: string[];
}
