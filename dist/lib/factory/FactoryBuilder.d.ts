/// <reference path="../contracts/FactoryBuilder.d.ts" />
import { ChanceFaker } from './FactoryManager';
import { Eloquent } from '../model/Eloquent';
export interface FactoryBuilder<T extends Eloquent> extends Najs.Contracts.Eloquent.FactoryBuilder<T>, Najs.Contracts.Eloquent.FactoryBuilderCollection<T> {
}
export declare class FactoryBuilder<T extends Eloquent> {
    protected className: string;
    protected name: string;
    protected definitions: Object;
    protected definedStates: Object;
    protected faker: ChanceFaker;
    protected amount?: number;
    protected activeStates?: string[];
    constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker);
    times(amount: number): any;
    states(...states: any[]): this;
    create(attributes?: Object): Promise<any>;
    make(attributes?: Object): any;
    raw(attributes?: Object): any;
    protected makeInstance(attributes?: Object): any;
    protected getRawAttributes(attributes?: Object): any;
    protected applyStates(definition: Object, attributes?: Object): Object;
    protected triggerReferenceAttributes(attributes: Object): Object;
}
