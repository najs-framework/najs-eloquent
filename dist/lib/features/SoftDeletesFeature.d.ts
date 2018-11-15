/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/ISoftDeletesFeature.d.ts" />
import { FeatureBase } from './FeatureBase';
export declare class SoftDeletesFeature extends FeatureBase implements NajsEloquent.Feature.ISoftDeletesFeature {
    static DefaultSetting: NajsEloquent.Feature.ISoftDeletesSetting;
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    hasSoftDeletes(model: NajsEloquent.Model.IModel): boolean;
    getSoftDeletesSetting(model: NajsEloquent.Model.IModel): NajsEloquent.Feature.ISoftDeletesSetting;
    trashed(model: NajsEloquent.Model.IModel): boolean;
    forceDelete(model: NajsEloquent.Model.IModel): Promise<boolean>;
    restore(model: NajsEloquent.Model.IModel): Promise<boolean>;
}
