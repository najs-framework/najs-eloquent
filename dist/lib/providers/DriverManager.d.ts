import { Facade } from 'najs-facade';
import { IEloquentDriverProvider } from './interfaces/IEloquentDriverProvider';
import { IAutoload } from 'najs-binding';
import { Eloquent } from '../model/Eloquent';
import { IEloquentDriver } from '../drivers/interfaces/IEloquentDriver';
export declare class DriverManager extends Facade implements IEloquentDriverProvider, IAutoload {
    static className: string;
    protected drivers: {
        [key: string]: {
            driverClassName: string;
            isDefault: boolean;
        };
    };
    protected binding: {
        [key: string]: string;
    };
    getClassName(): string;
    protected findDefaultDriver(): string;
    protected createDriver<T>(model: Eloquent<T>, driverClass: string, isGuarded: boolean): IEloquentDriver<T>;
    create<T extends Object = {}>(model: Eloquent<T>): IEloquentDriver<T>;
    create<T extends Object = {}>(model: Eloquent<T>, isGuarded: boolean): IEloquentDriver<T>;
    findDriverClassName(model: Eloquent<any> | string): string;
    register(driver: any, name: string, isDefault?: boolean): void;
    bind(model: string, driver: string): void;
}
