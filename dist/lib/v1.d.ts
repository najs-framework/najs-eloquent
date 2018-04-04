import { Collection } from 'collect.js';
import { EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade';
import { MongooseDriver } from './drivers/MongooseDriver';
import { ChanceFaker, FactoryManager as FactoryManagerClass } from './factory/FactoryManager';
import { FactoryBuilder as FactoryBuilderClass } from './factory/FactoryBuilder';
import { FlipFlopQueryLog as FlipFlopQueryLogClass } from './log/FlipFlopQueryLog';
import { GenericQueryBuilder as GenericQueryBuilderClass } from './query-builders/GenericQueryBuilder';
import { GenericQueryCondition as GenericQueryConditionClass } from './query-builders/GenericQueryCondition';
import { BuiltinMongooseProvider } from './providers/BuiltinMongooseProvider';
import { DriverManager as DriverManagerClass } from './providers/DriverManager';
import { MongooseQueryLog as MongooseQueryLogClass } from './query-builders/mongodb/MongooseQueryLog';
import { MongodbConditionConverter as MongodbConditionConverterClass } from './query-builders/mongodb/MongodbConditionConverter';
import { MongooseQueryBuilder as MongooseQueryBuilderClass } from './query-builders/mongodb/MongooseQueryBuilder';
import { IQueryLog, IQueryLogTransform, IQueryLogItem } from './log/interfaces/IQueryLog';
import { IFactory } from './factory/interfaces/IFactory';
import { IFactoryBuilder, IFactoryBuilderCollection } from './factory/interfaces/IFactoryBuilder';
import { IFactoryManager } from './factory/interfaces/IFactoryManager';
import { IEloquentDriverProvider } from './providers/interfaces/IEloquentDriverProvider';
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
            interface Factory<T> extends IFactory<T> {
            }
            interface FactoryBuilder<T> extends IFactoryBuilder<T> {
            }
            interface FactoryBuilderCollection<T> extends IFactoryBuilderCollection<T> {
            }
            interface FactoryManager<T> extends IFactoryManager<T> {
            }
        }
        namespace QueryBuilder {
        }
        namespace Provider {
            interface EloquentDriverProvider extends IEloquentDriverProvider {
            }
        }
        namespace Driver {
        }
        namespace Log {
            interface QueryLogTransform extends IQueryLogTransform {
            }
            interface QueryLogItem extends IQueryLogItem {
            }
            interface QueryLog extends IQueryLog {
            }
        }
    }
}
