export declare const NajsEloquent: {
    Driver: {
        Component: {
            StaticQuery: string;
        };
        DummyDriver: string;
        MongooseDriver: string;
        MongodbDriver: string;
        KnexDriver: string;
    };
    Model: {
        Component: {
            ModelAttribute: string;
            DynamicAttribute: string;
            ModelSetting: string;
            ModelFillable: string;
            ModelQuery: string;
            ModelTimestamps: string;
            ModelSerialization: string;
            ModelSoftDeletes: string;
            ModelActiveRecord: string;
            ModelEvent: string;
            ModelRelation: string;
        };
    };
    QueryBuilder: {
        MongooseQueryBuilder: string;
        MongodbQueryBuilder: string;
        MongodbConditionConverter: string;
        MongodbQueryLog: string;
    };
    Database: {
        Seeder: string;
    };
    Factory: {
        FactoryManager: string;
        FactoryBuilder: string;
    };
    QueryLog: {
        FlipFlopQueryLog: string;
    };
    Provider: {
        ComponentProvider: string;
        DriverProvider: string;
        MongodbProvider: string;
        MongooseProvider: string;
    };
    Wrapper: {
        QueryBuilderWrapper: string;
        MongooseQueryBuilderWrapper: string;
    };
    Relation: {
        RelationDataBucket: string;
        HasOneOrMany: string;
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
