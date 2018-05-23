/// <reference path="interfaces/IHasOne.ts" />
/// <reference path="interfaces/IHasMany.ts" />
/// <reference path="../model/interfaces/IModel.ts" />
/// <reference path="../collect.js/index" />

export type HasOne<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null
export type HasMany<T> = (CollectJs.Collection<NajsEloquent.Model.IModel<T> & T>) | undefined | null
export type BelongsTo<T> = (NajsEloquent.Model.IModel<T> & T) | undefined | null

export type HasOneRelation<T> = NajsEloquent.Relation.IHasOne<T>
export type HasManyRelation<T> = NajsEloquent.Relation.IHasMany<T>
export type BelongsToRelation<T> = NajsEloquent.Relation.IHasOne<T>
