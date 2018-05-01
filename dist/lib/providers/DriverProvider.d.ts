/// <reference path="../contracts/DriverProvider.d.ts" />
import { Facade } from 'najs-facade';
export declare class DriverProvider extends Facade implements Najs.Contracts.Eloquent.DriverProvider {
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
    protected createDriver<T>(model: Object, driverClass: string, isGuarded: boolean): Najs.Contracts.Eloquent.Driver<T>;
    create<T extends Object = {}>(model: Object, isGuarded?: boolean): Najs.Contracts.Eloquent.Driver<T>;
    findDriverClassName(model: Object | string): string;
    register(driver: string | Function, name: string, isDefault?: boolean): this;
    bind(model: string, driver: string): this;
}
