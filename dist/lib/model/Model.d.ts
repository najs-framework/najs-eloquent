/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../../../lib/definitions/collect.js/index.d.ts" />
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import SubCondition = NajsEloquent.QueryGrammar.SubCondition;
import Range = NajsEloquent.QueryGrammar.Range;
import { ModelEvent } from './ModelEvent';
export interface Model extends NajsEloquent.Model.IModel {
}
export declare class Model {
    id?: any;
    constructor(data?: object, isGuarded?: boolean);
    protected makeDriver<T>(): Najs.Contracts.Eloquent.Driver<T>;
    getDriver(): Najs.Contracts.Eloquent.Driver<any>;
    getModelName(): string;
    newQuery(name?: string): IQueryBuilder<this>;
    /**
     * Register a model class.
     *
     * @param modelClass
     */
    static register(modelClass: typeof Model): void;
    static Event: typeof ModelEvent;
    /**
     * Start new query of model.
     */
    static newQuery<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>>;
    /**
     * Start new query of model with name.
     */
    static newQuery<T extends typeof Model>(this: T, name: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Set the query with given name
     *
     * @param {string} name
     */
    static queryName<T extends typeof Model>(this: T, name: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Set the query log group name
     *
     * @param {string} group QueryLog group
     */
    static setLogGroup<T extends typeof Model>(this: T, group: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Set the columns or fields to be selected.
     *
     * @param {string|string[]} fields
     */
    static select<T extends typeof Model>(this: T, ...fields: Array<string | string[]>): IQueryBuilder<InstanceType<T>>;
    /**
     * Set the "limit" value of the query.
     * @param {number} records
     */
    static limit<T extends typeof Model>(this: T, record: number): IQueryBuilder<InstanceType<T>>;
    /**
     * Add an "order by" clause to the query.
     *
     * @param {string} field
     */
    static orderBy<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Add an "order by" clause to the query.
     *
     * @param {string} field
     * @param {string} direction
     */
    static orderBy<T extends typeof Model>(this: T, field: string, direction: 'asc' | 'desc'): IQueryBuilder<InstanceType<T>>;
    /**
     * Add an "order by" clause to the query with direction ASC.
     *
     * @param {string} field
     * @param {string} direction
     */
    static orderByAsc<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Add an "order by" clause to the query with direction DESC.
     *
     * @param {string} field
     * @param {string} direction
     */
    static orderByDesc<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Consider all soft-deleted or not-deleted items.
     */
    static withTrashed<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>>;
    /**
     * Consider soft-deleted items only.
     */
    static onlyTrashed<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a basic where clause to the query.
     *
     * @param {Function} conditionBuilder sub-query builder
     */
    static where<T extends typeof Model>(this: T, conditionBuilder: SubCondition): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    static where<T extends typeof Model>(this: T, field: string, value: any): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a basic where clause to the query.
     *
     * @param {string} field
     * @param {string} operator
     * @param {mixed} value
     */
    static where<T extends typeof Model>(this: T, field: string, operator: Operator, value: any): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where not" clause to the query.
     *
     * @param {string} field
     * @param {mixed} value
     */
    static whereNot<T extends typeof Model>(this: T, field: string, value: any): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where in" clause to the query.
     *
     * @param {string} field
     * @param {any[]} values
     */
    static whereIn<T extends typeof Model>(this: T, field: string, values: Array<any>): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where not in" clause to the query.
     *
     * @param {string} field
     * @param {any[]} values
     */
    static whereNotIn<T extends typeof Model>(this: T, field: string, values: Array<any>): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where null" clause to the query.
     *
     * @param {string} field
     */
    static whereNull<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where null" clause to the query.
     *
     * @param {string} field
     */
    static whereNotNull<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where between" clause to the query.
     *
     * @param {string} field
     */
    static whereBetween<T extends typeof Model>(this: T, field: string, range: Range): IQueryBuilder<InstanceType<T>>;
    /**
     * Add a "where not between" clause to the query.
     *
     * @param {string} field
     */
    static whereNotBetween<T extends typeof Model>(this: T, field: string, range: Range): IQueryBuilder<InstanceType<T>>;
    /**
     * Execute query and return result as a Collection.
     */
    static get<T extends typeof Model>(this: T): Promise<CollectJs.Collection<InstanceType<T>>>;
    /**
     * Select some fields and get result as Collection.
     */
    static get<T extends typeof Model>(this: T, ...fields: Array<string | string[]>): Promise<CollectJs.Collection<InstanceType<T>>>;
    /**
     * Execute query and return result as a Collection.
     */
    static all<T extends typeof Model>(this: T): Promise<CollectJs.Collection<InstanceType<T>>>;
    /**
     * return count of the records.
     */
    static count<T extends typeof Model>(this: T): Promise<number>;
    /**
     * Execute query and returns "pluck" result.
     */
    static pluck<T extends typeof Model>(this: T, valueKey: string): Promise<object>;
    /**
     * Execute query and returns "pluck" result.
     */
    static pluck<T extends typeof Model>(this: T, valueKey: string, indexKey: string): Promise<object>;
    /**
     * Find first record by id.
     *
     * @param {string} id
     */
    static findById<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T> | null>;
    /**
     * Find first record by id and throws NotFoundException if there is no record
     * @param {string} id
     */
    static findOrFail<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T>>;
    /**
     * Find first record by id and throws NotFoundException if there is no record
     * @param {string} id
     */
    static firstOrFail<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T>>;
    /**
     * Load given relations name when the query get executed.
     *
     * @param {string|string[]} relations
     */
    static with<T extends typeof Model>(this: T, ...relations: Array<string | string[]>): IQueryBuilder<InstanceType<T>>;
}
