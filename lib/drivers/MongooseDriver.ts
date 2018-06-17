/// <reference path="../contracts/Driver.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../model/interfaces/IModelSetting.ts" />

import '../wrappers/MongooseQueryBuilderWrapper'
import '../query-builders/mongodb/MongooseQueryBuilder'
import { make } from 'najs-binding'
import { NajsEloquent } from '../constants'
import { MongooseProvider } from '../facades/global/MongooseProviderFacade'
import { SoftDelete } from './mongoose/SoftDelete'
import { Document, Model, Schema, SchemaDefinition, SchemaOptions } from 'mongoose'
import { isFunction } from 'lodash'
import { DriverBase } from './based/DriverBase'
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp

export class MongooseDriver<Record extends Object> extends DriverBase<Document & Record>
  implements Najs.Contracts.Eloquent.Driver<Record> {
  static className: string = NajsEloquent.Driver.MongooseDriver

  protected attributes: Document & Record
  protected queryLogGroup: string
  protected modelName: string
  protected mongooseModel: Model<Document & Record>
  protected schema: SchemaDefinition
  protected options: SchemaOptions
  protected softDeletesSetting?: NajsEloquent.Model.ISoftDeletesSetting
  protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter

  constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting) {
    super()
    this.modelName = model.getModelName()
    this.queryLogGroup = 'all'
    this.schema = model.getSettingProperty('schema', {})
    this.options = model.getSettingProperty('options', {})
    // we need softDeletesSetting to initialize softDeletes option in query builder
    if (model.hasSoftDeletes()) {
      this.softDeletesSetting = model.getSoftDeletesSetting()
    }
  }

  getClassName() {
    return NajsEloquent.Driver.MongooseDriver
  }

  initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: any): void {
    this.initializeModelIfNeeded(model)
    this.createAttributesByData(model, isGuarded, data)
  }

  protected initializeModelIfNeeded(model: NajsEloquent.Model.IModel<any>) {
    // prettier-ignore
    if (MongooseProvider.getMongooseInstance().modelNames().indexOf(this.modelName) !== -1) {
      return
    }

    const schema = this.getMongooseSchema(model)

    if (model.hasTimestamps()) {
      schema.set('timestamps', model.getTimestampsSetting())
    }

    if (model.hasSoftDeletes()) {
      this.softDeletesSetting = model.getSoftDeletesSetting()
      schema.plugin(SoftDelete, this.softDeletesSetting)
    }

    MongooseProvider.createModelFromSchema(this.modelName, schema)
  }

  protected getMongooseSchema(model: NajsEloquent.Model.IModel<any>): Schema {
    let schema: Schema | undefined = undefined
    if (isFunction(model['getSchema'])) {
      schema = model['getSchema']()
      Object.getPrototypeOf(schema).setupTimestamp = setupTimestampMoment
    }

    if (!schema || !(schema instanceof Schema)) {
      Schema.prototype['setupTimestamp'] = setupTimestampMoment
      schema = new Schema(this.schema, Object.assign({ collection: this.formatRecordName() }, this.options))
    }
    return schema
  }

  protected createAttributesByData(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: any) {
    this.mongooseModel = MongooseProvider.getMongooseInstance().model(this.modelName)
    if (data instanceof this.mongooseModel) {
      this.attributes = <Document & Record>data
      return
    }

    this.attributes = new this.mongooseModel()
    if (typeof data === 'object') {
      if (isGuarded) {
        model.fill(data)
      } else {
        this.attributes.set(data)
      }
    }
  }

  getRecordName(): string {
    return this.attributes ? this.attributes.collection.name : this.formatRecordName()
  }

  shouldBeProxied(key: string): boolean {
    if (key === 'schema' || key === 'options') {
      return false
    }
    return true
  }

  hasAttribute(name: string): boolean {
    return typeof this.schema[name] !== 'undefined'
  }

  getAttribute<T>(name: string): T {
    return this.attributes.get(name)
  }

  setAttribute<T>(name: string, value: T): boolean {
    this.attributes.set(name, value)
    return true
  }

  getPrimaryKeyName(): string {
    return '_id'
  }

  toObject(): Object {
    return this.attributes.toObject({ virtuals: true })
  }

  newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T> {
    return make<NajsEloquent.Wrapper.IQueryBuilderWrapper<T>>(NajsEloquent.Wrapper.MongooseQueryBuilderWrapper, [
      this.modelName,
      this.getRecordName(),
      make(NajsEloquent.QueryBuilder.MongooseQueryBuilder, [this.modelName, this.softDeletesSetting]),
      dataBucket
    ])
  }

  async delete(softDeletes: boolean): Promise<any> {
    if (softDeletes) {
      return this.attributes['delete']()
    }
    return this.attributes.remove()
  }

  async restore(): Promise<any> {
    return this.attributes['restore']()
  }

  async save(): Promise<any> {
    return this.attributes.save()
  }

  markModified(name: string): void {
    this.attributes.markModified(name)
  }

  isModified(name: string): boolean {
    return this.attributes.isModified(name)
  }

  getModified(): string[] {
    return this.attributes.modifiedPaths()
  }

  isNew(): boolean {
    return this.attributes.isNew
  }
}
