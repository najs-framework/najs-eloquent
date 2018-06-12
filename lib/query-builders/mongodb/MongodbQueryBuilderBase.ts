/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />

import { make } from 'najs-binding'
import { MongodbConditionConverter } from './MongodbConditionConverter'
import { GenericQueryBuilder } from '../GenericQueryBuilder'
import { MongodbQueryLog } from './MongodbQueryLog'
import { isEmpty } from 'lodash'

export abstract class MongodbQueryBuilderBase extends GenericQueryBuilder {
  protected modelName: string
  protected primaryKey: string

  abstract getClassName(): string

  getPrimaryKey(): string {
    return this.primaryKey
  }

  toObject(): Object {
    const conditions = this.resolveMongodbConditionConverter().convert()
    return {
      name: this.name ? this.name : undefined,
      select: !isEmpty(this.fields.select) ? this.fields.select : undefined,
      limit: this.limitNumber,
      orderBy: !isEmpty(this.ordering) ? this.ordering : undefined,
      conditions: !isEmpty(conditions) ? conditions : undefined
    }
  }

  protected resolveMongodbConditionConverter(): MongodbConditionConverter {
    return make<MongodbConditionConverter>(MongodbConditionConverter.className, [this.getConditions()])
  }

  protected resolveMongodbQueryLog(): MongodbQueryLog {
    const data = this.toObject()
    data['builder'] = this.getClassName()
    return make<MongodbQueryLog>(MongodbQueryLog.className, [data])
  }

  protected isNotUsedOrEmptyCondition(): false | Object {
    if (!this.isUsed) {
      return false
    }
    const conditions = this.resolveMongodbConditionConverter().convert()
    if (isEmpty(conditions)) {
      return false
    }
    return conditions
  }
}
