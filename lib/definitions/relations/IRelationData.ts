/// <reference path="./IRelationshipFactory.ts" />

namespace NajsEloquent.Relation {
  export interface IRelationData<T> {
    getFactory(): IRelationshipFactory

    isLoaded(): boolean

    hasData(): boolean

    getData(): T | undefined | null

    setData(data: T | undefined | null): T | undefined | null

    getLoadType(): 'unknown' | 'lazy' | 'eager'

    setLoadType(type: 'lazy' | 'eager'): this
  }
}
