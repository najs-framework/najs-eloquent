import * as Knex from 'knex'
import { register } from 'najs-binding'
import { QueryBuilderWrapper } from './QueryBuilderWrapper'
import { NajsEloquent } from '../constants'

export class KnexQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
  static className: string = NajsEloquent.Wrapper.KnexQueryBuilderWrapper

  getClassName() {
    return NajsEloquent.Wrapper.KnexQueryBuilderWrapper
  }

  /**
   * Create a mongoose native query
   * @param handler
   */
  native(handler: (queryBuilder: Knex.QueryBuilder) => void): this {
    ; (this.queryBuilder as any).native(handler)

    return this
  }
}
register(KnexQueryBuilderWrapper, NajsEloquent.Wrapper.KnexQueryBuilderWrapper)
