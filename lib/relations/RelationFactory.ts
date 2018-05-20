/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="interfaces/IRelation.ts" />
/// <reference path="interfaces/IRelationFactory.ts" />

import './HasOneOrMany'
import { NajsEloquent } from '../constants'
import { HasOneOrMany } from './HasOneOrMany'
import { make } from 'najs-binding'

export class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
  protected rootModel: NajsEloquent.Model.IModel<any>
  protected relation: NajsEloquent.Relation.IRelation
  protected name: string
  protected isSample: boolean

  constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string, isSample: boolean) {
    this.rootModel = rootModel
    this.name = name
    this.isSample = isSample
  }

  hasOne(model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): any {
    return this.setupRelation(NajsEloquent.Relation.HasOneOrMany, () => {
      const relation: HasOneOrMany = make(NajsEloquent.Relation.HasOneOrMany, [this.rootModel, this.name])
      const foreign: NajsEloquent.Model.IModel<any> = this.getModelByNameOrDefinition(model)
      relation.setup(
        true,
        {
          model: this.rootModel.getModelName(),
          table: this.rootModel.getRecordName(),
          key: localKey || this.rootModel.getPrimaryKey()
        },
        {
          model: foreign.getModelName(),
          table: foreign.getRecordName(),
          key: foreignKey || foreign.getDriver().formatAttributeName(`${this.rootModel.getModelName()}Id`)
        }
      )

      return relation
    })
  }

  protected setupRelation(className: string, setup: () => NajsEloquent.Relation.IRelation) {
    if (this.isSample) {
      return make(className, [this.rootModel, this.name])
    }

    if (!this.relation) {
      this.relation = setup()
    }
    return this.relation
  }

  protected getModelByNameOrDefinition(model: string | Function): NajsEloquent.Model.IModel<any> {
    if (typeof model === 'function') {
      return Reflect.construct(model as Function, [])
    }
    return make(model)
  }
}
