/// <reference path="../../definitions/driver/IExecutorFactory.d.ts" />
/// <reference path="../../definitions/features/IRecordExecutor.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import { Record } from '../Record';
import { MemoryRecordExecutor } from './MemoryRecordExecutor';
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler';
import { MemoryQueryLog } from './MemoryQueryLog';
export declare class MemoryExecutorFactory implements NajsEloquent.Driver.IExecutorFactory {
    static className: string;
    makeRecordExecutor<T extends Record>(model: IModel, record: T): MemoryRecordExecutor;
    makeQueryExecutor(handler: MemoryQueryBuilderHandler): any;
    getClassName(): string;
    getDataSource(model: IModel): Najs.Contracts.Eloquent.MemoryDataSource<Record>;
    makeLogger(): MemoryQueryLog;
}
