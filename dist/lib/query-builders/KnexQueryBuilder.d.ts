/// <reference path="interfaces/ISoftDeleteQuery.d.ts" />
import './KnexQueryLog';
import * as Knex from 'knex';
import { QueryBuilderBase } from './QueryBuilderBase';
import { KnexQueryLog } from './KnexQueryLog';
export interface KnexQueryBuilder<T> extends NajsEloquent.QueryBuilder.IBasicQuery, NajsEloquent.QueryBuilder.ISoftDeleteQuery, NajsEloquent.QueryBuilder.IConditionQuery {
}
export declare class KnexQueryBuilder<T> extends QueryBuilderBase implements Najs.Contracts.Autoload, NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    protected softDelete?: {
        deletedAt: string;
    };
    protected table: string;
    protected configName?: string;
    protected knexQueryBuilder: Knex.QueryBuilder | null;
    protected addSoftDeleteCondition: boolean;
    protected addedSoftDeleteCondition: boolean;
    constructor(table: string, primaryKeyName: string, configName?: string, softDelete?: {
        deletedAt: string;
    });
    getClassName(): string;
    getKnexQueryBuilder(): Knex.QueryBuilder;
    orderBy(field: string, direction?: string): this;
    withTrashed(): this;
    onlyTrashed(): this;
    get(): Promise<T[]>;
    first(): Promise<T | null>;
    count(): Promise<number>;
    update(data: Object): Promise<number>;
    delete(): Promise<number>;
    restore(): Promise<number>;
    execute(): Promise<any>;
    native(handler: (queryBuilder: Knex.QueryBuilder) => void): this;
    resolveKnexQueryLog(): KnexQueryLog;
}
