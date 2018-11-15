namespace NajsEloquent.Relation {
  export interface IHasOneRelationship<T> extends IRelationship<T> {
    associate(model: T): void
  }
}
