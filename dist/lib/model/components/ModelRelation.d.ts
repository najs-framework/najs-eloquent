/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelRelation implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static getRelationDataBucket: NajsEloquent.Model.ModelMethod<any>;
    static load: NajsEloquent.Model.ModelMethod<any>;
    static bindRelationMapIfNeeded: NajsEloquent.Model.ModelMethod<any>;
    static getRelationByName: NajsEloquent.Model.ModelMethod<any>;
    static defineRelationProperty: NajsEloquent.Model.ModelMethod<any>;
}
