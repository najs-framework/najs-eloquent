import { Eloquent } from './Eloquent';
export declare class EloquentAttribute {
    protected known: string[];
    protected dynamic: {
        [key: string]: {
            name: string;
            getter: boolean;
            setter: boolean;
            accessor?: string;
            mutator?: string;
        };
    };
    constructor(model: Eloquent, prototype: any);
    protected createDynamicAttributeIfNeeded(property: string): void;
    isKnownAttribute(name: string | Symbol): boolean;
    buildKnownAttributes(model: Eloquent, prototype: any): void;
    findGettersAndSetters(prototype: any): void;
    findAccessorsAndMutators(model: Eloquent<any>, prototype: any): void;
    getAttribute(target: Eloquent<any>, attribute: string): any;
    setAttribute(target: Eloquent<any>, attribute: string, value: any): boolean;
}
