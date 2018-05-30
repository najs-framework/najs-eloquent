/// <reference path="interfaces/IRelationDataBucket.d.ts" />
/// <reference path="../../../lib/collect.js/index.d.ts" />
export declare class RelationDataBucket implements NajsEloquent.Relation.IRelationDataBucket {
    static className: string;
    protected modelMap: Object;
    protected bucket: Object;
    protected loaded: Object;
    constructor();
    getClassName(): string;
    register(name: string, modelName: string): this;
    newInstance<T>(name: string, record: Object): T;
    newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T>;
    makeModelFromRecord(name: string, record: Object): NajsEloquent.Model.IModel<any>;
    makeCollectionFromRecords(name: string, records: Object[]): CollectJs.Collection<NajsEloquent.Model.IModel<any>>;
    markRelationLoaded(modelName: string, relationName: string, loaded?: boolean): this;
    isRelationLoaded(modelName: string, relationName: string): boolean;
    getAttributes(name: string, attribute: string, allowDuplicated?: boolean): any[];
    filter(name: string, key: string, value: any, getFirstOnly?: boolean): Object[];
    convertToStringIfValueIsObjectID(value: any): any;
}
