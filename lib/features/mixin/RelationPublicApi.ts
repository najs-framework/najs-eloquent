/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelRelation.ts" />

import Model = NajsEloquent.Model.ModelInternal
import IRelationship = NajsEloquent.Relation.IRelationship
import IRelationshipFactory = NajsEloquent.Relation.IRelationshipFactory
import { flatten } from 'lodash'
import { RelationUtilities } from '../../relations/RelationUtilities'

export const RelationPublicApi: NajsEloquent.Model.IModelRelation = {
  getRelation<T = any>(this: Model, name: string): IRelationship<T> {
    return this.driver.getRelationFeature().findByName(this, name)
  },

  getRelations<T = any>(this: Model, ...args: Array<string | string[]>): IRelationship<T>[] {
    const relationNames: string[] = flatten(arguments)
    return RelationUtilities.bundleRelations(relationNames.map(name => this.getRelation(name)))
  },

  getLoadedRelations<T = any>(this: Model): IRelationship<T>[] {
    return this.driver.getRelationFeature().getLoadedRelations(this)
  },

  defineRelation(this: Model, name: string): IRelationshipFactory {
    return this.driver
      .getRelationFeature()
      .findDataByName(this, name)
      .getFactory()
  },

  load(this: Model, ...args: Array<string | string[]>): Promise<any> {
    const relationNames: string[] = flatten(arguments)
    return Promise.all(
      relationNames.map(name => {
        return this.getRelation(name).load()
      })
    )
  },

  isLoaded(this: Model, relation: string): boolean {
    return this.driver.getRelationFeature().isLoadedRelation(this, relation)
  },

  getLoaded(this: Model): string[] {
    return this.getLoadedRelations().map(item => item.getName())
  }
}
