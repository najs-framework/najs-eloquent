import { Eloquent } from './Eloquent'
import { MongooseQueryBuilder } from '..//query-builders/MongooseQueryBuilder'
import { Document, Schema } from 'mongoose'
import collect, { Collection } from 'collect.js'

export abstract class EloquentMongoose<T> extends Eloquent<Document & T> {
  protected collection: string

  constructor(data?: Document & T | Object) {
    super(<any>data)
  }

  abstract getSchema(): Schema

  static Class() {
    return <any>EloquentMongoose
  }

  // -------------------------------------------------------------------------------------------------------------------

  protected isNativeRecord(data: Document & T | Object | undefined): boolean {
    return typeof data === 'object'
  }

  protected initializeAttributes(): void {
    this.attributes = <Document & T>{}
  }

  protected setAttributesByObject(nativeRecord: Object): void {
    this.attributes = <Document & T>nativeRecord || <Document & T>{}
  }

  protected setAttributesByNativeRecord(nativeRecord: Document & T): void {
    this.attributes = <Document & T>nativeRecord
  }

  protected getReservedPropertiesList() {
    return super.getReservedPropertiesList().concat(['collection'])
  }

  getAttribute(name: string): any {}

  setAttribute(name: string, value: any): boolean {
    return true
  }

  newQuery(): any {}

  newCollection(eloquent: Array<Document & T>): Collection<EloquentMongoose<T>> {
    return collect([])
  }

  toObject(): Object {
    return this.attributes
  }

  toJson(): Object {
    return this.attributes
  }

  is(model: EloquentMongoose<T>): boolean {
    return false
  }

  fireEvent(event: string): this {
    return this
  }

  // -------------------------------------------------------------------------------------------------------------------

  async save(): Promise<any> {}
  async delete(): Promise<any> {}
  async forceDelete(): Promise<any> {}
  async fresh(): Promise<any> {}

  // -------------------------------------------------------------------------------------------------------------------

  static select(): MongooseQueryBuilder {
    return new MongooseQueryBuilder('test')
  }
}
