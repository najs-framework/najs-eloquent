import { Eloquent } from '../../model/Eloquent';
import { IBasicQuery } from '../../query-builders/interfaces/IBasicQuery';
import { IConditionQuery } from '../../query-builders/interfaces/IConditionQuery';
import { IFetchResultQuery } from '../../query-builders/interfaces/IFetchResultQuery';
export interface IEloquentDriverConstructor<Record extends Object = {}> {
    constructor(model: Eloquent<Record>, isGuarded: boolean): any;
}
export interface IEloquentDriver<Record extends Object = {}> {
    initialize(data?: Record | Object): void;
    getRecord(): Record;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    getId(): any;
    setId(id: any): void;
    newQuery(): IBasicQuery & IConditionQuery & IFetchResultQuery;
    toObject(): Object;
    toJSON(): Object;
    is(model: Eloquent): boolean;
    getReservedNames(): string[];
    getDriverProxyMethods(): string[];
    getQueryProxyMethods(): string[];
    formatAttributeName(name: string): string;
}
