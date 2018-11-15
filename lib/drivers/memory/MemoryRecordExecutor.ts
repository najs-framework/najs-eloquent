/// <reference path="../../contracts/MemoryDataSource.ts" />
/// <reference path="../../definitions/model/IModel.ts" />

import Model = NajsEloquent.Model.IModel
import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource

import { DefaultConvention } from '../../query-builders/shared/DefaultConvention'
import { RecordExecutorBase } from '../RecordExecutorBase'
import { MemoryQueryLog } from './MemoryQueryLog'
import { Record } from '../Record'

export class MemoryRecordExecutor extends RecordExecutorBase {
  protected dataSource: MemoryDataSource<Record>
  protected logger: MemoryQueryLog

  constructor(model: Model, record: Record, dataSource: MemoryDataSource<Record>, logger: MemoryQueryLog) {
    super(model, record, new DefaultConvention())
    this.dataSource = dataSource
    this.logger = logger
  }

  async saveRecord<R = any>(action: string): Promise<R> {
    this.logRaw('add', this.record.toObject()).action(`${this.model.getModelName()}.${action}()`)

    return this.shouldExecute()
      ? this.dataSource
          .add(this.record)
          .write()
          .then(success => {
            return this.logger.end({
              ok: success
            })
          })
      : this.logger.end({})
  }

  async createRecord<R = any>(action: string): Promise<R> {
    return this.saveRecord(action)
  }

  async updateRecord<R = any>(action: string): Promise<R> {
    return this.saveRecord(action)
  }

  async hardDeleteRecord<R = any>(): Promise<R> {
    this.logRaw('remove', this.record.toObject()).action(`${this.model.getModelName()}.hardDelete()`)

    return this.shouldExecute()
      ? this.dataSource
          .remove(this.record)
          .write()
          .then(success => {
            return this.logger.end({
              ok: success
            })
          })
      : this.logger.end({})
  }

  logRaw(func: string, data: any): MemoryQueryLog {
    return this.logger.raw(this.dataSource.getClassName(), `.${func}(`, data, ').write()')
  }
}
