"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// import * as Sinon from 'sinon'
const ClassSetting_1 = require("../../../lib/util/ClassSetting");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelRelation_1 = require("../../../lib/model/components/ModelRelation");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
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
        describe('.load()', function () {
            it('does nothing for now', function () {
                const user = new User();
                user.load();
            });
        });
        describe('.getRelationByName()', function () {
            it('throws an Error if there is no "relations" variable', function () {
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
            it('throws an Error if there is no relation configuration in this."relations"', function () {
                try {
                    const user = new User();
                    user['relations'] = {};
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
                    get userRelation() {
                        return 'user-relation';
                    }
                }
                ModelA.className = 'ModelA';
                const model = new ModelA();
                model['relations'] = {
                    user: { mapTo: 'userRelation', type: 'getter' }
                };
                expect(model.getRelationByName('user')).toEqual('user-relation');
            });
            it('returns result of function if mapping relations has type "function"', function () {
                class ModelA extends Eloquent_1.Eloquent {
                    getUserRelation() {
                        return 'user-relation';
                    }
                }
                ModelA.className = 'ModelA';
                const model = new ModelA();
                model['relations'] = {
                    user: { mapTo: 'getUserRelation', type: 'function' }
                };
                expect(model.getRelationByName('user')).toEqual('user-relation');
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
            it('always return a RelationFactory instance', function () {
                // TODO: here
            });
        });
        describe('findRelationsForModel()', function () {
            it('looks all relations definition in Model and create an "relations" object in prototype', function () {
                class A extends Eloquent_1.Eloquent {
                    getBabyRelation() {
                        return this.defineRelationProperty('baby').hasOne('test');
                    }
                }
                A.className = 'A';
                const instance = new A();
                ModelRelation_1.findRelationsForModel(instance);
                expect(instance['relations']).toEqual({
                    baby: { mappedTo: 'getBabyRelation', type: 'function' }
                });
                expect(A.prototype['relations'] === instance['relations']).toBe(true);
            });
            it('also works with relation defined in getter', function () {
                class B extends Eloquent_1.Eloquent {
                    get babyRelation() {
                        return this.defineRelationProperty('baby').hasOne('test');
                    }
                }
                B.className = 'B';
                const instance = new B();
                ModelRelation_1.findRelationsForModel(instance);
                expect(instance['relations']).toEqual({
                    baby: { mappedTo: 'babyRelation', type: 'getter' }
                });
                expect(B.prototype['relations'] === instance['relations']).toBe(true);
            });
            it('skip if the model has no relation definition', function () {
                class C extends Eloquent_1.Eloquent {
                    getBaby() {
                        return 'invalid';
                    }
                }
                C.className = 'C';
                const instance = new C();
                ModelRelation_1.findRelationsForModel(instance);
                expect(instance['relations']).toEqual({});
                expect(C.prototype['relations'] === instance['relations']).toBe(true);
            });
            it('handles any error could happen when try to read defined relations', function () {
                class D extends Eloquent_1.Eloquent {
                    getSomething() {
                        throw Error();
                    }
                }
                D.className = 'D';
                const instance = new D();
                ModelRelation_1.findRelationsForModel(instance);
                expect(instance['relations']).toEqual({});
                expect(D.prototype['relations'] === instance['relations']).toBe(true);
            });
            it('also works with inheritance relations', function () {
                class E extends Eloquent_1.Eloquent {
                    get babyRelation() {
                        return this.defineRelationProperty('baby').hasOne('test');
                    }
                }
                E.className = 'E';
                class F extends E {
                    getCindyRelation() {
                        return this.defineRelationProperty('cindy').hasOne('test');
                    }
                }
                F.className = 'F';
                const instance = new F();
                ModelRelation_1.findRelationsForModel(instance);
                expect(instance['relations']).toEqual({
                    baby: { mappedTo: 'babyRelation', type: 'getter' },
                    cindy: { mappedTo: 'getCindyRelation', type: 'function' }
                });
                expect(F.prototype['relations'] === instance['relations']).toBe(true);
            });
        });
    });
});