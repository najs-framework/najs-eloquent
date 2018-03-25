import { Facade } from 'najs-facade';
import { IAutoload } from 'najs-binding';
import { IFactoryBuilder } from './interfaces/IFactoryBuilder';
import { IFactoryManager, FactoryDefinition } from './interfaces/IFactoryManager';
export declare type ChanceFaker = Chance.Chance;
export declare class FactoryManager extends Facade implements IAutoload, IFactoryManager<ChanceFaker> {
    static className: string;
    protected faker: ChanceFaker;
    protected definitions: Object;
    protected states: Object;
    constructor();
    getClassName(): string;
    private initBagIfNeeded(name, className);
    define(className: string, definition: FactoryDefinition<ChanceFaker>, name?: string): this;
    defineAs(className: string, name: string, definition: FactoryDefinition<ChanceFaker>): this;
    state(className: string, state: string, definition: FactoryDefinition<ChanceFaker>): this;
    of(className: string): IFactoryBuilder;
    of(className: string, name: string): IFactoryBuilder;
    create(className: string, attributes?: Object): any;
    createAs(className: string, name: string, attributes?: Object): any;
    make(className: string, attributes?: Object): any;
    makeAs(className: string, name: string, attributes?: Object): any;
    raw(className: string, attributes?: Object): any;
    rawOf(className: string, name: string, attributes?: Object): any;
}
