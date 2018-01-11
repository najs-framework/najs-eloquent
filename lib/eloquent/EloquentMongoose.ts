import { EloquentBase } from './EloquentBase'
import { OrderDirection, SubCondition } from '../interfaces/IBasicQueryGrammar'
import { IMongooseProvider } from '../interfaces/IMongooseProvider'
import { MongooseQueryBuilder } from '../query-builders/MongooseQueryBuilder'
import { Document, Schema, Model, Mongoose, model } from 'mongoose'
import { make } from 'najs'
import collect, { Collection } from 'collect.js'

export abstract class EloquentMongoose<T> extends EloquentBase<Document & T> {
  protected collection: string
  protected schema: Schema
  protected model: Model<Document & T>

  abstract getSchema(): Schema

  static Class(): any {
    return <any>EloquentMongoose
  }

  getModelName(): string {
    return this.getClassName()
  }

  // -------------------------------------------------------------------------------------------------------------------
  protected initialize(data: Document & T | Object | undefined): EloquentMongoose<T> {
    if (!this.schema) {
      this.schema = this.getSchema()
    }
    const modelName: string = this.getModelName()
    const mongoose: Mongoose = this.getMongoose()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      model<Document & T>(this.getModelName(), this.schema)
    }
    this.model = mongoose.model(modelName)
    return super.initialize(data)
  }

  protected getMongoose(): Mongoose {
    return make<IMongooseProvider>('MongooseProvider').getMongooseInstance()
  }

  protected isNativeRecord(data: Document & T | Object | undefined): boolean {
    return data instanceof this.model
  }

  protected initializeAttributes(): void {
    this.attributes = new this.model()
  }

  protected setAttributesByObject(data: Object): void {
    this.attributes = new this.model()
    this.attributes.set(data)
  }

  protected setAttributesByNativeRecord(nativeRecord: Document & T): void {
    this.attributes = nativeRecord
  }

  protected getReservedPropertiesList() {
    return super
      .getReservedPropertiesList()
      .concat(Object.getOwnPropertyNames(EloquentMongoose.prototype), ['collection', 'model', 'schema'])
  }

  getAttribute(name: string): any {
    return this.attributes[name]
  }

  setAttribute(name: string, value: any): boolean {
    this.attributes[name] = value
    return true
  }

  newQuery(): any {
    return new MongooseQueryBuilder(this.getModelName())
  }

  newInstance(document?: Document & T | Object): EloquentMongoose<T> {
    const instance = make<EloquentMongoose<T>>(this.getClassName())
    return instance.initialize(document)
  }

  newCollection(dataset: Array<Document & T>): Collection<EloquentMongoose<T>> {
    return collect(dataset.map(item => this.newInstance(item)))
  }

  toObject(): Object {
    return Object.assign({}, this.attributes.toObject(), this.getAllValueOfAccessors())
  }

  toJson(): Object {
    const result = this.attributes.toJSON({
      getters: true,
      virtuals: true,
      versionKey: false
    })
    result['id'] = result['_id']
    delete result['_id']
    return Object.assign(result, this.getAllValueOfAccessors())
  }

  is(document: EloquentMongoose<T>): boolean {
    return this.attributes.equals(document.attributes)
  }

  fireEvent(event: string): this {
    this.model.emit(event, this)
    return this
  }

  // -------------------------------------------------------------------------------------------------------------------

  async save(): Promise<any> {
    return this.attributes.save()
  }

  async delete(): Promise<any> {
    return this.attributes.remove()
  }

  async forceDelete(): Promise<any> {
    return this.attributes.remove()
  }

  async fresh(): Promise<this | undefined | null> {
    if (this.attributes.isNew) {
      // tslint:disable-next-line
      return null
    }
    const query = this.newQuery()
    return query.where(query.getPrimaryKey(), this.attributes._id).find()
  }

  // -------------------------------------------------------------------------------------------------------------------
  static queryName(name: string): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getClassName())
  }

  static select(field: string): MongooseQueryBuilder
  static select(fields: string[]): MongooseQueryBuilder
  static select(...fields: Array<string | string[]>): MongooseQueryBuilder
  static select(...fields: Array<string | string[]>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).select(...fields)
  }

  static distinct(field: string): MongooseQueryBuilder
  static distinct(fields: string[]): MongooseQueryBuilder
  static distinct(...fields: Array<string | string[]>): MongooseQueryBuilder
  static distinct(...fields: Array<string | string[]>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).distinct(...fields)
  }

  static orderBy(field: string): MongooseQueryBuilder
  static orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder
  static orderBy(field: string, direction: OrderDirection = 'asc'): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orderBy(field, direction)
  }

  static orderByAsc(field: string): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orderByAsc(field)
  }

  static orderByDesc(field: string): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orderByDesc(field)
  }

  static limit(records: number): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).limit(records)
  }

  static where(conditionBuilder: SubCondition): MongooseQueryBuilder
  static where(field: string, value: any): MongooseQueryBuilder
  static where(field: string, operator: Operator, value: any): MongooseQueryBuilder
  static where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).where(<any>arg0, arg1, arg2)
  }

  static orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder
  static orWhere(field: string, value: any): MongooseQueryBuilder
  static orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder
  static orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orWhere(<any>arg0, arg1, arg2)
  }

  static whereIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).whereIn(field, values)
  }

  static whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).whereNotIn(field, values)
  }

  static orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orWhereIn(field, values)
  }

  static orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return new MongooseQueryBuilder(this.prototype.getModelName()).orWhereNotIn(field, values)
  }

  static all(): Promise<any> {
    return new MongooseQueryBuilder(this.prototype.getModelName()).all()
  }

  static get(): Promise<any>
  static get(field: string): Promise<any>
  static get(fields: string[]): Promise<any>
  static get(...fields: Array<string | string[]>): Promise<any>
  static get(...fields: Array<string | string[]>): Promise<any> {
    return new MongooseQueryBuilder(this.prototype.getModelName()).select(...fields).get()
  }

  static find(id: any): Promise<any>
  static find(id?: any): Promise<any> {
    if (typeof id !== 'undefined') {
      const query = new MongooseQueryBuilder(this.prototype.getModelName())
      return query.where(query.getPrimaryKey(), id).find()
    }
    return new MongooseQueryBuilder(this.prototype.getModelName()).find()
  }
}
