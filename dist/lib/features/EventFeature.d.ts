/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/features/IEventFeature.d.ts" />
import { FeatureBase } from './FeatureBase';
export declare class EventFeature extends FeatureBase implements NajsEloquent.Feature.IEventFeature {
    getPublicApi(): object;
    getFeatureName(): string;
    getClassName(): string;
    fire(model: NajsEloquent.Model.IModel, eventName: string, args: any): Promise<void>;
    getEventEmitter(model: NajsEloquent.Model.IModel): Najs.Contracts.Event.AsyncEventEmitter;
    getGlobalEventEmitter(model: NajsEloquent.Model.IModel): Najs.Contracts.Event.AsyncEventEmitter;
}
