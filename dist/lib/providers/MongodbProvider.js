"use strict";
/// <reference path="../contracts/MongodbProvider.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_facade_1 = require("najs-facade");
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../constants");
const mongodb_1 = require("mongodb");
class MongodbProvider extends najs_facade_1.Facade {
    getClassName() {
        return constants_1.NajsEloquent.Provider.MongodbProvider;
    }
    connect(url) {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(url, (error, client) => {
                if (error) {
                    return reject(error);
                }
                this.mongoClient = client;
                resolve(this);
            });
        });
    }
    close() {
        if (this.mongoClient) {
            this.mongoClient.close();
        }
        return this;
    }
    getMongoClient() {
        return this.mongoClient;
    }
    getDatabase(dbName) {
        return this.mongoClient && this.mongoClient.db(dbName);
    }
}
exports.MongodbProvider = MongodbProvider;
najs_binding_1.register(MongodbProvider, constants_1.NajsEloquent.Provider.MongodbProvider);
