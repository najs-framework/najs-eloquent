import { IQueryLog, QueryLogTransform as QueryLogTransformType, QueryLogItem as QueryLogItemType } from './log/interfaces/IQueryLog';
import { Collection } from 'collect.js';
import { ChanceFaker } from './factory/FactoryManager';
export declare type Faker = ChanceFaker;
export { Collection };
export { Eloquent, Mongoose, EloquentMongoose } from './model/Eloquent';
export { EloquentAttribute } from './model/EloquentAttribute';
export { EloquentMetadata } from './model/EloquentMetadata';
export { EloquentProxy } from './model/EloquentProxy';
export { IEloquentDriver } from './drivers/interfaces/IEloquentDriver';
export { DummyDriver } from './drivers/DummyDriver';
export { MongooseDriver } from './drivers/MongooseDriver';
export { SoftDelete } from './drivers/mongoose/SoftDelete';
export { NotFoundError } from './errors/NotFoundError';
export { EloquentDriverProviderFacade, EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade';
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade';
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade';
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade';
export { IFactory } from './factory/interfaces/IFactory';
export { IFactoryBuilder } from './factory/interfaces/IFactoryBuilder';
export { IFactoryManager } from './factory/interfaces/IFactoryManager';
export { FactoryBuilder } from './factory/FactoryBuilder';
export { FactoryManager } from './factory/FactoryManager';
export { FlipFlopQueryLog } from './log/FlipFlopQueryLog';
export { IEloquentDriverProvider } from './providers/interfaces/IEloquentDriverProvider';
export { IMongooseProvider } from './providers/interfaces/IMongooseProvider';
export { BuiltinMongooseProvider } from './providers/BuiltinMongooseProvider';
export { DriverManager } from './providers/DriverManager';
export { IBasicQuery } from './query-builders/interfaces/IBasicQuery';
export { IConditionQuery } from './query-builders/interfaces/IConditionQuery';
export { IFetchResultQuery } from './query-builders/interfaces/IFetchResultQuery';
export { IQueryConvention } from './query-builders/interfaces/IQueryConvention';
export { ISoftDeletesQuery } from './query-builders/interfaces/ISoftDeletesQuery';
export { MongodbConditionConverter } from './query-builders/mongodb/MongodbConditionConverter';
export { MongooseQueryBuilder } from './query-builders/mongodb/MongooseQueryBuilder';
export { MongooseQueryLog } from './query-builders/mongodb/MongooseQueryLog';
export { GenericQueryBuilder } from './query-builders/GenericQueryBuilder';
export { GenericQueryCondition } from './query-builders/GenericQueryCondition';
export { Seeder } from './seed/Seeder';
export declare namespace NajsEloquent {
    namespace Contracts {
        namespace Log {
            type QueryLogTransform = QueryLogTransformType;
            type QueryLogItem = QueryLogItemType;
            interface QueryLog extends IQueryLog {
            }
        }
    }
}
