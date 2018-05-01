/// <reference path="../interfaces/IQueryConvention.ts" />
/// <reference path="../interfaces/IFetchResultQuery.ts" />
/// <reference path="../../collect.js/index.d.ts" />
/// <reference path="../../model/interfaces/IModel.ts" />

import { MongooseProvider } from '../../facades/global/MongooseProviderFacade'
import { GenericQueryBuilder } from '../GenericQueryBuilder'
import { Model, Document, DocumentQuery, Mongoose } from 'mongoose'
import { MongooseQueryLog } from './MongooseQueryLog'
import { MongodbConditionConverter } from './MongodbConditionConverter'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { register, make } from 'najs-binding'
import { isEmpty } from 'lodash'

export type MongooseQuery<T> =
  | DocumentQuery<Document & T | null, Document & T>
  | DocumentQuery<(Document & T)[] | null, Document & T>

export class MongooseQueryBuilder<T> extends GenericQueryBuilder
  implements NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
  static className: string = NajsEloquentClasses.QueryBuilder.MongooseQueryBuilder

  protected mongooseModel: Model<Document & T>
  protected mongooseQuery: MongooseQuery<T>
  protected hasMongooseQuery: boolean
  protected primaryKey: string

  constructor(modelName: string)
  constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined)
  constructor(modelName: string, softDelete: NajsEloquent.Model.ISoftDeletesSetting | undefined, primaryKey: string)
  constructor(modelName: string, softDelete?: NajsEloquent.Model.ISoftDeletesSetting, primaryKey: string = '_id') {
    super(softDelete)
    this.primaryKey = primaryKey
    const mongoose: Mongoose = MongooseProvider.getMongooseInstance()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      throw new Error('Model ' + modelName + ' Not Found')
    }

    this.mongooseModel = mongoose.model(modelName)
  }

  getClassName() {
    return NajsEloquentClasses.QueryBuilder.MongooseQueryBuilder
  }

  protected getQuery(isFindOne: boolean = false, logger?: MongooseQueryLog): MongooseQuery<T> {
    if (!this.hasMongooseQuery) {
      const conditions = this.resolveMongodbConditionConverter().convert()
      this.mongooseQuery = isFindOne
        ? this.mongooseModel.findOne(conditions)
        : (this.mongooseQuery = this.mongooseModel.find(conditions))

      if (logger) {
        logger.raw(this.mongooseModel.modelName).raw(isFindOne ? '.findOne(' : '.find(', conditions, ')')
      }
      this.hasMongooseQuery = true
    }
    return this.mongooseQuery
  }

  protected passFieldsToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog) {
    for (const name in this.fields) {
      if (!isEmpty(this.fields[name])) {
        const fields = this.fields[name].join(' ')
        query[name](fields)
        if (logger) {
          logger.raw(`.${name}("${fields}")`)
        }
      }
    }
  }

  protected passLimitToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog) {
    if (this.limitNumber) {
      query.limit(this.limitNumber)
      if (logger) {
        logger.raw(`.limit(${this.limitNumber})`)
      }
    }
  }

  protected passOrderingToQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog) {
    if (this.ordering && !isEmpty(this.ordering)) {
      const sort: Object = Object.keys(this.ordering).reduce((memo, key) => {
        memo[key] = this.ordering[key] === 'asc' ? 1 : -1
        return memo
      }, {})
      query.sort(sort)
      if (logger) {
        logger.raw('.sort(', sort, ')')
      }
    }
  }

  protected passDataToMongooseQuery(query: MongooseQuery<T>, logger?: MongooseQueryLog) {
    this.passFieldsToQuery(query, logger)
    this.passLimitToQuery(query, logger)
    this.passOrderingToQuery(query, logger)
    return query
  }

  protected createQuery(findOne: boolean, logger?: MongooseQueryLog) {
    return this.passDataToMongooseQuery(this.getQuery(findOne, logger), logger) as DocumentQuery<
      (Document & T)[] | null,
      Document & T
    >
  }

  protected getQueryConvention(): NajsEloquent.QueryBuilder.IQueryConvention {
    return {
      formatFieldName(name: any) {
        if (name === 'id') {
          return '_id'
        }
        return name
      },
      getNullValueFor(name: any) {
        // tslint:disable-next-line
        return null
      }
    }
  }

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

  // -------------------------------------------------------------------------------------------------------------------

  native(
    handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>
  ): NajsEloquent.QueryBuilder.IFetchResultQuery<T> {
    this.mongooseQuery = handler.call(undefined, this.isUsed ? this.createQuery(false) : this.mongooseModel)
    this.hasMongooseQuery = true
    return this
  }

  async get(): Promise<Array<Document & T>> {
    const logger = this.resolveMongooseQueryLog()
    const query = this.createQuery(false, logger)
    logger
      .raw('.exec()')
      .action('get')
      .end()
    return (await query.exec()) as Array<Document & T>
  }

  async first(): Promise<T | null> {
    const logger = this.resolveMongooseQueryLog()
    const query = this.passDataToMongooseQuery(this.getQuery(true, logger), logger)
    // change mongoose query operator from find to findOne if needed
    if (query['op'] === 'find') {
      query.findOne()
      logger.raw('.fineOne()')
    }

    logger
      .raw('.exec()')
      .action('find')
      .end()

    return await (query as DocumentQuery<(Document & T) | null, Document & T>).exec()
  }

  async count(): Promise<number> {
    const logger = this.resolveMongooseQueryLog().action('count')
    this.selectedFields = []
    this.select(this.primaryKey)
    const query = this.createQuery(false, logger)
    logger.raw('.count().exec()').end()
    const result = await query.count().exec()
    return result
  }

  async update(data: Object): Promise<Object> {
    const conditions = this.resolveMongodbConditionConverter().convert()
    const query = this.mongooseModel.update(conditions, data, {
      multi: true
    })

    this.resolveMongooseQueryLog()
      .action('update')
      .raw(this.mongooseModel.modelName)
      .raw(`.update(${JSON.stringify(conditions)}, ${JSON.stringify(data)}, {multi: true})`)
      .raw('.exec()')
      .end()
    return <any>query.exec()
  }

  async delete(): Promise<Object> {
    const conditions = this.isNotUsedOrEmptyCondition()
    if (conditions === false) {
      return { n: 0, ok: 1 }
    }
    this.resolveMongooseQueryLog()
      .raw(this.mongooseModel.modelName)
      .raw('.remove(', conditions, ')', '.exec()')
      .end()

    const query = this.mongooseModel.remove(conditions)
    return <any>query.exec()
  }

  async restore(): Promise<Object> {
    if (!this.softDelete) {
      return { n: 0, nModified: 0, ok: 1 }
    }
    const conditions = this.isNotUsedOrEmptyCondition()
    if (conditions === false) {
      return { n: 0, nModified: 0, ok: 1 }
    }

    const updateData = {
      $set: { [this.softDelete.deletedAt]: this.convention.getNullValueFor(this.softDelete.deletedAt) }
    }
    const query = this.mongooseModel.update(conditions, updateData, { multi: true })
    this.resolveMongooseQueryLog()
      .action('restore')
      .raw(this.mongooseModel.modelName)
      .raw('.update(', conditions, ',', updateData, ', ', { multi: true }, ')')
      .raw('.exec()')
      .end()
    return query.exec()
  }

  async execute(): Promise<any> {
    const logger = this.resolveMongooseQueryLog()
    const query: any = this.getQuery(false, logger)
    logger
      .raw('.exec()')
      .action('execute')
      .end()
    return query.exec()
  }

  private isNotUsedOrEmptyCondition(): false | Object {
    if (!this.isUsed) {
      return false
    }
    const conditions = this.resolveMongodbConditionConverter().convert()
    if (isEmpty(conditions)) {
      return false
    }
    return conditions
  }

  private resolveMongodbConditionConverter(): MongodbConditionConverter {
    return make<MongodbConditionConverter>(MongodbConditionConverter.className, [this.getConditions()])
  }

  private resolveMongooseQueryLog(): MongooseQueryLog {
    const data = this.toObject()
    data['builder'] = this.getClassName()
    return make<MongooseQueryLog>(MongooseQueryLog.className, [data])
  }
}
register(MongooseQueryBuilder)
