/// <reference path="../query-builders/interfaces/IFetchResultQuery.ts" />

import { register } from 'najs-binding'
import { QueryBuilderWrapper } from './QueryBuilderWrapper'
import { NajsEloquent } from '../constants'
import { MongodbQueryBuilder } from '../query-builders/mongodb/MongodbQueryBuilder'
import { Collection } from 'mongodb'

export class MongodbQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
  static className: string = NajsEloquent.Wrapper.MongodbQueryBuilderWrapper

  getClassName() {
    return NajsEloquent.Wrapper.MongodbQueryBuilderWrapper
  }

  /**
   * Create a mongoose native query
   * @param handler
   */
  native(
    handler: (collection: Collection, conditions: object, options?: object) => Promise<any>
  ): { execute(): Promise<any> } {
    return (this.queryBuilder as MongodbQueryBuilder<any>).native(handler)
  }
}
register(MongodbQueryBuilderWrapper, NajsEloquent.Wrapper.MongodbQueryBuilderWrapper)
