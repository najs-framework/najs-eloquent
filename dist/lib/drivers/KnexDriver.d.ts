/// <reference path="../contracts/Driver.d.ts" />
import { RecordBaseDriver } from './based/RecordDriverBase';
export declare class KnexDriver extends RecordBaseDriver {
    protected tableName: string;
    protected primaryKeyName?: string;
    protected isNewRecord: boolean;
    constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting);
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    getClassName(): string;
    shouldBeProxied(key: string): boolean;
    getRecordName(): string;
}
