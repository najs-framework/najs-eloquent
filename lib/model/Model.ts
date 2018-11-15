/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/collect.js/index.d.ts" />

import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder
import SubCondition = NajsEloquent.QueryGrammar.SubCondition
import Range = NajsEloquent.QueryGrammar.Range

import { register, getClassName } from 'najs-binding'
import { DriverProvider } from '../facades/global/DriverProviderFacade'
import { PrototypeManager } from '../util/PrototypeManager'
import { ModelEvent } from './ModelEvent'

export interface Model extends NajsEloquent.Model.IModel {}
export class Model {
  public id?: any

  constructor(data?: object, isGuarded?: boolean) {
    this.internalData = {
      relations: {}
    } as any

    return this.makeDriver().makeModel<any>(this, data, isGuarded)
  }

  protected makeDriver<T>(): Najs.Contracts.Eloquent.Driver<T> {
    this.driver = DriverProvider.create(this)

    return this.driver
  }

  getDriver() {
    return this.driver
  }

  getModelName() {
    return getClassName(this)
  }

  newQuery(name?: string): IQueryBuilder<this> {
    const query = this.driver.getQueryFeature().newQuery(this)

    return typeof name !== 'undefined' ? query.queryName(name) : query
  }

  /**
   * Register a model class.
   *
   * @param modelClass
   */
  static register(modelClass: typeof Model) {
    register(modelClass)
  }

  // static start query methods ----------------------------------------------------------------------------------------
  static Event: typeof ModelEvent = ModelEvent

  /**
   * Start new query of model.
   */
  static newQuery<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>>
  /**
   * Start new query of model with name.
   */
  static newQuery<T extends typeof Model>(this: T, name: string): IQueryBuilder<InstanceType<T>>
  static newQuery<T extends typeof Model>(this: T, name?: string): IQueryBuilder<InstanceType<T>> {
    return (new this() as InstanceType<T>).newQuery(name)
  }

  /**
   * Set the query with given name
   *
   * @param {string} name
   */
  static queryName<T extends typeof Model>(this: T, name: string): IQueryBuilder<InstanceType<T>> {
    return this.newQuery(name)
  }

