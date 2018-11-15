/// <reference path="../definitions/collect.js/index.d.ts" />

namespace Najs.Contracts.Eloquent {
  export interface FactoryBuilder<Model> {
    /**
     * Set the amount of models you wish to create / make.
     *
     * @param {number} amount
     */
    times(amount: number): Pick<FactoryBuilder<CollectJs.Collection<Model>>, 'create' | 'states' | 'make' | 'raw'>

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
