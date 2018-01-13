import { EloquentBase, EloquentTimestamps, EloquentSoftDelete } from './EloquentBase'
import { OrderDirection, SubCondition } from '../interfaces/IBasicQueryGrammar'
import { IMongooseProvider } from '../interfaces/IMongooseProvider'
import { MongooseQueryBuilder } from '../query-builders/MongooseQueryBuilder'
import { Document, Schema, Model, Mongoose, model } from 'mongoose'
import collect, { Collection } from 'collect.js'
import { make } from 'najs'
import { NotFoundError } from '../errors/NotFoundError'
import { SoftDelete } from './mongoose/SoftDelete'
Schema.prototype['setupTimestamp'] = require('./mongoose/setupTimestamp').setupTimestamp

const DEFAULT_TIMESTAMPS: EloquentTimestamps = {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}

const DEFAULT_SOFT_DELETES: EloquentSoftDelete = {
  deletedAt: 'deleted_at',
  overrideMethods: false
}

export abstract class EloquentMongoose<T> extends EloquentBase<Document & T> {
  protected collection: string
  protected schema: Schema
  protected model: Model<Document & T>

  abstract getSchema(): Schema

  getId(): any {
    return this.attributes._id
  }

  setId(value: any): any {
    this.attributes._id = value
  }

  static Class(): any {
    return <any>EloquentMongoose
  }

  getModelName(): string {
    return this.getClassName()
  }

  // -------------------------------------------------------------------------------------------------------------------
  protected initializeModelIfNeeded(softDeletes: boolean | EloquentSoftDelete) {
    const modelName: string = this.getModelName()
    const mongoose: Mongoose = this.getMongoose()
    if (mongoose.modelNames().indexOf(modelName) === -1) {
      const schema = this.getSchema()
      const timestampsSettings = Object.getPrototypeOf(this).constructor.timestamps
      if (timestampsSettings) {
        schema.set('timestamps', timestampsSettings === true ? DEFAULT_TIMESTAMPS : timestampsSettings)
      }
      if (softDeletes) {
        schema.plugin(SoftDelete, softDeletes === true ? DEFAULT_SOFT_DELETES : softDeletes)
      }
      model<Document & T>(modelName, schema)
    }
  }

  protected initialize(data: Document & T | Object | undefined): EloquentMongoose<T> {
    this.initializeModelIfNeeded(Object.getPrototypeOf(this).constructor.softDeletes)
    this.model = this.getMongoose().model(this.getModelName())
    this.schema = this.model.schema
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

  newQuery(softDeletes?: boolean | EloquentSoftDelete): any {
    const softDeleteSettings = softDeletes || Object.getPrototypeOf(this).constructor.softDeletes
    this.initializeModelIfNeeded(softDeleteSettings)
    return new MongooseQueryBuilder(
      this.getModelName(),
      softDeleteSettings === true ? DEFAULT_SOFT_DELETES : softDeleteSettings
    )
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

  is(document: this): boolean {
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
    if (Object.getPrototypeOf(this).constructor.softDeletes) {
      return this.attributes['delete']()
    }
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
    return this.prototype.newQuery(this.softDeletes).queryName(name)
  }

  static select(field: string): MongooseQueryBuilder
  static select(fields: string[]): MongooseQueryBuilder
  static select(...fields: Array<string | string[]>): MongooseQueryBuilder
  static select(...fields: Array<string | string[]>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).select(...fields)
  }

  static distinct(field: string): MongooseQueryBuilder
  static distinct(fields: string[]): MongooseQueryBuilder
  static distinct(...fields: Array<string | string[]>): MongooseQueryBuilder
  static distinct(...fields: Array<string | string[]>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).distinct(...fields)
  }

  static orderBy(field: string): MongooseQueryBuilder
  static orderBy(field: string, direction: OrderDirection): MongooseQueryBuilder
  static orderBy(field: string, direction: OrderDirection = 'asc'): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orderBy(field, direction)
  }

  static orderByAsc(field: string): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orderByAsc(field)
  }

  static orderByDesc(field: string): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orderByDesc(field)
  }

  static limit(records: number): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).limit(records)
  }

  static where(conditionBuilder: SubCondition): MongooseQueryBuilder
  static where(field: string, value: any): MongooseQueryBuilder
  static where(field: string, operator: Operator, value: any): MongooseQueryBuilder
  static where(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).where(<any>arg0, arg1, arg2)
  }

  static orWhere(conditionBuilder: SubCondition): MongooseQueryBuilder
  static orWhere(field: string, value: any): MongooseQueryBuilder
  static orWhere(field: string, operator: Operator, value: any): MongooseQueryBuilder
  static orWhere(arg0: string | SubCondition, arg1?: Operator | any, arg2?: any): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orWhere(<any>arg0, arg1, arg2)
  }

  static whereIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).whereIn(field, values)
  }

  static whereNotIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).whereNotIn(field, values)
  }

  static orWhereIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orWhereIn(field, values)
  }

  static orWhereNotIn(field: string, values: Array<any>): MongooseQueryBuilder {
    return this.prototype.newQuery(this.softDeletes).orWhereNotIn(field, values)
  }

  static whereNull(field: string) {
    return this.prototype.newQuery(this.softDeletes).whereNull(field)
  }

  static whereNotNull(field: string) {
    return this.prototype.newQuery(this.softDeletes).whereNotNull(field)
  }

  static orWhereNull(field: string) {
    return this.prototype.newQuery(this.softDeletes).orWhereNull(field)
  }

  static orWhereNotNull(field: string) {
    return this.prototype.newQuery(this.softDeletes).orWhereNotNull(field)
  }

  static withTrash() {
    return this.prototype.newQuery(this.softDeletes).withTrash()
  }

  static onlyTrash() {
    return this.prototype.newQuery(this.softDeletes).onlyTrash()
  }

  static all(): Promise<any> {
    return this.prototype.newQuery(this.softDeletes).all()
  }

  static get(): Promise<any>
  static get(field: string): Promise<any>
  static get(fields: string[]): Promise<any>
  static get(...fields: Array<string | string[]>): Promise<any>
  static get(...fields: Array<string | string[]>): Promise<any> {
    return this.prototype
      .newQuery(this.softDeletes)
      .select(...fields)
      .get()
  }

  static find(id: any): Promise<any>
  static find(id?: any): Promise<any> {
    if (typeof id !== 'undefined') {
      const query = this.prototype.newQuery(this.softDeletes)
      return query.where(query.getPrimaryKey(), id).find()
    }
    return this.prototype.newQuery(this.softDeletes).find()
  }

  static pluck(value: string): Promise<Object>
  static pluck(value: string, key: string): Promise<Object>
  static pluck(value: string, key?: string): Promise<Object> {
    return this.prototype.newQuery(this.softDeletes).pluck(value, key)
  }

  static count(): Promise<number> {
    return this.prototype.newQuery(this.softDeletes).count()
  }

  static native(handler: (native: any) => any): Promise<any> {
    return this.prototype.newQuery(this.softDeletes).native(handler)
  }

  static findById(id: any): Promise<any> {
    return this.find(id)
  }

  static async findOrFail(id: any): Promise<any> {
    const value = await this.find(id)
    if (!value) {
      throw new NotFoundError(this.prototype.getClassName())
    }
    return value
  }
}
