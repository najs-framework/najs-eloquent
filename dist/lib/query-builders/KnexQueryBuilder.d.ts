/// <reference path="interfaces/ISoftDeleteQuery.d.ts" />
import * as Knex from 'knex';
export declare class KnexQueryBuilder {
    protected softDelete?: {
        deletedAt: string;
    };
    protected knex: Knex.Config;
    constructor(softDelete?: {
        deletedAt: string;
    });
    select(...fields: Array<string | string[]>): this;
}
