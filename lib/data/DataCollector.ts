/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/data/IDataBuffer.ts" />
/// <reference path="../definitions/data/IDataCollector.ts" />
/// <reference path="../definitions/query-builders/IConditionMatcher.ts" />
import IDataReader = NajsEloquent.Data.IDataReader
import IDataBuffer = NajsEloquent.Data.IDataBuffer
import IDataCollector = NajsEloquent.Data.IDataCollector
import IConditions = NajsEloquent.Data.IConditions
import IConditionMatcher = NajsEloquent.QueryBuilder.IConditionMatcher

import { eq, lt } from 'lodash'

export class DataCollector<T> implements IDataCollector<T> {
  protected dataBuffer: IDataBuffer<T>
  protected reader: IDataReader<T>
  protected limited?: number
  protected sortedBy?: Array<[string, string]>
  protected selected?: string[]
  protected conditions?: IConditions

  constructor(dataBuffer: IDataBuffer<T>, reader: IDataReader<T>) {
    this.dataBuffer = dataBuffer
    this.reader = reader
  }

  limit(value: number): this {
    this.limited = value

    return this
  }

  select(selectedFields: string[]): this {
    this.selected = selectedFields

    return this
  }

  orderBy(directions: Array<[string, string]>): this {
    this.sortedBy = directions

    return this
  }

  filterBy(conditions: IConditions): this {
    this.conditions = conditions

    return this
  }

  isMatch(item: T, conditions: IConditions): boolean {
    if (typeof conditions['$or'] !== 'undefined') {
      return this.isMatchAtLeastOneCondition(item, conditions['$or'])
    }

    if (typeof conditions['$and'] !== 'undefined') {
      return this.isMatchAllConditions(item, conditions['$and'])
    }

    return false
  }

  isMatchAtLeastOneCondition(item: T, conditions: Array<IConditions | IConditionMatcher<T>>): boolean {
    for (const matcherOrSubConditions of conditions) {
      if (typeof matcherOrSubConditions['isMatch'] === 'function') {
        if ((matcherOrSubConditions as IConditionMatcher<T>).isMatch(item)) {
          return true
        }
        continue
      }

      if (this.isMatch(item, matcherOrSubConditions)) {
        return true
      }
    }
    return false
  }

  isMatchAllConditions(item: T, conditions: Array<IConditions | IConditionMatcher<T>>): boolean {
    for (const matcherOrSubConditions of conditions) {
      if (typeof matcherOrSubConditions['isMatch'] === 'function') {
        if (!(matcherOrSubConditions as IConditionMatcher<T>).isMatch(item)) {
          return false
        }
        continue
      }

      if (!this.isMatch(item, matcherOrSubConditions)) {
        return false
      }
    }
    return true
  }

  hasFilterByConfig(): boolean {
    return typeof this.conditions !== 'undefined'
  }

  hasOrderByConfig(): boolean {
    return typeof this.sortedBy !== 'undefined' && this.sortedBy.length > 0
  }

  hasSelectedFieldsConfig(): boolean {
    return typeof this.selected !== 'undefined' && this.selected.length > 0
  }

  exec(): T[] {
    const filtered: T[] = []
    const shouldMatchItem = this.hasFilterByConfig()
    const shouldSortResult = this.hasOrderByConfig()
    const shouldPickFields = this.hasSelectedFieldsConfig()

    for (const item of this.dataBuffer) {
      if (shouldMatchItem && !this.isMatch(item, this.conditions!)) {
        continue
      }

      // Edge cases which happens if there is no sortedBy data
      if (!shouldSortResult) {
        filtered.push(shouldPickFields ? this.reader.pick(item, this.selected!) : item)

        // Edge case #1: the result is reach limited number the process should be stopped
        if (this.limited && filtered.length === this.limited) {
          return filtered
        }
        continue
      }

      // if there is a sorted data, always push the raw record
      filtered.push(item)
    }

    return shouldSortResult ? this.sortLimitAndSelectItems(filtered) : filtered
  }

  sortLimitAndSelectItems(items: T[]) {
    let result = items.sort((a, b) => this.compare(a, b, 0))

    if (this.limited) {
      result = result.slice(0, this.limited)
    }

    if (this.hasSelectedFieldsConfig()) {
      return result.map(item => this.reader.pick(item, this.selected!))
    }
    return result
  }

  compare(a: T, b: T, index: number): number {
    const key = this.sortedBy![index][0]
    const valueA = this.reader.getAttribute(a, key)
    const valueB = this.reader.getAttribute(b, key)

    const result = eq(valueA, valueB)
    if (result) {
      if (index + 1 >= this.sortedBy!.length) {
        return 0
      }
      return this.compare(a, b, index + 1)
    }

    const direction = this.sortedBy![index][1]
    const isLessThan = lt(valueA, valueB)
    if (isLessThan) {
      return direction === 'asc' ? -1 : 1
    }
    return direction === 'asc' ? 1 : -1
  }
}
