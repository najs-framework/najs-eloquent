/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class ModelTimestamps implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static hasTimestamps: NajsEloquent.Model.ModelMethod<boolean>;
    static getTimestampsSetting: NajsEloquent.Model.ModelMethod<NajsEloquent.Model.ITimestampsSetting>;
    static touch(this: NajsEloquent.Model.IModel<any>): NajsEloquent.Model.IModel<any>;
    static readonly DefaultSetting: NajsEloquent.Model.ITimestampsSetting;
}
