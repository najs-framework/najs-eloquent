/// <reference types="najs-binding" />

import { QueryLog } from '../facades/global/QueryLogFacade'
import { KnexQueryBuilder } from './KnexQueryBuilder'
import { NajsEloquent } from '../constants'
import { register } from 'najs-binding'

export class KnexQueryLog implements Najs.Contracts.Autoload {
  protected data: object

  constructor(data?: object) {
    this.data = data || {}
  }

  getClassName() {
    return NajsEloquent.QueryBuilder.KnexQueryLog
  }

  name(name: string): this {
    this.data['name'] = name

    return this
  }

  sql(sql: string): this {
    this.data['sql'] = sql

    return this
  }

  end(): void {
    QueryLog.push(this.data)
  }

  log(queryBuilder: KnexQueryBuilder) {
    if (queryBuilder['name']) {
      this.name(queryBuilder['name'])
    }

    if (queryBuilder['knexQueryBuilder']) {
      this.sql(queryBuilder['knexQueryBuilder']!.toQuery()).end()
    }
  }
}
register(KnexQueryLog, NajsEloquent.QueryBuilder.KnexQueryLog)
