import { IBasicQueryGrammar } from '../interfaces/IBasicQueryGrammar'
import { IQueryFetchResult } from '../interfaces/IQueryFetchResult'
// import { EloquentMongoose as Eloquent } from '../eloquent/EloquentMongoose'
// import { make } from 'najs'
import { isEmpty, mapValues } from 'lodash'
import { collect, Collection } from 'collect.js'
import { Model, Document, DocumentQuery, Mongoose } from 'mongoose'
import { QueryBuilder } from './QueryBuilder'
import { MongodbConditionConverter } from './MongodbConditionConverter'

export type MongooseQuery<T> =
  | DocumentQuery<Document & T | null, Document & T>
  | DocumentQuery<(Document & T)[] | null, Document & T>

export class MongooseQueryBuilder<T = {}> extends QueryBuilder implements IBasicQueryGrammar<T>, IQueryFetchResult<T> {
  mongooseModel: Model<Document & T>
  mongooseQuery: MongooseQuery<T>
  hasMongooseQuery: boolean

  constructor(modelName: string) {
    super()
    const mongoose: Mongoose = this.getMongoose()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      throw new Error('Model ' + modelName + ' Not Found')
    }

    this.mongooseModel = mongoose.model(modelName)
  }

  protected getMongoose(): Mongoose {
    return <any>{}
  }

  protected getQuery(isFindOne: boolean = false): MongooseQuery<T> {
    if (!this.hasMongooseQuery) {
      const conditions = new MongodbConditionConverter(this.getConditions()).convert()
      this.mongooseQuery = isFindOne ? this.mongooseModel.findOne(conditions) : this.mongooseModel.find(conditions)

      if (this.selectedFields) {
        this.mongooseQuery.select(this.selectedFields.join(' '))
      }
      if (this.distinctFields) {
        this.mongooseQuery.distinct(this.distinctFields.join(' '))
      }
      if (this.limitNumber) {
        this.mongooseQuery.limit(this.limitNumber)
      }
      if (this.ordering && !isEmpty(this.ordering)) {
        const sort: Object = Object.assign({}, this.ordering)
        mapValues(sort, (val: string) => (val === 'asc' ? 1 : -1))
        this.mongooseQuery.sort(sort)
      }
      this.hasMongooseQuery = true
    }
    return this.mongooseQuery
  }

  native(handler: (native: Model<Document & T> | MongooseQuery<T>) => MongooseQuery<T>): IQueryFetchResult<T> {
    this.mongooseQuery = handler.call(undefined, this.isUsed ? this.getQuery() : this.mongooseModel)
    return this
  }

  toObject(): Object {
    return new MongodbConditionConverter(this.getConditions()).convert()
  }

  // -------------------------------------------------------------------------------------------------------------------

  async all(): Promise<Collection<T>>
  async all<R>(): Promise<Collection<R>> {
    return collect([])
    // const eloquent = make<Eloquent<T>>('')
    // const result: Eloquent<T>[] = await this.getQuery().exec()
    // return collect(eloquent.newCollection(result))
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
