/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/ITimestampsFeature.d.ts" />
import { FeatureBase } from './FeatureBase';
export declare class TimestampsFeature extends FeatureBase implements NajsEloquent.Feature.ITimestampsFeature {
    static DefaultSetting: NajsEloquent.Feature.ITimestampsSetting;
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    hasTimestamps(model: NajsEloquent.Model.IModel): boolean;
    getTimestampsSetting(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ITimestampsSetting;
    touch(model: NajsEloquent.Model.IModel): void;
}
