/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />

import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher

import { Record } from './Record'
import { DataConditionMatcher } from '../data/DataConditionMatcher'
import { RecordDataReader } from './RecordDataReader'

export class RecordConditionMatcher extends DataConditionMatcher<Record> implements IConditionMatcher<Record> {
  constructor(field: string, operator: string, value: any) {
    super(field, operator, value, RecordDataReader)
  }

  toJSON(): object {
    return {
      field: this.field,
      operator: this.operator,
      value: this.value
    }
  }
}
