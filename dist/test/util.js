"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let currentDatabase = 0;
function init_mongoose(mongoose, database) {
    return new Promise(resolve => {
        mongoose.connect('mongodb://localhost/najs_eloquent_test_' + (database ? database : currentDatabase));
        currentDatabase++;
        mongoose.Promise = global.Promise;
        mongoose.connection.once('open', () => {
            resolve(true);
        });
    });
}
exports.init_mongoose = init_mongoose;
function delete_collection(mongoose, collection) {
    return new Promise(resolve => {
        try {
            if (mongoose.connection.collection(collection)) {
                mongoose.connection.collection(collection).drop(function () {
                    resolve(true);
                });
            }
            else {
                resolve(true);
            }
        }
        catch (error) { }
    });
}
exports.delete_collection = delete_collection;
