/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IHasOne<Model> extends IRelation {
    associate<T>(model: Model | Model.IModel<T>): this

    dissociate(): this
  }
}
