/// <reference path="IRelationshipFactory.d.ts" />
declare namespace NajsEloquent.Relation {
    interface IRelationData<T> {
        getFactory(): IRelationshipFactory;
        isLoaded(): boolean;
        hasData(): boolean;
        getData(): T | undefined | null;
        setData(data: T | undefined | null): T | undefined | null;
        getLoadType(): 'unknown' | 'lazy' | 'eager';
        setLoadType(type: 'lazy' | 'eager'): this;
    }
}
