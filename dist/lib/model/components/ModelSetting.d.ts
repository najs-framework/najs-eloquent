/// <reference path="../interfaces/IModel.d.ts" />
import { ClassSetting } from '../../util/ClassSetting';
export declare class ModelSetting implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static getSettingProperty: NajsEloquent.Model.ModelMethod<any>;
    static hasSetting: NajsEloquent.Model.ModelMethod<any>;
    static getSettingWithDefaultForTrueValue: NajsEloquent.Model.ModelMethod<any>;
    static getClassSetting: NajsEloquent.Model.ModelMethod<ClassSetting>;
    static getArrayUniqueSetting: NajsEloquent.Model.ModelMethod<string[]>;
    static pushToUniqueArraySetting: NajsEloquent.Model.ModelMethod<any>;
    static isInWhiteList: NajsEloquent.Model.ModelMethod<boolean>;
    static isKeyInWhiteList: NajsEloquent.Model.ModelMethod<boolean>;
    static isInBlackList: NajsEloquent.Model.ModelMethod<boolean>;
    static isKeyInBlackList: NajsEloquent.Model.ModelMethod<boolean>;
}
