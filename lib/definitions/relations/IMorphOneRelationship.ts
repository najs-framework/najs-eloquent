namespace NajsEloquent.Relation {
  export interface IMorphOneRelationship<T> extends IRelationship<T> {
    associate(model: T): void
  }
}
