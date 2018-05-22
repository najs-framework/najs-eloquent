/// <reference path="./interfaces/IHasOne.ts" />
/// <reference path="../model/interfaces/IModel.ts" />

export type HasOne<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null
export type BelongsTo<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null

export type HasOneRelation<T> = NajsEloquent.Relation.IHasOne<T>
export type BelongsToRelation<T> = NajsEloquent.Relation.IHasOne<T>
