import { IQueryFetchResult } from '../interfaces/IQueryFetchResult'
// import { EloquentMongoose as Eloquent } from '../eloquent/EloquentMongoose'
// import { make } from 'najs'
import { collect, Collection } from 'collect.js'
import { Model, DocumentQuery, Mongoose } from 'mongoose'
import { QueryBuilder } from './QueryBuilder'

export class MongooseQueryBuilder<T = {}> extends QueryBuilder<T> implements IQueryFetchResult<T> {
  mongooseModel: Model<any>
  mongooseQuery: DocumentQuery<any, any>

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

  protected getQuery(): DocumentQuery<any, any> {
    return this.mongooseQuery
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
