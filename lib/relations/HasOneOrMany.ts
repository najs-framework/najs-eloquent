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

  async eagerLoad() {}

  async lazyLoad() {
    const rootIsLocal = this.rootModel.getModelName() === this.local.model
    const queryModelName: string = rootIsLocal ? this.foreign.model : this.local.model
    const leftHandKey: string = rootIsLocal ? this.foreign.key : this.local.key
    const rightHandKey: string = rootIsLocal ? this.local.key : this.foreign.key

    const query = this.getModelByName(queryModelName)
      .newQuery(this.rootModel.getRelationDataBucket())
      .where(leftHandKey, this.rootModel.getAttribute(rightHandKey))

    return this.executeQuery(query)
  }

  // async loadById(queryModelName: string, leftHandKey: string, rightHandKey: string) {
  //   const query = this.getModelByName(queryModelName)
  //     .newQuery(this.rootModel.getRelationDataBucket())
  //     .where(leftHandKey, this.rootModel.getAttribute(rightHandKey))
  //   return this.executeQuery(query)
  // }

  // async loadByLocal(localModel: NajsEloquent.Model.IModel<any>) {
  //   const foreignModel = this.getModelByName(this.foreign.model)
  //   const query = foreignModel
  //     .newQuery(localModel.getRelationDataBucket())
  //     .where(this.foreign.key, localModel.getAttribute(this.local.key))
  //   return this.executeQuery(query)
  // }

  // async loadByForeign(foreignModel: NajsEloquent.Model.IModel<any>) {
  //   const localModel = <any>this.getModelByName(this.local.model)
  //   const query = localModel
  //     .newQuery(foreignModel.getRelationDataBucket())
  //     .where(this.local.key, foreignModel.getAttribute(this.foreign.key))
  //   return this.executeQuery(query)
  // }

  async executeQuery(query: NajsEloquent.Wrapper.IQueryBuilderWrapper<any>) {
    if (this.is1v1) {
      return query.first()
    }
    return query.get()
  }
}
register(HasOneOrMany, NajsEloquent.Relation.HasOneOrMany)
