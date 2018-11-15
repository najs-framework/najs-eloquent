/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/relations/IRelationship.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IQueryBuilder = NajsEloquent.QueryBuilder.IQueryBuilder;
import IRelationship = NajsEloquent.Relation.IRelationship;
import IRelationshipQuery = NajsEloquent.Relation.IRelationshipQuery;
import RelationshipFetchType = NajsEloquent.Relation.RelationshipFetchType;
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket;
import IRelationData = NajsEloquent.Relation.IRelationData;
export declare abstract class Relationship<T> implements IRelationship<T> {
    protected name: string;
    protected chains: string[];
    protected rootModel: IModel;
    protected rootKeyName: string;
    private targetModelInstance;
    protected targetDefinition: ModelDefinition;
    protected readonly targetModel: IModel;
    protected targetKeyName: string;
    protected customQueryFn: IRelationshipQuery<T> | undefined;
    constructor(rootModel: IModel, name: string);
    abstract getClassName(): string;
    abstract getType(): string;
    /**
     * Collect data from RelationDataBucket.
     */
    abstract collectData(): T | undefined | null;
    /**
     * Fetch data from database or data source.
     */
    abstract fetchData(type: RelationshipFetchType): Promise<T | undefined | null>;
    abstract isInverseOf<K>(relation: IRelationship<K>): boolean;
    with(...relations: Array<string | string[]>): this;
    query(cb: IRelationshipQuery<T>): this;
    createTargetQuery(name: string | undefined): IQueryBuilder<any>;
    applyCustomQuery(queryBuilder: IQueryBuilder<any>): IQueryBuilder<any>;
    getName(): string;
    getChains(): string[];
    getRelationData(): IRelationData<T>;
    getDataBucket(): IRelationDataBucket | undefined;
    isLoaded(): boolean;
    getData(): T | undefined | null;
    markInverseRelationshipsToLoaded(result: any): any;
    getInverseRelationships(model: IModel): IRelationship<any>[];
    lazyLoad(): Promise<T | undefined | null>;
    eagerLoad(): Promise<T | undefined | null>;
    loadData(type: 'lazy' | 'eager'): Promise<any>;
    loadChains(result: any): Promise<any>;
    load(): Promise<T | undefined | null>;
    private static morphMapData;
    static morphMap(arg1: string | object, arg2?: string | ModelDefinition): typeof Relationship;
    static getMorphMap(): {
        [type in string]: string;
    };
    static findModelName(type: string): string;
    static findMorphType(model: string | Model | ModelDefinition): string;
}
