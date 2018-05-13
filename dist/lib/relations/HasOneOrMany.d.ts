import { Relation } from './Relation';
export declare type RelationInfo = {
    model: string;
    table: string;
    key: string;
};
export declare class HasOneOrMany extends Relation {
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
    getClassName(): string;
    setup(oneToOne: boolean, local: RelationInfo, foreign: RelationInfo): void;
    load(model: any): any;
    protected buildData(): undefined;
    lazyLoad(): Promise<void>;
    eagerLoad(): Promise<void>;
    loadByLocal(localModel: any): any;
    loadByForeign(foreignModel: any): any;
}
