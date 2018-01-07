import { MongooseQuery } from './MongooseQueryBuilder'
import { QueryBuilder } from './QueryBuilder'
import { MongodbConditionConverter } from './MongodbConditionConverter'
import { IBasicQueryGrammar } from '../interfaces/IBasicQueryGrammar'
import { IQueryFetchResult } from '../interfaces/IQueryFetchResult'
import { IMongooseProvider } from '../interfaces/IMongooseProvider'
import { EloquentMongoose as Eloquent } from '../eloquent/EloquentMongoose'
import { make } from 'najs'
import { isEmpty } from 'lodash'
import collect, { Collection } from 'collect.js'
import { Model, Document, DocumentQuery, Mongoose } from 'mongoose'

export type MongooseQuery<T> =
  | DocumentQuery<Document & T | null, Document & T>
  | DocumentQuery<(Document & T)[] | null, Document & T>

export class MongooseQueryBuilder<T = {}> extends QueryBuilder implements IBasicQueryGrammar<T>, IQueryFetchResult<T> {
  protected mongooseModel: Model<Document & T>
  protected mongooseQuery: MongooseQuery<T>
  protected hasMongooseQuery: boolean

  constructor(modelName: string) {
    super()
    const mongoose: Mongoose = this.getMongoose()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      throw new Error('Model ' + modelName + ' Not Found')
    }

    this.mongooseModel = mongoose.model(modelName)
  }

  protected getMongoose(): Mongoose {
    return make<IMongooseProvider>('MongooseProvider').getMongooseInstance()
  }

  protected getQuery(isFindOne: boolean = false): MongooseQuery<T> {
    if (!this.hasMongooseQuery) {
      const conditions = new MongodbConditionConverter(this.getConditions()).convert()
      this.mongooseQuery = isFindOne ? this.mongooseModel.findOne(conditions) : this.mongooseModel.find(conditions)
      this.hasMongooseQuery = true
    }
    return this.mongooseQuery
  }

  protected passDataToMongooseQuery(query: MongooseQuery<T>) {
    if (!isEmpty(this.selectedFields)) {
      query.select(this.selectedFields.join(' '))
    }
    if (!isEmpty(this.distinctFields)) {
      query.distinct(this.distinctFields.join(' '))
    }
    if (this.limitNumber) {
      query.limit(this.limitNumber)
    }
    if (this.ordering && !isEmpty(this.ordering)) {
      const sort: Object = Object.keys(this.ordering).reduce((memo, key) => {
        memo[key] = this.ordering[key] === 'asc' ? 1 : -1
        return memo
      }, {})
      query.sort(sort)
    }
    return query
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
      select: !isEmpty(this.selectedFields) ? this.selectedFields : undefined,
      distinct: !isEmpty(this.distinctFields) ? this.distinctFields : undefined,
      limit: this.limitNumber,
      orderBy: !isEmpty(this.ordering) ? this.ordering : undefined,
      conditions: !isEmpty(conditions) ? conditions : undefined
    }
  }

  // -------------------------------------------------------------------------------------------------------------------

  async all(): Promise<Collection<any>> {
    return this.get()
  }

  async get(): Promise<Collection<any>> {
    const query = this.passDataToMongooseQuery(this.getQuery()) as DocumentQuery<(Document & T)[] | null, Document & T>
    const result = await query.exec()
    if (result) {
      const eloquent = make<Eloquent<T>>(this.mongooseModel.modelName)
      return eloquent.newCollection(result)
    }
    return collect([])
  }

  async find(): Promise<any | null> {
    const query = this.passDataToMongooseQuery(this.getQuery(true))
    // change mongoose query operator from find to findOne if needed
    if (query['op'] === 'find') {
      query.findOne()
    }

    const result = await (query as DocumentQuery<(Document & T) | null, Document & T>).exec()
    if (result) {
      return make<Eloquent<T>>(this.mongooseModel.modelName).newInstance(result)
    }
    // tslint:disable-next-line
    return null
  }

  async pluck(value: string, key: string): Promise<Object> {
    this.select(value, key)
    const query = this.passDataToMongooseQuery(this.getQuery()) as DocumentQuery<(Document & T)[] | null, Document & T>
    const result: Array<Document & T> | null = await query.exec()
    if (result) {
      return result.reduce(function(memo: Object, item: Document) {
        memo[item[key]] = item[value]
        return memo
      }, {})
    }
    return {}
  }

  // async update(): Promise<any> {}
  // async delete(): Promise<any> {}
}
