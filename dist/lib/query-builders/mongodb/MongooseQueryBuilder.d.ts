/// <reference path="../interfaces/IQueryConvention.d.ts" />
/// <reference path="../interfaces/IFetchResultQuery.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
/// <reference path="../../model/interfaces/IModel.d.ts" />
import { GenericQueryBuilder } from '../GenericQueryBuilder';
import { Model, Document, DocumentQuery } from 'mongoose';
import { MongooseQueryLog } from './MongooseQueryLog';
export declare type MongooseQuery<T> = DocumentQuery<Document & T | null, Document & T> | DocumentQuery<(Document & T)[] | null, Document & T>;
export declare class MongooseQueryBuilder<T> extends GenericQueryBuilder implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    static className: string;
    protected mongooseModel: Model<Document & T>;
    protected mongooseQuery: MongooseQuery<T>;
    protected hasMongooseQuery: boolean;
    protected primaryKey: string;
    constructor(modelName: string);
    constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined);
    constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined, primaryKey: string);
    getClassName(): string;
    protected getQuery(isFindOne?: boolean, logger?: MongooseQueryLog): MongooseQuery<T>;
    protected passFieldsToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog): void;
    protected passLimitToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog): void;
    protected passOrderingToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog): void;
    protected passDataToMongooseQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog): MongooseQuery<T>;
    protected createQuery(findOne: boolean, logger?: MongooseQueryLog): DocumentQuery<(Document & T)[] | null, Document & T>;
    protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention;
    getPrimaryKey(): string;
    toObject(): Object;
    native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): NajsEloquent.QueryBuilder.IFetchResultQuery<T>;
    get(): Promise<Array<Document & T>>;
    first(): Promise<T | null>;
    count(): Promise<number>;
    update(data: Object): Promise<Object>;
    delete(): Promise<Object>;
    restore(): Promise<Object>;
    execute(): Promise<any>;
    private isNotUsedOrEmptyCondition();
    private resolveMongodbConditionConverter();
    private resolveMongooseQueryLog();
}
