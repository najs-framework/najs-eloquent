import { Eloquent } from './Eloquent'
import { MongooseQueryBuilder } from '..//query-builders/MongooseQueryBuilder'
import { Document, Schema } from 'mongoose'

export abstract class EloquentMongoose<T> extends Eloquent<Document & T> {
  collection: string

  constructor(data?: Document | Object) {
    super(data)
  }

  protected getReservedPropertiesList() {
    return super.getReservedPropertiesList().concat(['collection'])
  }

  protected setAttributesByNativeRecord(data: Document | Object | undefined): void {}

  async save(): Promise<any> {}
  async create(): Promise<any> {}
  async update(): Promise<any> {}
  async delete(): Promise<any> {}

  abstract getSchema(): Schema

  static select(): MongooseQueryBuilder {
    return new MongooseQueryBuilder('test')
  }
}
