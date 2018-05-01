"use strict";
/// <reference path="../contracts/MongooseProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("./../constants");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
class MongooseProvider extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.NajsEloquent.Provider.MongooseProvider;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
MongooseProvider.className = constants_1.NajsEloquent.Provider.MongooseProvider;
exports.MongooseProvider = MongooseProvider;
najs_binding_1.register(MongooseProvider);
