import { IAutoload } from 'najs-binding'
import { snakeCase } from 'lodash'
import { plural } from 'pluralize'
import { Eloquent } from '../model/Eloquent'
import { EloquentMetadata } from '../model/EloquentMetadata'
import { IEloquentDriver } from './interfaces/IEloquentDriver'
import { Document, Model, Schema } from 'mongoose'
import { MongooseQueryBuilder } from '../query-builders/mongodb/MongooseQueryBuilder'
import { MongooseProvider } from '../facades/global/MongooseProviderFacade'
// import { SoftDelete } from '../v0.x/eloquent/mongoose/SoftDelete'

export class MongooseDriver<T extends Object = {}> implements IAutoload, IEloquentDriver {
  attributes: Document & T
  metadata: EloquentMetadata
  eloquentModel: Eloquent<T>
  mongooseModel: Model<Document & T>
  queryLogGroup: string
  modelName: string
  isGuarded: boolean

  constructor(model: Eloquent<T>, isGuarded: boolean) {
    this.eloquentModel = model
    this.modelName = model.getModelName()
    this.queryLogGroup = 'all'
    this.isGuarded = isGuarded
  }

  getClassName() {
    return 'NajsEloquent.MongooseDriver'
  }

  initialize(data?: T): void {
    this.metadata = EloquentMetadata.get(this.eloquentModel)
    this.initializeModelIfNeeded()
    this.mongooseModel = MongooseProvider.getMongooseInstance().model(this.modelName)
    if (data instanceof this.mongooseModel) {
      this.attributes = <Document & T>data
      return
    }

    this.attributes = new this.mongooseModel()
    if (typeof data === 'object') {
      if (this.isGuarded) {
        this.eloquentModel.fill(data)
      } else {
        this.attributes.set(data)
      }
    }
  }

  protected initializeModelIfNeeded() {
    // prettier-ignore
    if (MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
      return
    }

    const schema = new Schema(
      this.metadata.getSettingProperty('schema', {}),
      this.metadata.getSettingProperty('options', { collection: plural(snakeCase(this.modelName)) })
    )

    // timestamps
    // if (this.metadata.hasTimestamps()) {
    //   schema.set('timestamps', this.metadata.timestamps())
    // }

    // soft-deletes
    // if (this.metadata.hasSoftDeletes()) {
    //   schema.plugin(SoftDelete, this.metadata.softDeletes())
    // }

    MongooseProvider.createModelFromSchema(this.modelName, schema)
  }

  getRecord(): T {
    return this.attributes
  }

  getAttribute(name: string): any {
    return this.attributes[name]
  }

  setAttribute(name: string, value: any): boolean {
    this.attributes[name] = value
    return true
  }

  getId(): any {
    return this.attributes._id
  }

  setId(id: any): void {
    this.attributes._id = id
  }

  newQuery(): MongooseQueryBuilder<T> {
    return new MongooseQueryBuilder<T>(
      this.modelName,
      undefined
      // this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined
    ).setLogGroup(this.queryLogGroup)
  }

  // TODO: implementation
  toObject(): Object {
    return this.attributes
  }

  // TODO: implementation
  toJSON(): Object {
    return this.attributes
  }

  is(model: any): boolean {
    return this.attributes['_id'] === model['getId']()
  }

  formatAttributeName(name: string): string {
    return snakeCase(name)
  }

  getReservedNames(): string[] {
    return ['schema', 'collection', 'options']
  }

  getDriverProxyMethods() {
    return ['is', 'getId', 'setId', 'newQuery', 'touch', 'save', 'delete', 'forceDelete', 'restore', 'fresh']
  }

  getQueryProxyMethods() {
    return [
      // IBasicQuery
      'queryName',
      'select',
      'distinct',
      'orderBy',
      'orderByAsc',
      'orderByDesc',
      'limit',
      // IConditionQuery
      'where',
      'orWhere',
      'whereIn',
      'whereNotIn',
      'orWhereIn',
      'orWhereNotIn',
      'whereNull',
      'whereNotNull',
      'orWhereNull',
      'orWhereNotNull',
      // IFetchResultQuery
      'get',
      'all',
      'find',
      'first',
      'count',
      'pluck',
      'update',
      // 'delete', conflict to .getDriverProxyMethods() then it should be removed
      // 'restore', conflict to .getDriverProxyMethods() then it should be removed
      'execute'
    ]
  }

  touch() {
    if (this.metadata.hasTimestamps()) {
      const opts = this.metadata.timestamps()
      this.attributes.markModified(opts.updatedAt)
    }
  }

  async save(): Promise<any> {
    return this.attributes.save()
  }

  async delete(): Promise<any> {
    if (this.metadata.hasSoftDeletes()) {
      return this.attributes['delete']()
    }
    return this.attributes.remove()
  }

  async forceDelete(): Promise<any> {
    return this.attributes.remove()
  }

  async restore(): Promise<any> {
    if (this.metadata.hasSoftDeletes()) {
      return this.attributes['restore']()
    }
  }

  async fresh(): Promise<T | null> {
    if (this.attributes.isNew) {
      // tslint:disable-next-line
      return null
    }
    const query = this.newQuery()
    return query.where(query.getPrimaryKey(), this.attributes._id).first()
  }
}
