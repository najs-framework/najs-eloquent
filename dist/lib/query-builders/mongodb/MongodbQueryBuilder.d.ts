/// <reference path="../interfaces/IFetchResultQuery.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
import { Collection } from 'mongodb';
import { MongodbQueryBuilderBase } from './MongodbQueryBuilderBase';
import { MongodbQueryLog } from './MongodbQueryLog';
export declare class MongodbQueryBuilder<T> extends MongodbQueryBuilderBase implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    protected modelName: string;
    protected collection: Collection;
    protected timestamps?: NajsEloquent.Model.ITimestampsSetting;
    protected nativeHandlePromise: any;
    protected primaryKey: string;
    constructor(modelName: string, collection: Collection, softDelete?: NajsEloquent.Model.ISoftDeletesSetting | undefined, timestamps?: NajsEloquent.Model.ITimestampsSetting | undefined, primaryKey?: string);
    getClassName(): string;
    get(): Promise<T[]>;
    first(): Promise<T | null>;
    count(): Promise<number>;
    update(data: Object): Promise<object>;
    delete(): Promise<object>;
    restore(): Promise<object>;
    execute(): Promise<any>;
    native(handler: (collection: Collection, conditions: object, options?: object) => Promise<any>): {
        execute(): Promise<any>;
    };
    protected logQueryAndOptions(logger: MongodbQueryLog, query: object, options: object | undefined, func: string): MongodbQueryLog;
    createQueryOptions(): object | undefined;
}
