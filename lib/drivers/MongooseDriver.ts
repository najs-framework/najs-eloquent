import { IAutoload } from 'najs-binding'
import { snakeCase } from 'lodash'
import { Eloquent } from '../model/Eloquent'
import { EloquentMetadata } from '../model/EloquentMetadata'
import { IEloquentDriver } from './interfaces/IEloquentDriver'
import { Document, Model, Schema } from 'mongoose'
import { MongooseQueryBuilder } from '../query-builders/mongodb/MongooseQueryBuilder'

export class MongooseDriver<T extends Object = {}> implements IAutoload, IEloquentDriver {
  attributes: Document & T
  metadata: EloquentMetadata
  mongooseModel: Model<Document & T>
  mongooseSchema: Schema
  queryLogGroup: string
  modelName: string
  isGuarded: boolean

  constructor(model: Eloquent<T>, isGuarded: boolean) {
    this.metadata = EloquentMetadata.get(model)
    this.queryLogGroup = 'all'
    this.isGuarded = isGuarded
  }

  getClassName() {
    return 'NajsEloquent.MongooseProvider'
  }

  initialize(data?: T): void {
    // this.attributes = data || {}
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

  // TODO: implementation
  newQuery(): MongooseQueryBuilder<T> {
    return new MongooseQueryBuilder<T>(
      this.modelName,
      this.metadata.hasSoftDeletes() ? this.metadata.softDeletes() : undefined
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

  // TODO: implementation
  is(model: Eloquent<T>): boolean {
    return this.attributes['id'] === model['driver']['attributes']['id']
  }

  formatAttributeName(name: string): string {
    return snakeCase(name)
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

  getReservedNames(): string[] {
    return ['schema', 'collection', 'schemaOptions']
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
}
