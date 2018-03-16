"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const EloquentMetadata_1 = require("../../../lib/v0.x/eloquent/EloquentMetadata");
const EloquentTestBase_1 = require("./EloquentTestBase");
class BaseClass extends EloquentTestBase_1.EloquentTestBase {
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
describe('EloquentMetadata', function () {
    describe('.getSettingProperty()', function () {
        it('checks and returns static property firstly if exists', function () {
            class UseStaticVariable extends BaseClass {
            }
            UseStaticVariable.test = { props: 'static' };
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(UseStaticVariable, 'test', defaultValue)).toEqual({ props: 'static' });
        });
        it('checks and returns member property if exists', function () {
            class Member extends BaseClass {
                get test() {
                    return { props: 'member' };
                }
            }
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(Member, 'test', defaultValue)).toEqual({ props: 'member' });
            class MemberAndStatic extends BaseClass {
                get test() {
                    return { props: 'member' };
                }
            }
            MemberAndStatic.test = { props: 'static' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(MemberAndStatic, 'test', defaultValue)).toEqual({ props: 'static' });
        });
        it('returns default value if the property is not static or a member', function () {
            class NotFound extends BaseClass {
            }
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(NotFound, 'test', defaultValue)).toEqual(defaultValue);
        });
        it('works with EloquentBase instance, checks and returns static property firstly if exists', function () {
            class UseStaticVariable extends BaseClass {
            }
            UseStaticVariable.test = { props: 'static' };
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(new UseStaticVariable(), 'test', defaultValue)).toEqual({
                props: 'static'
            });
        });
        it('works with EloquentBase instance, checks and returns member property if exists', function () {
            class Member extends BaseClass {
                get test() {
                    return { props: 'member' };
                }
            }
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(new Member(), 'test', defaultValue)).toEqual({ props: 'member' });
            class MemberAndStatic extends BaseClass {
                get test() {
                    return { props: 'member' };
                }
            }
            MemberAndStatic.test = { props: 'static' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(new MemberAndStatic(), 'test', defaultValue)).toEqual({
                props: 'static'
            });
        });
        it('works with EloquentBase instance, returns default value if the property is not static or a member', function () {
            class NotFound extends BaseClass {
            }
            const defaultValue = { test: 'default' };
            expect(EloquentMetadata_1.EloquentMetadata.getSettingProperty(new NotFound(), 'test', defaultValue)).toEqual(defaultValue);
        });
    });
    describe('.fillable()', function () {
        it('calls .getSettingProperty() with property = fillable and defaultValue = []', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            expect(EloquentMetadata_1.EloquentMetadata.fillable(Test)).toEqual([]);
            expect(getSettingPropertySpy.calledWith(Test, 'fillable', [])).toBe(true);
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.fillable(instance)).toEqual([]);
            expect(getSettingPropertySpy.calledWith(instance, 'fillable', [])).toBe(true);
            getSettingPropertySpy.restore();
        });
    });
    describe('.guarded()', function () {
        it('calls .getSettingProperty() with property = guarded and defaultValue = ["*"]', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            expect(EloquentMetadata_1.EloquentMetadata.guarded(Test)).toEqual(['*']);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', ['*'])).toBe(true);
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.guarded(instance)).toEqual(['*']);
            expect(getSettingPropertySpy.calledWith(instance, 'guarded', ['*'])).toBe(true);
            getSettingPropertySpy.restore();
        });
    });
    describe('private .hasSetting()', function () {
        it('returns false if the property has false/undefined value, otherwise it returns true', function () {
            class Test extends BaseClass {
                constructor() {
                    super(...arguments);
                    this.a = false;
                    this.c = true;
                }
            }
            Test.b = undefined;
            Test.d = {};
            expect(EloquentMetadata_1.EloquentMetadata.guarded(Test)).toEqual(['*']);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](Test, 'a')).toBe(false);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](Test, 'b')).toBe(false);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](Test, 'c')).toBe(true);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](Test, 'd')).toBe(true);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](Test, 'e')).toBe(false);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](new Test(), 'a')).toBe(false);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](new Test(), 'b')).toBe(false);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](new Test(), 'c')).toBe(true);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](new Test(), 'd')).toBe(true);
            expect(EloquentMetadata_1.EloquentMetadata['hasSetting'](new Test(), 'e')).toBe(false);
        });
    });
    describe('private .getSettingWithTrueValue()', function () {
        it('not only returns default value if the value not found or false, but also if value is true', function () {
            class Test extends BaseClass {
                constructor() {
                    super(...arguments);
                    this.a = false;
                    this.c = true;
                }
            }
            Test.b = undefined;
            Test.d = {};
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](Test, 'a', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](Test, 'b', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](Test, 'c', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](Test, 'd', 'default')).toEqual({});
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](Test, 'e', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](new Test(), 'a', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](new Test(), 'b', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](new Test(), 'c', 'default')).toEqual('default');
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](new Test(), 'd', 'default')).toEqual({});
            expect(EloquentMetadata_1.EloquentMetadata['getSettingWithTrueValue'](new Test(), 'e', 'default')).toEqual('default');
        });
    });
    describe('.hasTimestamps()', function () {
        it('calls .hasSetting() with property = timestamps', function () {
            class Test extends BaseClass {
            }
            const hasSettingSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'hasSetting');
            expect(EloquentMetadata_1.EloquentMetadata.hasTimestamps(Test)).toEqual(false);
            expect(hasSettingSpy.calledWith(Test, 'timestamps'));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.hasTimestamps(instance)).toEqual(false);
            expect(hasSettingSpy.calledWith(instance, 'timestamps')).toBe(true);
            hasSettingSpy.restore();
        });
    });
    describe('.timestamps()', function () {
        it('calls .getSettingProperty() with property = timestamps and defaultValue = ...', function () {
            class Test extends BaseClass {
            }
            const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingWithTrueValue');
            const defaultValue = {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            };
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(Test)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(Test, 'timestamps', defaultValue));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(instance)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(instance, 'timestamps', defaultValue)).toBe(true);
            getSettingWithTrueValueSpy.restore();
        });
        it('can provide custom default value', function () {
            class Test extends BaseClass {
            }
            const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingWithTrueValue');
            const defaultValue = {
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            };
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(Test, defaultValue)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(Test, 'timestamps', defaultValue)).toBe(true);
            getSettingWithTrueValueSpy.restore();
        });
    });
    describe('.hasSoftDeletes()', function () {
        it('calls .hasSetting() with property = softDeletes', function () {
            class Test extends BaseClass {
            }
            const hasSettingSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'hasSetting');
            expect(EloquentMetadata_1.EloquentMetadata.hasSoftDeletes(Test)).toEqual(false);
            expect(hasSettingSpy.calledWith(Test, 'softDeletes'));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.hasSoftDeletes(instance)).toEqual(false);
            expect(hasSettingSpy.calledWith(instance, 'softDeletes')).toBe(true);
            hasSettingSpy.restore();
        });
    });
    describe('.softDeletes()', function () {
        it('calls .getSettingWithTrueValue() with property = softDeletes and defaultValue = ...', function () {
            class Test extends BaseClass {
            }
            const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingWithTrueValue');
            const defaultValue = {
                deletedAt: 'deleted_at',
                overrideMethods: false
            };
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(Test)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(Test, 'softDeletes', defaultValue));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(instance)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(instance, 'softDeletes', defaultValue)).toBe(true);
            getSettingWithTrueValueSpy.restore();
        });
        it('can provide custom default value', function () {
            class Test extends BaseClass {
            }
            const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingWithTrueValue');
            const defaultValue = {
                deletedAt: 'deleted_at',
                overrideMethods: true
            };
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(Test, defaultValue)).toEqual(defaultValue);
            expect(getSettingWithTrueValueSpy.calledWith(Test, 'softDeletes', defaultValue)).toBe(true);
            getSettingWithTrueValueSpy.restore();
        });
    });
});
