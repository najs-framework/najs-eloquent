import * as Knex from 'knex'
import { register } from 'najs-binding'
import { QueryBuilderWrapper } from './QueryBuilderWrapper'
import { NajsEloquent } from '../constants'
import { KnexQueryBuilder } from '../query-builders/KnexQueryBuilder'

export class KnexQueryBuilderWrapper<T> extends QueryBuilderWrapper<T> {
  static className: string = NajsEloquent.Wrapper.KnexQueryBuilderWrapper

  getClassName() {
    return NajsEloquent.Wrapper.KnexQueryBuilderWrapper
  }

  native(handler: (queryBuilder: Knex.QueryBuilder) => void): this {
    this.getKnexQueryBuilder().native(handler)

    return this
  }

  protected getKnexQueryBuilder(): KnexQueryBuilder<T> {
    return <any>this.queryBuilder
  }
}
register(KnexQueryBuilderWrapper, NajsEloquent.Wrapper.KnexQueryBuilderWrapper)
