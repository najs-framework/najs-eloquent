/// <reference path="interfaces/IRelationDataBucket.d.ts" />
/// <reference path="../../../lib/collect.js/index.d.ts" />
export declare class RelationDataBucket implements NajsEloquent.Relation.IRelationDataBucket {
    static className: string;
    protected modelMap: Object;
    protected bucket: Object;
    constructor();
    getClassName(): string;
    register(name: string, modelName: string): this;
    newInstance<T>(name: string, record: Object): T;
    newCollection<T>(name: string, records: Object[]): CollectJs.Collection<T>;
}
