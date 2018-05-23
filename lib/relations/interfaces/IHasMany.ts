/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IHasMany<T> extends IRelation {
    associate(model: Model.IModel<T>): this

    dissociate(model: Model.IModel<T>): this
  }
}
