declare namespace NajsEloquent.Relation {
    interface IBelongsToRelationship<T> extends IRelationship<T> {
        dissociate(): void;
    }
}
