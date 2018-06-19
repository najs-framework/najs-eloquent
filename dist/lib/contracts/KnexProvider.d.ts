declare namespace Najs.Contracts.Eloquent {
    interface KnexProvider<Knex, QueryBuilder, Config extends object> extends Najs.Contracts.Autoload {
        /**
         * Set default config for knex instance
         */
        setDefaultConfig(config: Config): this;
        /**
         * Get default config for knex instance
         */
        getDefaultConfig(): Config;
        /**
         * Create an knex instance
         */
        create(config?: Config): Knex;
        /**
         * Create an knex instance
         */
        createQueryBuilder(table: string, config?: Config): QueryBuilder;
    }
}
