"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const Sinon = require("sinon");
const EloquentMetadata_1 = require("../../lib/eloquent/EloquentMetadata");
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
            expect(getSettingPropertySpy.calledWith(Test, 'fillable', []));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.fillable(instance)).toEqual([]);
            expect(getSettingPropertySpy.calledWith(instance, 'fillable', []));
            getSettingPropertySpy.restore();
        });
    });
    describe('.guarded()', function () {
        it('calls .getSettingProperty() with property = guarded and defaultValue = ["*"]', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            expect(EloquentMetadata_1.EloquentMetadata.guarded(Test)).toEqual(['*']);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', ['*']));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.guarded(instance)).toEqual(['*']);
            expect(getSettingPropertySpy.calledWith(instance, 'guarded', ['*']));
            getSettingPropertySpy.restore();
        });
    });
    describe('.timestamps()', function () {
        it('calls .getSettingProperty() with property = timestamps and defaultValue = ...', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            const defaultValue = {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            };
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(Test)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(instance)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(instance, 'guarded', defaultValue));
            getSettingPropertySpy.restore();
        });
        it('can provide custom default value', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            const defaultValue = {
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            };
            expect(EloquentMetadata_1.EloquentMetadata.timestamps(Test, defaultValue)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue));
            getSettingPropertySpy.restore();
        });
    });
    describe('.softDeletes()', function () {
        it('calls .getSettingProperty() with property = softDeletes and defaultValue = ...', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            const defaultValue = {
                deletedAt: 'deleted_at',
                overrideMethods: false
            };
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(Test)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue));
            const instance = new Test();
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(instance)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(instance, 'guarded', defaultValue));
            getSettingPropertySpy.restore();
        });
        it('can provide custom default value', function () {
            class Test extends BaseClass {
            }
            const getSettingPropertySpy = Sinon.spy(EloquentMetadata_1.EloquentMetadata, 'getSettingProperty');
            const defaultValue = {
                deletedAt: 'deleted_at',
                overrideMethods: true
            };
            expect(EloquentMetadata_1.EloquentMetadata.softDeletes(Test, defaultValue)).toEqual(defaultValue);
            expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue));
            getSettingPropertySpy.restore();
        });
    });
});
