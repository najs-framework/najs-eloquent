/// <reference path="../contracts/KnexProvider.d.ts" />
import * as Knex from 'knex';
import { Facade } from 'najs-facade';
import { QueryBuilder, Config } from 'knex';
export declare class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
    protected defaultConfig: Config;
    getClassName(): string;
    setDefaultConfig(config: Config): this;
    getDefaultConfig(): Config;
    create(config?: Config): Knex;
    createQueryBuilder(table: string, config?: Config): QueryBuilder;
}