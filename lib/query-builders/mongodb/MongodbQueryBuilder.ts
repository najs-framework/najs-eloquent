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

  async get(): Promise<T[]> {
    const logger = this.resolveMongodbQueryLog()
    const result = await this.createQuery(false, logger)
    logger.end()
    return result
  }

  first(): Promise<T | null> {
    throw new Error('Not implemented.')
  }

  count(): Promise<number> {
    throw new Error('Not implemented.')
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

  createQuery(isFindOne: boolean, logger: MongodbQueryLog): Promise<any> {
    const query = this.resolveMongodbConditionConverter().convert()
    const options = this.createQueryOptions()
    // if (isFindOne) {
    //   logger.raw('db.', this.collection.collectionName, '.findOne(', query, options ? ', ' : '', options, ')')
    //   return this.collection.findOne(query, options)
    // } else {
    logger
      .raw('db.', this.collection.collectionName, '.find(', query, options ? ', ' : '', options, ')')
      .raw('.toArray()')
    return this.collection.find(query, options).toArray()
    // }
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
