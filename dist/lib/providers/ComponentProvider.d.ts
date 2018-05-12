/// <reference path="../contracts/ComponentProvider.d.ts" />
import { Facade } from 'najs-facade';
export declare class ComponentProvider extends Facade implements Najs.Contracts.Eloquent.ComponentProvider {
    static className: string;
    protected components: {
        [key: string]: {
            className: string;
            index: number;
            isDefault: boolean;
        };
    };
    protected binding: {
        [key: string]: string[];
    };
    protected extended: {
        [key: string]: string[];
    };
    getClassName(): string;
    extend(model: Object, driver: Najs.Contracts.Eloquent.Driver<any>): any;
    private resolveComponents(model, driver);
    getComponents(model?: string): string[];
    resolve(component: string): Najs.Contracts.Eloquent.Component;
    register(component: string | Function, name: string, isDefault?: boolean): this;
    bind(model: string, component: string): this;
}
