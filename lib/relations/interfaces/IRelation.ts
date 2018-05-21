/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export type RelationMap = {
    mapTo: string
    type: 'getter' | 'function'
  }

  export type RelationData = {
    factory: IRelationFactory
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
     * Get new query based on the relation.
     */
    getData<T>(): T | undefined

    /**
     * Determine the relationship is loaded or not.
     */
    isLoaded(): boolean

    /**
     * Lazy load relation data.
     */
    lazyLoad(): Promise<void>

    /**
     * Lazy load relation data.
     */
    eagerLoad(): Promise<void>

    /**
     * Get RelationDataBucket which contains eager data.
     */
    getDataBucket(): IRelationDataBucket | undefined
  }
}
