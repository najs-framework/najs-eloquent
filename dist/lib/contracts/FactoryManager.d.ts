/// <reference path="FactoryBuilder.d.ts" />
/// <reference path="../../../lib/definitions/collect.js/index.d.ts" />
/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/factory/IFactoryDefinition.d.ts" />
import Model = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IFactoryDefinition = NajsEloquent.Factory.IFactoryDefinition;
declare namespace Najs.Contracts.Eloquent {
    interface FactoryFunction {
        <T extends Model>(className: ModelDefinition<T>): FactoryBuilder<T>;
        <T extends Model>(className: ModelDefinition<T>, name: string): FactoryBuilder<T>;
        <T extends Model>(className: ModelDefinition<T>, amount: number): FactoryBuilder<CollectJs.Collection<T>>;
        <T extends Model>(className: ModelDefinition<T>, name: string, amount: number): FactoryBuilder<CollectJs.Collection<T>>;
    }
    interface FactoryManager {
        /**
         * Define a class with a given set of attributes.
         *
         * @param {string|Function} className
         * @param {Function} definition
         * @param {string} name
         */
        define<T extends Model>(className: ModelDefinition<T>, definition: IFactoryDefinition, name?: string): this;
        /**
         * Define a class with a given short-name.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Function} definition
         */
        defineAs<T extends Model>(className: ModelDefinition<T>, name: string, definition: IFactoryDefinition): this;
        /**
         * Define a state with a given set of attributes.
         *
         * @param {string|Function} className
         * @param {string} state
         * @param {Function} definition
         */
        state<T extends Model>(className: ModelDefinition<T>, state: string, definition: IFactoryDefinition): this;
        /**
         * Create a builder for the given model.
         *
         * @param {string|Function} className
         * @param {string} name
         */
        of<T extends Model>(className: ModelDefinition<T>, name?: string): FactoryBuilder<T>;
        /**
         * Create an instance of the given model and persist it to the database.
         *
         * @param {string|Function} className
         */
        create<T extends Model>(className: ModelDefinition<T>): Promise<T>;
        /**
         * Create an instance of the given model and persist it to the database.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        create<T extends Model>(className: ModelDefinition<T>, attributes: object): Promise<T>;
        /**
         * Create a collection of models and persist them to the database.
         *
         * @param {string|Function} className
         * @param {number} amount
         */
        create<T extends Model>(className: ModelDefinition<T>, amount: number): Promise<CollectJs.Collection<T>>;
        /**
         * Create a collection of models and persist them to the database.
         *
         * @param {string|Function} className
         * @param {number} amount
         * @param {Object} attributes
         */
        create<T extends Model>(className: ModelDefinition<T>, amount: number, attributes: object): Promise<CollectJs.Collection<T>>;
        /**
         * Create an instance of the given model and type and persist it to the database.
         *
         * @param {string|Function} className
         * @param {string} name
         */
        createAs<T extends Model>(className: ModelDefinition<T>, name: string): Promise<T>;
        /**
         * Create an instance of the given model and type and persist it to the database.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        createAs<T extends Model>(className: ModelDefinition<T>, name: string, attributes: object): Promise<T>;
        /**
         * Create a collection of models and type and persist it to the database.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         */
        createAs<T extends Model>(className: ModelDefinition<T>, name: string, amount: number): Promise<CollectJs.Collection<T>>;
        /**
         * Create a collection of models and type and persist it to the database.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         * @param {Object} attributes
         */
        createAs<T extends Model>(className: ModelDefinition<T>, name: string, amount: number, attributes: object): Promise<CollectJs.Collection<T>>;
        /**
         * Create an instance of the given model.
         *
         * @param {string|Function} className
         */
        make<T extends Model>(className: ModelDefinition<T>): T;
        /**
         * Create an instance of the given model.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        make<T extends Model>(className: ModelDefinition<T>, attributes: object): T;
        /**
         * Create a collection of models.
         *
         * @param {string|Function} className
         * @param {number} amount
         */
        make<T extends Model>(className: ModelDefinition<T>, amount: number): CollectJs.Collection<T>;
        /**
         * Create a collection of models.
         *
         * @param {string|Function} className
         * @param {number} amount
         * @param {Object} attributes
         */
        make<T extends Model>(className: ModelDefinition<T>, amount: number, attributes: object): CollectJs.Collection<T>;
        /**
         * Create an instance of the given model and type.
         *
         * @param {string|Function} className
         * @param {string} name
         */
        makeAs<T extends Model>(className: ModelDefinition<T>, name: string): T;
        /**
         * Create an instance of the given model and type.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        makeAs<T extends Model>(className: ModelDefinition<T>, name: string, attributes: object): T;
        /**
         * Create a collection of models. and type.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         */
        makeAs<T extends Model>(className: ModelDefinition<T>, name: string, amount: number): CollectJs.Collection<T>;
        /**
         * Create a collection of models. and type.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         * @param {Object} attributes
         */
        makeAs<T extends Model>(className: ModelDefinition<T>, name: string, amount: number, attributes: object): CollectJs.Collection<T>;
        /**
         * Create the raw attribute array for a given model.
         *
         * @param {string|Function} className
         */
        raw<T extends Model>(className: ModelDefinition<T>): T;
        /**
         * Create the raw attribute array for a given model.
         *
         * @param {string|Function} className
         * @param {Object} attributes
         */
        raw<T extends Model>(className: ModelDefinition<T>, attributes: object): T;
        /**
         * Create an array of raw attribute arrays.
         *
         * @param {string|Function} className
         * @param {number} amount
         */
        raw<T extends Model>(className: ModelDefinition<T>, amount: number): T[];
        /**
         * Create an array of raw attribute arrays.
         *
         * @param {string|Function} className
         * @param {number} amount
         * @param {Object} attributes
         */
        raw<T extends Model>(className: ModelDefinition<T>, amount: number, attributes: object): T[];
        /**
         * Create the raw attribute array for a given named model.
         *
         * @param {string|Function} className
         * @param {string} name
         */
        rawOf<T extends Model>(className: ModelDefinition<T>, name: string): T;
        /**
         * Create the raw attribute array for a given named model.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {Object} attributes
         */
        rawOf<T extends Model>(className: ModelDefinition<T>, name: string, attributes: object): T;
        /**
         * Create an array of raw attribute arrays for a given named model.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         * @param {Object} attributes
         */
        rawOf<T extends Model>(className: ModelDefinition<T>, name: string, amount: number): T[];
        /**
         * Create an array of raw attribute arrays for a given named model.
         *
         * @param {string|Function} className
         * @param {string} name
         * @param {number} amount
         * @param {Object} attributes
         */
        rawOf<T extends Model>(className: ModelDefinition<T>, name: string, amount: number, attributes: object): T[];
    }
}
