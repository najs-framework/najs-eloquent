/// <reference path="./IFeature.ts" />
/// <reference path="../model/IModel.ts" />
/// <reference path="../utils/IClassSetting.ts" />

namespace NajsEloquent.Feature {
  export interface ISettingFeature extends IFeature {
    /**
     * Get IClassSetting instance of the model
     *
     * @param {Model} model
     */
    getClassSetting(model: Model.IModel): Util.IClassSetting

    /**
     * Get setting property, just use static or sample version, instance value is skipped.
     *
     * @param {Model} model
     * @param {string} property
     * @param {mixed} defaultValue
     */
    getSettingProperty<T>(model: Model.IModel, property: string, defaultValue: T): T

    /**
     * Determine setting is exist or not, just static or sample version only.
     *
     * @param {Model} model
     * @param {string} property
     * @param {mixed} defaultValue
     */
    hasSetting(model: Model.IModel, property: string): boolean

    /**
     * Get setting (static or sample only) and returns default value in case the setting === true
     *
     * @param {Model} model
     * @param {string} property
     * @param {mixed} defaultValue
     */
    getSettingWithDefaultForTrueValue<T>(model: Model.IModel, property: string, defaultValue: T): T

    /**
     * Get the model setting which ensure result is always an unique array
     *
     * @param {Model} model
     * @param {string} property Property name
     * @param {string[]} defaultValue default value in case there is no setting
     */
    getArrayUniqueSetting(model: Model.IModel, property: string, defaultValue: string[]): string[]

    /**
     * Push the args to setting in property, ensure the values are always unique
     *
     * @param {Model} model
     * @param {string} property Property name
     * @param {Array<string|string[]} args arguments
     */
    pushToUniqueArraySetting(model: Model.IModel, property: string, args: ArrayLike<any>): void

    /**
     * Determine that given key should be in white list and not in black list
     *
     * Note: it returns true if white list is empty and key not an attribute of model and not start with underscore.
     *
     * @param {Model} model
     * @param {Array<string|string[]>} keyList
     * @param {string[]} whiteList
     * @param {string[]} blackList
     */
    isInWhiteList(model: Model.IModel, keyList: ArrayLike<any>, whiteList: string[], blackList: string[]): boolean

    /**
     * Determine that given key should be in white list and not in black list
     *
     * Note: it returns true if white list is empty and key not an attribute of model and not start with underscore.
     *
     * @param {Model} model
     * @param {string} key
     * @param {string[]} whiteList
     * @param {string[]} blackList
     */
    isKeyInWhiteList(model: Model.IModel, key: string, whiteList: string[], blackList: string[]): boolean

    /**
     * Determine that given key is in the black list or not
     *
     * @param {Model} model
     * @param {Array<string|string[]>} key
     * @param {string[]} blackList
     */
    isInBlackList(model: Model.IModel, key: ArrayLike<any>, blackList: string[]): boolean

    /**
     * Determine that given key is in the black list or not
     *
     * @param {Model} model
     * @param {string} key
     * @param {string[]} blackList
     */
    isKeyInBlackList(model: Model.IModel, key: any, blackList: string[]): boolean
  }
}
