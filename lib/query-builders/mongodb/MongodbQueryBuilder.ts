/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />

import { register } from 'najs-binding'
import { Collection } from 'mongodb'
import { MongodbQueryBuilderBase } from './MongodbQueryBuilderBase'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'

export class MongodbQueryBuilder<T> extends MongodbQueryBuilderBase
  implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
  protected modelName: string
  protected collection: Collection
  protected primaryKey: string

  constructor(
    modelName: string,
    collection: Collection,
    softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined,
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
    throw new Error('Not implemented.')
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
}
register(MongodbQueryBuilder, NajsEloquentClasses.QueryBuilder.MongodbQueryBuilder)
