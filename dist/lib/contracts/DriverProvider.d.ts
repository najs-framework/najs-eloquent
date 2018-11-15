/// <reference path="Driver.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface DriverProvider extends Najs.Contracts.Autoload {
        /**
         * Determine that driver is register or not.
         *
         * @param driverClass Driver class
         */
        has(driverClass: any): boolean;
        /**
         * Create a driver instance
         *
         * @param {Model} model
         */
        create<T>(model: Object): Driver<T>;
        /**
         * Create a driver instance without guarding
         *
         * @param {Model} model
         */
        create<T>(model: Object, isGuarded: boolean): Driver<T>;
        /**
         * Find driver for given model's name
         *
         * @param {string} model
         */
        findDriverClassName(model: string): string;
        /**
         * Find driver for given model
         *
         * @param {Model} model
         */
        findDriverClassName(model: Object): string;
        /**
         * Register a driver with specific name
         *
         * @param {string} driver Driver class name
         * @param {string} name
         */
        register(driver: string, name: string): this;
        /**
         * Register a driver with specific name
         *
         * @param {string} driver Driver class name
         * @param {string} name
         * @param {boolean} isDefault
         */
        register(driver: string, name: string, isDefault: boolean): this;
        /**
         * Register a driver with specific name
         *
         * @param {Function} driver Driver's constructor
         * @param {string} name
         */
        register(driver: Function, name: string): this;
        /**
         * Register a driver with specific name
         *
         * @param {Function} driver Driver's constructor
         * @param {string} name
         * @param {boolean} isDefault
         */
        register(driver: Function, name: string, isDefault: boolean): this;
        /**
         * Bind a model to specific driver
         *
         * @param {string} model Model's name
         * @param {string} name Driver's name
         */
        bind(model: string, name: string): this;
    }
}
