import { IFacadeContainer } from 'najs-facade';
import { ModelAttribute } from './model/components/ModelAttribute';
import { ModelFillable } from './model/components/ModelFillable';
import { ModelSerialization } from './model/components/ModelSerialization';
import { ModelQuery } from './model/components/ModelQuery';
import { ModelTimestamps } from './model/components/ModelTimestamps';
import { ModelSoftDeletes } from './model/components/ModelSoftDeletes';
import { ModelActiveRecord } from './model/components/ModelActiveRecord';
import { ModelSetting } from './model/components/ModelSetting';
import { StaticQuery } from './model/components/StaticQuery';
import { DynamicAttribute } from './model/components/DynamicAttribute';
import { DriverProvider } from './providers/DriverProvider';
import { ComponentProvider } from './providers/ComponentProvider';
import { MongooseProvider } from './providers/MongooseProvider';
import { GenericQueryBuilder } from './query-builders/GenericQueryBuilder';
import { MongodbConditionConverter } from './query-builders/mongodb/MongodbConditionConverter';
import { MongooseQueryBuilder } from './query-builders/mongodb/MongooseQueryBuilder';
import { MongooseQueryLog } from './query-builders/mongodb/MongooseQueryLog';
import { QueryBuilderWrapper } from './wrappers/QueryBuilderWrapper';
import { MongooseQueryBuilderWrapper } from './wrappers/MongooseQueryBuilderWrapper';
export declare type BuiltinClasses = {
    FacadeContainer: IFacadeContainer;
    Model: {
        Component: {
            ModelAttribute: typeof ModelAttribute;
            ModelFillable: typeof ModelFillable;
            ModelSerialization: typeof ModelSerialization;
            ModelQuery: typeof ModelQuery;
            ModelTimestamps: typeof ModelTimestamps;
            ModelSoftDeletes: typeof ModelSoftDeletes;
            ModelActiveRecord: typeof ModelActiveRecord;
            ModelSetting: typeof ModelSetting;
            DynamicAttribute: typeof DynamicAttribute;
            StaticQuery: typeof StaticQuery;
        };
    };
    Provider: {
        DriverProvider: typeof DriverProvider;
        ComponentProvider: typeof ComponentProvider;
        MongooseProvider: typeof MongooseProvider;
    };
    QueryBuilder: {
        GenericQueryBuilder: typeof GenericQueryBuilder;
        Mongodb: {
            MongodbConditionConverter: typeof MongodbConditionConverter;
            MongooseQueryBuilder: typeof MongooseQueryBuilder;
            MongooseQueryLog: typeof MongooseQueryLog;
        };
    };
    Wrapper: {
        QueryBuilderWrapper: typeof QueryBuilderWrapper;
        MongooseQueryBuilderWrapper: typeof MongooseQueryBuilderWrapper;
    };
};
