/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IHasMany<Model> extends IRelation {
    associate<T>(model: Model | Model.IModel<T>): this

    dissociate<T>(model: Model | Model.IModel<T>): this
  }
}
