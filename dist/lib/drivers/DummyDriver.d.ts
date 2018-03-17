import { Eloquent } from '../model/Eloquent';
import { IEloquentDriver } from './interfaces/IEloquentDriver';
import { IBasicQuery } from '../query-builders/interfaces/IBasicQuery';
import { IConditionQuery } from '../query-builders/interfaces/IConditionQuery';
export declare class DummyDriver<T extends Object = {}> implements IEloquentDriver<T> {
    model: Eloquent<T>;
    initialize(model: Eloquent<T>, data: T): void;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    getId(): any;
    setId(id: any): void;
    newQuery(): IBasicQuery & IConditionQuery;
    toObject(): Object;
    toJSON(): Object;
    is(model: Eloquent): boolean;
}
