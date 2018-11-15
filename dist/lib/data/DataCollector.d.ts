/// <reference path="../definitions/data/IDataReader.d.ts" />
/// <reference path="../definitions/data/IDataBuffer.d.ts" />
/// <reference path="../definitions/data/IDataCollector.d.ts" />
/// <reference path="../definitions/query-builders/IConditionMatcher.d.ts" />
import IDataReader = NajsEloquent.Data.IDataReader;
import IDataBuffer = NajsEloquent.Data.IDataBuffer;
import IDataCollector = NajsEloquent.Data.IDataCollector;
import IConditions = NajsEloquent.Data.IConditions;
import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher;
export declare class DataCollector<T> implements IDataCollector<T> {
    protected dataBuffer: IDataBuffer<T>;
    protected reader: IDataReader<T>;
    protected limited?: number;
    protected sortedBy?: Array<[string, string]>;
    protected selected?: string[];
    protected conditions?: IConditions;
    constructor(dataBuffer: IDataBuffer<T>, reader: IDataReader<T>);
    limit(value: number): this;
    select(selectedFields: string[]): this;
    orderBy(directions: Array<[string, string]>): this;
    filterBy(conditions: IConditions): this;
    isMatch(item: T, conditions: IConditions): boolean;
    isMatchAtLeastOneCondition(item: T, conditions: Array<IConditions | IConditionMatcher<T>>): boolean;
    isMatchAllConditions(item: T, conditions: Array<IConditions | IConditionMatcher<T>>): boolean;
    hasFilterByConfig(): boolean;
    hasOrderByConfig(): boolean;
    hasSelectedFieldsConfig(): boolean;
    exec(): T[];
    sortLimitAndSelectItems(items: T[]): T[];
    compare(a: T, b: T, index: number): number;
}
