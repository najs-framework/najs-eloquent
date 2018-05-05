"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./util/functions");
exports.NajsEloquent = {
    Driver: {
        Component: {
            StaticQuery: 'NajsEloquent.Driver.Component.StaticQuery'
        },
        DummyDriver: 'NajsEloquent.Driver.DummyDriver',
        MongooseDriver: 'NajsEloquent.Driver.MongooseDriver',
        KnexDriver: 'NajsEloquent.Driver.KnexDriver'
    },
    Model: {
        Component: {
            ModelAttribute: 'NajsEloquent.Model.Component.ModelAttribute',
            DynamicAttribute: 'NajsEloquent.Model.Component.DynamicAttribute',
            ModelSetting: 'NajsEloquent.Model.Component.ModelSetting',
            ModelFillable: 'NajsEloquent.Model.Component.ModelFillable',
            ModelQuery: 'NajsEloquent.Model.Component.ModelQuery',
            ModelTimestamps: 'NajsEloquent.Model.Component.ModelTimestamps',
            ModelSerialization: 'NajsEloquent.Model.Component.ModelSerialization',
            ModelSoftDeletes: 'NajsEloquent.Model.Component.ModelSoftDeletes',
            ModelActiveRecord: 'NajsEloquent.Model.Component.ModelActiveRecord',
            ModelRelation: 'NajsEloquent.Model.Component.ModelRelation'
        }
    },
    QueryBuilder: {
        MongooseQueryBuilder: 'NajsEloquent.QueryBuilder.Mongodb.MongooseQueryBuilder',
        MongodbConditionConverter: 'NajsEloquent.QueryBuilder.Mongodb.MongodbConditionConverter',
        MongooseQueryLog: 'NajsEloquent.QueryBuilder.Mongodb.MongooseQueryLog'
    },
    Database: {
        Seeder: 'NajsEloquent.Database.Seeder'
    },
    Factory: {
        FactoryManager: 'NajsEloquent.Factory.FactoryManager'
    },
    QueryLog: {
        FlipFlopQueryLog: 'NajsEloquent.QueryLog.FlipFlopQueryLog'
    },
    Provider: {
        ComponentProvider: 'NajsEloquent.Provider.ComponentProvider',
        DriverProvider: 'NajsEloquent.Provider.DriverProvider',
        MongooseProvider: 'NajsEloquent.Provider.MongooseProvider'
    },
    Wrapper: {
        QueryBuilderWrapper: 'NajsEloquent.Wrapper.QueryBuilderWrapper',
        MongooseQueryBuilderWrapper: 'NajsEloquent.Wrapper.MongooseQueryBuilderWrapper'
    },
    Relation: {
        RelationDataBucket: 'NajsEloquent.Relation.RelationDataBucket'
    }
};
exports.QueryFunctions = {
    BasicQuery: [
        'queryName',
        'setLogGroup',
        'getPrimaryKeyName',
        'select',
        'limit',
        'orderBy',
        'orderByAsc',
        'orderByDesc'
    ],
    ConditionQuery: [
        'where',
        'andWhere',
        'orWhere',
        'whereNot',
        'andWhereNot',
        'orWhereNot',
        'whereIn',
        'andWhereIn',
        'orWhereIn',
        'whereNotIn',
        'andWhereNotIn',
        'orWhereNotIn',
        'whereNull',
        'andWhereNull',
        'orWhereNull',
        'whereNotNull',
        'andWhereNotNull',
        'orWhereNotNull',
        'whereBetween',
        'andWhereBetween',
        'orWhereBetween',
        'whereNotBetween',
        'andWhereNotBetween',
        'orWhereNotBetween'
    ],
    SoftDeleteQuery: ['withTrashed', 'onlyTrashed'],
    FetchResultQuery: ['get', 'first', 'count', 'update', 'delete', 'restore', 'execute'],
    AdvancedQuery: ['first', 'find', 'get', 'all', 'count', 'pluck', 'findById', 'findOrFail', 'firstOrFail']
};
exports.StartQueryFunctions = functions_1.array_unique(exports.QueryFunctions.AdvancedQuery, exports.QueryFunctions.SoftDeleteQuery, exports.QueryFunctions.FetchResultQuery.filter(name => ['update', 'delete', 'restore', 'execute'].indexOf(name) === -1), exports.QueryFunctions.BasicQuery.filter(name => name !== 'getPrimaryKeyName'), exports.QueryFunctions.ConditionQuery.filter(name => name.indexOf('where') === 0));
