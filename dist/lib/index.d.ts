import { EloquentMongoose } from './v0.x/eloquent/EloquentMongoose';
import { EloquentMongooseSpec } from './v0.x/specs/EloquentMongooseSpec';
export declare const Mongoose: typeof EloquentMongoose;
export declare const Eloquent: {
    Mongoose<T, R>(): EloquentMongooseSpec<T, R>;
};
export default Eloquent;
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade';
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade';
export { EloquentBase } from './v0.x/eloquent/EloquentBase';
export { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './v0.x/eloquent/EloquentMetadata';
export { IMongooseProvider } from './v0.x/interfaces/IMongooseProvider';
export { IBasicQueryConditionGrammar, IBasicQueryGrammar } from './v0.x/interfaces/IBasicQueryGrammar';
export { IEloquent } from './v0.x/interfaces/IEloquent';
export { IQueryFetchResult } from './v0.x/interfaces/IQueryFetchResult';
export { EloquentMongooseSpec } from './v0.x/specs/EloquentMongooseSpec';
