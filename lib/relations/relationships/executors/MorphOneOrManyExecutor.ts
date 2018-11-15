/// <reference path="../../../definitions/data/IDataCollector.ts" />
/// <reference path="../../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../../definitions/query-builders/IConditionMatcher.ts" />
/// <reference path="../../../definitions/query-builders/IQueryBuilder.ts" />

import IDataCollector = NajsEloquent.Data.IDataCollector
import IDataReader = NajsEloquent.Data.IDataReader
import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder

import { DataConditionMatcher } from '../../../data/DataConditionMatcher'
import { IHasOneOrManyExecutor } from './HasOneOrManyExecutor'

export class MorphOneOrManyExecutor<T> implements IHasOneOrManyExecutor<T> {
  protected morphTypeValue: string
  protected targetMorphTypeName: string
  protected executor: IHasOneOrManyExecutor<T>

  constructor(executor: IHasOneOrManyExecutor<T>, targetMorphTypeName: string, typeValue: string) {
    this.executor = executor
    this.morphTypeValue = typeValue
    this.targetMorphTypeName = targetMorphTypeName
  }

  setCollector(collector: IDataCollector<any>, conditions: IConditionMatcher<any>[], reader: IDataReader<any>): this {
    conditions.unshift(new DataConditionMatcher(this.targetMorphTypeName, '=', this.morphTypeValue, reader))

    this.executor.setCollector(collector, conditions, reader)
    return this
  }

  setQuery(query: IQueryBuilder<any>): this {
    query.where(this.targetMorphTypeName, this.morphTypeValue)

    this.executor.setQuery(query)
    return this
  }

  executeCollector(): T | undefined | null {
    return this.executor.executeCollector()
  }

  getEmptyValue(): T | undefined {
    return this.executor.getEmptyValue()
  }

  executeQuery(): Promise<T | undefined | null> {
    return this.executor.executeQuery()
  }
}
