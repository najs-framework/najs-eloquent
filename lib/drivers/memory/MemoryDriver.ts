/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/features/IRecordManager.ts" />

import '../RecordManager'
import { register, make } from 'najs-binding'
import { DriverBase } from '../DriverBase'
import { Record } from '../Record'
import { NajsEloquent } from '../../constants'
import { MemoryQueryBuilderFactory } from './MemoryQueryBuilderFactory'
import { MemoryExecutorFactory } from './MemoryExecutorFactory'

export class MemoryDriver<T extends Record = Record> extends DriverBase<T> {
  protected recordManager: NajsEloquent.Feature.IRecordManager<T>
  static Name = 'memory'

  constructor() {
    super()

    this.recordManager = make(NajsEloquent.Feature.RecordManager, [make(MemoryExecutorFactory.className)])
  }

  getClassName() {
    return NajsEloquent.Driver.MemoryDriver
  }

  getRecordManager() {
    return this.recordManager
  }

  makeQueryBuilderFactory() {
    return make<MemoryQueryBuilderFactory>(MemoryQueryBuilderFactory.className)
  }
}
register(MemoryDriver, NajsEloquent.Driver.MemoryDriver)
