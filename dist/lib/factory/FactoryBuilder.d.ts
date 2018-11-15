/// <reference path="../contracts/FactoryBuilder.d.ts" />
/// <reference path="../../../lib/definitions/collect.js/index.d.ts" />
import { ChanceFaker } from './FactoryManager';
import { Model } from '../model/Model';
export interface FactoryBuilder<T extends Model> extends Najs.Contracts.Eloquent.FactoryBuilder<T> {
}
export declare class FactoryBuilder<T extends Model> {
    protected className: string;
    protected name: string;
    protected definitions: Object;
    protected definedStates: Object;
    protected faker: ChanceFaker;
    protected amount?: number;
    protected activeStates?: string[];
    constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker);
    getClassName(): string;
    times(amount: number): any;
    states(...states: any[]): this;
    create(attributes?: Object): Promise<any>;
    make(attributes?: Object): any;
    raw(attributes?: Object): any;
    makeModelInstance(attributes?: Object): any;
    getRawAttributes(attributes?: Object): any;
    applyStates(definition: Object, attributes?: Object): Object;
    triggerReferenceAttributes(attributes: Object): Object;
}
