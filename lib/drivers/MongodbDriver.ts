/// <reference types="najs-event" />
/// <reference path="../contracts/Driver.ts" />

import '../wrappers/MongodbQueryBuilderWrapper'
import '../query-builders/mongodb/MongodbQueryBuilder'
import { NajsEloquent } from '../constants'
import { Record } from '../model/Record'
import { RecordBaseDriver } from './based/RecordDriverBase'
import { MongodbProviderFacade } from '../facades/global/MongodbProviderFacade'
import { Collection } from 'mongodb'
import { make } from 'najs-binding'
import * as Moment from 'moment'

export class MongodbDriver extends RecordBaseDriver implements Najs.Contracts.Eloquent.Driver<Record> {
  protected collection: Collection

  protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter

  getClassName() {
    return NajsEloquent.Driver.MongodbDriver
  }

  initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void {
    this.collection = MongodbProviderFacade.getDatabase().collection(this.formatRecordName())

    if (data instanceof Record) {
      this.attributes = data
      return
    }

    if (typeof data === 'object') {
      if (isGuarded) {
        this.attributes = new Record()
        model.fill(data)
      } else {
        this.attributes = new Record(data)
      }
    } else {
      this.attributes = new Record()
    }
  }

  shouldBeProxied(key: string): boolean {
    return key !== 'options' && key !== 'schema'
  }

  getRecordName(): string {
    return this.collection.collectionName
  }

  getPrimaryKeyName(): string {
    return '_id'
  }

  isNew(): boolean {
    return typeof this.attributes.getAttribute(this.getPrimaryKeyName()) === 'undefined'
  }

  newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T> {
    return make<NajsEloquent.Wrapper.IQueryBuilderWrapper<T>>(NajsEloquent.Wrapper.MongodbQueryBuilderWrapper, [
      this.modelName,
      this.getRecordName(),
      make(NajsEloquent.QueryBuilder.MongodbQueryBuilder, [
        this.modelName,
        this.collection,
        this.softDeletesSetting,
        this.timestampsSetting,
        this.getPrimaryKeyName()
      ]),
      dataBucket
    ])
  }

  async delete(softDeletes: boolean): Promise<any> {
    if (softDeletes && this.softDeletesSetting) {
      this.setAttribute(this.softDeletesSetting.deletedAt, Moment().toDate())
      return this.save(false)
    }

    if (!softDeletes && !this.isNew()) {
      const primaryKey = this.getPrimaryKeyName()
      return this.collection.deleteOne({ [primaryKey]: this.attributes.getAttribute(primaryKey) })
    }
  }

  async restore(): Promise<any> {
    if (!this.isNew() && this.softDeletesSetting) {
      // tslint:disable-next-line
      this.setAttribute(this.softDeletesSetting.deletedAt, null)
      return this.save(false)
    }
  }

  async save(fillData: boolean = true): Promise<any> {
    if (fillData) {
      const isNew = this.isNew()

      if (this.timestampsSetting) {
        this.setAttribute(this.timestampsSetting.updatedAt, Moment().toDate())

        if (isNew) {
          this.setAttributeIfNeeded(this.timestampsSetting.createdAt, Moment().toDate())
        }
      }

      if (this.softDeletesSetting) {
        // tslint:disable-next-line
        this.setAttributeIfNeeded(this.softDeletesSetting.deletedAt, null)
      }
    }

    return new Promise((resolve, reject) => {
      this.collection.save(this.attributes.toObject(), function(error, result) {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }

  setAttributeIfNeeded(attribute: string, value: any) {
    if (typeof this.attributes.getAttribute(attribute) === 'undefined') {
      this.attributes.setAttribute(attribute, value)
    }
  }
}
