import { QueryLog } from '../../facades/global/QueryLogFacade'
import { MongooseQuery } from './MongooseQueryBuilder'
import { QueryBuilder, QueryBuilderSoftDelete } from './QueryBuilder'
import { MongodbConditionConverter } from './MongodbConditionConverter'
import { IBasicQueryGrammar } from '../interfaces/IBasicQueryGrammar'
import { IQueryFetchResult } from '../interfaces/IQueryFetchResult'
import { IMongooseProvider } from '../interfaces/IMongooseProvider'
import { EloquentMongoose as Eloquent } from '../eloquent/EloquentMongoose'
import { make } from 'najs-binding'
import { isEmpty } from 'lodash'
import collect, { Collection } from 'collect.js'
import { Model, Document, DocumentQuery, Mongoose } from 'mongoose'
import { NotFoundError } from '../errors/NotFoundError'

export type MongooseQuery<T> =
  | DocumentQuery<Document & T | null, Document & T>
  | DocumentQuery<(Document & T)[] | null, Document & T>

export class MongooseQueryBuilder<T = {}> extends QueryBuilder
  implements IBasicQueryGrammar<T>, IQueryFetchResult<Document & T> {
  static className: string = 'MongooseQueryBuilder'
  protected mongooseModel: Model<Document & T>
  protected mongooseQuery: MongooseQuery<T>
  protected hasMongooseQuery: boolean
  protected primaryKey: string

  constructor(modelName: string)
  constructor(modelName: string, softDelete: QueryBuilderSoftDelete)
  constructor(modelName: string, softDelete: QueryBuilderSoftDelete | undefined, primaryKey: string)
  constructor(modelName: string, softDelete?: QueryBuilderSoftDelete, primaryKey: string = '_id') {
    super(softDelete)
    this.primaryKey = primaryKey
    const mongoose: Mongoose = this.getMongooseProvider().getMongooseInstance()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      throw new Error('Model ' + modelName + ' Not Found')
    }

    this.mongooseModel = mongoose.model(modelName)
  }

  protected getMongooseProvider(): IMongooseProvider {
    return make<IMongooseProvider>('MongooseProvider')
  }

  protected getQuery(isFindOne: boolean = false, rawLogs: string[] = []): MongooseQuery<T> {
    if (!this.hasMongooseQuery) {
      const conditions = new MongodbConditionConverter(this.getConditions()).convert()
      rawLogs.push(this.mongooseModel.modelName)
      if (isFindOne) {
        this.mongooseQuery = this.mongooseModel.findOne(conditions)
        rawLogs.push(`.findOne(${JSON.stringify(conditions)})`)
      } else {
        this.mongooseQuery = this.mongooseModel.find(conditions)
        rawLogs.push(`.find(${JSON.stringify(conditions)})`)
      }
      this.hasMongooseQuery = true
    }
    return this.mongooseQuery
  }

  protected passDataToMongooseQuery(query: MongooseQuery<T>, rawLogs: string[] = []) {
    if (!isEmpty(this.selectedFields)) {
      const selectParams = this.selectedFields.join(' ')
      query.select(selectParams)
      rawLogs.push(`.select("${selectParams}")`)
    }
    if (!isEmpty(this.distinctFields)) {
      const distinctParams = this.distinctFields.join(' ')
      query.distinct(distinctParams)
      rawLogs.push(`.distinct("${distinctParams}")`)
    }
    if (this.limitNumber) {
      query.limit(this.limitNumber)
      rawLogs.push(`.limit(${this.limitNumber})`)
    }
    if (this.ordering && !isEmpty(this.ordering)) {
      const sort: Object = Object.keys(this.ordering).reduce((memo, key) => {
        memo[key] = this.ordering[key] === 'asc' ? 1 : -1
        return memo
      }, {})
      query.sort(sort)
      rawLogs.push(`.sort(${JSON.stringify(sort)})`)
    }
    return query
  }

  getPrimaryKey(): string {
    return this.primaryKey
  }

  native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): IQueryFetchResult<T> {
    this.mongooseQuery = handler.call(
      undefined,
      this.isUsed ? this.passDataToMongooseQuery(this.getQuery()) : this.mongooseModel
    )
    this.hasMongooseQuery = true
    return this
  }

  toObject(): Object {
    const conditions = new MongodbConditionConverter(this.getConditions()).convert()
    return {
      name: this.name ? this.name : undefined,
      select: !isEmpty(this.selectedFields) ? this.selectedFields : undefined,
      distinct: !isEmpty(this.distinctFields) ? this.distinctFields : undefined,
      limit: this.limitNumber,
      orderBy: !isEmpty(this.ordering) ? this.ordering : undefined,
      conditions: !isEmpty(conditions) ? conditions : undefined
    }
  }

  protected logQuery(action: string, raw: string) {
    const data = this.toObject()
    data['builder'] = MongooseQueryBuilder.className
    data['action'] = action
    data['raw'] = raw
    QueryLog.push(data, this.queryLogGroup)
  }

  protected getFieldByName(name: any) {
    if (name === 'id') {
      return '_id'
    }
    return name
  }

  // -------------------------------------------------------------------------------------------------------------------

  async get(): Promise<Collection<any>> {
    const rawLogs: string[] = []
    const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs) as DocumentQuery<
      (Document & T)[] | null,
      Document & T
    >
    rawLogs.push('.exec()')
    this.logQuery('get', rawLogs.join(''))
    const result = await query.exec()
    if (result && !isEmpty(result)) {
      const eloquent = make<Eloquent<T>>(this.mongooseModel.modelName)
      return eloquent.newCollection(result)
    }
    return collect([])
  }

  async all(): Promise<Collection<any>> {
    return this.get()
  }

  async find(): Promise<any | null> {
    const rawLogs: string[] = []
    const query = this.passDataToMongooseQuery(this.getQuery(true, rawLogs), rawLogs)
    // change mongoose query operator from find to findOne if needed
    if (query['op'] === 'find') {
      query.findOne()
      rawLogs.push('.fineOne()')
    }

    rawLogs.push('.exec()')
    this.logQuery('find', rawLogs.join(''))
    const result = await (query as DocumentQuery<(Document & T) | null, Document & T>).exec()
    if (result) {
      return make<Eloquent<T>>(this.mongooseModel.modelName).newInstance(result)
    }
    // tslint:disable-next-line
    return null
  }

  async findOrFail(): Promise<any> {
    const value = await this.find()
    if (!value) {
      throw new NotFoundError(this.mongooseModel.modelName)
    }
    return value
  }

  async firstOrFail(): Promise<any> {
    return this.findOrFail()
  }

  async first(): Promise<any | null> {
    return this.find()
  }

  async pluck(value: string): Promise<Object>
  async pluck(value: string, key: string): Promise<Object>
  async pluck(value: string, key?: string): Promise<Object> {
    const rawLogs: string[] = []

    this.selectedFields = []
    const keyName = key ? key : this.primaryKey
    this.select(value, keyName)
    const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs) as DocumentQuery<
      (Document & T)[] | null,
      Document & T
    >

    rawLogs.push('.exec()')
    this.logQuery('pluck', rawLogs.join(''))
    const result: Array<Document & T> | null = await query.exec()
    if (result && !isEmpty(result)) {
      return result.reduce(function(memo: Object, item: Document) {
        memo[item[keyName]] = item[value]
        return memo
      }, {})
    }
    return {}
  }

  async count(): Promise<number> {
    const rawLogs: string[] = []
    this.selectedFields = []
    this.select(this.primaryKey)
    const query = this.passDataToMongooseQuery(this.getQuery(false, rawLogs), rawLogs) as DocumentQuery<
      (Document & T)[] | null,
      Document & T
    >
    rawLogs.push('.count().exec()')
    this.logQuery('count', rawLogs.join(''))
    const result = await query.count().exec()
    return result
  }

  async update(data: Object): Promise<Object> {
    const rawLogs: string[] = []
    const conditions = new MongodbConditionConverter(this.getConditions()).convert()
    const query = this.mongooseModel.update(conditions, data, {
      multi: true
    })
    rawLogs.push(this.mongooseModel.modelName)
    rawLogs.push(`.update(${JSON.stringify(conditions)}, ${JSON.stringify(data)}, {multi: true})`)
    rawLogs.push('.exec()')
    this.logQuery('update', rawLogs.join(''))
    return <Object>query.exec()
  }

  async delete(): Promise<Object> {
    const conditions = this.isNotUsedOrEmptyCondition()
    if (conditions === false) {
      return { n: 0, ok: 1 }
    }
    const rawLogs: string[] = []
    rawLogs.push(this.mongooseModel.modelName)
    rawLogs.push(`.remove(${JSON.stringify(conditions)})`)
    rawLogs.push('.exec()')
    this.logQuery('delete', rawLogs.join(''))
    const query = this.mongooseModel.remove(conditions)
    return <Object>query.exec()
  }

  async restore(): Promise<Object> {
    if (!this.softDelete) {
      return { n: 0, nModified: 0, ok: 1 }
    }
    const conditions = this.isNotUsedOrEmptyCondition()
    if (conditions === false) {
      return { n: 0, nModified: 0, ok: 1 }
    }
    const rawLogs: string[] = []
    const updateData = {
      $set: { [this.softDelete.deletedAt]: this.getNullValue(this.softDelete.deletedAt) }
    }
    const query = this.mongooseModel.update(conditions, updateData, { multi: true })
    rawLogs.push(this.mongooseModel.modelName)
    rawLogs.push('.update(')
    rawLogs.push(JSON.stringify(conditions))
    rawLogs.push(', ')
    rawLogs.push(JSON.stringify(updateData))
    rawLogs.push(', ')
    rawLogs.push(JSON.stringify({ multi: true }))
    rawLogs.push(').exec()')
    this.logQuery('restore', rawLogs.join(''))
    return <Object>query.exec()
  }

  async execute(): Promise<any> {
    const rawLogs: string[] = []
    const query: any = this.getQuery(false, rawLogs)
    rawLogs.push('.exec()')
    this.logQuery('execute', rawLogs.join(''))
    return query.exec()
  }

  private isNotUsedOrEmptyCondition(): false | Object {
    if (!this.isUsed) {
      return false
    }
    const conditions = new MongodbConditionConverter(this.getConditions()).convert()
    if (isEmpty(conditions)) {
      return false
    }
    return conditions
  }
}
