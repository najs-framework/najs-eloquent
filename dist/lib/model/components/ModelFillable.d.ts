/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelFillable implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static getFillable: NajsEloquent.Model.ModelMethod<string[]>;
    static getGuarded: NajsEloquent.Model.ModelMethod<string[]>;
    static markFillable: NajsEloquent.Model.ModelMethod<string[], any>;
    static markGuarded: NajsEloquent.Model.ModelMethod<string[], any>;
    static isFillable: NajsEloquent.Model.ModelMethod<boolean>;
    static isGuarded: NajsEloquent.Model.ModelMethod<boolean>;
    static fill: NajsEloquent.Model.ModelMethod<Object>;
    static forceFill: NajsEloquent.Model.ModelMethod<Object>;
}
