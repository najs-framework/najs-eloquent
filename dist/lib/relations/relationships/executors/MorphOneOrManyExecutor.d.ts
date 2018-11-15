/// <reference path="../../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="../../../definitions/query-builders/IConditionMatcher.d.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.d.ts" />
import IDataCollector = NajsEloquent.Data.IDataCollector;
import IDataReader = NajsEloquent.Data.IDataReader;
import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher;
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import { IHasOneOrManyExecutor } from './HasOneOrManyExecutor';
export declare class MorphOneOrManyExecutor<T> implements IHasOneOrManyExecutor<T> {
    protected morphTypeValue: string;
    protected targetMorphTypeName: string;
    protected executor: IHasOneOrManyExecutor<T>;
    constructor(executor: IHasOneOrManyExecutor<T>, targetMorphTypeName: string, typeValue: string);
    setCollector(collector: IDataCollector<any>, conditions: IConditionMatcher<any>[], reader: IDataReader<any>): this;
    setQuery(query: IQueryBuilder<any>): this;
    executeCollector(): T | undefined | null;
    getEmptyValue(): T | undefined;
    executeQuery(): Promise<T | undefined | null>;
}
