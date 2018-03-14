import { EloquentMongoose } from './eloquent/EloquentMongoose';
import { EloquentMongooseSpec } from './specs/EloquentMongooseSpec';
export declare const Mongoose: typeof EloquentMongoose;
export declare const Eloquent: {
    Mongoose<T, R>(): EloquentMongooseSpec<T, R>;
};
export default Eloquent;
export { QueryLog } from './query-builders/QueryLog';
export { EloquentBase } from './eloquent/EloquentBase';
export { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './eloquent/EloquentMetadata';
export { IMongooseProvider } from './interfaces/IMongooseProvider';
export { IBasicQueryConditionGrammar, IBasicQueryGrammar } from './interfaces/IBasicQueryGrammar';
export { IEloquent } from './interfaces/IEloquent';
export { IQueryFetchResult } from './interfaces/IQueryFetchResult';
export { EloquentMongooseSpec } from './specs/EloquentMongooseSpec';
