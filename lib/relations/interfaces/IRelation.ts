// export interface IRelation<Result, Relation> {
//   isLoaded(): boolean

//   load(): Promise<Result>

//   getRelation(): Relation
// }

export interface IRelation<Result> {
  isLoaded(): boolean

  load(): Promise<Result>
}
