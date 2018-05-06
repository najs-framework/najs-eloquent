/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IHasOne<T> extends IRelation {
    associate(model: Model.IModel<T>): this

    dissociate(): this
  }
}
