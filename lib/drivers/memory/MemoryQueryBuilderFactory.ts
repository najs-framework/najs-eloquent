/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilderFactory.ts" />

import { register } from 'najs-binding'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { MemoryQueryBuilder } from './MemoryQueryBuilder'
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler'

export class MemoryQueryBuilderFactory implements NajsEloquent.QueryBuilder.IQueryBuilderFactory {
  static className: string = NajsEloquentClasses.Driver.Memory.MemoryQueryBuilderFactory

  getClassName() {
    return NajsEloquentClasses.Driver.Memory.MemoryQueryBuilderFactory
  }

  make(model: NajsEloquent.Model.IModel): MemoryQueryBuilder<any> {
    return new MemoryQueryBuilder(new MemoryQueryBuilderHandler(model))
  }
}
register(MemoryQueryBuilderFactory, NajsEloquentClasses.Driver.Memory.MemoryQueryBuilderFactory, true, true)
