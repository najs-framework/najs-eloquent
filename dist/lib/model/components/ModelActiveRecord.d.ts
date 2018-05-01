/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelActiveRecord implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static isNew: NajsEloquent.Model.ModelMethod<boolean>;
    static delete: NajsEloquent.Model.ModelMethod<Promise<boolean>>;
    static save: NajsEloquent.Model.ModelMethod<any>;
    static fresh: NajsEloquent.Model.ModelMethod<any>;
}
