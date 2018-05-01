"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const Eloquent_1 = require("../../../lib/model/Eloquent");
const ModelSerialization_1 = require("../../../lib/model/components/ModelSerialization");
const ModelSetting_1 = require("../../../lib/model/components/ModelSetting");
const DummyDriver_1 = require("../../../lib/drivers/DummyDriver");
const EloquentDriverProviderFacade_1 = require("../../../lib/facades/global/EloquentDriverProviderFacade");
const EloquentComponentProviderFacade_1 = require("../../../lib/facades/global/EloquentComponentProviderFacade");
EloquentComponentProviderFacade_1.EloquentComponentProvider.register(ModelSerialization_1.ModelSerialization, 'serialization', true);
EloquentDriverProviderFacade_1.EloquentDriverProvider.register(DummyDriver_1.DummyDriver, 'dummy', true);
describe('Model/Serialization', function () {
    describe('Unit', function () {
        describe('.getClassName()', function () {
            it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelSerialization" as class name', function () {
                const serialization = new ModelSerialization_1.ModelSerialization();
                expect(serialization.getClassName()).toEqual('NajsEloquent.Model.Component.ModelSerialization');
            });
        });
        describe('.extend()', function () {
            it('extends the given prototype with 8 functions', function () {
                const functions = {
                    getVisible: 'getVisible',
                    getHidden: 'getHidden',
                    markVisible: 'markVisible',
                    markHidden: 'markHidden',
                    isVisible: 'isVisible',
                    isHidden: 'isHidden',
                    toObject: 'toObject',
                    toJSON: 'toJSON',
                    toJson: 'toJSON'
                };
                const prototype = {};
                const serialization = new ModelSerialization_1.ModelSerialization();
                serialization.extend(prototype, [], {});
                for (const name in functions) {
                    expect(typeof prototype[name] === 'function').toBe(true);
                    expect(prototype[name] === ModelSerialization_1.ModelSerialization[functions[name]]).toBe(true);
                }
            });
        });
        describe('static .isVisible()', function () {
            it('uses ModelUtilities.isInWhiteList() with whiteList = .getVisible(), blackList = this.getHidden()', function () {
                const isInWhiteListStub = Sinon.stub(ModelSetting_1.ModelSetting, 'isInWhiteList');
                isInWhiteListStub.returns('anything');
                const user = {
                    getVisible() {
                        return 'visible';
                    },
                    getHidden() {
                        return 'hidden';
                    }
                };
                user['isInWhiteList'] = ModelSetting_1.ModelSetting.isInWhiteList;
                expect(ModelSerialization_1.ModelSerialization.isVisible.call(user, 'test')).toEqual('anything');
                expect(isInWhiteListStub.called).toBe(true);
                expect(Array.from(isInWhiteListStub.firstCall.args[0])).toEqual(['test']);
                expect(isInWhiteListStub.firstCall.args[1]).toEqual('visible');
                expect(isInWhiteListStub.firstCall.args[2]).toEqual('hidden');
                isInWhiteListStub.restore();
            });
        });
        describe('static .isGuarded()', function () {
            it('uses ModelUtilities.isInBlackList() with blackList = this.getHidden()', function () {
                const isInBlackListStub = Sinon.stub(ModelSetting_1.ModelSetting, 'isInBlackList');
                isInBlackListStub.returns('anything');
                const user = {
                    getHidden() {
                        return 'hidden';
                    }
                };
                user['isInBlackList'] = ModelSetting_1.ModelSetting.isInBlackList;
                expect(ModelSerialization_1.ModelSerialization.isHidden.call(user, 'test')).toEqual('anything');
                expect(isInBlackListStub.called).toBe(true);
                expect(Array.from(isInBlackListStub.firstCall.args[0])).toEqual(['test']);
                expect(isInBlackListStub.firstCall.args[1]).toEqual('hidden');
                isInBlackListStub.restore();
            });
        });
    });
    describe('Integration', function () {
        class User extends Eloquent_1.Eloquent {
        }
        User.className = 'User';
        User.visible = ['first_name', 'last_name'];
        class Post extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.visible = ['title', 'content'];
            }
        }
        Post.className = 'Post';
        class Token extends Eloquent_1.Eloquent {
        }
        Token.className = 'Token';
        Token.hidden = ['token'];
        class Secret extends Eloquent_1.Eloquent {
            constructor() {
                super(...arguments);
                this.hidden = ['password'];
            }
        }
        Secret.className = 'Secret';
        describe('.getVisible()', function () {
            it('works with both kind of settings - static or member', function () {
                const user = new User();
                expect(user.getVisible()).toEqual(['first_name', 'last_name']);
                const post = new Post();
                expect(post.getVisible()).toEqual(['title', 'content']);
            });
        });
        describe('.markVisible()', function () {
            it('is chainable.', function () {
                const user = new User();
                expect(user.markVisible('test') === user).toBe(true);
            });
            it('can use to apply a temporary setting', function () {
                const user = new User();
                user.markVisible('password');
                expect(user.getVisible()).toEqual(['first_name', 'last_name', 'password']);
                expect(user['visible']).toEqual(['password']);
                expect(new User().getVisible()).toEqual(['first_name', 'last_name']);
                const post = new Post();
                post.markVisible('view');
                expect(post.getVisible()).toEqual(['title', 'content', 'view']);
                expect(post['visible']).toEqual(['title', 'content', 'view']);
                expect(new Post().getVisible()).toEqual(['title', 'content']);
            });
        });
        describe('.getHidden()', function () {
            it('has default value is []', function () {
                const user = new User();
                expect(user.getHidden()).toEqual([]);
                const post = new Post();
                expect(post.getHidden()).toEqual([]);
            });
            it('works with both kind of settings - static or member', function () {
                const token = new Token();
                expect(token.getHidden()).toEqual(['token']);
                const secret = new Secret();
                expect(secret.getHidden()).toEqual(['password']);
            });
        });
        describe('.isVisible()', function () {
            it('can be used to detect single attribute', function () {
                const user = new User();
                expect(user.isVisible('first_name')).toBe(true);
                expect(user.isVisible('not-defined')).toBe(false);
            });
            it('return true if the "visible" setting is empty and not a knownAttributes and not start with _', function () {
                const token = new Token();
                expect(token.isVisible('anything')).toBe(true);
                expect(token.isVisible('_anything')).toBe(false);
                expect(token.isVisible('guarded')).toBe(false);
            });
            it('can be used to detect multiple attributes with AND operator', function () {
                const user = new User();
                expect(user.isVisible('first_name', 'last_name')).toBe(true);
                expect(user.isVisible(['first_name', 'last_name'])).toBe(true);
                expect(user.isVisible(['first_name', 'last_name'], 'not-found')).toBe(false);
            });
        });
        describe('.isHidden()', function () {
            it('can be used to detect single attribute', function () {
                const user = new User();
                expect(user.isHidden('test')).toBe(false);
                const token = new Token();
                expect(token.isHidden('test')).toBe(false);
                expect(token.isHidden('token')).toBe(true);
            });
            it('can be used to detect multiple attributes with AND operator', function () {
                const user = new User();
                user.markHidden('a', 'b');
                expect(user.isHidden('a', 'b')).toBe(true);
                expect(user.isHidden('a', 'b', 'c')).toBe(false);
                const token = new Token();
                expect(token.isHidden('token', 'test')).toBe(false);
                expect(token.markHidden('test').isHidden('token', 'test')).toBe(true);
            });
        });
        describe('.markHidden()', function () {
            it('is chainable.', function () {
                const user = new User();
                expect(user.markHidden('test') === user).toBe(true);
            });
            it('can use to apply a temporary setting', function () {
                const user = new User();
                user.markHidden('test');
                expect(user.getHidden()).toEqual(['test']);
                expect(new User().getHidden()).toEqual([]);
                const post = new Post();
                post.markHidden('test');
                expect(post.getHidden()).toEqual(['test']);
                expect(new Post().getHidden()).toEqual([]);
                const token = new Token();
                token.markHidden('test');
                expect(token.getHidden()).toEqual(['token', 'test']);
                expect(token['hidden']).toEqual(['test']);
                expect(new Token().getHidden()).toEqual(['token']);
                const secret = new Secret();
                secret.markHidden('test');
                expect(secret.getHidden()).toEqual(['password', 'test']);
                expect(secret['hidden']).toEqual(['password', 'test']);
                expect(new Secret().getHidden()).toEqual(['password']);
            });
        });
        describe('.toObject()', function () {
            it('calls "driver".toObject()', function () {
                const user = new User();
                const driverToObjectStub = Sinon.stub(user['driver'], 'toObject');
                driverToObjectStub.returns('anything');
                expect(user.toObject()).toEqual('anything');
                expect(driverToObjectStub.called).toBe(true);
            });
        });
        describe('.toJSON()', function () {
            it('calls .toObject() and filters the key which allowed to visible in JSON', function () {
                const token = new Token();
                token.forceFill({ a: 1, b: 2, token: 'hidden' });
                expect(token.toObject()).toEqual({ a: 1, b: 2, token: 'hidden' });
                expect(token.toJSON()).toEqual({ a: 1, b: 2 });
                token.markHidden('b');
                expect(token.toJSON()).toEqual({ a: 1 });
            });
        });
    });
});
