"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chance_1 = require("chance");
const collect_js_1 = require("collect.js");
exports.Collection = collect_js_1.Collection;
const EloquentDriverProviderFacade_1 = require("./facades/global/EloquentDriverProviderFacade");
exports.EloquentDriverProvider = EloquentDriverProviderFacade_1.EloquentDriverProvider;
const MongooseDriver_1 = require("./drivers/MongooseDriver");
exports.MongooseDriver = MongooseDriver_1.MongooseDriver;
const FactoryManager_1 = require("./factory/FactoryManager");
const FactoryBuilder_1 = require("./factory/FactoryBuilder");
const FlipFlopQueryLog_1 = require("./log/FlipFlopQueryLog");
const GenericQueryBuilder_1 = require("./query-builders/GenericQueryBuilder");
const GenericQueryCondition_1 = require("./query-builders/GenericQueryCondition");
const BuiltinMongooseProvider_1 = require("./providers/BuiltinMongooseProvider");
const DriverManager_1 = require("./providers/DriverManager");
const MongooseQueryLog_1 = require("./query-builders/mongodb/MongooseQueryLog");
const MongodbConditionConverter_1 = require("./query-builders/mongodb/MongodbConditionConverter");
const MongooseQueryBuilder_1 = require("./query-builders/mongodb/MongooseQueryBuilder");
var Eloquent_1 = require("./model/Eloquent");
exports.Eloquent = Eloquent_1.Eloquent;
var constants_1 = require("./constants");
exports.NajsEloquentClass = constants_1.NajsEloquentClass;
var NotFoundError_1 = require("./errors/NotFoundError");
exports.NotFoundError = NotFoundError_1.NotFoundError;
var Seeder_1 = require("./seed/Seeder");
exports.Seeder = Seeder_1.Seeder;
var EloquentDriverProviderFacade_2 = require("./facades/global/EloquentDriverProviderFacade");
exports.EloquentDriverProviderFacade = EloquentDriverProviderFacade_2.EloquentDriverProviderFacade;
var FactoryFacade_1 = require("./facades/global/FactoryFacade");
exports.FactoryFacade = FactoryFacade_1.FactoryFacade;
exports.Factory = FactoryFacade_1.Factory;
exports.factory = FactoryFacade_1.factory;
var MongooseProviderFacade_1 = require("./facades/global/MongooseProviderFacade");
exports.MongooseProviderFacade = MongooseProviderFacade_1.MongooseProviderFacade;
exports.MongooseProvider = MongooseProviderFacade_1.MongooseProvider;
var QueryLogFacade_1 = require("./facades/global/QueryLogFacade");
exports.QueryLogFacade = QueryLogFacade_1.QueryLogFacade;
exports.QueryLog = QueryLogFacade_1.QueryLog;
// register mongoose driver as default driver
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(MongooseDriver_1.MongooseDriver, 'mongoose', true);
// @ts-ignore
function getFaker() {
    return new chance_1.Chance();
}
// Builtin classes and contracts ---------------------------------------------------------------------------------------
var NajsEloquent;
(function (NajsEloquent) {
    let Builtin;
    (function (Builtin) {
        Builtin.FactoryManager = FactoryManager_1.FactoryManager;
        Builtin.FactoryBuilder = FactoryBuilder_1.FactoryBuilder;
        Builtin.FlipFlopQueryLog = FlipFlopQueryLog_1.FlipFlopQueryLog;
        Builtin.GenericQueryBuilder = GenericQueryBuilder_1.GenericQueryBuilder;
        Builtin.GenericQueryCondition = GenericQueryCondition_1.GenericQueryCondition;
        Builtin.MongodbConditionConverter = MongodbConditionConverter_1.MongodbConditionConverter;
        Builtin.MongooseQueryBuilder = MongooseQueryBuilder_1.MongooseQueryBuilder;
        Builtin.MongooseQueryLog = MongooseQueryLog_1.MongooseQueryLog;
        Builtin.MongooseProvider = BuiltinMongooseProvider_1.BuiltinMongooseProvider;
        Builtin.DriverManager = DriverManager_1.DriverManager;
    })(Builtin = NajsEloquent.Builtin || (NajsEloquent.Builtin = {}));
})(NajsEloquent = exports.NajsEloquent || (exports.NajsEloquent = {}));
