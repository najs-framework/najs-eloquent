/// <reference path="IRelationQuery.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelation<T> {
        getName(): string;
        isLoaded(): boolean;
        load(): Promise<T>;
        getEager(): void;
        setEager(): void;
        getRelation(): IRelationQuery;
    }
}
