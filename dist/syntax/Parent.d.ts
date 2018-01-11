import { Schema } from 'mongoose';
import { EloquentMongooseSpec } from '../lib/specs/EloquentMongooseSpec';
export interface IParentVirtualAttribute {
    parent_virtual_attribute: Date;
}
export declare const BaseClass: EloquentMongooseSpec<IParentVirtualAttribute, Parent>;
export declare class Parent extends BaseClass {
    static className: string;
    getClassName(): string;
    getSchema(): Schema;
    readonly parent_getter: string;
    parent_setter: string;
    parentMethod(): void;
    static parentStaticMethod(): void;
}
export declare function test_syntax(): void;
