/// <reference path="../../../definitions/data/IDataCollector.ts" />
/// <reference path="../../../definitions/model/IModel.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../../definitions/collect.js/index.d.ts" />

import IModel = NajsEloquent.Model.IModel
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import Collection = CollectJs.Collection

import { make_collection } from '../../../util/factory'
import { HasOneOrManyExecutor } from './HasOneOrManyExecutor'

export class HasManyExecutor<T> extends HasOneOrManyExecutor<Collection<T>> {
  protected dataBucket: IRelationDataBucket
  protected targetModel: IModel

  async executeQuery(): Promise<Collection<T> | undefined | null> {
    return this.query.get() as any
  }

  executeCollector(): Collection<T> | undefined | null {
    return this.dataBucket.makeCollection(this.targetModel, this.collector.exec()) as any
  }

  getEmptyValue(): Collection<T> | undefined {
    return make_collection<T>([])
  }
}
