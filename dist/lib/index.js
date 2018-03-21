"use strict";
// Currently v0.x is published they will be deleted completely when v1.x is done
Object.defineProperty(exports, "__esModule", { value: true });
const EloquentMongoose_1 = require("./v0.x/eloquent/EloquentMongoose");
exports.Mongoose = EloquentMongoose_1.EloquentMongoose;
exports.Eloquent = {
    Mongoose() {
        return EloquentMongoose_1.EloquentMongoose;
    }
};
exports.default = exports.Eloquent;
var QueryLogFacade_1 = require("./facades/global/QueryLogFacade");
exports.QueryLogFacade = QueryLogFacade_1.QueryLogFacade;
exports.QueryLog = QueryLogFacade_1.QueryLog;
var EloquentBase_1 = require("./v0.x/eloquent/EloquentBase");
exports.EloquentBase = EloquentBase_1.EloquentBase;
var EloquentMetadata_1 = require("./v0.x/eloquent/EloquentMetadata");
exports.EloquentMetadata = EloquentMetadata_1.EloquentMetadata;
