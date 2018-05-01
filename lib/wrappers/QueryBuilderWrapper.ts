/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../relations/interfaces/IRelationDataBucket.ts" />
/// <reference path="interfaces/IQueryBuilderWrapper.ts" />

import '../relations/RelationDataBucket'
import { make, register } from 'najs-binding'
import { NajsEloquent, QueryFunctions } from '../constants'
import { NotFoundError } from '../errors/NotFoundError'
import { array_unique } from '../util/functions'

const FORWARD_FUNCTIONS = array_unique(
  QueryFunctions.BasicQuery,
  QueryFunctions.ConditionQuery,
  QueryFunctions.SoftDeleteQuery,
  QueryFunctions.FetchResultQuery.filter(item => item !== 'first' && item !== 'get')
)

export interface QueryBuilderWrapper<T> extends NajsEloquent.Wrapper.IQueryBuilderWrapper<T> {}
export class QueryBuilderWrapper<T> {
  static className: string = NajsEloquent.Wrapper.QueryBuilderWrapper
  protected modelName: string
  protected recordName: string

  constructor(
    model: string,
    recordName: string,
    queryBuilder: NajsEloquent.QueryBuilder.IQueryBuilder & NajsEloquent.QueryBuilder.IFetchResultQuery<T>
  ) {
    this.modelName = model
    this.recordName = recordName
    this.queryBuilder = queryBuilder
  }

  getClassName() {
    return NajsEloquent.Wrapper.QueryBuilderWrapper
  }

  protected createCollection(result: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<T> & T> {
    return this.createEagerBucket().newCollection<NajsEloquent.Model.IModel<T> & T>(this.recordName, result)
  }

  protected createInstance(result: Object): NajsEloquent.Model.IModel<T> & T {
    return this.createEagerBucket().newInstance<NajsEloquent.Model.IModel<T> & T>(this.recordName, result)
  }

  protected createEagerBucket(): NajsEloquent.Relation.IRelationDataBucket {
    const eager: NajsEloquent.Relation.IRelationDataBucket = make(NajsEloquent.Relation.RelationDataBucket, [])
    return eager.register(this.recordName, this.modelName)
  }

  async first(id?: any): Promise<(NajsEloquent.Model.IModel<T> & T) | null> {
    if (typeof id !== 'undefined') {
      this.queryBuilder.where(this.queryBuilder.getPrimaryKeyName(), id)
    }
    const result = await this.queryBuilder.first()
    return result ? this.createInstance(result) : result
  }

  async find(id?: any): Promise<(NajsEloquent.Model.IModel<T> & T) | null> {
    return this.first(id)
  }

  async get(...fields: Array<string | string[]>): Promise<CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>> {
    if (arguments.length !== 0) {
      this.queryBuilder.select(...fields)
    }
    return this.createCollection(await this.queryBuilder.get())
  }

  async all(...fields: Array<string | string[]>): Promise<CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>> {
    return this.get(...fields)
  }

  async pluck(valueKey: string, indexKey?: string): Promise<Object> {
    const indexKeyName = typeof indexKey === 'undefined' ? this.queryBuilder.getPrimaryKeyName() : indexKey
    const result = await this.queryBuilder.select(valueKey, indexKeyName).get()
    return result.reduce(function(memo: Object, item: Object) {
      memo[item[indexKeyName]] = item[valueKey]
      return memo
    }, {})
  }

  async findById(id: any): Promise<NajsEloquent.Model.IModel<T> & T | null> {
    return this.first(id)
  }

  async findOrFail(id: any): Promise<NajsEloquent.Model.IModel<T> & T> {
    const result = await this.find(id)
    if (result === null) {
      throw new NotFoundError(this.modelName)
    }
    return result
  }

  async firstOrFail(id: any): Promise<NajsEloquent.Model.IModel<T> & T> {
    return this.findOrFail(id)
  }

  static get ForwardFunctions() {
    return FORWARD_FUNCTIONS
  }
}

for (const name of FORWARD_FUNCTIONS) {
  QueryBuilderWrapper.prototype[name] = function() {
    const result = this['queryBuilder'][name](...arguments)
    return result === this['queryBuilder'] ? this : result
  }
}

register(QueryBuilderWrapper)
