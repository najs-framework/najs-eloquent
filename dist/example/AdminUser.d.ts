import { EloquentMongooseSpec } from '../lib';
import { Schema } from 'mongoose';
export interface IAdminUser {
    id?: string;
    is_admin: true;
}
export declare const AdminUserBase: EloquentMongooseSpec<IAdminUser & {
    getSchema(): Schema;
}, AdminUser>;
export declare class AdminUser extends AdminUserBase {
    static className: string;
    getModelName(): string;
    getClassName(): string;
    getSchema(): Schema;
}
