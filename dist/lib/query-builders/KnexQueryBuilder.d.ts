/// <reference path="interfaces/ISoftDeleteQuery.d.ts" />
import './KnexQueryLog';
import * as Knex from 'knex';
import { QueryBuilderBase } from './QueryBuilderBase';
import { KnexQueryLog } from './KnexQueryLog';
export interface KnexQueryBuilder extends NajsEloquent.QueryBuilder.IBasicQuery, NajsEloquent.QueryBuilder.ISoftDeleteQuery, NajsEloquent.QueryBuilder.IConditionQuery {
}
export declare class KnexQueryBuilder extends QueryBuilderBase implements Najs.Contracts.Autoload {
    protected softDelete?: {
        deletedAt: string;
    };
    protected table: string;
    protected knexQueryBuilder: Knex.QueryBuilder | null;
    protected addSoftDeleteCondition: boolean;
    protected addedSoftDeleteCondition: boolean;
    constructor(table: string, primaryKeyName: string, softDelete?: {
        deletedAt: string;
    });
    getClassName(): string;
    getKnexQueryBuilder(): Knex.QueryBuilder;
    orderBy(field: string, direction?: string): this;
    withTrashed(): this;
    onlyTrashed(): this;
    get(): Promise<object[]>;
    first(): Promise<object | null>;
    count(): Promise<number>;
    update(data: Object): Promise<number>;
    delete(): Promise<number>;
    resolveKnexQueryLog(): KnexQueryLog;
}
