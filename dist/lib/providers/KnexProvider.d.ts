/// <reference path="../contracts/KnexProvider.d.ts" />
import * as Knex from 'knex';
import { Facade } from 'najs-facade';
import { QueryBuilder, Config } from 'knex';
export declare class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<Knex, QueryBuilder, Config> {
    protected configurations: {
        [name: string]: Config;
    };
    protected instances: {
        [name: string]: Knex | undefined;
    };
    constructor();
    getClassName(): string;
    setConfig(name: string, config: Config): this;
    getConfig(name: string): Config;
    setDefaultConfig(config: Config): this;
    getDefaultConfig(): Config;
    create(arg1?: string | Config, arg2?: Config): Knex;
    createQueryBuilder(table: string, arg1?: Config | string, arg2?: Config): QueryBuilder;
}
