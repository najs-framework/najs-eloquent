/// <reference path="interfaces/IRelationFactory.ts" />

import { Relation } from './Relation'

export class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
  hasOne(model: any, key?: any, foreignKey?: any): any {
    return <any>new Relation()
  }
}
