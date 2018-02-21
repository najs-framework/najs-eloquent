"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
let MongooseProvider = MongooseProvider_1 = class MongooseProvider {
    getClassName() {
        return MongooseProvider_1.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
};
MongooseProvider.className = 'MongooseProvider';
MongooseProvider = MongooseProvider_1 = __decorate([
    najs_binding_1.register() // register MongooseProvider with 'MongooseProvider' name
], MongooseProvider);
exports.MongooseProvider = MongooseProvider;
var MongooseProvider_1;
