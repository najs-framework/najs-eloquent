import { Eloquent } from '../model/Eloquent';
import { IEloquentDriver } from './interfaces/IEloquentDriver';
export declare class EloquentDriverProvider {
    create<T>(model: Eloquent<any>): IEloquentDriver<T>;
    register(driver: IEloquentDriver, name: string): void;
    bind(model: string, name: IEloquentDriver): void;
}
