/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasMany<Model> extends IRelation {
        associate<T>(model: Model | Model.IModel<T>): this;
        dissociate<T>(model: Model | Model.IModel<T>): this;
    }
}
