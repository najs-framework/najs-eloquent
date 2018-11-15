declare namespace NajsEloquent.Relation {
    interface IMorphOneRelationship<T> extends IRelationship<T> {
        associate(model: T): void;
    }
}
