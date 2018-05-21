/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../model/interfaces/IModelQuery.d.ts" />
export declare abstract class Relation {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected name: string;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string);
    abstract buildData<T>(): T | undefined;
    abstract getClassName(): string;
    abstract lazyLoad(): Promise<void>;
    abstract eagerLoad(): Promise<void>;
    protected getRelationInfo(): NajsEloquent.Relation.RelationData;
    getAttachedPropertyName(): string;
    isLoaded(): boolean;
    getData<T>(): T | undefined;
    getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined;
    getModelByName(model: string): NajsEloquent.Model.IModel<any> & NajsEloquent.Model.IModelQuery<any, NajsEloquent.Wrapper.IQueryBuilderWrapper<any>>;
}
