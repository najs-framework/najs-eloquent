"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const najs_binding_1 = require("najs-binding");
const Relation_1 = require("../../lib/relations/Relation");
const HasOneOrMany_1 = require("../../lib/relations/HasOneOrMany");
const MongooseDriver_1 = require("../../lib/drivers/MongooseDriver");
const MongooseProviderFacade_1 = require("../../lib/facades/global/MongooseProviderFacade");
const EloquentDriverProviderFacade_1 = require("../../lib/facades/global/EloquentDriverProviderFacade");
const util_1 = require("../util");
const Eloquent_1 = require("../../lib/model/Eloquent");
EloquentDriverProviderFacade_1.EloquentDriverProviderFacade.register(MongooseDriver_1.MongooseDriver, 'mongoose', true);
describe('HasOneOrMany', function () {
    it('extends Relation, implements IAutoload with class name NajsEloquent.Relation.HasOneOrMany', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        expect(relation).toBeInstanceOf(Relation_1.Relation);
        expect(relation.getClassName()).toEqual('NajsEloquent.Relation.HasOneOrMany');
    });
    describe('.setup()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.setup(true, {}, {});
    });
    describe('.buildData()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.buildData();
    });
    // describe('.lazyLoad()', function() {
    //   const relation = new HasOneOrMany(<any>{}, 'test')
    //   relation.lazyLoad()
    // })
    describe('.eagerLoad()', function () {
        const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
        relation.eagerLoad();
    });
    describe('.executeQuery', function () {
        it('calls query.first() if "is1v1" is true', function () {
            const query = {
                first() {
                    return 'first';
                },
                get() {
                    return 'get';
                }
            };
            const firstSpy = Sinon.spy(query, 'first');
            const getSpy = Sinon.spy(query, 'get');
            const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
            relation['is1v1'] = true;
            relation.executeQuery(query);
            expect(firstSpy.called).toBe(true);
            expect(getSpy.called).toBe(false);
        });
        it('calls query.get() if "is1v1" is false', function () {
            const query = {
                first() {
                    return 'first';
                },
                get() {
                    return 'get';
                }
            };
            const firstSpy = Sinon.spy(query, 'first');
            const getSpy = Sinon.spy(query, 'get');
            const relation = new HasOneOrMany_1.HasOneOrMany({}, 'test');
            relation['is1v1'] = false;
            relation.executeQuery(query);
            expect(firstSpy.called).toBe(false);
            expect(getSpy.called).toBe(true);
        });
    });
});
describe('HasOneOrMany - Integration - MongooseDriver', function () {
    beforeAll(async function () {
        await util_1.init_mongoose(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'relations_has_one_or_many');
    });
    afterAll(async function () {
        await util_1.delete_collection(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'users');
        await util_1.delete_collection(MongooseProviderFacade_1.MongooseProvider.getMongooseInstance(), 'posts');
    });
    class Phone extends Eloquent_1.Eloquent {
        getUserRelation() {
            return this.defineRelationProperty('user').belongsTo('User');
        }
    }
    Phone.className = 'Phone';
    Phone.schema = {
        user_id: { type: String, required: true },
        number: { type: String, required: true }
    };
    Eloquent_1.Eloquent.register(Phone);
    class User extends Eloquent_1.Eloquent {
        getPhoneRelation() {
            return this.defineRelationProperty('phone').hasOne('Phone');
        }
    }
    User.className = 'User';
    User.schema = {
        name: { type: String, required: true }
    };
    najs_binding_1.register(User);
    describe('.lazyLoad()', function () {
        it('should work', async function () {
            const user = new User();
            user.name = 'a';
            await user.save();
            expect(await user.getPhoneRelation().lazyLoad()).toBeNull();
            const phone = new Phone();
            phone.number = 'a-phone';
            phone.user_id = user.id;
            await phone.save();
            const phoneData = await user.getPhoneRelation().lazyLoad();
            console.log(phoneData['toJson']());
            const userData = await phone.getUserRelation().lazyLoad();
            console.log(userData['toJson']());
        });
    });
});
