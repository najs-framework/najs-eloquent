/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
/// <reference path="../interfaces/IModelDynamicAttribute.d.ts" />
export declare class DynamicAttribute implements Najs.Contracts.Eloquent.Component {
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static hasAttribute(this: NajsEloquent.Model.IModel<any>, key: string): boolean;
    static bindAccessorsAndMutators(prototype: Object, knownAttributes: string[], dynamicAttributes: Object): void;
    static buildAccessorAndMutatorDescriptor(prototype: Object, name: string, settings: NajsEloquent.Model.DynamicAttributeSettings): Object | undefined;
    static buildDynamicAttributes(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): {};
    static findGettersAndSetters(dynamicAttributes: Object, prototype: Object): void;
    static findAccessorsAndMutators(bucket: Object, prototype: any, driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static createDynamicAttributeIfNeeded(bucket: Object, property: string): void;
    static buildKnownAttributes(prototype: Object, bases: Object[]): string[];
}
