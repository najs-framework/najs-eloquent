namespace Najs.Contracts.Eloquent {
  export interface KnexProvider<Knex, QueryBuilder, Config extends object> extends Najs.Contracts.Autoload {
    /**
     * Set config by name
     * @param {string} name
     * @param {object} config
     */
    setConfig(name: string, config: Config): this

    /**
     * Set config by name
     * @param {string} name
     */
    getConfig(name: string): Config

    /**
     * Set default config for knex instance
     */
    setDefaultConfig(config: Config): this

    /**
     * Get default config for knex instance
     */
    getDefaultConfig(): Config

    /**
     * Create an knex instance
     */
    create(): Knex
    /**
     * Create an knex cached instance
     */
    create(name: string): Knex
    /**
     * Create an knex instance with config
     */
    create(config: Config): Knex
    /**
     * Set config to name and create knex cached instance
     */
    create(name: string, config: Config): Knex

    /**
     * Create query builder from default knex instance
     */
    createQueryBuilder(table: string): QueryBuilder
    /**
     * Create query builder from knex cached instance by name
     */
    createQueryBuilder(table: string, name: string): QueryBuilder
    /**
     * Create query builder from not cached knex instance with config
     */
    createQueryBuilder(table: string, config: Config): QueryBuilder
    /**
     * Set config to name and create query builder from knex cached instance
     */
    createQueryBuilder(table: string, name: string, config: Config): QueryBuilder
  }
}
