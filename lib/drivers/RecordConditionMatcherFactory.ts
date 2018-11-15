/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />

import IConditionMatcherFactory = NajsEloquent.QueryBuilder.IConditionMatcherFactory
import SingleQueryConditionData = NajsEloquent.QueryBuilder.SingleQueryConditionData

import { register } from 'najs-binding'
import { RecordConditionMatcher } from './RecordConditionMatcher'
import { NajsEloquent as NajsEloquentClasses } from '../constants'

export class RecordConditionMatcherFactory implements IConditionMatcherFactory {
  static className: string = NajsEloquentClasses.Driver.Memory.RecordConditionMatcherFactory

  getClassName() {
    return NajsEloquentClasses.Driver.Memory.RecordConditionMatcherFactory
  }

  make(data: SingleQueryConditionData): RecordConditionMatcher {
    return new RecordConditionMatcher(data.field, data.operator, data.value)
  }

  transform(matcher: RecordConditionMatcher): RecordConditionMatcher {
    return matcher
  }
}
register(RecordConditionMatcherFactory, NajsEloquentClasses.Driver.Memory.RecordConditionMatcherFactory, true, true)
