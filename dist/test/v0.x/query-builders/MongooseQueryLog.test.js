"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const QueryLog_1 = require("../../../lib/v0.x/query-builders/QueryLog");
const MongooseQueryBuilder_1 = require("../../../lib/v0.x/query-builders/MongooseQueryBuilder");
const najs_binding_1 = require("najs-binding");
const mongoose_1 = require("mongoose");
const mongoose = require('mongoose');
class MongooseProvider {
    getClassName() {
        return MongooseProvider.className;
    }
    getMongooseInstance() {
        return mongoose;
    }
    createModelFromSchema(modelName, schema) {
        return mongoose_1.model(modelName, schema);
    }
}
MongooseProvider.className = 'MongooseProvider';
najs_binding_1.register(MongooseProvider);
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number }
}, {
    collection: 'users'
});
mongoose_1.model('User', UserSchema);
describe('MongooseQueryLog', function () {
    beforeEach(function () {
        QueryLog_1.QueryLog.clear().enable();
    });
    describe('.get()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', 'test').get();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
            expect(log.query.raw).toEqual('User.find({"first_name":"test"}).exec()');
        });
    });
    describe('.count()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', 'test').count();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.find()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', 'test').find();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.pluck()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', '!=', 'test').pluck('first_name');
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.update()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').update({ test: 'anything' });
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.delete()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').delete();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.restore()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder['softDelete'] = { deletedAt: 'deleted_at' };
            builder.where('id', '000000000000000000000000').restore();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
    describe('.execute()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').execute();
            const log = QueryLog_1.QueryLog.pull()[0];
            console.log(log);
        });
    });
});
