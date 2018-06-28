/// <reference path="../contracts/Driver.ts" />

import '../wrappers/KnexQueryBuilderWrapper'
import '../query-builders/KnexQueryBuilder'
import { make } from 'najs-binding'
import { NajsEloquent } from '../constants'
import { RecordBaseDriver } from './based/RecordDriverBase'

export class KnexDriver extends RecordBaseDriver {
  protected tableName: string
  protected connectionName: string
  protected primaryKeyName: string

  constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting) {
    super(model)

    this.tableName = model.getSettingProperty('table', this.formatRecordName())
    this.connectionName = model.getSettingProperty('connection', 'default')
    this.primaryKeyName = model.getSettingProperty('primaryKey', 'id')
  }

  initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void {
    super.initialize(model, isGuarded, data)
  }

  newQuery<T>(dataBucket?: NajsEloquent.Relation.IRelationDataBucket): NajsEloquent.Wrapper.IQueryBuilderWrapper<T> {
    return make<NajsEloquent.Wrapper.IQueryBuilderWrapper<T>>(NajsEloquent.Wrapper.KnexQueryBuilderWrapper, [
      this.modelName,
      this.getRecordName(),
      make(NajsEloquent.QueryBuilder.KnexQueryBuilder, [
        this.tableName,
        this.primaryKeyName,
        this.connectionName,
        this.softDeletesSetting
      ]),
      dataBucket
    ])
  }

  getClassName() {
    return NajsEloquent.Driver.KnexDriver
  }

  shouldBeProxied(key: string): boolean {
    return key !== 'table' && key !== 'primaryKey' && key !== 'connection'
  }

  getRecordName(): string {
    return this.tableName
  }
}
