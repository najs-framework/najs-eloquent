/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="interfaces/IRelationFactory.ts" />

import { Relation } from './Relation'

export class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
  protected rootModel: NajsEloquent.Model.IModel<any>
  protected relation: NajsEloquent.Relation.IRelation
  protected name: string
  protected loaded: boolean

  constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string) {
    this.rootModel = rootModel
    this.name = name
    this.loaded = false
  }

  hasOne(model: string | NajsEloquent.Model.ModelDefinition<any>, key?: string, foreignKey?: string): any {
    return Reflect.construct(Relation, [this.rootModel, this.name])
  }
}
