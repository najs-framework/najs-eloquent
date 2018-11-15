/// <reference path="../contracts/MemoryDataSource.ts" />
/// <reference path="../definitions/model/IModel.ts" />

import { Record } from './Record'
import { RecordDataReader } from './RecordDataReader'
import { DataBuffer } from '../data/DataBuffer'

export abstract class RecordDataSourceBase extends DataBuffer<Record>
  implements Najs.Contracts.Eloquent.MemoryDataSource<Record> {
  protected modelName: string

  constructor(model: NajsEloquent.Model.IModel) {
    super(model.getPrimaryKeyName(), RecordDataReader)
    this.modelName = model.getModelName()
  }

  getModelName(): string {
    return this.modelName
  }

  abstract getClassName(): string
  abstract createPrimaryKeyIfNeeded(data: Record): string
  abstract read(): Promise<boolean>
  abstract write(): Promise<boolean>

  add(data: Record): this {
    this.createPrimaryKeyIfNeeded(data)

    return super.add(data)
  }

  remove(data: Record): this {
    this.createPrimaryKeyIfNeeded(data)

    return super.remove(data)
  }
}
