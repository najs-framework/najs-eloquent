"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongodbProviderFacade_1 = require("../lib/facades/global/MongodbProviderFacade");
const KnexProviderFacade_1 = require("../lib/facades/global/KnexProviderFacade");
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
function init_knex(database) {
    return new Promise(resolve => {
        const connection = {
            host: '127.0.0.1',
            user: 'root',
            password: ''
        };
        KnexProviderFacade_1.KnexProviderFacade.setDefaultConfig({
            client: 'mysql',
            connection: connection
        });
        const dropDatabaseSql = `DROP DATABASE IF EXISTS ${database}`;
        const createDatabaseSql = `CREATE DATABASE ${database} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_bin`;
        const knex = KnexProviderFacade_1.KnexProviderFacade.create();
        knex.raw(dropDatabaseSql).then(function (result) {
            knex.raw(createDatabaseSql).then(function (result) {
                connection['database'] = database;
                KnexProviderFacade_1.KnexProviderFacade.setDefaultConfig({
                    client: 'mysql',
                    connection: connection
                });
                resolve();
            });
        });
    });
}
exports.init_knex = init_knex;
function knex_run_sql(sql) {
    return new Promise(resolve => {
        KnexProviderFacade_1.KnexProviderFacade.create()
            .raw(sql)
            .then(resolve);
    });
}
exports.knex_run_sql = knex_run_sql;
