import { Record } from '../../model/Record';
import { DriverBase } from './DriverBase';
export declare class RecordBaseDriver extends DriverBase<Record> {
    protected attributes: Record;
    protected queryLogGroup: string;
    protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting;
    protected timestampsSetting?: NajsEloquent.Model.ITimestampsSetting;
    constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting);
    initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void;
    shouldBeProxied(key: string): boolean;
    hasAttribute(name: string): boolean;
    getAttribute<T>(name: string): T;
    setAttribute<T>(name: string, value: T): boolean;
    toObject(): Object;
    markModified(name: string): void;
    isModified(name: string): boolean;
    getModified(): string[];
}
