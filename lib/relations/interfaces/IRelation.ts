/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export type RelationMap = {
    mapTo: string
    type: 'getter' | 'function'
  }

  export type RelationData = {
    factory: IRelationFactory
    isBuilt?: boolean
    isLoaded?: boolean
    loadType?: 'lazy' | 'eager'
    data?: any
  }

  export interface IRelation {
    /**
     * Get the relation name.
     */
    getAttachedPropertyName(): string

    /**
     * Set sub-relation with will be loaded when current relation load.
     *
     * @param relations
     */
    with(...relations: Array<string | string[]>): this

    /**
     * Get new query based on the relation.
     */
    getData<T>(): T | undefined | null

    /**
     * Determine the relation is loaded or not.
     */
    isLoaded(): boolean

    /**
     * Determine the relation data is built or not.
     */
    isBuilt(): boolean

    /**
     * Mark load status of the relation.
     *
     * @param {boolean} loaded
     */
    markLoad(loaded: boolean): this

    /**
     * Mark build status of the relation.
     *
     * @param {boolean} loaded
     */
    markBuild(built: boolean): this

    /**
     * load relation data, use eagerLoad() if it's possible otherwise will use lazyLoad().
     */
    load<T>(): Promise<T | undefined | null>

    /**
     * Lazy load relation data.
     */
    lazyLoad<T>(): Promise<T | undefined | null>

    /**
     * Eager load relation data.
     */
    eagerLoad<T>(): Promise<T | undefined | null>

    /**
     * Get RelationDataBucket which contains eager data.
     */
    getDataBucket(): IRelationDataBucket | undefined

    /**
     * Get relation type
     */
    getType(): string
  }
}
