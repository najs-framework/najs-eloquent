/// <reference path="../definitions/features/IRecordExecutor.d.ts" />
/// <reference path="../definitions/query-builders/IConvention.d.ts" />
import IConvention = NajsEloquent.QueryBuilder.IConvention;
import Model = NajsEloquent.Model.IModel;
import { Record } from './Record';
import { ExecutorBase } from './ExecutorBase';
export declare abstract class RecordExecutorBase extends ExecutorBase implements NajsEloquent.Feature.IRecordExecutor {
    protected model: NajsEloquent.Model.IModel;
    protected record: Record;
    protected convention: IConvention;
    constructor(model: Model, record: Record, convention: IConvention);
    abstract createRecord<T>(action: string): Promise<T>;
    abstract updateRecord<T>(action: string): Promise<T>;
    abstract hardDeleteRecord<T>(): Promise<T>;
    fillData(isCreate: boolean): void;
    fillTimestampsData(isCreate: boolean): void;
    fillSoftDeletesData(): void;
    setAttributeIfNeeded(attribute: string, value: any): void;
    create<R = any>(shouldFillData?: boolean, action?: string): Promise<R>;
    update<R = any>(shouldFillData?: boolean, action?: string): Promise<R>;
    softDelete<R = any>(): Promise<R>;
    hardDelete<R = any>(): Promise<R>;
    restore<R = any>(): Promise<R>;
    hasPrimaryKey(): boolean;
    hasModifiedData(): boolean;
}
