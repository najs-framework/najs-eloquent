import { Record } from '../model/Record';
export declare class RecordBaseDriver {
    static GlobalEventEmitter: Najs.Contracts.Event.AsyncEventEmitter;
    protected attributes: Record;
    protected modelName: string;
    protected queryLogGroup: string;
    protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting;
    protected timestampsSetting?: NajsEloquent.Model.ITimestampsSetting;
    protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter;
    constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting);
    getRecord(): Record;
    setRecord(value: Record): void;
    useEloquentProxy(): boolean;
    shouldBeProxied(key: string): boolean;
    proxify(type: 'get' | 'set', target: any, key: string, value?: any): any;
    hasAttribute(name: string): boolean;
    getAttribute<T>(name: string): T;
    setAttribute<T>(name: string, value: T): boolean;
    toObject(): Object;
    markModified(name: string): void;
    isModified(name: string): boolean;
    getModified(): string[];
    formatAttributeName(name: string): string;
    formatRecordName(): string;
    isSoftDeleted(): boolean;
    getEventEmitter(global: boolean): Najs.Contracts.Event.AsyncEventEmitter;
}
