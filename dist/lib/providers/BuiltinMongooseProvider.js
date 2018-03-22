"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("./../constants");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
class BuiltinMongooseProvider extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.NajsEloquentClass.MongooseProvider;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
BuiltinMongooseProvider.className = constants_1.NajsEloquentClass.MongooseProvider;
exports.BuiltinMongooseProvider = BuiltinMongooseProvider;
najs_binding_1.register(BuiltinMongooseProvider);
