/// <reference path="../definitions/utils/IClassSetting.d.ts" />
export declare const CREATE_SAMPLE = "create-sample";
export declare class ClassSetting implements NajsEloquent.Util.IClassSetting {
    protected sample: Object;
    protected definition: Function;
    protected instance: Object;
    private constructor();
    private constructor();
    /**
     * Read the setting with given property and the setting reader callback.
     *
     * @param {string} property
     * @param {Function} reader
     */
    read<T>(property: string, reader: NajsEloquent.Util.ISettingReader<T>): T;
    /**
     * Get the "sample" instance.
     */
    getSample<T extends Object>(): T;
    /**
     * Get definition of the class.
     */
    getDefinition(): Function;
    private clone;
    /**
     * store ClassSetting instance with "sample"
     */
    protected static samples: Object;
    static get(instance: Object, cache?: boolean): ClassSetting;
    /**
     * get ClassSetting Reader of an instance with instance's value
     */
    static of(instance: Object): ClassSetting;
    static of(instance: Object, cache: boolean): ClassSetting;
}
