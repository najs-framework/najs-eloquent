/// <reference path="interfaces/IHasOne.d.ts" />
/// <reference path="../model/interfaces/IModel.d.ts" />
export declare type HasOne<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null;
export declare type BelongsTo<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null;
export declare type HasOneRelation<T> = NajsEloquent.Relation.IHasOne<T>;
export declare type BelongsToRelation<T> = NajsEloquent.Relation.IHasOne<T>;
