/// <reference path="./IRelationQuery.ts" />

namespace NajsEloquent.Relation {
  export interface IRelation<T> {
    getName(): string

    isLoaded(): boolean

    load(): Promise<T>

    getEager(): void

    setEager(): void

    getRelation(): IRelationQuery
  }
}
