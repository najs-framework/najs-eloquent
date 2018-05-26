/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
/// <reference path="../../relations/interfaces/IRelationDataBucket.d.ts" />
export declare class ModelQuery implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static readonly ForwardToQueryBuilderMethods: string[];
    static newQuery(this: NajsEloquent.Model.IModel<any>, dataBucket?: NajsEloquent.Relation.IRelationDataBucket): any;
    static forwardToQueryBuilder(name: string): any;
}
