/// <reference path="../query-builders/interfaces/IFetchResultQuery.d.ts" />
import { QueryBuilderWrapper } from './QueryBuilderWrapper';
import { MongooseQuery } from '../query-builders/mongodb/MongooseQueryBuilder';
import { Document, Model } from 'mongoose';
export declare class MongooseQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
    static className: string;
    getClassName(): string;
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): NajsEloquent.QueryBuilder.IFetchResultQuery<T>;
}
