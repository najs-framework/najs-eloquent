"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const EloquentTestBase_1 = require("./EloquentTestBase");
const Record_1 = require("./Record");
const najs_1 = require("najs");
class User extends EloquentTestBase_1.EloquentTestBase {
    getClassName() {
        return 'User';
    }
    get full_name() {
        return this.attributes['first_name'] + ' ' + this.attributes['last_name'];
    }
    set full_name(value) {
        const parts = value.split(' ');
        this.attributes['first_name'] = parts[0];
        this.attributes['last_name'] = parts[1];
    }
    getFullNameAttribute() {
        return (this.attributes['first_name'] + ' ' + this.attributes['last_name']).toUpperCase();
    }
    setFullNameAttribute(value) { }
    getNickNameAttribute() {
        return this.attributes['first_name'].toUpperCase();
    }
    setNickNameAttribute(value) {
        this.attributes['first_name'] = value.toLowerCase();
    }
    getSomething_wrong_formatAttribute() {
        return 'something_wrong_format';
    }
    getSomethingAccessorWrong() {
        return 'full_name';
    }
}
describe('Eloquent', function () {
    describe('constructor()', function () {
        it('always returns a proxy, and register to Najs.ClassRegistry if needed', function () {
            expect(najs_1.ClassRegistry.has('User')).toBe(false);
            new User();
            expect(najs_1.ClassRegistry.has('User')).toBe(true);
        });
        it('can create new object with value', function () {
            const user = new User({ first_name: 'test' });
            expect(user.toObject()).toEqual({ first_name: 'test' });
        });
        it('can create new object with Record instance', function () {
            const user = new User(Record_1.Record.create({ first_name: 'test' }));
            expect(user.toObject()).toEqual({ first_name: 'test' });
        });
    });
    describe('getReservedPropertiesList()', function () {
        it('defines which properties already taken', function () {
            class A extends EloquentTestBase_1.EloquentTestBase {
                constructor() {
                    super(...arguments);
                    this.guarded = [];
                }
                getClassName() {
                    return 'A';
                }
                getReservedPropertiesList() {
                    return super.getReservedPropertiesList().concat(['taken']);
                }
            }
            const a = new A();
            expect(a.isFillable('taken')).toBe(false);
        });
    });
    describe('initialize()', function () {
        it('is called by constructor', function () { });
        it('creates __knownAttributeList attribute', function () {
            const user = new User();
            expect(user['__knownAttributeList'].sort()).toEqual([]
                .concat(
            // reserved attributes from IEloquent
            [
                'inspect',
                'valueOf',
                '__knownAttributeList',
                'attributes',
                'fillable',
                'guarded',
                'softDeletes',
                'timestamps',
                'table'
            ], 
            // attributes from IEloquent
            [
                'id',
                'getClassName',
                'fill',
                'forceFill',
                'getFillable',
                'getGuarded',
                'isFillable',
                'isGuarded',
                'touch',
                'setAttribute',
                'getAttribute',
                'toObject',
                'toJson',
                'save',
                'delete',
                'restore',
                'forceDelete',
                'fresh',
                'is',
                'fireEvent',
                'newQuery',
                'newInstance',
                'newCollection'
            ], 
            // attributes from EloquentBase
            [
                'constructor',
                'isNativeRecord',
                'initializeAttributes',
                'setAttributesByObject',
                'setAttributesByNativeRecord',
                'initialize',
                'getReservedPropertiesList',
                'getId',
                'setId'
            ], 
            // accessors
            ['accessors', 'mutators', 'findAccessorsAndMutators', 'findGettersAndSetters', 'getAllValueOfAccessors'], 
            // attributes from User
            [
                'full_name',
                'getFullNameAttribute',
                'setFullNameAttribute',
                'getNickNameAttribute',
                'setNickNameAttribute',
                'getSomethingAccessorWrong',
                'getSomething_wrong_formatAttribute'
            ])
                .sort());
        });
    });
    describe('id: any', function () {
        it('calls getId() and setId() abstract functions', function () {
            const user = new User();
            const getIdSpy = Sinon.spy(user, 'getId');
            const setIdSpy = Sinon.spy(user, 'setId');
            user.id = 'anything';
            const id = user.id;
            expect(id).toEqual('anything');
            expect(getIdSpy.called).toBe(true);
            expect(setIdSpy.calledWith('anything')).toBe(true);
        });
    });
    describe('newInstance(data)', function () {
        it('create new instance of Eloquent based by passing data', function () {
            const user = new User();
            const instance = user.newInstance({ first_name: 'john' });
            expect(instance).toBeInstanceOf(User);
            expect(instance === user.newInstance()).toBe(false);
            expect(instance.toObject()).toEqual({ first_name: 'john' });
        });
    });
    describe('newCollection(data)', function () {
        it('create new instance of Eloquent based by passing data', function () {
            const user = new User();
            const collection = user.newCollection([{ first_name: 'john' }]);
            expect(collection.items[0]).toBeInstanceOf(User);
            expect(collection.all().map(item => item.toObject())).toEqual([{ first_name: 'john' }]);
        });
    });
    describe('getGuarded()', function () {
        it('returns ["*"] by default even the guarded property is not set', function () {
            const user = new User();
            expect(user.getGuarded()).toEqual(['*']);
        });
    });
    describe('isGuarded()', function () {
        it('guards all attributes by default', function () {
            const user = new User();
            expect(user.isGuarded('first_name')).toBe(true);
        });
        it('checks attribute in guarded property if it was set', function () {
            const user = new User();
            user['guarded'] = ['password'];
            expect(user.isGuarded('first_name')).toBe(false);
            expect(user.isGuarded('last_name')).toBe(false);
            expect(user.isGuarded('password')).toBe(true);
        });
    });
    describe('getFillable()', function () {
        it('returns [] by default even the fillable property is not set', function () {
            const user = new User();
            expect(user.getFillable()).toEqual([]);
        });
    });
    describe('isFillable()', function () {
        it('returns false if fillable is not defined', function () {
            const user = new User();
            expect(user.isFillable('first_name')).toBe(false);
            expect(user.isFillable('last_name')).toBe(false);
        });
        it('returns true if the key is in fillable', function () {
            const user = new User();
            user['fillable'] = ['first_name'];
            expect(user.isFillable('first_name')).toBe(true);
            expect(user.isFillable('last_name')).toBe(false);
        });
        it('returns false if the key is guarded', function () {
            const user = new User();
            user['fillable'] = ['last_name'];
            user['guarded'] = ['first_name'];
            expect(user.isFillable('first_name')).toBe(false);
            expect(user.isFillable('last_name')).toBe(true);
        });
        it('returns true if fillable not defined, not in guarded, not known properties and not start by _', function () {
            const user = new User();
            user['guarded'] = ['password'];
            expect(user.isFillable('not_defined')).toBe(true);
            expect(user.isFillable('attributes')).toBe(false);
            expect(user.isFillable('_private')).toBe(false);
        });
        it('always checks in fillable before guarded', function () {
            const user = new User();
            user['fillable'] = ['first_name'];
            user['guarded'] = ['first_name'];
            expect(user.isFillable('first_name')).toBe(true);
            expect(user.isFillable('last_name')).toBe(false);
        });
    });
    describe('fill()', function () {
        it('fills data which if isFillable(key) returns true', function () {
            const user = new User();
            user['fillable'] = ['first_name'];
            user.fill({
                first_name: 'john',
                last_name: 'doe',
                not_fillable: 'anything'
            });
            expect(user.getAttribute('first_name')).toEqual('john');
            expect(user.toObject()).toEqual({ first_name: 'john' });
        });
        it('calls setAttribute() to assign fillable attribute', function () {
            const user = new User();
            user['fillable'] = ['first_name'];
            user.fill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(user.toJson()).toEqual({ first_name: 'john' });
        });
        it('could fill any attributes by default except start with _', function () {
            const user = new User();
            user['guarded'] = [];
            user.fill({
                not_config: 'filled',
                _test: 'will not filled'
            });
            expect(user.toJson()).toEqual({ not_config: 'filled' });
        });
    });
    describe('forceFill()', function () {
        it('fills data even they are not fillable', function () {
            const user = new User();
            user['fillable'] = ['first_name'];
            user['guarded'] = ['last_name'];
            user.forceFill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(user.getAttribute('first_name')).toEqual('john');
            expect(user.getAttribute('last_name')).toEqual('doe');
            expect(user.toObject()).toEqual({ first_name: 'john', last_name: 'doe' });
        });
        it('calls setAttribute() to assign fillable attribute', function () {
            const user = new User();
            user.forceFill({
                first_name: 'john',
                last_name: 'doe'
            });
            expect(user.toObject()).toEqual({ first_name: 'john', last_name: 'doe' });
        });
    });
    describe('fill()', function () { });
    if (Object.getOwnPropertyDescriptors) {
        describe('Accessors for node >= 8.7', function () {
            it('supports getter since node >= 8.7', function () {
                const user = new User();
                expect(user['accessors']['full_name']).toEqual({
                    name: 'full_name',
                    type: 'getter'
                });
                expect(user['accessors']['nick_name']).toEqual({
                    name: 'nick_name',
                    type: 'function',
                    ref: 'getNickNameAttribute'
                });
                expect(user['accessors']['something_wrong_format']).toEqual({
                    name: 'something_wrong_format',
                    type: 'function',
                    ref: 'getSomething_wrong_formatAttribute'
                });
            });
            it('skip function get...Attribute() if getter is defined', function () {
                const user = new User({
                    first_name: 'tony',
                    last_name: 'stark'
                });
                expect(user.full_name).toEqual('tony stark');
                expect(user['accessors']['full_name']).toEqual({
                    name: 'full_name',
                    type: 'getter'
                });
            });
            it('has function to get all values of accessors', function () {
                const user = new User({
                    first_name: 'tony',
                    last_name: 'stark'
                });
                expect(user['getAllValueOfAccessors']()).toEqual({
                    full_name: 'tony stark',
                    nick_name: 'TONY',
                    something_wrong_format: 'something_wrong_format'
                });
            });
            it('is not called getAttribute if there is a accessor for attribute', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User({
                        first_name: 'tony',
                        last_name: 'stark'
                    });
                    const getAttributeSpy = Sinon.spy(user, 'getAttribute');
                    // a little hack for cover case mutator is getter
                    const indexOfFullName = user['__knownAttributeList'].indexOf('full_name');
                    user['__knownAttributeList'].splice(indexOfFullName, 1);
                    const fullName = user.full_name;
                    expect(getAttributeSpy.notCalled).toBe(true);
                    expect(fullName).toEqual('tony stark');
                    const nickName = user['nick_name'];
                    expect(getAttributeSpy.notCalled).toBe(true);
                    expect(nickName).toEqual('TONY');
                });
            });
        });
        describe('Mutators for node >= 8.7', function () {
            it('supports setter since node >= 8.7', function () {
                const user = new User();
                expect(user['mutators']['full_name']).toEqual({
                    name: 'full_name',
                    type: 'setter'
                });
            });
            it('is not called setAttribute if there is a mutator for attribute', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = new User();
                    const setAttributeSpy = Sinon.spy(user, 'setAttribute');
                    // a little hack for cover case mutator is setter
                    const indexOfFullName = user['__knownAttributeList'].indexOf('full_name');
                    user['__knownAttributeList'].splice(indexOfFullName, 1);
                    user['full_name'] = 'Test test';
                    expect(setAttributeSpy.notCalled).toBe(true);
                    user['nick_name'] = 'TEST';
                    expect(setAttributeSpy.notCalled).toBe(true);
                });
            });
        });
    }
    else {
        describe('Accessors for node < 8.7', function () {
            it('can find accessor type function', function () {
                const user = new User();
                expect(user['accessors']['full_name']).toEqual({
                    name: 'full_name',
                    type: 'function',
                    ref: 'getFullNameAttribute'
                });
                expect(user['accessors']['nick_name']).toEqual({
                    name: 'nick_name',
                    type: 'function',
                    ref: 'getNickNameAttribute'
                });
                expect(user['accessors']['something_wrong_format']).toEqual({
                    name: 'something_wrong_format',
                    type: 'function',
                    ref: 'getSomething_wrong_formatAttribute'
                });
            });
            it('has function to get all values of accessors', function () {
                const user = new User({
                    first_name: 'tony',
                    last_name: 'stark'
                });
                expect(user['getAllValueOfAccessors']()).toEqual({
                    full_name: 'TONY STARK',
                    nick_name: 'TONY',
                    something_wrong_format: 'something_wrong_format'
                });
            });
        });
    }
});
