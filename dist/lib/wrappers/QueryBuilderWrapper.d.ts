/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../relations/interfaces/IRelationDataBucket.d.ts" />
/// <reference path="interfaces/IQueryBuilderWrapper.d.ts" />
import '../relations/RelationDataBucket';
export interface QueryBuilderWrapper<T> extends NajsEloquent.Wrapper.IQueryBuilderWrapper<T> {
}
export declare class QueryBuilderWrapper<T> {
    static className: string;
    protected modelName: string;
    protected recordName: string;
    protected relationDataBucket?: NajsEloquent.Relation.IRelationDataBucket;
    constructor(model: string, recordName: string, queryBuilder: NajsEloquent.QueryBuilder.IQueryBuilder & NajsEloquent.QueryBuilder.IFetchResultQuery<T>, relationDataBucket?: NajsEloquent.Relation.IRelationDataBucket);
    getClassName(): string;
    createCollection(result: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>;
    createInstance(result: Object): NajsEloquent.Model.IModel<T> & T;
    createRelationDataBucketIfNeeded(): NajsEloquent.Relation.IRelationDataBucket;
    first(id?: any): Promise<(NajsEloquent.Model.IModel<T> & T) | null>;
    find(id?: any): Promise<(NajsEloquent.Model.IModel<T> & T) | null>;
    get(...fields: Array<string | string[]>): Promise<CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>>;
    all(...fields: Array<string | string[]>): Promise<CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>>;
    pluck(valueKey: string, indexKey?: string): Promise<Object>;
    findById(id: any): Promise<NajsEloquent.Model.IModel<T> & T | null>;
    findOrFail(id: any): Promise<NajsEloquent.Model.IModel<T> & T>;
    firstOrFail(id: any): Promise<NajsEloquent.Model.IModel<T> & T>;
    static readonly ForwardFunctions: string[];
}
