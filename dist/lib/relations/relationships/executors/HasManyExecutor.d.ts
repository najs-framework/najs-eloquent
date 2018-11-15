/// <reference path="../../../definitions/data/IDataCollector.d.ts" />
/// <reference path="../../../definitions/model/IModel.d.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.d.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.d.ts" />
/// <reference path="../../../../../lib/definitions/collect.js/index.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import Collection = CollectJs.Collection;
import { HasOneOrManyExecutor } from './HasOneOrManyExecutor';
export declare class HasManyExecutor<T> extends HasOneOrManyExecutor<Collection<T>> {
    protected dataBucket: IRelationDataBucket;
    protected targetModel: IModel;
    executeQuery(): Promise<Collection<T> | undefined | null>;
    executeCollector(): Collection<T> | undefined | null;
    getEmptyValue(): Collection<T> | undefined;
}
