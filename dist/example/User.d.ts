import { Schema } from 'mongoose';
import { Collection } from 'collect.js';
import { EloquentMongooseSpec } from '../lib';
export interface IUser {
    id?: string;
    first_name: string;
    last_name: string;
    full_name: string;
}
export declare const EloquentMongooseBase: EloquentMongooseSpec<IUser, User>;
export declare class User extends EloquentMongooseBase {
    static className: string;
    getClassName(): string;
    getSchema(): Schema;
    readonly full_name: string;
    static getAllUsers(): Promise<Collection<User>>;
}
