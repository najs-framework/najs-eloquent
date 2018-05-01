/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelAttribute implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static getAttribute(this: NajsEloquent.Model.IModel<any>, key: string): any;
    static setAttribute(this: NajsEloquent.Model.IModel<any>, key: string, value: any): NajsEloquent.Model.IModel<any>;
    static getPrimaryKey(this: NajsEloquent.Model.IModel<any>): any;
    static setPrimaryKey(this: NajsEloquent.Model.IModel<any>, id: any): NajsEloquent.Model.IModel<any>;
    static getPrimaryKeyName(this: NajsEloquent.Model.IModel<any>): string;
}
