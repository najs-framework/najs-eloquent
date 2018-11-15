/// <reference path="../../contracts/MemoryDataSource.d.ts" />
/// <reference path="../../definitions/model/IModel.d.ts" />
import Model = NajsEloquent.Model.IModel;
import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource;
import { RecordExecutorBase } from '../RecordExecutorBase';
import { MemoryQueryLog } from './MemoryQueryLog';
import { Record } from '../Record';
export declare class MemoryRecordExecutor extends RecordExecutorBase {
    protected dataSource: MemoryDataSource<Record>;
    protected logger: MemoryQueryLog;
    constructor(model: Model, record: Record, dataSource: MemoryDataSource<Record>, logger: MemoryQueryLog);
    saveRecord<R = any>(action: string): Promise<R>;
    createRecord<R = any>(action: string): Promise<R>;
    updateRecord<R = any>(action: string): Promise<R>;
    hardDeleteRecord<R = any>(): Promise<R>;
    logRaw(func: string, data: any): MemoryQueryLog;
}
