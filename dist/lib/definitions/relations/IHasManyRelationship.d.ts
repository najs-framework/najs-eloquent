/// <reference path="../../../../lib/definitions/collect.js/index.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasManyRelationship<T> extends IRelationship<CollectJs.Collection<T>> {
        associate(...models: Array<T | T[] | CollectJs.Collection<T>>): this;
        dissociate(...models: Array<T | T[] | CollectJs.Collection<T>>): this;
    }
}
