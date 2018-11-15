/// <reference path="../../contracts/MemoryDataSource.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryExecutor.ts" />

import MemoryDataSource = Najs.Contracts.Eloquent.MemoryDataSource

import { isEmpty } from 'lodash'
import { make } from 'najs-binding'
import { RecordConditionMatcherFactory } from '../RecordConditionMatcherFactory'
import { BasicQueryConverter } from '../../query-builders/shared/BasicQueryConverter'
import { Record } from '../Record'
import { ExecutorBase } from '../ExecutorBase'
import { MemoryQueryLog, IUpdateRecordInfo } from './MemoryQueryLog'
import { MemoryQueryBuilderHandler } from './MemoryQueryBuilderHandler'
import { BasicQuery } from '../../query-builders/shared/BasicQuery'
import { ExecutorUtils } from '../../query-builders/shared/ExecutorUtils'
import { MomentProvider } from '../../facades/global/MomentProviderFacade'

export class MemoryQueryExecutor extends ExecutorBase implements NajsEloquent.QueryBuilder.IQueryExecutor {
  protected queryHandler: MemoryQueryBuilderHandler
  protected dataSource: MemoryDataSource<Record>
  protected basicQuery: BasicQuery
  protected logger: MemoryQueryLog

  constructor(queryHandler: MemoryQueryBuilderHandler, dataSource: MemoryDataSource<Record>, logger: MemoryQueryLog) {
    super()
    this.queryHandler = queryHandler
    this.dataSource = dataSource
    this.basicQuery = queryHandler.getBasicQuery()
    this.logger = logger.name(this.queryHandler.getQueryName())
  }

  async get(): Promise<object[]> {
    const collector = this.makeCollector()
    const result = this.shouldExecute() ? await this.collectResult(collector) : []
    return this.logger
      .raw('.exec()')
      .action('get')
      .end(result)
  }

  async first(): Promise<object | undefined> {
    const collector = this.makeCollector().limit(1)
    const result = this.shouldExecute() ? await this.collectResult(collector) : undefined
    this.logger
      .raw('.limit(1).exec()')
      .action('first')
      .end(result ? result[0] : undefined)

    return result && result.length > 0 ? result[0] : undefined
  }

  async count(): Promise<number> {
    if (this.basicQuery.getSelect()) {
      this.basicQuery.clearSelect()
    }
    if (!isEmpty(this.basicQuery.getOrdering())) {
      this.basicQuery.clearOrdering()
    }

    const collector = this.makeCollector()
    const result = this.shouldExecute() ? await this.collectResult(collector) : []
    return this.logger
      .raw('.exec()')
      .action('count')
      .end(result.length)
  }

  async update(data: object): Promise<any> {
    const collector = this.makeCollector()
    const records = this.shouldExecute() ? await this.collectResult(collector) : []

    if (this.queryHandler.hasTimestamps()) {
      data[this.queryHandler.getTimestampsSetting().updatedAt] = MomentProvider.make().toDate()
    }

    if (records.length === 0) {
      return this.logger
        .raw('.exec() >> empty, do nothing')
        .action('update')
        .end(true)
    }

    this.logger.raw('.exec() >> update records >> dataSource.write()').action('update')
    return await this.updateRecordsByData(records, data)
  }

  async delete(): Promise<any> {
    const collector = this.makeCollector()
    if (!collector.hasFilterByConfig()) {
      return false
    }

    const records = this.shouldExecute() ? await this.collectResult(collector) : []
    if (records.length === 0) {
      return this.logger
        .raw('.exec() >> empty, do nothing')
        .action('delete')
        .end(true)
    }

    this.logger.raw('.exec() >> delete records >> dataSource.write()').action('delete')
    for (const record of records) {
      this.dataSource.remove(record)
    }
    return this.logger.end(await this.dataSource.write())
  }

  async restore(): Promise<any> {
    if (!this.queryHandler.hasSoftDeletes()) {
      return false
    }

    const collector = this.makeCollector()
    if (!collector.hasFilterByConfig()) {
      return false
    }

    const records = this.shouldExecute() ? await this.collectResult(collector) : []

    if (records.length === 0) {
      return this.logger
        .raw('.exec() >> empty, do nothing')
        .action('restore')
        .end(true)
    }

    const fieldName = this.queryHandler.getSoftDeletesSetting().deletedAt
    const data = { [fieldName]: this.queryHandler.getQueryConvention().getNullValueFor(fieldName) }

    this.logger.raw('.exec() >> update records >> dataSource.write()').action('restore')
    return await this.updateRecordsByData(records, data)
  }

  async execute(): Promise<any> {
    return this.get()
  }

  async updateRecordsByData(records: Record[], data: object) {
    let shouldWrite = false
    for (const record of records) {
      const info = this.getUpdateRecordInfo(record, data)
      if (info.modified) {
        shouldWrite = true
        this.dataSource.add(record)
      }
      this.logger.updateRecordInfo(info)
    }
    return this.logger.end(shouldWrite ? await this.dataSource.write() : true)
  }

  getUpdateRecordInfo(record: Record, data: object): IUpdateRecordInfo {
    const info: IUpdateRecordInfo = {
      origin: Object.assign({}, record.toObject()),
      modified: false,
      updated: record.toObject()
    }

    record.clearModified()
    for (const name in data) {
      record.setAttribute(name, data[name])
    }
    info.modified = record.getModified().length > 0
    return info
  }

  async collectResult(collector: NajsEloquent.Data.IDataCollector<Record>): Promise<Record[]> {
    await this.dataSource.read()

    return collector.exec()
  }

  makeCollector() {
    const collector = this.dataSource.getCollector()

    this.logger
      .dataSource(this.dataSource)
      .raw(`MemoryDataSourceProvider.create("${this.queryHandler.getModel().getModelName()}").getCollector()`)

    const limit = this.basicQuery.getLimit()
    if (limit) {
      collector.limit(limit)
      this.logger.queryBuilderData('limit', limit).raw('.limit(', limit, ')')
    }

    const ordering = Array.from(this.basicQuery.getOrdering().entries())
    if (ordering && ordering.length > 0) {
      collector.orderBy(ordering)
      this.logger.queryBuilderData('ordering', ordering).raw('.orderBy(', JSON.stringify(ordering), ')')
    }

    const selected = this.basicQuery.getSelect()
    if (!isEmpty(selected)) {
      collector.select(selected!)
      this.logger.queryBuilderData('select', selected).raw('.select(', selected, ')')
    }

    const conditions = this.getFilterConditions()
    if (!isEmpty(conditions)) {
      collector.filterBy(conditions)
      this.logger.queryBuilderData('conditions', this.basicQuery.getRawConditions()).raw('.filterBy(', conditions, ')')
    }

    return collector
  }

  getFilterConditions(): object {
    ExecutorUtils.addSoftDeleteConditionIfNeeded(this.queryHandler)

    const converter = new BasicQueryConverter(
      this.basicQuery,
      make<RecordConditionMatcherFactory>(RecordConditionMatcherFactory.className)
    )
    return converter.getConvertedQuery()
  }
}
