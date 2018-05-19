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

  // load(model: any): any {
  //   if (model.getModelName() === this.local.model) {
  //     return this.loadByLocal(model)
  //   }
  //   return this.loadByForeign(model)
  // }

  buildData() {
    return undefined
  }

  async lazyLoad() {}

  async eagerLoad() {}

  // loadByLocal(localModel: any) {
  //   const foreignModel = <any>{}
  //   const query = foreignModel.newQuery().where(this.foreign.key, localModel.getAttribute(this.local.key))
  //   if (this.is1v1) {
  //     return query.first()
  //   }
  //   return query.get()
  // }

  // loadByForeign(foreignModel: any) {
  //   const localModel = <any>{}
  //   const query = localModel.newQuery().where(this.local.key, foreignModel.getAttribute(this.foreign.key))
  //   return query.first()
  // }
}
register(HasOneOrMany, NajsEloquent.Relation.HasOneOrMany)
