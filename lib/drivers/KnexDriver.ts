/// <reference path="../contracts/Driver.ts" />

import { NajsEloquent } from '../constants'
import { RecordBaseDriver } from './based/RecordDriverBase'

export class KnexDriver extends RecordBaseDriver {
  protected tableName: string
  protected primaryKeyName?: string
  protected isNewRecord: boolean

  constructor(model: NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelSetting) {
    super(model)

    this.isNewRecord = true
    this.tableName = model.getSettingProperty('table', this.formatRecordName())
  }

  initialize(model: NajsEloquent.Model.IModel<any>, isGuarded: boolean, data?: Object): void {}

  getClassName() {
    return NajsEloquent.Driver.KnexDriver
  }

  shouldBeProxied(key: string): boolean {
    return key !== 'table'
  }

  getRecordName(): string {
    return this.tableName
  }
}
