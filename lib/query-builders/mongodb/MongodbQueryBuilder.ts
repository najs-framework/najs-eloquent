/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />

import { register } from 'najs-binding'
import { Collection } from 'mongodb'
import { isEmpty } from 'lodash'
import { MongodbQueryBuilderBase } from './MongodbQueryBuilderBase'
import { MongodbQueryLog } from './MongodbQueryLog'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'

export class MongodbQueryBuilder<T> extends MongodbQueryBuilderBase
  implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
  protected modelName: string
  protected collection: Collection
  protected primaryKey: string

  constructor(
    modelName: string,
    collection: Collection,
    softDelete?: NajsEloquent.Model.ISoftDeletesSetting | undefined,
    primaryKey: string = '_id'
  ) {
    super(softDelete)
    this.modelName = modelName
    this.collection = collection
    this.primaryKey = primaryKey
  }

  getClassName(): string {
    return NajsEloquentClasses.QueryBuilder.MongodbQueryBuilder
  }

  get(): Promise<T[]> {
    const query = this.resolveMongodbConditionConverter().convert()
    const options = this.createQueryOptions()
    const logger = this.resolveMongodbQueryLog()
    this.logQueryAndOptions(logger, query, options, 'find')
      .raw('.toArray()')
      .end()
    return this.collection.find(query, options).toArray()
  }

  first(): Promise<T | null> {
    const query = this.resolveMongodbConditionConverter().convert()
    const options = this.createQueryOptions()
    const logger = this.resolveMongodbQueryLog()
    this.logQueryAndOptions(logger, query, options, 'findOne').end()
    return this.collection.findOne(query, options)
  }

  count(): Promise<number> {
    if (this.fields.select) {
      this.fields.select = []
    }
    if (!isEmpty(this.ordering)) {
      this.ordering = {}
    }
    const query = this.resolveMongodbConditionConverter().convert()
    const options = this.createQueryOptions()
    const logger = this.resolveMongodbQueryLog()
    this.logQueryAndOptions(logger, query, options, 'count').end()
    return this.collection.count(query)
  }

  update(data: Object): Promise<Object> {
    throw new Error('Not implemented.')
  }

  delete(): Promise<Object> {
    throw new Error('Not implemented.')
  }

  restore(): Promise<Object> {
    throw new Error('Not implemented.')
  }

  execute(): Promise<any> {
    throw new Error('Not implemented.')
  }

  // -------------------------------------------------------------------------------------------------------------------
  protected logQueryAndOptions(
    logger: MongodbQueryLog,
    query: object,
    options: object | undefined,
    func: string
  ): MongodbQueryLog {
    return logger.raw('db.', this.collection.collectionName, `.${func}(`, query).raw(options ? ', ' : '', options, ')')
  }

  createQueryOptions(): object | undefined {
    const options = {}

    if (this.limitNumber) {
      options['limit'] = this.limitNumber
    }

    if (this.ordering && !isEmpty(this.ordering)) {
      options['sort'] = Object.keys(this.ordering).reduce((memo: any[], key) => {
        memo.push([key, this.ordering[key] === 'asc' ? 1 : -1])
        return memo
      }, [])
    }

    if (!isEmpty(this.fields.select)) {
      options['projection'] = this.fields.select!.reduce((memo: object, key) => {
        memo[key] = 1
        return memo
      }, {})
    }

    return isEmpty(options) ? undefined : options
  }
}
register(MongodbQueryBuilder, NajsEloquentClasses.QueryBuilder.MongodbQueryBuilder)
