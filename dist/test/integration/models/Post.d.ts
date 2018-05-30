import { EloquentStaticMongoose, HasMany, HasManyRelation, BelongsTo, BelongsToRelation } from '../../../lib';
import { User } from './User';
import { Comment } from './Comment';
export interface IPost {
    user_id: string;
    title: string;
    content: string;
    view: number;
}
export interface IPostRelations {
    user: BelongsTo<User>;
    comments: HasMany<Comment>;
    getUserRelation(): BelongsToRelation<User>;
    getCommentsRelation(): HasManyRelation<Comment>;
}
export declare const PostBase: EloquentStaticMongoose<IPost & IPostRelations>;
/**
 * Post model, extends from Eloquent.Mongoose<IPost>(), supports
 *   - full definitions of Eloquent<IPost>
 *   - full definitions of static API
 */
export interface Post extends IPost, IPostRelations {
}
export declare class Post extends PostBase {
    static className: string;
    protected static timestamps: boolean;
    protected static softDeletes: boolean;
    protected static schema: {
        user_id: {
            type: StringConstructor;
            required: boolean;
        };
        title: {
            type: StringConstructor;
            required: boolean;
        };
        content: {
            type: StringConstructor;
            required: boolean;
        };
        view: {
            type: NumberConstructor;
            required: boolean;
        };
    };
    getClassName(): string;
    getUserRelation(): BelongsToRelation<User>;
    getCommentsRelation(): HasManyRelation<Comment>;
}
