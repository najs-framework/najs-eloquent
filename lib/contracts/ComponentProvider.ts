/// <reference path="Component.ts" />

namespace Najs.Contracts.Eloquent {
  export interface ComponentProvider extends Najs.Contracts.Autoload {
    /**
     * Extend and apply components to Model
     *
     * @param {Model} model model instance
     * @param driver driver instance
     */
    extend(model: Object, driver: Driver<any>): void

    /**
     * Get default components list for all models.
     */
    getComponents(): string[]
    /**
     * Get components list for the given model.
     *
     * @param {string} model
     */
    getComponents(model: string): string[]

    /**
     * Resolve an instance of Component
     *
     * @param {string} component component name
     */
    resolve(component: string): Component

    /**
     * Register a component with specific name
     *
     * @param {string} component Component class name
     * @param {string} name name
     * @param {boolean} isDefault If true will be apply for all models, default is false
     */
    register(component: string, name: string, isDefault?: boolean): this
    /**
     * Register a component with specific name
     *
     * @param {Function} component Component constructor
     * @param {string} name name
     * @param {boolean} isDefault If true will be apply for all models, default is false
     */
    register(component: Function, name: string, isDefault?: boolean): this

    /**
     * Bind a component for given model.
     * The given model will have all defaults components including the given component
     *
     * @param {string} model model name
     * @param {string} component component name
     */
    bind(model: string, component: string): this
  }
}
