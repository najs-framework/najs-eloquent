/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />

import * as Lodash from 'lodash'

export class DataConditionMatcher<T extends object> implements NajsEloquent.QueryBuilder.IConditionMatcher<T> {
  protected field: string
  protected operator: string
  protected originalValue: any
  protected value: any
  protected reader: NajsEloquent.Data.IDataReader<T>

  constructor(field: string, operator: string, value: any, reader: NajsEloquent.Data.IDataReader<T>) {
    this.field = field
    this.operator = operator
    this.value = reader.toComparable(value)
    if (this.value !== value) {
      this.originalValue = value
    }
    this.reader = reader
  }

  isEqual(record: T): boolean {
    return Lodash.isEqual(this.reader.getAttribute(record, this.field), this.value)
  }

  isLessThan(record: T): boolean {
    return Lodash.lt(this.reader.getAttribute(record, this.field), this.value)
  }

  isLessThanOrEqual(record: T): boolean {
    return Lodash.lte(this.reader.getAttribute(record, this.field), this.value)
  }

  isGreaterThan(record: T): boolean {
    return Lodash.gt(this.reader.getAttribute(record, this.field), this.value)
  }

  isGreaterThanOrEqual(record: T): boolean {
    return Lodash.gte(this.reader.getAttribute(record, this.field), this.value)
  }

  isInArray(record: T): boolean {
    return Lodash.includes(this.value, this.reader.getAttribute(record, this.field))
  }

  isMatch(record: T): boolean {
    switch (this.operator) {
      case '=':
      case '==':
        return this.isEqual(record)

      case '!=':
      case '<>':
        return !this.isEqual(record)

      case '<':
        return this.isLessThan(record)

      case '<=':
      case '=<':
        return this.isLessThanOrEqual(record)

      case '>':
        return this.isGreaterThan(record)

      case '>=':
      case '=>':
        return this.isGreaterThanOrEqual(record)

      case 'in':
        return this.isInArray(record)

      case 'not-in':
        return !this.isInArray(record)

      default:
        return false
    }
  }
}
