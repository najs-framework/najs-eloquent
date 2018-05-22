"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const ClassSetting_1 = require("../../../lib/util/ClassSetting");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelRelation_1 = require("../../../lib/model/components/ModelRelation");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
const RelationFactory_1 = require("../../../lib/relations/RelationFactory");
const najs_binding_1 = require("najs-binding");
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('ModelRelation', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelRelation" as class name', function () {
                const relation = new ModelRelation_1.ModelRelation();
                expect(relation.getClassName()).toEqual('NajsEloquent.Model.Component.ModelRelation');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 3 functions', function () {
                const functions = {
                    load: 'load',
                    getRelationByName: 'getRelationByName',
                    defineRelationProperty: 'defineRelationProperty'
                };
                const prototype = {};
                const relation = new ModelRelation_1.ModelRelation();
                relation.extend(prototype, [], {});
                for (const name in functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === ModelRelation_1.ModelRelation[functions[name]]).toBe(true);
                }
            });
        });
    });
    describe('Integration', function () {
        class User extends Eloquent_1.Eloquent {
        }
        User.className = 'User';
        class Test extends Eloquent_1.Eloquent {
        }
        Test.className = 'Test';
        najs_binding_1.register(Test);
        describe('.load()', function () {
            it('flattens arguments, then loops all relations and calls .getRelationByName().load()', async function () {
                const user = new User();
                const relation = {
                    load() { }
                };
                const loadSpy = Sinon.spy(relation, 'load');
                const getRelationByNameStub = Sinon.stub(user, 'getRelationByName');
                getRelationByNameStub.returns(relation);
                await user.load('test');
                expect(getRelationByNameStub.calledWith('test')).toBe(true);
                expect(loadSpy.called).toBe(true);
                getRelationByNameStub.resetHistory();
                loadSpy.resetHistory();
                await user.load('a', 'b', 'c');
                expect(getRelationByNameStub.firstCall.calledWith('a')).toBe(true);
                expect(getRelationByNameStub.secondCall.calledWith('b')).toBe(true);
                expect(getRelationByNameStub.thirdCall.calledWith('c')).toBe(true);
                expect(loadSpy.callCount).toBe(3);
                getRelationByNameStub.resetHistory();
                loadSpy.resetHistory();
                await user.load('a', ['b', 'c']);
                expect(getRelationByNameStub.firstCall.calledWith('a')).toBe(true);
                expect(getRelationByNameStub.secondCall.calledWith('b')).toBe(true);
                expect(getRelationByNameStub.thirdCall.calledWith('c')).toBe(true);
                expect(loadSpy.callCount).toBe(3);
            });
        });
        describe('.getRelationDataBucket()', function () {
            it('returns relationDataBucket property', function () {
                const user = new User();
                user['relationDataBucket'] = 'anything';
                expect(user.getRelationDataBucket()).toEqual('anything');
            });
        });
        describe('.getRelationByName()', function () {
            it('throws an Error if there is no "relationsMap" variable', function () {
                try {
                    const user = new User();
                    user.getRelationByName('post');
                }
                catch (error) {
                    expect(error.message).toEqual('Relation "post" is not found in model "User".');
                    return;
                }
                expect('Should not reach this line').toEqual('Hmm');
            });
            it('returns the property if mapping relations has type "getter"', function () {
                class ModelA extends Eloquent_1.Eloquent {
                    get postRelation() {
                        return this.defineRelationProperty('post').hasOne(Test);
                    }
                }
                ModelA.className = 'ModelA';
                const model = new ModelA();
                expect(model.getRelationByName('post').getAttachedPropertyName()).toEqual('post');
            });
            it('returns result of function if mapping relationsMap has type "function"', function () {
                class ModelA extends Eloquent_1.Eloquent {
                    getUserRelation() {
                        return this.defineRelationProperty('post').hasOne('Test');
                    }
                }
                ModelA.className = 'ModelA';
                const model = new ModelA();
                expect(model.getRelationByName('post').getAttachedPropertyName()).toEqual('post');
            });
            it('calls relation.with() and pass the rest of string if there is a dot in model string', function () {
                class ModelA extends Eloquent_1.Eloquent {
                    getUserRelation() {
                        return this.defineRelationProperty('post').hasOne('Test');
                    }
                }
                ModelA.className = 'ModelA';
                const model = new ModelA();
                const relation = model.getRelationByName('post.test');
                expect(relation['loadChain']).toEqual(['test']);
            });
        });
        describe('.defineRelationProperty()', function () {
            it('set name to this.relationName if the instance is sample instance', function () {
                const user = new User();
                user.defineRelationProperty('test');
                expect(user['relationName']).toBeUndefined();
                const sample = ClassSetting_1.ClassSetting.get(user).getSample();
                sample.defineRelationProperty('test');
                expect(sample['relationName']).toEqual('test');
            });
            it('always returns a RelationFactory instance which cached in "relations"', function () {
                const user = new User();
                const relationFactory = user.defineRelationProperty('test');
                expect(relationFactory).toBeInstanceOf(RelationFactory_1.RelationFactory);
                expect(user['relations']['test'].factory === relationFactory).toBe(true);
                expect(user.defineRelationProperty('test') === relationFactory).toBe(true);
                expect(user.defineRelationProperty('other') === relationFactory).toBe(false);
            });
            it('calls define_relation_property_if_needed() and define the give property in model', function () {
                class HasOneUser extends Eloquent_1.Eloquent {
                    getUserRelation() {
                        return this.defineRelationProperty('user').hasOne('User');
                    }
                }
                HasOneUser.className = 'HasOneUser';
                const model = new HasOneUser();
                expect(Object.getOwnPropertyDescriptor(HasOneUser.prototype, 'user')).not.toBeUndefined();
                expect(model['user']).toBeUndefined();
            });
            it('define_relation_property_if_needed() throws error if it is not define in right way', function () {
                class HasOneUserError extends Eloquent_1.Eloquent {
                    getUserRelation() {
                        return this.defineRelationProperty('user');
                    }
                }
                HasOneUserError.className = 'HasOneUserError';
                const model = new HasOneUserError();
                try {
                    expect(model['user']).toBeUndefined();
                }
                catch (error) {
                    expect(error.message).toEqual('Relation "user" is not defined in model "HasOneUserError".');
                    return;
                }
                expect('should not reach this line').toEqual('hm');
            });
        });
        describe('findRelationsForModel()', function () {
            it('looks all relationsMap definition in Model and create an "relationsMap" object in prototype', function () {
                class A extends Eloquent_1.Eloquent {
                    getBabyRelation() {
                        return this.defineRelationProperty('baby').hasOne('Test');
                    }
                }
                A.className = 'A';
                const instance = new A();
                expect(instance['relationsMap']).toEqual({
                    baby: { mapTo: 'getBabyRelation', type: 'function' }
                });
                expect(A.prototype['relationsMap'] === instance['relationsMap']).toBe(true);
            });
            it('also works with relation defined in getter', function () {
                class B extends Eloquent_1.Eloquent {
                    get babyRelation() {
                        return this.defineRelationProperty('baby').hasOne('Test');
                    }
                }
                B.className = 'B';
                const instance = new B();
                expect(instance['relationsMap']).toEqual({
                    baby: { mapTo: 'babyRelation', type: 'getter' }
                });
                expect(B.prototype['relationsMap'] === instance['relationsMap']).toBe(true);
            });
            it('skip if the model has no relation definition', function () {
                class C extends Eloquent_1.Eloquent {
                    getBaby() {
                        return 'invalid';
                    }
                }
                C.className = 'C';
                const instance = new C();
                expect(instance['relationsMap']).toEqual({});
                expect(C.prototype['relationsMap'] === instance['relationsMap']).toBe(true);
            });
            it('handles any error could happen when try to read defined relations', function () {
                class D extends Eloquent_1.Eloquent {
                    getSomething() {
                        throw Error();
                    }
                }
                D.className = 'D';
                const instance = new D();
                expect(instance['relationsMap']).toEqual({});
                expect(D.prototype['relationsMap'] === instance['relationsMap']).toBe(true);
            });
            it('also works with inheritance relations', function () {
                class E extends Eloquent_1.Eloquent {
                    get babyRelation() {
                        return this.defineRelationProperty('baby').hasOne('Test');
                    }
                }
                E.className = 'E';
                class F extends E {
                    getCindyRelation() {
                        return this.defineRelationProperty('cindy').hasOne('Test');
                    }
                }
                F.className = 'F';
                const instance = new F();
                expect(instance['relationsMap']).toEqual({
                    baby: { mapTo: 'babyRelation', type: 'getter' },
                    cindy: { mapTo: 'getCindyRelation', type: 'function' }
                });
                expect(F.prototype['relationsMap'] === instance['relationsMap']).toBe(true);
            });
        });
    });
});
