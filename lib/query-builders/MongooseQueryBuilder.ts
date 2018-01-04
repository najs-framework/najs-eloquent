import { collect, Collection } from 'collect.js'
import { IQueryFetchResult } from '../interfaces/IQueryFetchResult'
import { EloquentMongoose as Eloquent } from '../eloquent/EloquentMongoose'
import { Model, DocumentQuery } from 'mongoose'

export class MongooseQueryBuilder<T = {}> implements IQueryFetchResult<T> {
  model: Model<any>
  query: DocumentQuery<any, any>

  constructor(modelName: string) {}

  protected getQuery(): DocumentQuery<any, any> {
    return this.query
  }

  async all(): Promise<Collection<T>>
  async all<R>(): Promise<Collection<R>> {
    const result: Eloquent<T>[] = await this.getQuery().exec()
    return collect(<any>result.map(item => item))
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
