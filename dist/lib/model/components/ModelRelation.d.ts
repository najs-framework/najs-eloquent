/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare function findRelationsForModel(model: NajsEloquent.Model.IModel<any>): void;
export declare class ModelRelation implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static load: NajsEloquent.Model.ModelMethod<any>;
    static getRelationByName: NajsEloquent.Model.ModelMethod<any>;
    static callMappedRelationByName(model: NajsEloquent.Model.IModel<any>, name: string): any;
    static defineRelationProperty: NajsEloquent.Model.ModelMethod<any>;
}
