import { Eloquent, HasMany, HasManyRelation } from '../../../lib';
import { Post } from './Post';
export interface IUser {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    age: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
export interface IUserRelations {
    posts: HasMany<Post>;
    getPostsRelation(): HasManyRelation<Post>;
}
/**
 * User model, extends from Eloquent<IPost>
 *   - supports full definitions of Eloquent<IPost>
 *   - DO NOT SUPPORT definitions of static API
 */
export interface User extends IUser, IUserRelations {
}
export declare class User extends Eloquent<IUser & IUserRelations> {
    static className: string;
    static timestamps: boolean;
    static softDeletes: boolean;
    static fillable: string[];
    static hidden: string[];
    static schema: {
        email: {
            type: StringConstructor;
            required: boolean;
        };
        password: {
            type: StringConstructor;
            required: boolean;
        };
        first_name: {
            type: StringConstructor;
            required: boolean;
        };
        last_name: {
            type: StringConstructor;
            required: boolean;
        };
        age: {
            type: NumberConstructor;
            default: number;
        };
    };
    getClassName(): string;
    getHashedPassword(): string;
    setRawPassword(password: string): void;
    getPostsRelation(): HasManyRelation<Post>;
}
