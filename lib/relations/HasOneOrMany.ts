/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.ts" />

import { register } from 'najs-binding'
import { Relation, RelationInfo } from './Relation'
import { NajsEloquent } from '../constants'
import { RelationType } from './RelationType'

export class HasOneOrMany extends Relation {
  static className: string = NajsEloquent.Relation.HasOneOrMany

  /**
   * Store local RelationInfo, it always has 1 record
   */
  protected local: RelationInfo
  /**
   * Store foreign RelationInfo, it can has 1 or many depends on "isHasOne"
   */
  protected foreign: RelationInfo
  /**
   * If it is true the relation is OneToOne otherwise is OneToMany
   */
  protected is1v1: boolean

  getClassName(): string {
    return NajsEloquent.Relation.HasOneOrMany
  }

  setup(oneToOne: boolean, local: RelationInfo, foreign: RelationInfo) {
    this.is1v1 = oneToOne
    this.local = local
    this.foreign = foreign
  }

  isInverseOf(relation: NajsEloquent.Relation.IRelation): boolean {
    if (!(relation instanceof HasOneOrMany)) {
      return false
    }

    if (!this.isInverseOfTypeMatched(relation)) {
      return false
    }

    return (
      this.compareRelationInfo(this.local, relation.local) && this.compareRelationInfo(this.foreign, relation.foreign)
    )
  }

  isInverseOfTypeMatched(relation: HasOneOrMany) {
    if (this.type !== RelationType.BelongsTo && relation.type !== RelationType.BelongsTo) {
      return false
    }

    if (this.type === RelationType.BelongsTo) {
      return relation.type === RelationType.HasMany || relation.type === RelationType.HasOne
    }

    return this.type === RelationType.HasMany || this.type === RelationType.HasOne
  }

  buildData<T>(): T | undefined | null {
    this.relationData.isBuilt = true
    const relationDataBucket = this.rootModel.getRelationDataBucket()
    if (!relationDataBucket) {
      return undefined
    }

    const info = this.getQueryInfo()
    const data = this.makeModelOrCollectionFromRecords(
      relationDataBucket,
      info.table,
      !this.is1v1,
      relationDataBucket.filter(info.table, info.filterKey, this.rootModel.getAttribute(info.valuesKey), this.is1v1)
    )
    this.relationData.data = data
    return data
  }

  getQueryInfo() {
    const isUsingLocal = this.rootModel.getModelName() === this.local.model
    const local: RelationInfo = isUsingLocal ? this.local : this.foreign
    const foreign: RelationInfo = isUsingLocal ? this.foreign : this.local
    return {
      model: foreign.model,
      table: foreign.table,
      filterKey: foreign.key,
      valuesKey: local.key
    }
  }

  async eagerLoad<T>(): Promise<T | undefined | null> {
    const info = this.getQueryInfo()

    const query = this.getModelByName(info.model)
      .newQuery(this.rootModel.getRelationDataBucket())
      .whereIn(info.filterKey, this.getKeysInDataBucket(this.rootModel.getRecordName(), info.valuesKey))

    const result = await query.get()
    this.relationData.isLoaded = true
    this.relationData.loadType = 'eager'
    this.relationData.isBuilt = false
    return <any>result
  }

  async lazyLoad<T>(): Promise<T | undefined | null> {
    const info = this.getQueryInfo()

    const query = this.getModelByName(info.model)
      .newQuery(this.rootModel.getRelationDataBucket())
      .where(info.filterKey, this.rootModel.getAttribute(info.valuesKey))

    const result = await this.executeQuery(query)
    this.relationData.isLoaded = true
    this.relationData.loadType = 'lazy'
    this.relationData.isBuilt = true
    this.relationData.data = result
    return result
  }

  async executeQuery(query: NajsEloquent.Wrapper.IQueryBuilderWrapper<any>) {
    if (this.is1v1) {
      return query.first()
    }
    return query.get()
  }
}
register(HasOneOrMany, NajsEloquent.Relation.HasOneOrMany)
