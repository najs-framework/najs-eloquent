"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ---------------------------------------------------------------------------------------------------------------------
// package: Data
const DataBuffer_1 = require("./data/DataBuffer");
const DataCollector_1 = require("./data/DataCollector");
const DataConditionMatcher_1 = require("./data/DataConditionMatcher");
var NajsEloquent;
(function (NajsEloquent) {
    var Data;
    (function (Data) {
        Data.DataBuffer = DataBuffer_1.DataBuffer;
        Data.DataCollector = DataCollector_1.DataCollector;
        Data.DataConditionMatcher = DataConditionMatcher_1.DataConditionMatcher;
    })(Data = NajsEloquent.Data || (NajsEloquent.Data = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package: Driver
const DriverBase_1 = require("./drivers/DriverBase");
const ExecutorBase_1 = require("./drivers/ExecutorBase");
const QueryLogBase_1 = require("./drivers/QueryLogBase");
const Record_1 = require("./drivers/Record");
const RecordConditionMatcher_1 = require("./drivers/RecordConditionMatcher");
const RecordConditionMatcherFactory_1 = require("./drivers/RecordConditionMatcherFactory");
const RecordDataReader_1 = require("./drivers/RecordDataReader");
const RecordDataSourceBase_1 = require("./drivers/RecordDataSourceBase");
const RecordExecutorBase_1 = require("./drivers/RecordExecutorBase");
const RecordManager_1 = require("./drivers/RecordManager");
const RecordManagerBase_1 = require("./drivers/RecordManagerBase");
(function (NajsEloquent) {
    var Driver;
    (function (Driver) {
        Driver.DriverBase = DriverBase_1.DriverBase;
        Driver.ExecutorBase = ExecutorBase_1.ExecutorBase;
        Driver.QueryLogBase = QueryLogBase_1.QueryLogBase;
        Driver.Record = Record_1.Record;
        Driver.RecordConditionMatcher = RecordConditionMatcher_1.RecordConditionMatcher;
        Driver.RecordConditionMatcherFactory = RecordConditionMatcherFactory_1.RecordConditionMatcherFactory;
        Driver.RecordDataReader = RecordDataReader_1.RecordDataReader;
        Driver.RecordDataSourceBase = RecordDataSourceBase_1.RecordDataSourceBase;
        Driver.RecordExecutorBase = RecordExecutorBase_1.RecordExecutorBase;
        Driver.RecordManager = RecordManager_1.RecordManager;
        Driver.RecordManagerBase = RecordManagerBase_1.RecordManagerBase;
    })(Driver = NajsEloquent.Driver || (NajsEloquent.Driver = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package: Driver/Memory
const MemoryDataSource_1 = require("./drivers/memory/MemoryDataSource");
const MemoryDriver_1 = require("./drivers/memory/MemoryDriver");
const MemoryExecutorFactory_1 = require("./drivers/memory/MemoryExecutorFactory");
const MemoryQueryBuilder_1 = require("./drivers/memory/MemoryQueryBuilder");
const MemoryQueryBuilderHandler_1 = require("./drivers/memory/MemoryQueryBuilderHandler");
const MemoryQueryBuilderFactory_1 = require("./drivers/memory/MemoryQueryBuilderFactory");
const MemoryQueryExecutor_1 = require("./drivers/memory/MemoryQueryExecutor");
const MemoryQueryLog_1 = require("./drivers/memory/MemoryQueryLog");
const MemoryRecordExecutor_1 = require("./drivers/memory/MemoryRecordExecutor");
(function (NajsEloquent) {
    var Driver;
    (function (Driver) {
        var Memory;
        (function (Memory) {
            Memory.MemoryDataSource = MemoryDataSource_1.MemoryDataSource;
            Memory.MemoryDriver = MemoryDriver_1.MemoryDriver;
            Memory.MemoryExecutorFactory = MemoryExecutorFactory_1.MemoryExecutorFactory;
            Memory.MemoryQueryBuilder = MemoryQueryBuilder_1.MemoryQueryBuilder;
            Memory.MemoryQueryBuilderHandler = MemoryQueryBuilderHandler_1.MemoryQueryBuilderHandler;
            Memory.MemoryQueryBuilderFactory = MemoryQueryBuilderFactory_1.MemoryQueryBuilderFactory;
            Memory.MemoryQueryExecutor = MemoryQueryExecutor_1.MemoryQueryExecutor;
            Memory.MemoryQueryLog = MemoryQueryLog_1.MemoryQueryLog;
            Memory.MemoryRecordExecutor = MemoryRecordExecutor_1.MemoryRecordExecutor;
        })(Memory = Driver.Memory || (Driver.Memory = {}));
    })(Driver = NajsEloquent.Driver || (NajsEloquent.Driver = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package: Error
const NotFoundError_1 = require("./errors/NotFoundError");
const RelationNotDefinedError_1 = require("./errors/RelationNotDefinedError");
const RelationNotFoundInNewInstanceError_1 = require("./errors/RelationNotFoundInNewInstanceError");
(function (NajsEloquent) {
    var Error;
    (function (Error) {
        Error.NotFoundError = NotFoundError_1.NotFoundError;
        Error.RelationNotDefinedError = RelationNotDefinedError_1.RelationNotDefinedError;
        Error.RelationNotFoundInNewInstanceError = RelationNotFoundInNewInstanceError_1.RelationNotFoundInNewInstanceError;
    })(Error = NajsEloquent.Error || (NajsEloquent.Error = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package: Factory
const FactoryBuilder_1 = require("./factory/FactoryBuilder");
const FactoryManager_1 = require("./factory/FactoryManager");
(function (NajsEloquent) {
    var Factory;
    (function (Factory) {
        Factory.FactoryBuilder = FactoryBuilder_1.FactoryBuilder;
        Factory.FactoryManager = FactoryManager_1.FactoryManager;
    })(Factory = NajsEloquent.Factory || (NajsEloquent.Factory = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package: Feature
const EventFeature_1 = require("./features/EventFeature");
const FeatureBase_1 = require("./features/FeatureBase");
const FillableFeature_1 = require("./features/FillableFeature");
const QueryFeature_1 = require("./features/QueryFeature");
const RelationFeature_1 = require("./features/RelationFeature");
const SerializationFeature_1 = require("./features/SerializationFeature");
const SettingFeature_1 = require("./features/SettingFeature");
const SoftDeletesFeature_1 = require("./features/SoftDeletesFeature");
const TimestampsFeature_1 = require("./features/TimestampsFeature");
(function (NajsEloquent) {
    var Feature;
    (function (Feature) {
        Feature.EventFeature = EventFeature_1.EventFeature;
        Feature.FeatureBase = FeatureBase_1.FeatureBase;
        Feature.QueryFeature = QueryFeature_1.QueryFeature;
        Feature.FillableFeature = FillableFeature_1.FillableFeature;
        Feature.RelationFeature = RelationFeature_1.RelationFeature;
        Feature.SerializationFeature = SerializationFeature_1.SerializationFeature;
        Feature.SettingFeature = SettingFeature_1.SettingFeature;
        Feature.SoftDeletesFeature = SoftDeletesFeature_1.SoftDeletesFeature;
        Feature.TimestampsFeature = TimestampsFeature_1.TimestampsFeature;
    })(Feature = NajsEloquent.Feature || (NajsEloquent.Feature = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// // package: Feature/Mixin
const EventPublicApi_1 = require("./features/mixin/EventPublicApi");
const FillablePublicApi_1 = require("./features/mixin/FillablePublicApi");
const RecordManagerPublicApi_1 = require("./features/mixin/RecordManagerPublicApi");
const RelationPublicApi_1 = require("./features/mixin/RelationPublicApi");
const SerializationPublicApi_1 = require("./features/mixin/SerializationPublicApi");
const SoftDeletesPublicApi_1 = require("./features/mixin/SoftDeletesPublicApi");
const TimestampsPublicApi_1 = require("./features/mixin/TimestampsPublicApi");
(function (NajsEloquent) {
    var Feature;
    (function (Feature) {
        var Mixin;
        (function (Mixin) {
            Mixin.EventPublicApi = EventPublicApi_1.EventPublicApi;
            Mixin.FillablePublicApi = FillablePublicApi_1.FillablePublicApi;
            Mixin.RecordManagerPublicApi = RecordManagerPublicApi_1.RecordManagerPublicApi;
            Mixin.RelationPublicApi = RelationPublicApi_1.RelationPublicApi;
            Mixin.SerializationPublicApi = SerializationPublicApi_1.SerializationPublicApi;
            Mixin.SoftDeletesPublicApi = SoftDeletesPublicApi_1.SoftDeletesPublicApi;
            Mixin.TimestampsPublicApi = TimestampsPublicApi_1.TimestampsPublicApi;
        })(Mixin = Feature.Mixin || (Feature.Mixin = {}));
    })(Feature = NajsEloquent.Feature || (NajsEloquent.Feature = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package Provider
const DriverProvider_1 = require("./providers/DriverProvider");
const MemoryDataSourceProvider_1 = require("./providers/MemoryDataSourceProvider");
const MomentProvider_1 = require("./providers/MomentProvider");
(function (NajsEloquent) {
    var Provider;
    (function (Provider) {
        Provider.DriverProvider = DriverProvider_1.DriverProvider;
        Provider.MemoryDataSourceProvider = MemoryDataSourceProvider_1.MemoryDataSourceProvider;
        Provider.MomentProvider = MomentProvider_1.MomentProvider;
    })(Provider = NajsEloquent.Provider || (NajsEloquent.Provider = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder
const QueryBuilder_1 = require("./query-builders/QueryBuilder");
const QueryBuilderHandlerBase_1 = require("./query-builders/QueryBuilderHandlerBase");
(function (NajsEloquent) {
    var QueryBuilder;
    (function (QueryBuilder_2) {
        QueryBuilder_2.QueryBuilder = QueryBuilder_1.QueryBuilder;
        QueryBuilder_2.QueryBuilderHandlerBase = QueryBuilderHandlerBase_1.QueryBuilderHandlerBase;
    })(QueryBuilder = NajsEloquent.QueryBuilder || (NajsEloquent.QueryBuilder = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder/Mixin
const AdvancedQuery_1 = require("./query-builders/mixin/AdvancedQuery");
const ConditionQuery_1 = require("./query-builders/mixin/ConditionQuery");
const ExecuteQuery_1 = require("./query-builders/mixin/ExecuteQuery");
const Query_1 = require("./query-builders/mixin/Query");
(function (NajsEloquent) {
    var QueryBuilder;
    (function (QueryBuilder) {
        var Mixin;
        (function (Mixin) {
            Mixin.AdvancedQuery = AdvancedQuery_1.AdvancedQuery;
            Mixin.ConditionQuery = ConditionQuery_1.ConditionQuery;
            Mixin.ExecuteQuery = ExecuteQuery_1.ExecuteQuery;
            Mixin.Query = Query_1.Query;
        })(Mixin = QueryBuilder.Mixin || (QueryBuilder.Mixin = {}));
    })(QueryBuilder = NajsEloquent.QueryBuilder || (NajsEloquent.QueryBuilder = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package QueryBuilder/Shared
const BasicQuery_1 = require("./query-builders/shared/BasicQuery");
const BasicQueryConverter_1 = require("./query-builders/shared/BasicQueryConverter");
const ConditionQueryHandler_1 = require("./query-builders/shared/ConditionQueryHandler");
const DefaultConvention_1 = require("./query-builders/shared/DefaultConvention");
const ExecutorUtils_1 = require("./query-builders/shared/ExecutorUtils");
const Operator_1 = require("./query-builders/shared/Operator");
const QueryCondition_1 = require("./query-builders/shared/QueryCondition");
(function (NajsEloquent) {
    var QueryBuilder;
    (function (QueryBuilder) {
        var Shared;
        (function (Shared) {
            Shared.BasicQuery = BasicQuery_1.BasicQuery;
            Shared.BasicQueryConverter = BasicQueryConverter_1.BasicQueryConverter;
            Shared.ConditionQueryHandler = ConditionQueryHandler_1.ConditionQueryHandler;
            Shared.DefaultConvention = DefaultConvention_1.DefaultConvention;
            Shared.ExecutorUtils = ExecutorUtils_1.ExecutorUtils;
            Shared.Operator = Operator_1.Operator;
            Shared.QueryCondition = QueryCondition_1.QueryCondition;
        })(Shared = QueryBuilder.Shared || (QueryBuilder.Shared = {}));
    })(QueryBuilder = NajsEloquent.QueryBuilder || (NajsEloquent.QueryBuilder = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package QueryLog
const FlipFlopQueryLog_1 = require("./query-log/FlipFlopQueryLog");
(function (NajsEloquent) {
    var QueryLog;
    (function (QueryLog) {
        QueryLog.FlipFlopQueryLog = FlipFlopQueryLog_1.FlipFlopQueryLog;
    })(QueryLog = NajsEloquent.QueryLog || (NajsEloquent.QueryLog = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// ---------------------------------------------------------------------------------------------------------------------
// package Util
const ClassSetting_1 = require("./util/ClassSetting");
const PrototypeManager_1 = require("./util/PrototypeManager");
const SettingType_1 = require("./util/SettingType");
(function (NajsEloquent) {
    var Util;
    (function (Util) {
        Util.ClassSetting = ClassSetting_1.ClassSetting;
        Util.PrototypeManager = PrototypeManager_1.PrototypeManager;
        Util.SettingType = SettingType_1.SettingType;
    })(Util = NajsEloquent.Util || (NajsEloquent.Util = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
// // package Relation
// // import { Relation } from './relations/Relation'
// // import { RelationData } from './relations/RelationData'
// // import { RelationDataBucket } from './relations/RelationDataBucket'
// // import { RelationDefinitionFinder } from './relations/RelationDefinitionFinder'
// // import { RelationFactory } from './relations/RelationFactory'
// // import { RelationUtilities } from './relations/RelationUtilities'
// // import { HasOneRelation } from './relations/basic/HasOneRelation'
