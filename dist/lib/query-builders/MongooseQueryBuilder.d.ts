import { MongooseQuery } from './MongooseQueryBuilder';
import { QueryBuilder } from './QueryBuilder';
import { IBasicQueryGrammar } from '../interfaces/IBasicQueryGrammar';
import { IQueryFetchResult } from '../interfaces/IQueryFetchResult';
import { Collection } from 'collect.js';
import { Model, Document, DocumentQuery, Mongoose } from 'mongoose';
export declare type MongooseQuery<T> = DocumentQuery<Document & T | null, Document & T> | DocumentQuery<(Document & T)[] | null, Document & T>;
export declare class MongooseQueryBuilder<T = {}> extends QueryBuilder implements IBasicQueryGrammar<T>, IQueryFetchResult<Document & T> {
    protected mongooseModel: Model<Document & T>;
    protected mongooseQuery: MongooseQuery<T>;
    protected hasMongooseQuery: boolean;
    protected primaryKey: string;
    constructor(modelName: string, primaryKey?: string);
    protected getMongoose(): Mongoose;
    protected getQuery(isFindOne?: boolean): MongooseQuery<T>;
    protected passDataToMongooseQuery(query: MongooseQuery<T>): MongooseQuery<T>;
    getPrimaryKey(): string;
    native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): IQueryFetchResult<T>;
    toObject(): Object;
    get(): Promise<Collection<any>>;
    all(): Promise<Collection<any>>;
    find(): Promise<any | null>;
    pluck(value: string): Promise<Object>;
    pluck(value: string, key: string): Promise<Object>;
    count(): Promise<number>;
    update(data: Object): Promise<Object>;
    delete(): Promise<Object>;
    execute(): Promise<any>;
}
