/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/relations/IRelationship.d.ts" />
/// <reference path="../definitions/features/ISerializationFeature.d.ts" />
import Model = NajsEloquent.Model.IModel;
import Options = NajsEloquent.Feature.ToObjectOptions;
import { FeatureBase } from './FeatureBase';
export declare class SerializationFeature extends FeatureBase implements NajsEloquent.Feature.ISerializationFeature {
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    getVisible(model: Model): string[];
    setVisible(model: NajsEloquent.Model.IModel, visible: string[]): void;
    addVisible(model: Model, keys: ArrayLike<string | string[]>): void;
    makeVisible(model: Model, keys: ArrayLike<string | string[]>): void;
    isVisible(model: Model, keys: ArrayLike<string | string[]>): boolean;
    getHidden(model: Model): string[];
    setHidden(model: NajsEloquent.Model.IModel, hidden: string[]): void;
    addHidden(model: Model, keys: ArrayLike<string | string[]>): void;
    makeHidden(model: Model, keys: ArrayLike<string | string[]>): void;
    isHidden(model: Model, keys: ArrayLike<string | string[]>): boolean;
    attributesToObject(model: Model, shouldApplyVisibleAndHidden?: boolean): object;
    relationDataToObject(model: Model, data: any, chains: string[], relationName: string, formatName: boolean): any;
    relationsToObject(model: Model, names: string[] | undefined, formatName: boolean, shouldApplyVisibleAndHidden?: boolean): object;
    applyVisibleAndHiddenFor(model: Model, data: object): {};
    toObject(model: Model, options?: Options): object;
    toJson(model: Model, replacer?: (key: string, value: any) => any, space?: string | number): string;
}
