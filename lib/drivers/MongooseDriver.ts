import { IAutoload } from 'najs-binding'
import { isFunction, snakeCase } from 'lodash'
import { plural } from 'pluralize'
import { Eloquent } from '../model/Eloquent'
import { EloquentMetadata } from '../model/EloquentMetadata'
import { IEloquentDriver } from './interfaces/IEloquentDriver'
import { Document, Model, Schema } from 'mongoose'
import { MongooseQueryBuilder } from '../query-builders/mongodb/MongooseQueryBuilder'
import { MongooseProvider } from '../facades/global/MongooseProviderFacade'
import { SoftDelete } from '../v0.x/eloquent/mongoose/SoftDelete'

export class MongooseDriver<T extends Object = {}> implements IAutoload, IEloquentDriver {
  protected attributes: Document & T
  protected metadata: EloquentMetadata
  protected eloquentModel: Eloquent<T>
  protected mongooseModel: Model<Document & T>
  protected queryLogGroup: string
  protected modelName: string
  protected isGuarded: boolean

  constructor(model: Eloquent<T>, isGuarded: boolean) {
    this.eloquentModel = model
    this.modelName = model.getModelName()
    this.queryLogGroup = 'all'
    this.isGuarded = isGuarded
  }

  getClassName() {
    return 'NajsEloquent.MongooseDriver'
  }

  initialize(data?: any): void {
    this.metadata = EloquentMetadata.get(this.eloquentModel)
    this.initializeModelIfNeeded()
    this.createAttributesByData(data)
  }

  protected initializeModelIfNeeded() {
    // prettier-ignore
    if (MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
      return
    }

    const schema = this.getMongooseSchema()

    if (this.metadata.hasTimestamps()) {
      schema.set('timestamps', this.metadata.timestamps())
    }

    if (this.metadata.hasSoftDeletes()) {
      schema.plugin(SoftDelete, this.metadata.softDeletes())
    }

    MongooseProvider.createModelFromSchema(this.modelName, schema)
  }

  protected getMongooseSchema(): Schema {
    let schema: Schema | undefined = undefined
    if (isFunction(this.eloquentModel['getSchema'])) {
      schema = this.eloquentModel['getSchema']()
    }

    if (!schema || !(schema instanceof Schema)) {
      schema = new Schema(
        this.metadata.getSettingProperty('schema', {}),
        Object.assign(
          { collection: plural(snakeCase(this.modelName)) },
          this.metadata.getSettingProperty('options', {})
        )
      )
    }
    return schema
  }

  protected createAttributesByData(data?: any) {
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
      this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined
    ).setLogGroup(this.queryLogGroup)
  }

  toObject(): Object {
    return this.attributes.toObject()
  }

  toJSON(): Object {
    const data = this.toObject()
    return Object.getOwnPropertyNames(data).reduce((memo, name) => {
      const key = name === '_id' ? 'id' : name
      if (this.eloquentModel.isVisible(key)) {
        memo[key] = data[name]
      }
      return memo
    }, {})
  }

  is(model: any): boolean {
    return this.attributes['_id'] === model['getId']()
  }

  formatAttributeName(name: string): string {
    return snakeCase(name)
  }

  getReservedNames(): string[] {
    return ['schema', 'collection', 'options', 'getSchema']
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
    return this.eloquentModel
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
