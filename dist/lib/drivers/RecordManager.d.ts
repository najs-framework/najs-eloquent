/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/IRecordExecutor.d.ts" />
import { RecordManagerBase } from './RecordManagerBase';
import { Record } from './Record';
export declare class RecordManager<T extends Record> extends RecordManagerBase<T> {
    getClassName(): string;
    initialize(model: NajsEloquent.Model.ModelInternal<Record>, isGuarded: boolean, data?: T | object): void;
    getAttribute(model: NajsEloquent.Model.ModelInternal<Record>, key: string): any;
    setAttribute<T>(model: NajsEloquent.Model.ModelInternal<Record>, key: string, value: T): boolean;
    hasAttribute(model: NajsEloquent.Model.IModel, key: string): boolean;
    getPrimaryKeyName(model: NajsEloquent.Model.IModel): string;
    toObject(model: NajsEloquent.Model.ModelInternal<Record>): object;
    markModified(model: NajsEloquent.Model.ModelInternal<Record>, keys: ArrayLike<Array<string | string[]>>): void;
    isModified(model: NajsEloquent.Model.ModelInternal<Record>, keys: ArrayLike<Array<string | string[]>>): boolean;
    getModified(model: NajsEloquent.Model.ModelInternal<Record>): string[];
    isNew(model: NajsEloquent.Model.ModelInternal<Record>): boolean;
}
