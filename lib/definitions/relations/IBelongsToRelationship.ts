namespace NajsEloquent.Relation {
  export interface IBelongsToRelationship<T> extends IRelationship<T> {
    dissociate(): void
  }
}
