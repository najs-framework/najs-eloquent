/// <reference path="../../model/interfaces/IModel.ts" />

namespace NajsEloquent.Relation {
  export interface IHasOne<T> extends IRelation, Model.IModel<T> {
    // associate(): this
    // associate(model: Model.IModel<any>): this
    // dissociate(): this
  }

  export type HasOne<T> = IHasOne<T> & { [P in keyof T]: T[P] }
}
