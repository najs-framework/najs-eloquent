import * as Knex from 'knex';
import { QueryBuilderWrapper } from './QueryBuilderWrapper';
export declare class KnexQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
    static className: string;
    getClassName(): string;
    /**
     * Create a mongoose native query
     * @param handler
     */
    native(handler: (queryBuilder: Knex.QueryBuilder) => void): this;
}
