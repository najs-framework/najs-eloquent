/// <reference path="../contracts/Driver.d.ts" />
/// <reference path="../definitions/features/ISettingFeature.d.ts" />
/// <reference path="../definitions/features/IEventFeature.d.ts" />
/// <reference path="../definitions/features/IQueryFeature.d.ts" />
/// <reference path="../definitions/features/IFillableFeature.d.ts" />
/// <reference path="../definitions/features/ISerializationFeature.d.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.d.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.d.ts" />
/// <reference path="../definitions/features/IRelationFeature.d.ts" />
/// <reference path="../definitions/query-builders/IQueryBuilder.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import '../features/SettingFeature';
import '../features/EventFeature';
import '../features/QueryFeature';
import '../features/FillableFeature';
import '../features/SerializationFeature';
import '../features/TimestampsFeature';
import '../features/SoftDeletesFeature';
import '../features/RelationFeature';
/**
 * Base class of all drivers, handling:
 *   - generic initialize for makeModel()
 *   - make common/share features
 *   - attachPublicApi logic, ensure that the model prototype should be attached 1 time only.
 */
export declare abstract class DriverBase<T> implements Najs.Contracts.Eloquent.Driver<T> {
    protected attachedModels: object;
    protected settingFeature: NajsEloquent.Feature.ISettingFeature;
    protected eventFeature: NajsEloquent.Feature.IEventFeature;
    protected queryFeature: NajsEloquent.Feature.IQueryFeature;
    protected fillableFeature: NajsEloquent.Feature.IFillableFeature;
    protected serializationFeature: NajsEloquent.Feature.ISerializationFeature;
    protected timestampsFeature: NajsEloquent.Feature.ITimestampsFeature;
    protected softDeletesFeature: NajsEloquent.Feature.ISoftDeletesFeature;
    protected relationFeature: NajsEloquent.Feature.IRelationFeature;
    protected static globalEventEmitter: Najs.Contracts.Event.AsyncEventEmitter;
    constructor();
    abstract getClassName(): string;
    abstract getRecordManager(): NajsEloquent.Feature.IRecordManager<T>;
    abstract makeQueryBuilderFactory(): NajsEloquent.QueryBuilder.IQueryBuilderFactory;
    getSettingFeature(): NajsEloquent.Feature.ISettingFeature;
    getEventFeature(): NajsEloquent.Feature.IEventFeature;
    getQueryFeature(): NajsEloquent.Feature.IQueryFeature;
    getFillableFeature(): NajsEloquent.Feature.IFillableFeature;
    getSerializationFeature(): NajsEloquent.Feature.ISerializationFeature;
    getTimestampsFeature(): NajsEloquent.Feature.ITimestampsFeature;
    getSoftDeletesFeature(): NajsEloquent.Feature.ISoftDeletesFeature;
    getGlobalEventEmitter(): Najs.Contracts.Event.AsyncEventEmitter;
    getRelationFeature(): NajsEloquent.Feature.IRelationFeature;
    makeModel<M extends IModel>(model: M, data?: T | object | string, isGuarded?: boolean): M;
    applyProxy<M extends IModel>(model: M): M;
    shouldBeProxied(target: NajsEloquent.Model.ModelInternal, name: any): boolean;
    proxify(type: 'get' | 'set', model: NajsEloquent.Model.IModel, name: string, value?: any): any;
    attachPublicApiIfNeeded(model: IModel): void;
    definePropertiesBeforeAttachFeatures(model: IModel, prototype: object, bases: object[]): void;
    definePropertiesAfterAttachFeatures(model: IModel, prototype: object, bases: object[]): void;
    getSharedFeatures(): NajsEloquent.Feature.IFeature[];
    getCustomFeatures(): NajsEloquent.Feature.IFeature[];
    getFeatures(): NajsEloquent.Feature.IFeature[];
    attachFeatureIfNeeded(feature: NajsEloquent.Feature.IFeature, prototype: object, bases: object[]): void;
}
