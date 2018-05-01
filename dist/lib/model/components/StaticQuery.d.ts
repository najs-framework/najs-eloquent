/// <reference path="../../contracts/Component.d.ts" />
/// <reference path="../interfaces/IModel.d.ts" />
export declare class StaticQuery implements Najs.Contracts.Eloquent.Component {
    static className: string;
    getClassName(): string;
    extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    static newQuery(this: any): any;
    static readonly ForwardToNewQueryMethods: string[];
    static forwardToNewQuery(name: string): any;
}
