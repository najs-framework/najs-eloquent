import { ChanceFaker } from './FactoryManager';
import { IFactoryBuilder } from './interfaces/IFactoryBuilder';
export declare class FactoryBuilder implements IFactoryBuilder {
    protected className: string;
    protected name: string;
    protected definitions: Object;
    protected definedStates: Object;
    protected faker: ChanceFaker;
    protected amount?: number;
    protected activeStates?: string[];
    constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker);
    times(amount: number): this;
    states(state: string): this;
    states(states: string[]): this;
    states(...state: string[]): this;
    states(...states: Array<string[]>): this;
    create<T = any>(): Promise<T>;
    create<T = any>(attributes: Object): Promise<T>;
    make<T = any>(): T;
    make<T = any>(attributes: Object): T;
    raw<T = any>(): T;
    raw<T = any>(attributes: Object): T;
    protected makeInstance(attributes?: Object): any;
    protected getRawAttributes(attributes?: Object): any;
    protected applyStates(definition: Object, attributes?: Object): Object;
    protected triggerReferenceAttributes(attributes: Object): Object;
}
