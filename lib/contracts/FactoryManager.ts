/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../factory/interfaces/FactoryDefinition.ts" />

namespace Najs.Contracts.Eloquent {
  export interface FactoryFunction {
    <T>(className: string | { new (): T }): Najs.Contracts.Eloquent.FactoryBuilder<T>
    <T>(className: string | { new (): T }, name: string): Najs.Contracts.Eloquent.FactoryBuilder<T>
    <T>(className: string | { new (): T }, amount: number): Najs.Contracts.Eloquent.FactoryBuilder<T>
    <T>(className: string | { new (): T }, name: string, amount: number): Najs.Contracts.Eloquent.FactoryBuilder<T>
  }

  export interface FactoryManager {
    /**
     * Define a class with a given set of attributes.
     *
     * @param {string|Function} className
     * @param {Function} definition
     * @param {string} name
     */
    define(className: string | { new (): any }, definition: NajsEloquent.Factory.FactoryDefinition, name?: string): this

    /**
     * Define a class with a given short-name.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Function} definition
     */
    defineAs(
      className: string | { new (): any },
      name: string,
      definition: NajsEloquent.Factory.FactoryDefinition
    ): this

    /**
     * Define a state with a given set of attributes.
     *
     * @param {string|Function} className
     * @param {string} state
     * @param {Function} definition
     */
    state(className: string | { new (): any }, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this

    /**
     * Create a builder for the given model.
     *
     * @param {string|Function} className
     * @param {string} name
     */
    of<T>(className: string | { new (): T }, name?: string): FactoryBuilder<T>

    /**
     * Create an instance of the given model and persist it to the database.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    create<T>(className: string | { new (): T }, attributes?: Object): T

    /**
     * Create an instance of the given model and type and persist it to the database.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    createAs<T>(className: string | { new (): T }, name: string, attributes?: Object): T

    /**
     * Create an instance of the given model.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    make<T>(className: string | { new (): T }, attributes?: Object): T

    /**
     * Create an instance of the given model and type.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    makeAs<T>(className: string | { new (): T }, name: string, attributes?: Object): T

    /**
     * Get the raw attribute array for a given model.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    raw<T>(className: string | { new (): T }, attributes?: Object): T

    /**
     * Get the raw attribute array for a given named model.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    rawOf<T>(className: string | { new (): T }, name: string, attributes?: Object): T
  }
}
