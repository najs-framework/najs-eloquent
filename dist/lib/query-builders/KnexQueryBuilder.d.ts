/// <reference path="interfaces/ISoftDeleteQuery.d.ts" />
import * as Knex from 'knex';
import { QueryBuilderBase } from './QueryBuilderBase';
export interface KnexQueryBuilder extends NajsEloquent.QueryBuilder.IBasicQuery, NajsEloquent.QueryBuilder.ISoftDeleteQuery, NajsEloquent.QueryBuilder.IConditionQuery {
}
export declare class KnexQueryBuilder extends QueryBuilderBase {
    protected softDelete?: {
        deletedAt: string;
    };
    protected table: string;
    protected knexQueryBuilder: Knex.QueryBuilder | null;
    constructor(table: string, primaryKeyName: string, softDelete?: {
        deletedAt: string;
    });
    getKnexQueryBuilder(): Knex.QueryBuilder;
    orderBy(field: string, direction?: string): this;
    get(): Promise<object[]>;
}
