/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/IFillableFeature.d.ts" />
import { FeatureBase } from './FeatureBase';
export declare class FillableFeature extends FeatureBase implements NajsEloquent.Feature.IFillableFeature {
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    getFillable(model: NajsEloquent.Model.IModel): string[];
    setFillable(model: NajsEloquent.Model.IModel, fillable: string[]): void;
    addFillable(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): void;
    isFillable(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): boolean;
    getGuarded(model: NajsEloquent.Model.IModel): string[];
    setGuarded(model: NajsEloquent.Model.IModel, guarded: string[]): void;
    addGuarded(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): void;
    isGuarded(model: NajsEloquent.Model.IModel, keys: ArrayLike<string | string[]>): boolean;
    fill(model: NajsEloquent.Model.IModel, data: object): void;
    forceFill(model: NajsEloquent.Model.IModel, data: object): void;
}
