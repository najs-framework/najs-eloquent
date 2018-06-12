/// <reference path="../interfaces/IFetchResultQuery.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
import { Collection } from 'mongodb';
import { MongodbQueryBuilderBase } from './MongodbQueryBuilderBase';
export declare class MongodbQueryBuilder<T> extends MongodbQueryBuilderBase implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    protected modelName: string;
    protected collection: Collection;
    protected primaryKey: string;
    constructor(modelName: string, collection: Collection, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined, primaryKey?: string);
    getClassName(): string;
    get(): Promise<T[]>;
    first(): Promise<T | null>;
    count(): Promise<number>;
    update(data: Object): Promise<Object>;
    delete(): Promise<Object>;
    restore(): Promise<Object>;
    execute(): Promise<any>;
}
