/// <reference path="../definitions/data/IDataReader.d.ts" />
/// <reference path="../definitions/query-builders/IConditionMatcher.d.ts" />
export declare class DataConditionMatcher<T extends object> implements NajsEloquent.QueryBuilder.IConditionMatcher<T> {
    protected field: string;
    protected operator: string;
    protected originalValue: any;
    protected value: any;
    protected reader: NajsEloquent.Data.IDataReader<T>;
    constructor(field: string, operator: string, value: any, reader: NajsEloquent.Data.IDataReader<T>);
    isEqual(record: T): boolean;
    isLessThan(record: T): boolean;
    isLessThanOrEqual(record: T): boolean;
    isGreaterThan(record: T): boolean;
    isGreaterThanOrEqual(record: T): boolean;
    isInArray(record: T): boolean;
    isMatch(record: T): boolean;
}
