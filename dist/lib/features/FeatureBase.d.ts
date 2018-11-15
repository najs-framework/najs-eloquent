/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/ISettingFeature.d.ts" />
/// <reference path="../definitions/features/IRecordManager.d.ts" />
/// <reference path="../definitions/features/ISerializationFeature.d.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.d.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.d.ts" />
/// <reference path="../definitions/features/IRelationFeature.d.ts" />
export declare abstract class FeatureBase {
    abstract getPublicApi(): object | undefined;
    attachPublicApi(prototype: object, bases: object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    useInternalOf(model: NajsEloquent.Model.IModel): NajsEloquent.Model.ModelInternal;
    useSettingFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISettingFeature;
    useRecordManagerOf<T>(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IRecordManager<T>;
    useFillableFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IFillableFeature;
    useSerializationFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISerializationFeature;
    useTimestampsFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ITimestampsFeature;
    useSoftDeletesFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISoftDeletesFeature;
    useRelationFeatureOf(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.IRelationFeature;
}
