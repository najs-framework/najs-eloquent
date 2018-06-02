/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasOne<Model> extends IRelation {
        associate<T>(model: Model | Model.IModel<T>): this;
        dissociate(): this;
    }
}
