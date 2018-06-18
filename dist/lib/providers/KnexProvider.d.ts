/// <reference path="../contracts/KnexProvider.d.ts" />
import { Facade } from 'najs-facade';
import { QueryBuilder, Config } from 'knex';
export declare class KnexProvider extends Facade implements Najs.Contracts.Eloquent.KnexProvider<QueryBuilder, Config> {
    protected config: Config;
    getClassName(): string;
    setDefaultConfig(config: Config): this;
    getDefaultConfig(): Config;
    create(table: string, config?: Config): QueryBuilder;
}
