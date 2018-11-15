/// <reference path="../../definitions/driver/IExecutorFactory.ts" />
/// <reference path="../../definitions/features/IRecordExecutor.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />

import IModel = NajsEloquent.Model.IModel

import { register } from 'najs-binding'
import { Record } from '../Record'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { MemoryRecordExecutor } from './MemoryRecordExecutor'
import { MemoryQueryExecutor } from './MemoryQueryExecutor'
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler'
import { MemoryQueryLog } from './MemoryQueryLog'
import { MemoryDataSourceProvider } from '../../facades/global/MemoryDataSourceProviderFacade'

export class MemoryExecutorFactory implements NajsEloquent.Driver.IExecutorFactory {
  static className: string = NajsEloquentClasses.Driver.Memory.MemoryExecutorFactory

  makeRecordExecutor<T extends Record>(model: IModel, record: T): MemoryRecordExecutor {
    return new MemoryRecordExecutor(model, record, this.getDataSource(model), this.makeLogger())
  }

  makeQueryExecutor(handler: MemoryQueryBuilderHandler): any {
    return new MemoryQueryExecutor(handler, this.getDataSource(handler.getModel()), this.makeLogger())
  }

  getClassName() {
    return NajsEloquentClasses.Driver.Memory.MemoryExecutorFactory
  }

  getDataSource(model: IModel) {
    return MemoryDataSourceProvider.create(model)
  }

  makeLogger(): MemoryQueryLog {
    return new MemoryQueryLog()
  }
}
register(MemoryExecutorFactory, NajsEloquentClasses.Driver.Memory.MemoryExecutorFactory, true, true)
