/// <reference path="../collect.js/index.d.ts" />
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
     */
    create<T>(className: string | { new (): T }): Promise<T>
    /**
     * Create an instance of the given model and persist it to the database.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    create<T>(className: string | { new (): T }, attributes: object): Promise<T>
    /**
     * Create a collection of models and persist them to the database.
     *
     * @param {string|Function} className
     * @param {number} amount
     */
    create<T>(className: string | { new (): T }, amount: number): Promise<CollectJs.Collection<T>>
    /**
     * Create a collection of models and persist them to the database.
     *
     * @param {string|Function} className
     * @param {number} amount
     * @param {Object} attributes
     */
    create<T>(className: string | { new (): T }, amount: number, attributes: object): Promise<CollectJs.Collection<T>>

    /**
     * Create an instance of the given model and type and persist it to the database.
     *
     * @param {string|Function} className
     * @param {string} name
     */
    createAs<T>(className: string | { new (): T }, name: string): Promise<T>
    /**
     * Create an instance of the given model and type and persist it to the database.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    createAs<T>(className: string | { new (): T }, name: string, attributes: object): Promise<T>
    /**
     * Create a collection of models and type and persist it to the database.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     */
    createAs<T>(className: string | { new (): T }, name: string, amount: number): Promise<CollectJs.Collection<T>>
    /**
     * Create a collection of models and type and persist it to the database.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     * @param {Object} attributes
     */
    createAs<T>(
      className: string | { new (): T },
      name: string,
      amount: number,
      attributes: object
    ): Promise<CollectJs.Collection<T>>

    /**
     * Create an instance of the given model.
     *
     * @param {string|Function} className
     */
    make<T>(className: string | { new (): T }): T
    /**
     * Create an instance of the given model.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    make<T>(className: string | { new (): T }, attributes: object): T
    /**
     * Create a collection of models.
     *
     * @param {string|Function} className
     * @param {number} amount
     */
    make<T>(className: string | { new (): T }, amount: number): CollectJs.Collection<T>
    /**
     * Create a collection of models.
     *
     * @param {string|Function} className
     * @param {number} amount
     * @param {Object} attributes
     */
    make<T>(className: string | { new (): T }, amount: number, attributes: object): CollectJs.Collection<T>

    /**
     * Create an instance of the given model and type.
     *
     * @param {string|Function} className
     * @param {string} name
     */
    makeAs<T>(className: string | { new (): T }, name: string): T
    /**
     * Create an instance of the given model and type.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    makeAs<T>(className: string | { new (): T }, name: string, attributes: object): T
    /**
     * Create a collection of models. and type.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     */
    makeAs<T>(className: string | { new (): T }, name: string, amount: number): CollectJs.Collection<T>
    /**
     * Create a collection of models. and type.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     * @param {Object} attributes
     */
    makeAs<T>(
      className: string | { new (): T },
      name: string,
      amount: number,
      attributes: object
    ): CollectJs.Collection<T>

    /**
     * Create the raw attribute array for a given model.
     *
     * @param {string|Function} className
     */
    raw<T>(className: string | { new (): T }): T
    /**
     * Create the raw attribute array for a given model.
     *
     * @param {string|Function} className
     * @param {Object} attributes
     */
    raw<T>(className: string | { new (): T }, attributes: object): T
    /**
     * Create an array of raw attribute arrays.
     *
     * @param {string|Function} className
     * @param {number} amount
     */
    raw<T>(className: string | { new (): T }, amount: number): T[]
    /**
     * Create an array of raw attribute arrays.
     *
     * @param {string|Function} className
     * @param {number} amount
     * @param {Object} attributes
     */
    raw<T>(className: string | { new (): T }, amount: number, attributes: object): T[]

    /**
     * Create the raw attribute array for a given named model.
     *
     * @param {string|Function} className
     * @param {string} name
     */
    rawOf<T>(className: string | { new (): T }, name: string): T
    /**
     * Create the raw attribute array for a given named model.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {Object} attributes
     */
    rawOf<T>(className: string | { new (): T }, name: string, attributes: object): T
    /**
     * Create an array of raw attribute arrays for a given named model.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     * @param {Object} attributes
     */
    rawOf<T>(className: string | { new (): T }, name: string, amount: number): T[]
    /**
     * Create an array of raw attribute arrays for a given named model.
     *
     * @param {string|Function} className
     * @param {string} name
     * @param {number} amount
     * @param {Object} attributes
     */
    rawOf<T>(className: string | { new (): T }, name: string, amount: number, attributes: object): T[]
  }
}
