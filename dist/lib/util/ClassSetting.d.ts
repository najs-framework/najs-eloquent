/// <reference path="interfaces/ISettingReader.d.ts" />
export declare const CREATE_SAMPLE = "create-sample";
export declare class ClassSetting {
    protected sample: Object;
    protected definition: Function;
    protected instance: Object;
    private constructor();
    private constructor();
    read<T>(property: string, reader: NajsEloquent.Util.ISettingReader<T>): T;
    private clone(instance);
    /**
     * store ClassSetting instance with "sample"
     */
    protected static samples: Object;
    /**
     * get ClassSetting Reader of an instance with instance's value
     */
    static of(instance: Object): ClassSetting;
    static of(instance: Object, cache: boolean): ClassSetting;
}
