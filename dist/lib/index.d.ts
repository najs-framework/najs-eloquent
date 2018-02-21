import { EloquentMongoose } from './eloquent/EloquentMongoose';
import { EloquentMongooseSpec } from './specs/EloquentMongooseSpec';
export declare const Mongoose: typeof EloquentMongoose;
export declare const Eloquent: {
    Mongoose<T, R>(): EloquentMongooseSpec<T, R>;
};
export default Eloquent;
export { QueryLog } from './query-builders/QueryLog';
export { EloquentBase } from './eloquent/EloquentBase';
export { IMongooseProvider } from './interfaces/IMongooseProvider';
export { EloquentMongooseSpec } from './specs/EloquentMongooseSpec';
