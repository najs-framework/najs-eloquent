import { Eloquent } from '../../model/Eloquent';
import { IBasicQuery } from '../../query-builders/interfaces/IBasicQuery';
import { IConditionQuery } from '../../query-builders/interfaces/IConditionQuery';
export interface IEloquentDriver<Record extends Object = {}> {
    initialize(model: Eloquent<Record>, data: Record): void;
    getAttribute(name: string): any;
    setAttribute(name: string, value: any): boolean;
    getId(): any;
    setId(id: any): void;
    newQuery(): IBasicQuery & IConditionQuery;
    toObject(): Object;
    toJSON(): Object;
    is(model: Eloquent): boolean;
}
