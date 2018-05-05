export declare type RelationInfo = {
    model: string;
    table: string;
    key: string;
};
export declare class HasOneOrMany {
    /**
     * Store local RelationInfo, it always has 1 record
     */
    protected local: RelationInfo;
    /**
     * Store foreign RelationInfo, it can has 1 or many depends on "isHasOne"
     */
    protected foreign: RelationInfo;
    /**
     * If it is true the relation is OneToOne otherwise is OneToMany
     */
    protected is1v1: boolean;
    constructor(oneToOne: boolean, local: RelationInfo, foreign: RelationInfo);
    load(model: any): any;
    loadByLocal(localModel: any): any;
    loadByForeign(foreignModel: any): any;
}
