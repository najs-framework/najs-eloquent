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
    constructor(model: string, recordName: string, queryBuilder: NajsEloquent.QueryBuilder.IQueryBuilder & NajsEloquent.QueryBuilder.IFetchResultQuery<T>);
    getClassName(): string;
    protected createCollection(result: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>;
    protected createInstance(result: Object): NajsEloquent.Model.IModel<T> & T;
    protected createEagerBucket(): NajsEloquent.Relation.IRelationDataBucket;
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
