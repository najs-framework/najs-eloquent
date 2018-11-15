/// <reference path="../definitions/relations/IRelationData.d.ts" />
export declare class RelationData<T> implements NajsEloquent.Relation.IRelationData<T> {
    protected data: T | undefined | null;
    protected state: string;
    protected factory: NajsEloquent.Relation.IRelationshipFactory;
    protected loadType?: 'lazy' | 'eager';
    constructor(factory: NajsEloquent.Relation.IRelationshipFactory);
    getFactory(): NajsEloquent.Relation.IRelationshipFactory;
    isLoaded(): boolean;
    hasData(): boolean;
    getData(): T | undefined | null;
    setData(data: T | undefined | null): T | undefined | null;
    getLoadType(): 'unknown' | 'lazy' | 'eager';
    setLoadType(type: 'lazy' | 'eager'): this;
}
