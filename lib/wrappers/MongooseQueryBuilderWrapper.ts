/// <reference path="../query-builders/interfaces/IFetchResultQuery.ts" />

import { register } from 'najs-binding'
import { QueryBuilderWrapper } from './QueryBuilderWrapper'
import { NajsEloquent } from '../constants'
import { MongooseQueryBuilder, MongooseQuery } from '../query-builders/mongodb/MongooseQueryBuilder'
import { Document, Model } from 'mongoose'

export class MongooseQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
  static className: string = NajsEloquent.Wrapper.MongooseQueryBuilderWrapper

  getClassName() {
    return NajsEloquent.Wrapper.MongooseQueryBuilderWrapper
  }

  /**
   * Create a mongoose native query
   * @param handler
   */
  native(
    handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>
  ): NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    return (this.queryBuilder as MongooseQueryBuilder<any>).native(handler)
  }
}
register(MongooseQueryBuilderWrapper)
