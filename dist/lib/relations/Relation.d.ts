/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="../model/interfaces/IEloquent.d.ts" />
export declare abstract class Relation implements NajsEloquent.Relation.IRelation {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected name: string;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string);
    abstract getClassName(): string;
    abstract buildData<T>(): T | undefined | null;
    abstract lazyLoad<T>(): Promise<T | undefined | null>;
    abstract eagerLoad<T>(): Promise<T | undefined | null>;
    readonly relationData: NajsEloquent.Relation.RelationData;
    getAttachedPropertyName(): string;
    isLoaded(): boolean;
    isBuilt(): boolean;
    getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined;
    getModelByName(model: string): NajsEloquent.Model.IEloquent<any>;
    getData<T>(): T | undefined | null;
    load<T>(): Promise<T | undefined | null>;
}
