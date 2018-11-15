/// <reference path="../relations/IRelationship.ts" />
/// <reference path="../relations/IRelationshipFactory.ts" />

namespace NajsEloquent.Model {
  export interface IModelRelation {
    /**
     * Get relation by given name.
     * @param {string} name
     */
    getRelation<T = any>(name: string): Relation.IRelationship<T>

    /**
     * Get relations by given names.
     * @param this
     * @param args
     */
    getRelations<T = any>(this: Model, ...args: Array<string | string[]>): Relation.IRelationship<T>[]

    /**
     * Get loaded relations.
     * @param this
     * @param args
     */
    getLoadedRelations<T = any>(this: Model): Relation.IRelationship<T>[]

    /**
     * Define a relation property by name
     *
     * @param {string} name
     */
    defineRelation(name: keyof this): Relation.IRelationshipFactory

    /**
     * Load the relation
     */
    load<T>(...args: Array<keyof this | string | string[]>): Promise<T>

    /**
     * Determine that the relation is loaded or not. Please note that it only determine direct relation and can not
     * determine nested relations like: "direct-relation.relation-of-direct-relation"
     *
     * @param {string} relation
     */
    isLoaded(relation: string): boolean

    /**
     * Get loaded relations.
     */
    getLoaded(): string[]
  }
}
