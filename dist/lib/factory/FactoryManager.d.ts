/// <reference path="../contracts/FactoryManager.d.ts" />
/// <reference path="../contracts/FactoryBuilder.d.ts" />
/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/factory/IFactoryDefinition.d.ts" />
/// <reference types="chance" />
import ModelDefinition = NajsEloquent.Model.ModelDefinition;
import IFactoryDefinition = NajsEloquent.Factory.IFactoryDefinition;
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
    private addDefinition;
    protected getModelName(className: ModelDefinition): string;
    define(className: ModelDefinition, definition: IFactoryDefinition, name?: string): this;
    defineAs(className: ModelDefinition, name: string, definition: IFactoryDefinition): this;
    state(className: ModelDefinition, state: string, definition: IFactoryDefinition): this;
    of(className: ModelDefinition, name?: string): Najs.Contracts.Eloquent.FactoryBuilder<any>;
}
