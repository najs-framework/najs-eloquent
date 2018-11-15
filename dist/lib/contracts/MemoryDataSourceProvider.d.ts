/// <reference path="../definitions/model/IModel.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface MemoryDataSourceProvider<T extends object> extends Najs.Contracts.Autoload {
        /**
         * Determine that DataSource is register or not.
         *
         * @param dataSource DataSource class
         */
        has(dataSource: any): boolean;
        /**
         * Create a MemoryDataSource by model.
         * @param model
         */
        create(model: NajsEloquent.Model.IModel): MemoryDataSource<T>;
        /**
         * Find MemoryDataSource for given model's name
         *
         * @param {string} model
         */
        findMemoryDataSourceClassName(model: string): string;
        /**
         * Find MemoryDataSource for given model's name
         *
         * @param {Model} model
         */
        findMemoryDataSourceClassName(model: NajsEloquent.Model.IModel): string;
        /**
         * Register a MemoryDataSource with specific name
         *
         * @param {string} dataSourceClassName MemoryDataSource class name
         * @param {string} name
         */
        register(dataSourceClassName: string, name: string): this;
        /**
         * Register a MemoryDataSource with specific name
         *
         * @param {string} dataSourceClassName MemoryDataSource class name
         * @param {string} name
         * @param {boolean} isDefault
         */
        register(dataSourceClassName: string, name: string, isDefault: boolean): this;
        /**
         * Register a MemoryDataSource with specific name
         *
         * @param {Function} dataSource MemoryDataSource's constructor
         * @param {string} name
         */
        register(dataSource: Function, name: string): this;
        /**
         * Register a MemoryDataSource with specific name
         *
         * @param {Function} dataSource MemoryDataSource's constructor
         * @param {string} name
         * @param {boolean} isDefault
         */
        register(dataSource: Function, name: string, isDefault: boolean): this;
        /**
         * Bind a model to specific MemoryDataSource
         *
         * @param {string} model
         * @param {string} name
         */
        bind(model: string, name: string): this;
        /**
         * Bind a model to specific MemoryDataSource
         *
         * @param {string} model
         * @param {string} name
         */
        bind(model: NajsEloquent.Model.ModelDefinition, name: string): this;
    }
}
