/// <reference path="../../relations/interfaces/IRelationDataBucket.ts" />
/// <reference path="../../relations/interfaces/IRelationFactory.ts" />

namespace NajsEloquent.Model {
  export declare class IModelRelation {
    /**
     * Relation data bucket which is used for eager load.
     */
    protected relationDataBucket: Relation.IRelationDataBucket

    /**
     * Relations mapping information, this is shared for all instances.
     */
    protected relationsMap: {
      [name: string]: Relation.RelationMap
    }

    /**
     * Relation information, which store relations data for each model instance.
     */
    protected relations: {
      [name: string]: Relation.RelationData
    }
  }

  export interface IModelRelation {
    /**
     * Lazy load relation
     *
     * @param {Array<string|string[]>} args relation name
     */
    load(...args: Array<string | string[]>): Promise<any>

    /**
     * Get relation by given name
     * @param {string} name
     */
    getRelationByName(name: string): Relation.IRelation

    /**
     * Define a relation property by name
     *
     * @param {string} name
     */
    defineRelationProperty(name: string): Relation.IRelationFactory
  }

  export interface IModelRelationQuery {
    /**
     * Eager load relations
     *
     * @param {Array<string|string[]>} args relation name
     */
    with(...args: Array<string | string[]>): void
  }
}
