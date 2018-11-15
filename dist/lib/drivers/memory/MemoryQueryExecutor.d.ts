/// <reference path="../../contracts/MemoryDataSource.d.ts" />
/// <reference path="../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.d.ts" />
import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource;
import { Record } from '../Record';
import { ExecutorBase } from '../ExecutorBase';
import { MemoryQueryLog, IUpdateRecordInfo } from './MemoryQueryLog';
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler';
import { BasicQuery } from '../../query-builders/shared/BasicQuery';
export declare class MemoryQueryExecutor extends ExecutorBase implements NajsEloquent.QueryBuilder.IQueryExecutor {
    protected queryHandler: MemoryQueryBuilderHandler;
    protected dataSource: MemoryDataSource<Record>;
    protected basicQuery: BasicQuery;
    protected logger: MemoryQueryLog;
    constructor(queryHandler: MemoryQueryBuilderHandler, dataSource: MemoryDataSource<Record>, logger: MemoryQueryLog);
    get(): Promise<object[]>;
    first(): Promise<object | undefined>;
    count(): Promise<number>;
    update(data: object): Promise<any>;
    delete(): Promise<any>;
    restore(): Promise<any>;
    execute(): Promise<any>;
    updateRecordsByData(records: Record[], data: object): Promise<any>;
    getUpdateRecordInfo(record: Record, data: object): IUpdateRecordInfo;
    collectResult(collector: NajsEloquent.Data.IDataCollector<Record>): Promise<Record[]>;
    makeCollector(): NajsEloquent.Data.IDataCollector<Record>;
    getFilterConditions(): object;
}
