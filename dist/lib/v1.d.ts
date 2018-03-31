import { Collection } from 'collect.js';
import { ChanceFaker } from './factory/FactoryManager';
import { EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade';
import { MongooseDriver } from './drivers/MongooseDriver';
import { FactoryManager as FactoryManagerClass } from './factory/FactoryManager';
import { FactoryBuilder as FactoryBuilderClass } from './factory/FactoryBuilder';
import { FlipFlopQueryLog as FlipFlopQueryLogClass } from './log/FlipFlopQueryLog';
import { GenericQueryBuilder as GenericQueryBuilderClass } from './query-builders/GenericQueryBuilder';
import { GenericQueryCondition as GenericQueryConditionClass } from './query-builders/GenericQueryCondition';
import { BuiltinMongooseProvider } from './providers/BuiltinMongooseProvider';
import { DriverManager as DriverManagerClass } from './providers/DriverManager';
import { MongooseQueryLog as MongooseQueryLogClass } from './query-builders/mongodb/MongooseQueryLog';
import { MongodbConditionConverter as MongodbConditionConverterClass } from './query-builders/mongodb/MongodbConditionConverter';
import { MongooseQueryBuilder as MongooseQueryBuilderClass } from './query-builders/mongodb/MongooseQueryBuilder';
import { IQueryLog, QueryLogTransform as QueryLogTransformType, QueryLogItem as QueryLogItemType } from './log/interfaces/IQueryLog';
export declare type Faker = ChanceFaker;
export { Collection };
export { Eloquent, Mongoose, EloquentMongoose } from './model/Eloquent';
export { NajsEloquentClass } from './constants';
export { IEloquentDriver } from './drivers/interfaces/IEloquentDriver';
export { MongooseDriver };
export { NotFoundError } from './errors/NotFoundError';
export { Seeder } from './seed/Seeder';
export { EloquentDriverProvider };
export { EloquentDriverProviderFacade } from './facades/global/EloquentDriverProviderFacade';
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade';
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade';
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade';
export { IFactory } from './factory/interfaces/IFactory';
export { IFactoryBuilder } from './factory/interfaces/IFactoryBuilder';
export { IFactoryManager } from './factory/interfaces/IFactoryManager';
export { IEloquentDriverProvider } from './providers/interfaces/IEloquentDriverProvider';
export { IMongooseProvider } from './providers/interfaces/IMongooseProvider';
export { IBasicQuery } from './query-builders/interfaces/IBasicQuery';
export { IConditionQuery } from './query-builders/interfaces/IConditionQuery';
export { IFetchResultQuery } from './query-builders/interfaces/IFetchResultQuery';
export { IQueryConvention } from './query-builders/interfaces/IQueryConvention';
export { ISoftDeletesQuery } from './query-builders/interfaces/ISoftDeletesQuery';
export declare namespace NajsEloquent {
    namespace Builtin {
        const FactoryManager: typeof FactoryManagerClass;
        const FactoryBuilder: typeof FactoryBuilderClass;
        const FlipFlopQueryLog: typeof FlipFlopQueryLogClass;
        const GenericQueryBuilder: typeof GenericQueryBuilderClass;
        const GenericQueryCondition: typeof GenericQueryConditionClass;
        const MongodbConditionConverter: typeof MongodbConditionConverterClass;
        const MongooseQueryBuilder: typeof MongooseQueryBuilderClass;
        const MongooseQueryLog: typeof MongooseQueryLogClass;
        const MongooseProvider: typeof BuiltinMongooseProvider;
        const DriverManager: typeof DriverManagerClass;
    }
    namespace Contracts {
        namespace Factory {
        }
        namespace QueryBuilder {
        }
        namespace Provider {
        }
        namespace Driver {
        }
        namespace Log {
            type QueryLogTransform = QueryLogTransformType;
            type QueryLogItem = QueryLogItemType;
            interface QueryLog extends IQueryLog {
            }
        }
    }
}
