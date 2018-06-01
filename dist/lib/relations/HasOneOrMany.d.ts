/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../wrappers/interfaces/IQueryBuilderWrapper.d.ts" />
import { Relation, RelationInfo } from './Relation';
export declare class HasOneOrMany extends Relation {
    static className: string;
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
    isInverseOf(relation: NajsEloquent.Relation.IRelation): boolean;
    isInverseOfTypeMatched(relation: HasOneOrMany): boolean;
    buildData<T>(): T | undefined | null;
    getQueryInfo(): {
        model: string;
        table: string;
        filterKey: string;
        valuesKey: string;
    };
    eagerLoad<T>(): Promise<T | undefined | null>;
    lazyLoad<T>(): Promise<T | undefined | null>;
    executeQuery(query: NajsEloquent.Wrapper.IQueryBuilderWrapper<any>): Promise<any>;
}
