/// <reference path="../collect.js/index.d.ts" />

namespace NajsEloquent.Relation {
  export interface IMorphManyRelationship<T> extends IRelationship<CollectJs.Collection<T>> {
    associate(...models: Array<T | T[] | CollectJs.Collection<T>>): this

    dissociate(...models: Array<T | T[] | CollectJs.Collection<T>>): this
  }
}
