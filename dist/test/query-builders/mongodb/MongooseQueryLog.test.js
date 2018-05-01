"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
require("../../../lib/query-log/FlipFlopQueryLog");
const MongooseProviderFacade_1 = require("../../../lib/facades/global/MongooseProviderFacade");
const QueryLogFacade_1 = require("../../../lib/facades/global/QueryLogFacade");
const MongooseQueryBuilder_1 = require("../../../lib/query-builders/mongodb/MongooseQueryBuilder");
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number }
}, {
    collection: 'users'
});
MongooseProviderFacade_1.MongooseProvider.createModelFromSchema('User', UserSchema);
describe('MongooseQueryLog', function () {
    // TODO: write test
    beforeEach(function () {
        QueryLogFacade_1.QueryLog.clear().enable();
    });
    describe('.get()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder
                .select()
                .where('first_name', 'test')
                .limit(10)
                .get();
            // const log = QueryLog.pull()[0]
            // console.log(log)
            // expect(log.query.raw).toEqual('User.find({"first_name":"test"}).exec()')
        });
    });
    describe('.count()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', 'test').count();
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
    describe('.find()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('first_name', 'test').first();
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
    describe('.update()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').update({ test: 'anything' });
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
    describe('.delete()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').delete();
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
    describe('.restore()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder['softDelete'] = { deletedAt: 'deleted_at' };
            builder.where('id', '000000000000000000000000').restore();
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
    describe('.execute()', function () {
        it('should work', function () {
            const builder = new MongooseQueryBuilder_1.MongooseQueryBuilder('User');
            builder.where('id', '000000000000000000000000').execute();
            // const log = QueryLog.pull()[0]
            // console.log(log)
        });
    });
});
