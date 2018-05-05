namespace NajsEloquent.Wrapper {
  export declare class IRelationWrapper<T> {
    protected relation: Relation.IRelation
    protected data: T
  }
  export interface IRelationWrapper<T> {
    load(): Promise<any>

    load(...args: Array<string | string[]>): Promise<any>

    /**
     * Determine the relationship is loaded or not.
     */
    isLoaded(): boolean
  }
}
