/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../factory/interfaces/FactoryDefinition.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface FactoryManager {
        /**
         * Define a class with a given set of attributes.
         *
         * @param {string|Function} className
         * @param {Function} definition
         * @param {string} name
         */
        define(className: string | NajsEloquent.Model.ModelDefinition<any>, definition: NajsEloquent.Factory.FactoryDefinition, name?: string): this;
        /**
         * Define a class with a given short-name.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Function} definition
         */
        defineAs(className: string | NajsEloquent.Model.ModelDefinition<any>, name: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
        /**
         * Define a state with a given set of attributes.
         *
         * @param {string|Function} className
         * @param {string} state
         * @param {Function} definition
         */
        state(className: string | NajsEloquent.Model.ModelDefinition<any>, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
        /**
         * Create a builder for the given model.
         *
         * @param {string|Function} className
         * @param {string} name
         */
        of<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name?: string): FactoryBuilder<T>;
        /**
         * Create an instance of the given model and persist it to the database.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        create<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes?: Object): T;
        /**
         * Create an instance of the given model and type and persist it to the database.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        createAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes?: Object): T;
        /**
         * Create an instance of the given model.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        make<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes?: Object): T;
        /**
         * Create an instance of the given model and type.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        makeAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes?: Object): T;
        /**
         * Get the raw attribute array for a given model.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        raw<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes?: Object): T;
        /**
         * Get the raw attribute array for a given named model.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        rawOf<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes?: Object): T;
    }
}
