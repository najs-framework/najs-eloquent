/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="../../../lib/collect.js/index.d.ts" />
/// <reference path="../model/interfaces/IEloquent.d.ts" />
import { RelationType } from './RelationType';
export declare type RelationInfo = {
    model: string;
    table: string;
    key: string;
};
export declare abstract class Relation implements NajsEloquent.Relation.IRelation {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected name: string;
    protected loadChain: string[];
    protected type: RelationType;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string, type?: RelationType);
    abstract getClassName(): string;
    abstract buildData<T>(): T | undefined | null;
    abstract lazyLoad<T>(): Promise<T | undefined | null>;
    abstract eagerLoad<T>(): Promise<T | undefined | null>;
    abstract isInverseOf<T extends Relation>(relation: T): boolean;
    readonly relationData: NajsEloquent.Relation.RelationData;
    getType(): string;
    with(...names: Array<string | string[]>): this;
    getAttachedPropertyName(): string;
    isLoaded(): boolean;
    isBuilt(): boolean;
    markLoad(loaded: boolean): this;
    markBuild(built: boolean): this;
    getDataBucket(): NajsEloquent.Relation.IRelationDataBucket | undefined;
    getModelByName(model: string): NajsEloquent.Model.IEloquent<any>;
    getKeysInDataBucket(table: string, key: string): string[];
    compareRelationInfo(a: RelationInfo, b: RelationInfo): boolean;
    makeModelOrCollectionFromRecords(relationDataBucket: NajsEloquent.Relation.IRelationDataBucket, table: string, makeCollection: boolean, records: Object[]): any;
    getData<T>(): T | undefined | null;
    load<T>(): Promise<T | undefined | null>;
    loadChainRelations(result: any): Promise<any>;
}
