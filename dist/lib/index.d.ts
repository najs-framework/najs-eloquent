/// <reference path="../../lib/collect.js/index.d.ts" />
/// <reference path="contracts/Driver.d.ts" />
/// <reference path="contracts/DriverProvider.d.ts" />
/// <reference path="contracts/Component.d.ts" />
/// <reference path="contracts/ComponentProvider.d.ts" />
/// <reference path="contracts/QueryLog.d.ts" />
/// <reference path="contracts/MongooseProvider.d.ts" />
/// <reference path="model/interfaces/IModel.d.ts" />
/// <reference path="model/interfaces/IModelQuery.d.ts" />
import { BuiltinClasses } from './builtin';
import { ChanceFaker } from './factory/FactoryManager';
export declare type Faker = ChanceFaker;
export { QueryLogFacade, QueryLog } from './facades/global/QueryLogFacade';
export { EloquentDriverProviderFacade, EloquentDriverProvider } from './facades/global/EloquentDriverProviderFacade';
export { EloquentComponentProviderFacade, EloquentComponentProvider } from './facades/global/EloquentComponentProviderFacade';
export { MongooseProviderFacade, MongooseProvider } from './facades/global/MongooseProviderFacade';
export { FactoryFacade, Factory, factory } from './facades/global/FactoryFacade';
export { NotFoundError } from './errors/NotFoundError';
export { Model } from './model/Model';
export { Eloquent, EloquentStaticMongoose } from './model/Eloquent';
export { EloquentMongoose } from './model/EloquentMongoose';
export { DummyDriver } from './drivers/DummyDriver';
export { MongooseDriver } from './drivers/MongooseDriver';
export declare const NajsEloquent: BuiltinClasses;