  /**
   * Set the query log group name
   *
   * @param {string} group QueryLog group
   */
  static setLogGroup<T extends typeof Model>(this: T, group: string): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.setLogGroup.apply(query, arguments)
  }

  /**
   * Set the columns or fields to be selected.
   *
   * @param {string|string[]} fields
   */
  static select<T extends typeof Model>(this: T, ...fields: Array<string | string[]>): IQueryBuilder<InstanceType<T>>
  static select() {
    const query = this.newQuery()
    return query.select.apply(query, arguments)
  }

  /**
   * Set the "limit" value of the query.
   * @param {number} records
   */
  static limit<T extends typeof Model>(this: T, record: number): IQueryBuilder<InstanceType<T>>
  static limit() {
    const query = this.newQuery()
    return query.limit.apply(query, arguments)
  }

  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   */
  static orderBy<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>
  /**
   * Add an "order by" clause to the query.
   *
   * @param {string} field
   * @param {string} direction
   */
  static orderBy<T extends typeof Model>(
    this: T,
    field: string,
    direction: 'asc' | 'desc'
  ): IQueryBuilder<InstanceType<T>>
  static orderBy() {
    const query = this.newQuery()
    return query.orderBy.apply(query, arguments)
  }

  /**
   * Add an "order by" clause to the query with direction ASC.
   *
   * @param {string} field
   * @param {string} direction
   */
  static orderByAsc<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.orderByAsc.apply(query, arguments)
  }

  /**
   * Add an "order by" clause to the query with direction DESC.
   *
   * @param {string} field
   * @param {string} direction
   */
  static orderByDesc<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.orderByDesc.apply(query, arguments)
  }

  /**
   * Consider all soft-deleted or not-deleted items.
   */
  static withTrashed<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.withTrashed.apply(query, arguments)
  }

  /**
   * Consider soft-deleted items only.
   */
  static onlyTrashed<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.onlyTrashed.apply(query, arguments)
  }

  /**
   * Add a basic where clause to the query.
   *
   * @param {Function} conditionBuilder sub-query builder
   */
  static where<T extends typeof Model>(this: T, conditionBuilder: SubCondition): IQueryBuilder<InstanceType<T>>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  static where<T extends typeof Model>(this: T, field: string, value: any): IQueryBuilder<InstanceType<T>>
  /**
   * Add a basic where clause to the query.
   *
   * @param {string} field
   * @param {string} operator
   * @param {mixed} value
   */
  static where<T extends typeof Model>(
    this: T,
    field: string,
    operator: Operator,
    value: any
  ): IQueryBuilder<InstanceType<T>>
  static where<T extends typeof Model>(this: T): IQueryBuilder<InstanceType<T>> {
    const query = this.newQuery()
    return query.where.apply(query, arguments)
  }

  /**
   * Add a "where not" clause to the query.
   *
   * @param {string} field
   * @param {mixed} value
   */
  static whereNot<T extends typeof Model>(this: T, field: string, value: any): IQueryBuilder<InstanceType<T>>
  static whereNot(field: string, value: any) {
    const query = this.newQuery()
    return query.whereNot.apply(query, arguments)
  }

  /**
   * Add a "where in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  static whereIn<T extends typeof Model>(this: T, field: string, values: Array<any>): IQueryBuilder<InstanceType<T>>
  static whereIn(field: string, values: Array<any>) {
    const query = this.newQuery()
    return query.whereIn.apply(query, arguments)
  }

  /**
   * Add a "where not in" clause to the query.
   *
   * @param {string} field
   * @param {any[]} values
   */
  static whereNotIn<T extends typeof Model>(this: T, field: string, values: Array<any>): IQueryBuilder<InstanceType<T>>
  static whereNotIn(field: string, values: Array<any>) {
    const query = this.newQuery()
    return query.whereNotIn.apply(query, arguments)
  }

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  static whereNull<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>
  static whereNull(field: string) {
    const query = this.newQuery()
    return query.whereNull.apply(query, arguments)
  }

  /**
   * Add a "where null" clause to the query.
   *
   * @param {string} field
   */
  static whereNotNull<T extends typeof Model>(this: T, field: string): IQueryBuilder<InstanceType<T>>
  static whereNotNull(field: string) {
    const query = this.newQuery()
    return query.whereNotNull.apply(query, arguments)
  }

  /**
   * Add a "where between" clause to the query.
   *
   * @param {string} field
   */
  static whereBetween<T extends typeof Model>(this: T, field: string, range: Range): IQueryBuilder<InstanceType<T>>
  static whereBetween(field: string, range: Range) {
    const query = this.newQuery()
    return query.whereBetween.apply(query, arguments)
  }

  /**
   * Add a "where not between" clause to the query.
   *
   * @param {string} field
   */
  static whereNotBetween<T extends typeof Model>(this: T, field: string, range: Range): IQueryBuilder<InstanceType<T>>
  static whereNotBetween(field: string, range: Range) {
    const query = this.newQuery()
    return query.whereNotBetween.apply(query, arguments)
  }

  /**
   * Execute query and return result as a Collection.
   */
  static get<T extends typeof Model>(this: T): Promise<CollectJs.Collection<InstanceType<T>>>
  /**
   * Select some fields and get result as Collection.
   */
  static get<T extends typeof Model>(
    this: T,
    ...fields: Array<string | string[]>
  ): Promise<CollectJs.Collection<InstanceType<T>>>
  static get() {
    const query = this.newQuery()
    return query.get.apply(query, arguments)
  }

  /**
   * Execute query and return result as a Collection.
   */
  static all<T extends typeof Model>(this: T): Promise<CollectJs.Collection<InstanceType<T>>> {
    const query = this.newQuery()
    return query.all.apply(query, arguments)
  }

  /**
   * return count of the records.
   */
  static count<T extends typeof Model>(this: T): Promise<number> {
    const query = this.newQuery()
    return query.count.apply(query, arguments)
  }

  /**
   * Execute query and returns "pluck" result.
   */
  static pluck<T extends typeof Model>(this: T, valueKey: string): Promise<object>
  /**
   * Execute query and returns "pluck" result.
   */
  static pluck<T extends typeof Model>(this: T, valueKey: string, indexKey: string): Promise<object>
  static pluck(): Promise<object> {
    const query = this.newQuery()
    return query.pluck.apply(query, arguments)
  }

  /**
   * Find first record by id.
   *
   * @param {string} id
   */
  static findById<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T> | null> {
    const query = this.newQuery()
    return query.findById.apply(query, arguments)
  }

  /**
   * Find first record by id and throws NotFoundException if there is no record
   * @param {string} id
   */
  static findOrFail<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T>> {
    const query = this.newQuery()
    return query.findOrFail.apply(query, arguments)
  }

  /**
   * Find first record by id and throws NotFoundException if there is no record
   * @param {string} id
   */
  static firstOrFail<T extends typeof Model>(this: T, id: any): Promise<InstanceType<T>> {
    const query = this.newQuery()
    return query.firstOrFail.apply(query, arguments)
  }

  /**
   * Load given relations name when the query get executed.
   *
   * @param {string|string[]} relations
   */
  static with<T extends typeof Model>(this: T, ...relations: Array<string | string[]>): IQueryBuilder<InstanceType<T>>
  static with() {
    const query = this.newQuery()
    return query.with.apply(query, arguments)
  }
}

PrototypeManager.stopFindingRelationsIn(Model.prototype)
Object.defineProperty(Model.prototype, '_isNajsEloquentModel', { value: true })
