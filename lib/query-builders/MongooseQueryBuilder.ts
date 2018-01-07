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
    const eloquent = make<Eloquent<T>>(this.mongooseModel.modelName)
    if (!result) {
      return collect([])
    }
    return eloquent.newCollection(result)
  }

  // async get(): Promise<Collection<Eloquent<Document>>> {
  //   return collect([])
  // }

  // async find(): Promise<Eloquent<Document> | null> {
  //   // tslint:disable-next-line
  //   return null
  // }

  // async pluck(): Promise<Object> {
  //   return {}
  // }

  // async update(): Promise<any> {}
  // async delete(): Promise<any> {}
}
