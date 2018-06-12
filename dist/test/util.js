"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongodbProviderFacade_1 = require("../lib/facades/global/MongodbProviderFacade");
function init_mongoose(mongoose, name) {
    return new Promise(resolve => {
        mongoose.connect('mongodb://localhost/najs_eloquent_test_' + name);
        mongoose.Promise = global.Promise;
        mongoose.connection.once('open', () => {
            resolve(true);
        });
    });
}
exports.init_mongoose = init_mongoose;
function delete_collection(mongoose, collection) {
    return new Promise(resolve => {
        mongoose.connection.collection(collection).drop(resolve);
    });
}
exports.delete_collection = delete_collection;
function init_mongodb(name) {
    return MongodbProviderFacade_1.MongodbProviderFacade.connect('mongodb://localhost:27017/najs_eloquent_test_' + name);
}
exports.init_mongodb = init_mongodb;
function delete_collection_use_mongodb(name) {
    return MongodbProviderFacade_1.MongodbProviderFacade.getDatabase()
        .collection(name)
        .drop();
}
exports.delete_collection_use_mongodb = delete_collection_use_mongodb;
