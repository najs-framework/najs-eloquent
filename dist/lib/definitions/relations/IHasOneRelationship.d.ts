declare namespace NajsEloquent.Relation {
    interface IHasOneRelationship<T> extends IRelationship<T> {
        associate(model: T): void;
    }
}
