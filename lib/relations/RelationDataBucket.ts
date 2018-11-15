/// <reference path="../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../definitions/collect.js/index.d.ts" />

import Model = NajsEloquent.Model.IModel
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import IRelationDataBucketMetadata = NajsEloquent.Relation.IRelationDataBucketMetadata
import Autoload = Najs.Contracts.Autoload
import { register, make, getClassName } from 'najs-binding'
import { NajsEloquent as NajsEloquentClasses } from '../constants'
import { relationFeatureOf } from '../util/accessors'
import { DataBuffer } from '../data/DataBuffer'
import { make_collection } from '../util/factory'

export class RelationDataBucket implements Autoload, IRelationDataBucket {
  protected bucket: {
    [key in string]: {
      data: DataBuffer<object>
      meta: {
        loaded: string[]
      }
    }
  }

  constructor() {
    this.bucket = {}
  }

  getClassName(): string {
    return NajsEloquentClasses.Relation.RelationDataBucket
  }

  add(model: Model): this {
    this.getDataOf(model).add(relationFeatureOf(model).getRawDataForDataBucket(model))

    return this
  }

  makeModel<M extends Model = Model>(model: M, data: any): M {
    const instance = make<M>(getClassName(model), [data, false])

    relationFeatureOf(instance).setDataBucket(instance, this as any)
    return instance
  }

  makeCollection<M extends Model = Model>(model: M, data: any[]): CollectJs.Collection<M> {
    return make_collection(data, item => this.makeModel(model, item))
  }

  getDataOf<M extends Model = Model>(model: M): DataBuffer<object> {
    return this.bucket[this.createKey(model)].data
  }

  getMetadataOf(model: Model): IRelationDataBucketMetadata {
    return this.bucket[this.createKey(model)].meta
  }

  createKey(model: Model): string {
    const key = relationFeatureOf(model).createKeyForDataBucket(model)
    if (typeof this.bucket[key] === 'undefined') {
      this.bucket[key] = {
        data: new DataBuffer(model.getPrimaryKeyName(), relationFeatureOf(model).getDataReaderForDataBucket()),
        meta: {
          loaded: []
        }
      }
    }
    return key
  }
}
register(RelationDataBucket, NajsEloquentClasses.Relation.RelationDataBucket)
