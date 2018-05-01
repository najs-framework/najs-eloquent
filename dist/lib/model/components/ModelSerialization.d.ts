/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelSerialization implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static getVisible: NajsEloquent.Model.ModelMethod<string[]>;
    static getHidden: NajsEloquent.Model.ModelMethod<string[]>;
    static markVisible: NajsEloquent.Model.ModelMethod<string[], any>;
    static markHidden: NajsEloquent.Model.ModelMethod<string[], any>;
    static isVisible: NajsEloquent.Model.ModelMethod<boolean>;
    static isHidden: NajsEloquent.Model.ModelMethod<boolean>;
    static toObject: NajsEloquent.Model.ModelMethod<Object>;
    static toJSON: NajsEloquent.Model.ModelMethod<Object>;
}
