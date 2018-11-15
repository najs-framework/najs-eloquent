/// <reference path="../../contracts/MemoryDataSource.ts" />
import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource
import { Record } from '../Record'
import { QueryLogBase, IQueryLogData } from '../QueryLogBase'

export interface IMemoryLogData extends IQueryLogData {
  dataSource?: string
  records?: IUpdateRecordInfo[]
}
export interface IUpdateRecordInfo {
  origin: object
  modified: boolean
  updated: object
}

export class MemoryQueryLog extends QueryLogBase<IMemoryLogData> {
  getDefaultData(): IMemoryLogData {
    return this.getEmptyData()
  }

  dataSource(ds: MemoryDataSource<Record>): this {
    this.data.dataSource = ds.getClassName()

    return this
  }

  updateRecordInfo(info: IUpdateRecordInfo): this {
    if (typeof this.data.records === 'undefined') {
      this.data.records = []
    }
    this.data.records.push(info)

    return this
  }
}
