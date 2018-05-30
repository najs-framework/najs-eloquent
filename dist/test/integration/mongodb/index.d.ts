import '../ModelFactory';
import { IUser, User } from '../models/User';
import { IPost, Post } from '../models/Post';
import { IComment, Comment } from '../models/Comment';
export { IUser, User };
export { IPost, Post };
export { IComment, Comment };
export declare function init_mongoose(name: string): Promise<any>;
export declare function delete_collection(collections: string[]): Promise<any>;
