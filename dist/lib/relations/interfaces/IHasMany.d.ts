/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasMany<T> extends IRelation {
        associate(model: Model.IModel<T>): this;
        dissociate(model: Model.IModel<T>): this;
    }
}
