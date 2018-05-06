/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasOne<T> extends IRelation {
        associate(model: Model.IModel<T>): this;
        dissociate(): this;
    }
}
