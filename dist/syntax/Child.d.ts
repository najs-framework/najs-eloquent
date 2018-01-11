import { Schema } from 'mongoose';
import { Parent } from './Parent';
import { EloquentMongooseSpec } from '../lib';
export interface IChildVirtualAttribute {
    child_virtual_attribute: Date;
}
export declare const ChildBase: EloquentMongooseSpec<Parent & IChildVirtualAttribute, Parent & Child>;
export declare class Child extends ChildBase {
    static className: string;
    getClassName(): string;
    getSchema(): Schema;
    readonly child_getter: string;
    child_setter: string;
    childMethod(): void;
    static childStaticMethod(): void;
}
export declare function test_syntax(): void;
