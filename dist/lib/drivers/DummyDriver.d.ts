import { Eloquent } from '../model/Eloquent';
import { IEloquentDriver } from './interfaces/IEloquentDriver';
export declare class DummyDriver<T extends Object = {}> implements IEloquentDriver<T> {
    static className: string;
    attributes: Object;
    initialize(data?: T): void;
    getRecord(): T;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    getId(): any;
    setId(id: any): void;
    newQuery(): any;
    toObject(): Object;
    toJSON(): Object;
    is(model: Eloquent<T>): boolean;
    getReservedNames(): string[];
    getDriverProxyMethods(): string[];
    getQueryProxyMethods(): string[];
    formatAttributeName(name: string): string;
}
