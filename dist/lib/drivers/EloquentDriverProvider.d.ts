import { Eloquent } from '../model/Eloquent';
import { IEloquentDriver } from './interfaces/IEloquentDriver';
export declare class EloquentDriverProvider {
    protected static drivers: {
        [key: string]: {
            driverClassName: string;
            isDefault: boolean;
        };
    };
    protected static binding: {
        [key: string]: string;
    };
    protected static findDefaultDriver(): string;
    protected static createDriver<T>(model: Eloquent<T>, driverClass: string): IEloquentDriver<T>;
    static create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T>;
    static findDriverClassName(model: string): string;
    static findDriverClassName(model: Eloquent<any>): string;
    static register(driver: string, name: string, isDefault: boolean): void;
    static register(driver: Function, name: string, isDefault: boolean): void;
    static bind(model: string, name: string): void;
}
