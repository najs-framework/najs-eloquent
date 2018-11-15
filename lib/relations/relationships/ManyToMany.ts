/// <reference path="../../definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/data/IDataReader.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../definitions/relations/IBelongsToManyRelationship.ts" />

import Model = NajsEloquent.Model.IModel
import ModelDefinition = NajsEloquent.Model.ModelDefinition
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType
import IRelationshipQuery = NajsEloquent.Relation.IRelationshipQuery
import IPivotOptions = NajsEloquent.Relation.IPivotOptions
import IManyToMany = NajsEloquent.Relation.IManyToMany
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder
import QueryBuilderInternal = NajsEloquent.QueryBuilder.QueryBuilderInternal
import Collection = CollectJs.Collection

import { flatten } from 'lodash'
import { ClassRegistry, make } from 'najs-binding'
import { Relationship } from '../Relationship'
import { PivotModel } from './pivot/PivotModel'
import { isModel } from '../../util/helpers'
import { array_unique } from '../../util/functions'
import { TimestampsFeature } from '../../features/TimestampsFeature'
import { SoftDeletesFeature } from '../../features/SoftDeletesFeature'

export abstract class ManyToMany<T extends Model> extends Relationship<Collection<T>> implements IManyToMany<T> {
  protected pivot: ModelDefinition
  protected pivotModelInstance: Model
  protected pivotDefinition: typeof PivotModel
  protected pivotTargetKeyName: string
  protected pivotRootKeyName: string
  protected pivotAccessor?: string
  protected pivotOptions: IPivotOptions

  protected pivotCustomQueryFn: IRelationshipQuery<T> | undefined

  constructor(
    root: Model,
    relationName: string,
    target: ModelDefinition,
    pivot: ModelDefinition,
    pivotTargetKeyName: string,
    pivotRootKeyName: string,
    targetKeyName: string,
    rootKeyName: string
  ) {
    super(root, relationName)
    this.targetDefinition = target
    this.pivot = pivot
    this.pivotTargetKeyName = pivotTargetKeyName
    this.pivotRootKeyName = pivotRootKeyName
    this.targetKeyName = targetKeyName
    this.rootKeyName = rootKeyName
    this.pivotOptions = {
      foreignKeys: [this.pivotRootKeyName, this.pivotTargetKeyName].sort() as [string, string]
    }
  }

  abstract getType(): string

  abstract getClassName(): string

  abstract collectData(): Collection<T> | undefined | null

  abstract fetchPivotData(type: RelationshipFetchType): Promise<CollectJs.Collection<Model>>

  isInverseOf<K>(relation: NajsEloquent.Relation.IRelationship<K>): boolean {
    return false
  }

  protected get pivotModel(): Model {
    if (!this.pivotModelInstance) {
      this.pivotModelInstance = this.newPivot()
    }
    return this.pivotModelInstance
  }

  protected getPivotAccessor(): string {
    return this.pivotAccessor || 'pivot'
  }

  newPivot(data?: object, isGuarded?: boolean): Model {
    if (typeof this.pivot === 'string') {
      if (ClassRegistry.has(this.pivot)) {
        const instance = make<Model>(this.pivot)
        if (isModel(instance)) {
          this.setPivotDefinition(ClassRegistry.findOrFail(this.pivot).instanceConstructor as any)
          return instance
        }
      }

      // the pivot is not a model then we should create an pivot model
      this.setPivotDefinition(PivotModel.createPivotClass(this.pivot, this.getPivotOptions(this.pivot)))
      return Reflect.construct(this.pivotDefinition, Array.from(arguments))
    }

    this.setPivotDefinition(this.pivot as any)
    return Reflect.construct(this.pivot, Array.from(arguments))
  }

  newPivotQuery(name?: string, raw: boolean = false): IQueryBuilder<Model> {
    const queryBuilder = this.applyPivotCustomQuery(this.pivotModel.newQuery(name as any)) as QueryBuilderInternal
    queryBuilder.handler.setRelationDataBucket(this.getDataBucket())

    if (raw) {
      return queryBuilder
    }

    const rootPrimaryKey = this.rootModel.getAttribute(this.rootKeyName)
    if (rootPrimaryKey) {
      return queryBuilder.where(this.pivotRootKeyName, rootPrimaryKey)
    }
    return queryBuilder
  }

  applyPivotCustomQuery(queryBuilder: IQueryBuilder<any>): IQueryBuilder<any> {
    if (typeof this.pivotCustomQueryFn === 'function') {
      this.pivotCustomQueryFn.call(queryBuilder, queryBuilder)
    }
    return queryBuilder
  }

  withPivot(...fields: Array<string | string[]>): this {
    const input = flatten(fields)
    if (typeof this.pivotOptions.fields === 'undefined') {
      this.pivotOptions.fields = input
    } else {
      this.pivotOptions.fields = array_unique(this.pivotOptions.fields.concat(input))
    }

    return this
  }

  as(accessor: string): this {
    this.pivotAccessor = accessor

    return this
  }

  withTimestamps(createdAt?: string, updatedAt?: string): this {
    this.pivotOptions.timestamps =
      typeof createdAt !== 'undefined' && typeof updatedAt !== 'undefined'
        ? { createdAt: createdAt, updatedAt: updatedAt }
        : TimestampsFeature.DefaultSetting

    return this
  }

  withSoftDeletes(deletedAt?: string): this {
    this.pivotOptions.softDeletes =
      typeof deletedAt !== 'undefined'
        ? Object.assign({}, SoftDeletesFeature.DefaultSetting, { deletedAt: deletedAt })
        : SoftDeletesFeature.DefaultSetting

    return this
  }

  queryPivot(cb: IRelationshipQuery<T>): this {
    this.pivotCustomQueryFn = cb

    return this
  }

  getPivotOptions(name?: string): IPivotOptions {
    if (name && !this.pivotOptions.name) {
      this.pivotOptions.name = name
    }
    return this.pivotOptions
  }

  setPivotDefinition(definition: typeof PivotModel): void {
    const options = this.getPivotOptions()
    this.pivotDefinition = definition
    this.pivotDefinition['options'] = options

    this.setFillableToPivotDefinitionIfNeeded(options)
    this.setTimestampsToPivotDefinitionIfNeeded(options)
    this.setSoftDeletesToPivotDefinitionIfNeeded(options)
  }

  private setFillableToPivotDefinitionIfNeeded(options: IPivotOptions) {
    if (typeof options.fields === 'undefined') {
      return
    }

    if (typeof this.pivotDefinition['fillable'] === 'undefined') {
      this.pivotDefinition['fillable'] = array_unique(([] as string[]).concat(options.foreignKeys, options.fields))
      return
    }

    this.pivotDefinition['fillable'] = array_unique(
      ([] as string[]).concat(this.pivotDefinition['fillable'], options.foreignKeys, options.fields)
    )
  }

  private setTimestampsToPivotDefinitionIfNeeded(options: IPivotOptions) {
    if (typeof options.timestamps === 'undefined') {
      return
    }
    this.pivotDefinition['timestamps'] = options.timestamps
  }

  private setSoftDeletesToPivotDefinitionIfNeeded(options: IPivotOptions) {
    if (typeof options.softDeletes === 'undefined') {
      return
    }
    this.pivotDefinition['softDeletes'] = options.softDeletes
  }
}
