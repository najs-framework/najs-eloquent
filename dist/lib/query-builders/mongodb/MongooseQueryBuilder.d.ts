/// <reference path="../interfaces/IQueryConvention.d.ts" />
/// <reference path="../interfaces/IFetchResultQuery.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
/// <reference path="../../model/interfaces/IModel.d.ts" />
import { MongodbQueryBuilderBase } from './MongodbQueryBuilderBase';
import { Model, Document, DocumentQuery } from 'mongoose';
import { MongodbQueryLog } from './MongodbQueryLog';
export declare type MongooseQuery<T> = DocumentQuery<Document & T | null, Document & T> | DocumentQuery<(Document & T)[] | null, Document & T>;
export declare class MongooseQueryBuilder<T> extends MongodbQueryBuilderBase implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    static className: string;
    protected mongooseModel: Model<Document & T>;
    protected mongooseQuery: MongooseQuery<T>;
    protected hasMongooseQuery: boolean;
    protected primaryKey: string;
    constructor(modelName: string);
    constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined);
    constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined, primaryKey: string);
    getClassName(): string;
    native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): NajsEloquent.QueryBuilder.IFetchResultQuery<T>;
    get(): Promise<Array<Document & T>>;
    first(): Promise<T | null>;
    count(): Promise<number>;
    update(data: Object): Promise<Object>;
    delete(): Promise<Object>;
    restore(): Promise<Object>;
    execute(): Promise<any>;
    protected getQuery(isFindOne?: boolean, logger?: MongodbQueryLog): MongooseQuery<T>;
    protected passFieldsToQuery(query: MongooseQuery<T>, logger?: MongodbQueryLog): void;
    protected passLimitToQuery(query: MongooseQuery<T>, logger?: MongodbQueryLog): void;
    protected passOrderingToQuery(query: MongooseQuery<T>, logger?: MongodbQueryLog): void;
    protected passDataToMongooseQuery(query: MongooseQuery<T>, logger?: MongodbQueryLog): MongooseQuery<T>;
    protected createQuery(findOne: boolean, logger?: MongodbQueryLog): DocumentQuery<(Document & T)[] | null, Document & T>;
    protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention;
}
