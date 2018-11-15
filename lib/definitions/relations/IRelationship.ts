/// <reference path="../model/IModel.ts" />
/// <reference path="../query-builders/IQueryBuilder.ts" />

namespace NajsEloquent.Relation {
  export type RelationDefinition = {
    accessor: string
    target: string
    targetType: 'getter' | 'function'
    targetClass?: string
  }

  export type RelationDefinitions = { [name in string]: RelationDefinition }
  export type RelationshipFetchType = 'lazy' | 'eager'

  export interface IRelationshipQuery<T> {
    (queryBuilder: QueryBuilder.IQueryBuilder<T>): any
  }

  export interface IRelationship<T> {
    /**
     * Set sub-relation with will be loaded when current relation load.
     *
     * @param relations
     */
    with(...relations: Array<string | string[]>): this

    /**
     * Add custom query to relationship.
     */
    query(cb: IRelationshipQuery<T>): this

    /**
     * Get defined name of the relation.
     */
    getName(): string

    /**
     * Get chains relation.
     */
    getChains(): string[]

    /**
     * Get data of the relationship.
     */
    getData(): T | undefined | null

    /**
     * Determine the relationship is loaded or not.
     */
    isLoaded(): boolean

    /**
     * load relationship data, use eagerLoad() if it's possible otherwise will use lazyLoad().
     */
    load(): Promise<T | undefined | null>

    /**
     * Lazy load relationship.
     */
    lazyLoad(): Promise<T | undefined | null>

    /**
     * Eager load relationship.
     */
    eagerLoad(): Promise<T | undefined | null>

    /**
     * Get RelationDataBucket which contains eager data.
     */
    getDataBucket(): IRelationDataBucket | undefined

    /**
     * Get relationship type
     */
    getType(): string

    /**
     * Determine that current relationship is an inverse of given relationship or not.
     *
     * @param {Relationship} relation
     */
    isInverseOf<K = any>(relation: IRelationship<K>): boolean
  }

  export interface IRelationshipStatic {
    /**
     * Map a morph type to model.
     *
     * @param {string} type name of morph which is stored in database.
     * @param {string} model name of model which mapped to.
     */
    morphMap(type: string, model: Model.ModelDefinition): this

    /**
     * Append data to current morph data
     *
     * @param {object} data
     */
    morphMap(data: { [type in string]: string }): this

    /**
     * Get morph map data
     */
    getMorphMap(): { [type in string]: string }

    /**
     * Find model name by given morph type
     *
     * @param {string} morphType
     */
    findModelName(morphType: string): string

    /**
     * Find saved morph type by the model definition
     */
    findMorphType(model: Model.ModelDefinition): string
    /**
     * Find saved morph type by the model instance
     */
    findMorphType(model: Model.IModel): string
  }
}
