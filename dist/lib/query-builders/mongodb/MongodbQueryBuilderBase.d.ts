/// <reference path="../interfaces/IFetchResultQuery.d.ts" />
/// <reference path="../../../../lib/collect.js/index.d.ts" />
import { MongodbConditionConverter } from './MongodbConditionConverter';
import { GenericQueryBuilder } from '../GenericQueryBuilder';
import { MongodbQueryLog } from './MongodbQueryLog';
export declare abstract class MongodbQueryBuilderBase extends GenericQueryBuilder {
    protected modelName: string;
    protected primaryKey: string;
    abstract getClassName(): string;
    getPrimaryKey(): string;
    toObject(): Object;
    protected resolveMongodbConditionConverter(): MongodbConditionConverter;
    protected resolveMongodbQueryLog(): MongodbQueryLog;
    protected isNotUsedOrEmptyCondition(): false | Object;
    protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention;
}
