/// <reference path="../query-builders/interfaces/IFetchResultQuery.d.ts" />
import { QueryBuilderWrapper } from './QueryBuilderWrapper';
import { Collection } from 'mongodb';
export declare class MongodbQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
    static className: string;
    getClassName(): string;
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler: (collection: Collection, conditions: object, options?: object) => Promise<any>): {
        execute(): Promise<any>;
    };
}
