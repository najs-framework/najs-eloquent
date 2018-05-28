/// <reference path="../contracts/FactoryManager.d.ts" />
/// <reference path="../contracts/FactoryBuilder.d.ts" />
/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference types="chance" />
import './FactoryBuilder';
import { Facade } from 'najs-facade';
export declare type ChanceFaker = Chance.Chance;
export interface FactoryManager extends Najs.Contracts.Eloquent.FactoryManager {
}
export declare class FactoryManager extends Facade implements Najs.Contracts.Eloquent.FactoryManager {
    static className: string;
    protected faker: ChanceFaker;
    protected definitions: Object;
    protected states: Object;
    constructor();
    getClassName(): string;
    protected addDefinition(bag: string, className: any, name: string, definition: any): this;
    private parseModelName(className);
    define(className: string | {
        new (): any;
    }, definition: NajsEloquent.Factory.FactoryDefinition, name?: string): this;
    defineAs(className: string | {
        new (): any;
    }, name: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
    state(className: string | {
        new (): any;
    }, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
    of(className: string | {
        new (): any;
    }, name?: string): Najs.Contracts.Eloquent.FactoryBuilder<any>;
}
