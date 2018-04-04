import { ChanceFaker } from './FactoryManager';
import { Eloquent } from '../model/Eloquent';
import { IFactoryBuilder, IFactoryBuilderCollection } from './interfaces/IFactoryBuilder';
export declare class FactoryBuilder<T extends Eloquent> implements IFactoryBuilder<T> {
    protected className: string;
    protected name: string;
    protected definitions: Object;
    protected definedStates: Object;
    protected faker: ChanceFaker;
    protected amount?: number;
    protected activeStates?: string[];
    constructor(className: string, name: string, definitions: Object, states: Object, faker: ChanceFaker);
    times(amount: number): IFactoryBuilderCollection<T>;
    states(state: string): this;
    states(states: string[]): this;
    states(...state: string[]): this;
    states(...states: Array<string[]>): this;
    create<T>(): Promise<T>;
    create<T>(attributes: Object): Promise<T>;
    make<T>(): T;
    make<T>(attributes: Object): T;
    raw<T>(): T;
    raw<T>(attributes: Object): T;
    protected makeInstance(attributes?: Object): any;
    protected getRawAttributes(attributes?: Object): any;
    protected applyStates(definition: Object, attributes?: Object): Object;
    protected triggerReferenceAttributes(attributes: Object): Object;
}
