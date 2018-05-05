/// <reference path="../../model/interfaces/IModel.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IHasOne<T> extends IRelation, Model.IModel<T> {
    }
    type HasOne<T> = IHasOne<T> & {
        [P in keyof T]: T[P];
    };
}
