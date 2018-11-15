export declare const NajsEloquent: {
    Driver: {
        MemoryDriver: string;
        MongodbDriver: string;
        MongooseDriver: string;
        Memory: {
            MemoryDataSource: string;
            MemoryQueryBuilderFactory: string;
            MemoryExecutorFactory: string;
            RecordFilter: string;
            RecordConditionMatcherFactory: string;
        };
        Mongodb: {
            MongodbExecutorFactory: string;
            MongodbQueryBuilderFactory: string;
            MongodbConditionMatcherFactory: string;
        };
        Mongoose: {
            MongooseDocumentManager: string;
            MongooseQueryBuilderFactory: string;
            MongooseExecutorFactory: string;
        };
        Knex: {
            KnexWrapper: string;
        };
    };
    Factory: {
        FactoryManager: string;
        FactoryBuilder: string;
    };
    Feature: {
        RecordManager: string;
        SettingFeature: string;
        EventFeature: string;
        FillableFeature: string;
        SerializationFeature: string;
        QueryFeature: string;
        TimestampsFeature: string;
        SoftDeletesFeature: string;
        RelationFeature: string;
    };
    Provider: {
        DriverProvider: string;
        MemoryDataSourceProvider: string;
        MomentProvider: string;
        MongodbProvider: string;
        MongooseProvider: string;
        KnexProvider: string;
    };
    QueryBuilder: {
        MongodbConditionConverter: string;
    };
    QueryLog: {
        FlipFlopQueryLog: string;
    };
    Relation: {
        Relationship: {
            HasOne: string;
            BelongsTo: string;
            HasMany: string;
            BelongsToMany: string;
            MorphOne: string;
            MorphMany: string;
            MorphTo: string;
        };
        RelationDataBucket: string;
    };
};
export declare const QueryFunctions: {
    BasicQuery: string[];
    ConditionQuery: string[];
    SoftDeleteQuery: string[];
    FetchResultQuery: string[];
    AdvancedQuery: string[];
};
export declare const StartQueryFunctions: string[];
