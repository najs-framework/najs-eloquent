/// <reference types="najs-binding" />
/// <reference path="../../contracts/Driver.ts" />

namespace NajsEloquent.Feature {
  export interface IFeature extends Najs.Contracts.Autoload {
    /**
     * Attach the public api to prototype of model, it also applies the shared properties to all model instances.
     *
     * @param {object} prototype
     * @param {object[]} bases
     * @param {Driver} driver
     */
    attachPublicApi(prototype: object, bases: object[], driver: Najs.Contracts.Eloquent.Driver<any>): void

    /**
     * Get the feature name.
     */
    getFeatureName(): string
  }
}
