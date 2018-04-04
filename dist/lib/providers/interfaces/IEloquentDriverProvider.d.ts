import { Eloquent } from '../../model/Eloquent';
import { IEloquentDriver } from '../../drivers/interfaces/IEloquentDriver';
export interface IEloquentDriverProvider {
    /**
     * Create a driver instance
     *
     * @param {Model} model
     */
    create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T>;
    /**
     * Create a driver instance without guarding
     *
     * @param {Model} model
     */
    create<T extends Object = {}>(model: Eloquent<T>, isGuarded: boolean): IEloquentDriver<T>;
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
    findDriverClassName(model: Eloquent<any>): string;
    /**
     * Register a driver with specific name
     *
     * @param {string} driver Driver class name
     * @param {string} name
     */
    register(driver: string, name: string): void;
    /**
     * Register a driver with specific name
     *
     * @param {string} driver Driver class name
     * @param {string} name
     * @param {boolean} isDefault
     */
    register(driver: string, name: string, isDefault: boolean): void;
    /**
     * Register a driver with specific name
     *
     * @param {string} driver Driver's constructor
     * @param {string} name
     */
    register(driver: Function, name: string): void;
    /**
     * Register a driver with specific name
     *
     * @param {string} driver Driver's constructor
     * @param {string} name
     * @param {boolean} isDefault
     */
    register(driver: Function, name: string, isDefault: boolean): void;
    /**
     * Bind a model to specific driver
     *
     * @param {string} model Model's name
     * @param {string} name Driver's name
     */
    bind(model: string, name: string): void;
}
