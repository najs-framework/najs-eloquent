/// <reference path="../collect.js/index.d.ts" />

namespace Najs.Contracts.Eloquent {
  export interface FactoryBuilderCollection<Model> {
    /**
     * Set the states to be applied to the model.
     *
     * @param {string|string[]} state
     */
    states(...state: Array<string | string[]>): this

    /**
     * Create a collection of models and persist them to the database.
     *
     * @param {Object} attributes
     */
    create<T = Model>(attributes?: Object): Promise<CollectJs.Collection<T>>

    /**
     * Create a collection of models.
     *
     * @param {Object} attributes
     */
    make<T = Model>(attributes?: Object): CollectJs.Collection<T>

    /**
     * Create an array of raw attribute arrays.
     *
     * @param {Object} attributes
     */
    raw<T = Model>(attributes?: Object): T[]
  }

  export interface FactoryBuilder<Model> {
    /**
     * Set the amount of models you wish to create / make.
     *
     * @param {number} amount
     */
    times(amount: number): FactoryBuilderCollection<Model>

    /**
     * Set the states to be applied to the model.
     *
     * @param {string|string[]} state
     */
    states(...state: Array<string | string[]>): this

    /**
     * Create an instance of model and persist them to the database.
     * @param {Object} attributes
     */
    create<T = Model>(attributes?: Object): Promise<T>

    /**
     * Create an instance of model.
     *
     * @param {Object} attributes
     */
    make<T = Model>(attributes?: Object): T

    /**
     * Create a raw attribute array.
     *
     * @param {Object} attributes
     */
    raw<T = Model>(attributes?: Object): T
  }
}
