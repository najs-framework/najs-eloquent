"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
