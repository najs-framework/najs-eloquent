/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.ts" />

import { register } from 'najs-binding'
import { Relation } from './Relation'
import { NajsEloquent } from '../constants'

export type RelationInfo = {
  model: string
  table: string
  key: string
}

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

  buildData() {
    return undefined
  }

  getQueryInfo() {
    if (this.rootModel.getModelName() === this.local.model) {
      return {
        model: this.foreign.model,
        filterKey: this.foreign.key,
        valuesKey: this.local.key
      }
    }
    return {
      model: this.local.model,
      filterKey: this.local.key,
      valuesKey: this.foreign.key
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
    // console.log('b', this.rootModel['relations'][this.name])
    return <any>result
  }

  async lazyLoad<T>(): Promise<T | undefined | null> {
    const info = this.getQueryInfo()

    const query = this.getModelByName(info.model)
      .newQuery(this.rootModel.getRelationDataBucket())
      .where(info.filterKey, this.rootModel.getAttribute(info.valuesKey))

    const result = this.executeQuery(query)
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
