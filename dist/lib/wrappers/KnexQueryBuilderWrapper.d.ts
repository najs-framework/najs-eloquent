import * as Knex from 'knex';
import { QueryBuilderWrapper } from './QueryBuilderWrapper';
import { KnexQueryBuilder } from '../query-builders/KnexQueryBuilder';
export declare class KnexQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
    static className: string;
    getClassName(): string;
    native(handler: (queryBuilder: Knex.QueryBuilder) => void): this;
    protected getKnexQueryBuilder(): KnexQueryBuilder<T>;
}
