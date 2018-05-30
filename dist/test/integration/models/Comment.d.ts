import { EloquentMongoose, BelongsTo, BelongsToRelation } from '../../../lib';
import { User } from './User';
import { Post } from './Post';
export interface IComment {
    user_id?: string;
    email?: string;
    name?: string;
    content: string;
    like: number;
}
export interface ICommentRelations {
    user: BelongsTo<User>;
    post: BelongsTo<Post>;
    getUserRelation(): BelongsToRelation<User>;
    getPostRelation(): BelongsToRelation<Post>;
}
export interface Comment extends IComment, ICommentRelations {
}
export declare class Comment extends EloquentMongoose<IComment & ICommentRelations> {
    static className: string;
    protected static timestamps: boolean;
    protected static softDeletes: boolean;
    protected static schema: {
        user_id: {
            type: StringConstructor;
            required: boolean;
        };
        post_id: {
            type: StringConstructor;
            required: boolean;
        };
        email: {
            type: StringConstructor;
            required: boolean;
        };
        name: {
            type: StringConstructor;
            required: boolean;
        };
        content: {
            type: StringConstructor;
            required: boolean;
        };
        like: {
            type: NumberConstructor;
            required: boolean;
        };
    };
    getClassName(): string;
    getUserRelation(): BelongsToRelation<User>;
    getPostRelation(): BelongsToRelation<Post>;
}
