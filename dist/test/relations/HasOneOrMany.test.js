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
const FactoryFacade_1 = require("./../../lib/facades/global/FactoryFacade");
const RelationType_1 = require("../../lib/relations/RelationType");
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
    // describe('.buildData()', function() {
    //   const relation = new HasOneOrMany(<any>{}, 'test')
    //   relation.buildData()
    // })
    // describe('.lazyLoad()', function() {
    //   const relation = new HasOneOrMany(<any>{}, 'test')
    //   relation.lazyLoad()
    // })
    // describe('.eagerLoad()', function() {
    //   const relation = new HasOneOrMany(<any>{}, 'test')
    //   relation.eagerLoad()
    // })
    describe('.isInverseOf', function () {
        it('returns false if compared is not instance of HasOneOrMany', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            const compared = {};
            expect(current.isInverseOf(compared)).toBe(false);
        });
        it('returns false if .isInverseOfTypeMatched() returns false', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            const isInverseOfTypeMatchedStub = Sinon.stub(current, 'isInverseOfTypeMatched');
            isInverseOfTypeMatchedStub.returns(false);
            expect(current.isInverseOf(current)).toBe(false);
        });
        it('returns true if .compareRelationInfo() match for local/foreign', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            const compared = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.BelongsTo);
            current['local'] = { model: 'Test', table: 'test', key: 'test_id' };
            current['foreign'] = { model: 'Test', table: 'test', key: 'test_id' };
            compared['local'] = { model: 'Test', table: 'test', key: 'test_id' };
            compared['foreign'] = { model: 'Test', table: 'test', key: 'test_id' };
            expect(current.isInverseOf(compared)).toBe(true);
            expect(compared.isInverseOf(current)).toBe(true);
        });
    });
    describe('.isInverseOfTypeMatched', function () {
        it('returns false if the current relation and compare relation have type not belongs-to', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            const compared = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            expect(current.isInverseOfTypeMatched(compared)).toBe(false);
            expect(compared.isInverseOfTypeMatched(current)).toBe(false);
        });
        it('returns true if the current relation is belongs-to but and compare relation is has many', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.BelongsTo);
            const compared = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasMany);
            expect(current.isInverseOfTypeMatched(compared)).toBe(true);
            expect(compared.isInverseOfTypeMatched(current)).toBe(true);
        });
        it('returns true if the current relation is belongs-to but and compare relation is has one', function () {
            const current = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.BelongsTo);
            const compared = new HasOneOrMany_1.HasOneOrMany({}, 'test', RelationType_1.RelationType.HasOne);
            expect(current.isInverseOfTypeMatched(compared)).toBe(true);
            expect(compared.isInverseOfTypeMatched(current)).toBe(true);
        });
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
    Phone.fillable = ['number'];
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
    User.fillable = ['name'];
    najs_binding_1.register(User);
    FactoryFacade_1.Factory.define(User, function (faker, attributes) {
        return Object.assign({
            name: faker.name()
        }, attributes);
    });
    FactoryFacade_1.Factory.define(Phone, function (faker, attributes) {
        return Object.assign({
            number: faker.phone()
        }, attributes);
    });
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
    describe('.eagerLoad()', function () {
        it('should work', async function () {
            const users = await FactoryFacade_1.factory(User)
                .times(3)
                .create();
            const phones = await FactoryFacade_1.factory(Phone)
                .times(5)
                .make();
            phones.items[0]['user_id'] = users.items[0]['id'];
            await phones.items[0].save();
            phones.items[1]['user_id'] = users.items[0]['id'];
            await phones.items[1].save();
            phones.items[2]['user_id'] = users.items[0]['id'];
            await phones.items[2].save();
            phones.items[3]['user_id'] = users.items[1]['id'];
            await phones.items[3].save();
            phones.items[4]['user_id'] = users.items[1]['id'];
            await phones.items[3].save();
            const userModel = new User();
            const result = await userModel.get();
            // const first = result.first()
            // const last = result.last()
            // console.log(first.getRelationDataBucket() === last.getRelationDataBucket())
            // console.log('result', result)
            // console.log('data bucket', userModel.getRelationDataBucket())
            await result.first().load('phone');
            console.log(result.first().phone.toJson());
            const last = result.last();
            console.log(last.phone);
            const newUser = await FactoryFacade_1.Factory.create(User);
            await newUser.getPhoneRelation().load();
            newUser.getPhoneRelation().markBuild(false);
            console.log(newUser.phone);
        });
    });
});
