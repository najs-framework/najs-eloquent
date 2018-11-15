/// <reference path="../definitions/features/IRecordExecutor.ts" />
/// <reference path="../definitions/query-builders/IConvention.ts" />

import IConvention = NajsEloquent.QueryBuilder.IConvention
import Model = NajsEloquent.Model.IModel
import { Record } from './Record'
import { ExecutorBase } from './ExecutorBase'
import { MomentProvider } from '../facades/global/MomentProviderFacade'

export abstract class RecordExecutorBase extends ExecutorBase implements NajsEloquent.Feature.IRecordExecutor {
  protected model: NajsEloquent.Model.IModel
  protected record: Record
  protected convention: IConvention

  constructor(model: Model, record: Record, convention: IConvention) {
    super()
    this.model = model
    this.record = record
    this.convention = convention
  }

  abstract createRecord<T>(action: string): Promise<T>
  abstract updateRecord<T>(action: string): Promise<T>
  abstract hardDeleteRecord<T>(): Promise<T>

  fillData(isCreate: boolean) {
    this.fillTimestampsData(isCreate)
    this.fillSoftDeletesData()
  }

  fillTimestampsData(isCreate: boolean) {
    const timestampFeature = this.model.getDriver().getTimestampsFeature()

    if (timestampFeature.hasTimestamps(this.model)) {
      const timestampSettings = timestampFeature.getTimestampsSetting(this.model)

      this.record.setAttribute(
        this.convention.formatFieldName(timestampSettings.updatedAt),
        MomentProvider.make().toDate()
      )
      if (isCreate) {
        this.setAttributeIfNeeded(
          this.convention.formatFieldName(timestampSettings.createdAt),
          MomentProvider.make().toDate()
        )
      }
    }
  }

  fillSoftDeletesData() {
    const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature()

    if (softDeletesFeature.hasSoftDeletes(this.model)) {
      const softDeleteSettings = softDeletesFeature.getSoftDeletesSetting(this.model)
      this.setAttributeIfNeeded(
        this.convention.formatFieldName(softDeleteSettings.deletedAt),
        this.convention.getNullValueFor(softDeleteSettings.deletedAt)
      )
    }
  }

  setAttributeIfNeeded(attribute: string, value: any) {
    if (typeof this.record.getAttribute(attribute) === 'undefined') {
      this.record.setAttribute(attribute, value)
    }
  }

  async create<R = any>(shouldFillData: boolean = true, action: string = 'create'): Promise<R> {
    if (shouldFillData) {
      this.fillData(true)
    }

    const result = this.createRecord<R>(action)
    this.record.clearModified()
    return result
  }

  async update<R = any>(shouldFillData: boolean = true, action: string = 'update'): Promise<R> {
    if (!this.hasPrimaryKey()) {
      return false as any
    }

    if (shouldFillData) {
      this.fillData(false)
    }

    if (!this.hasModifiedData()) {
      return false as any
    }

    const result = this.updateRecord<R>(action)
    this.record.clearModified()
    return result
  }

  async softDelete<R = any>(): Promise<R> {
    const isNew = this.model.isNew()
    this.fillTimestampsData(isNew)

    const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature()
    this.record.setAttribute(
      this.convention.formatFieldName(softDeletesFeature.getSoftDeletesSetting(this.model).deletedAt),
      MomentProvider.make().toDate()
    )

    return isNew ? this.create(false, 'softDelete') : this.update(false, 'softDelete')
  }

  async hardDelete<R = any>(): Promise<R> {
    if (!this.hasPrimaryKey()) {
      return false as any
    }

    const result = this.hardDeleteRecord<R>()
    this.record.clearModified()
    return result
  }

  async restore<R = any>(): Promise<R> {
    const softDeletesFeature = this.model.getDriver().getSoftDeletesFeature()
    const fieldName = softDeletesFeature.getSoftDeletesSetting(this.model).deletedAt

    this.fillTimestampsData(false)
    this.record.setAttribute(this.convention.formatFieldName(fieldName), this.convention.getNullValueFor(fieldName))
    return this.update(false, 'restore')
  }

  hasPrimaryKey(): boolean {
    const primaryKeyValue = this.model.getPrimaryKey()
    if (!primaryKeyValue) {
      return false
    }

    return true
  }

  hasModifiedData(): boolean {
    return this.record.getModified().length > 0
  }
}
