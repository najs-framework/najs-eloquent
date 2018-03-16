import 'jest'
import * as Sinon from 'sinon'
import { EloquentMetadata } from '../../../lib/v0.x/eloquent/EloquentMetadata'
import { EloquentTestBase } from './EloquentTestBase'

class BaseClass extends EloquentTestBase<{
  first_name: string
  last_name: string
  nick_name: string
  password: string
}> {
  getClassName() {
    return 'User'
  }

  get full_name(): string {
    return this.attributes['first_name'] + ' ' + this.attributes['last_name']
  }

  set full_name(value: string) {
    const parts = value.split(' ')
    this.attributes['first_name'] = parts[0]
    this.attributes['last_name'] = parts[1]
  }

  getFullNameAttribute() {
    return (this.attributes['first_name'] + ' ' + this.attributes['last_name']).toUpperCase()
  }

  setFullNameAttribute(value: string) {}

  getNickNameAttribute() {
    return this.attributes['first_name'].toUpperCase()
  }

  setNickNameAttribute(value: string) {
    this.attributes['first_name'] = value.toLowerCase()
  }

  getSomething_wrong_formatAttribute() {
    return 'something_wrong_format'
  }

  getSomethingAccessorWrong() {
    return 'full_name'
  }
}

describe('EloquentMetadata', function() {
  describe('.getSettingProperty()', function() {
    it('checks and returns static property firstly if exists', function() {
      class UseStaticVariable extends BaseClass {
        static test: any = { props: 'static' }
      }
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(UseStaticVariable, 'test', defaultValue)).toEqual({ props: 'static' })
    })

    it('checks and returns member property if exists', function() {
      class Member extends BaseClass {
        get test() {
          return { props: 'member' }
        }
      }
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(Member, 'test', defaultValue)).toEqual({ props: 'member' })

      class MemberAndStatic extends BaseClass {
        static test: any = { props: 'static' }
        get test() {
          return { props: 'member' }
        }
      }

      expect(EloquentMetadata.getSettingProperty(MemberAndStatic, 'test', defaultValue)).toEqual({ props: 'static' })
    })

    it('returns default value if the property is not static or a member', function() {
      class NotFound extends BaseClass {}
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(NotFound, 'test', defaultValue)).toEqual(defaultValue)
    })

    it('works with EloquentBase instance, checks and returns static property firstly if exists', function() {
      class UseStaticVariable extends BaseClass {
        static test: any = { props: 'static' }
      }
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(new UseStaticVariable(), 'test', defaultValue)).toEqual({
        props: 'static'
      })
    })

    it('works with EloquentBase instance, checks and returns member property if exists', function() {
      class Member extends BaseClass {
        get test() {
          return { props: 'member' }
        }
      }
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(new Member(), 'test', defaultValue)).toEqual({ props: 'member' })

      class MemberAndStatic extends BaseClass {
        static test: any = { props: 'static' }
        get test() {
          return { props: 'member' }
        }
      }
      expect(EloquentMetadata.getSettingProperty(new MemberAndStatic(), 'test', defaultValue)).toEqual({
        props: 'static'
      })
    })

    it('works with EloquentBase instance, returns default value if the property is not static or a member', function() {
      class NotFound extends BaseClass {}
      const defaultValue: any = { test: 'default' }
      expect(EloquentMetadata.getSettingProperty(new NotFound(), 'test', defaultValue)).toEqual(defaultValue)
    })
  })

  describe('.fillable()', function() {
    it('calls .getSettingProperty() with property = fillable and defaultValue = []', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      expect(EloquentMetadata.fillable(Test)).toEqual([])
      expect(getSettingPropertySpy.calledWith(Test, 'fillable', [])).toBe(true)

      const instance = new Test()
      expect(EloquentMetadata.fillable(instance)).toEqual([])
      expect(getSettingPropertySpy.calledWith(instance, 'fillable', [])).toBe(true)
      getSettingPropertySpy.restore()
    })
  })

  describe('.guarded()', function() {
    it('calls .getSettingProperty() with property = guarded and defaultValue = ["*"]', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      expect(EloquentMetadata.guarded(Test)).toEqual(['*'])
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', ['*'])).toBe(true)

      const instance = new Test()
      expect(EloquentMetadata.guarded(instance)).toEqual(['*'])
      expect(getSettingPropertySpy.calledWith(instance, 'guarded', ['*'])).toBe(true)
      getSettingPropertySpy.restore()
    })
  })

  describe('private .hasSetting()', function() {
    it('returns false if the property has false/undefined value, otherwise it returns true', function() {
      class Test extends BaseClass {
        a: any = false
        static b: any = undefined
        c: any = true
        static d: any = {}
      }

      expect(EloquentMetadata.guarded(Test)).toEqual(['*'])
      expect(EloquentMetadata['hasSetting'](Test, 'a')).toBe(false)
      expect(EloquentMetadata['hasSetting'](Test, 'b')).toBe(false)
      expect(EloquentMetadata['hasSetting'](Test, 'c')).toBe(true)
      expect(EloquentMetadata['hasSetting'](Test, 'd')).toBe(true)
      expect(EloquentMetadata['hasSetting'](Test, 'e')).toBe(false)

      expect(EloquentMetadata['hasSetting'](new Test(), 'a')).toBe(false)
      expect(EloquentMetadata['hasSetting'](new Test(), 'b')).toBe(false)
      expect(EloquentMetadata['hasSetting'](new Test(), 'c')).toBe(true)
      expect(EloquentMetadata['hasSetting'](new Test(), 'd')).toBe(true)
      expect(EloquentMetadata['hasSetting'](new Test(), 'e')).toBe(false)
    })
  })

  describe('private .getSettingWithTrueValue()', function() {
    it('not only returns default value if the value not found or false, but also if value is true', function() {
      class Test extends BaseClass {
        a: any = false
        static b: any = undefined
        c: any = true
        static d: any = {}
      }

      expect(EloquentMetadata['getSettingWithTrueValue'](Test, 'a', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](Test, 'b', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](Test, 'c', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](Test, 'd', 'default')).toEqual({})
      expect(EloquentMetadata['getSettingWithTrueValue'](Test, 'e', 'default')).toEqual('default')

      expect(EloquentMetadata['getSettingWithTrueValue'](new Test(), 'a', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](new Test(), 'b', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](new Test(), 'c', 'default')).toEqual('default')
      expect(EloquentMetadata['getSettingWithTrueValue'](new Test(), 'd', 'default')).toEqual({})
      expect(EloquentMetadata['getSettingWithTrueValue'](new Test(), 'e', 'default')).toEqual('default')
    })
  })

  describe('.hasTimestamps()', function() {
    it('calls .hasSetting() with property = timestamps', function() {
      class Test extends BaseClass {}
      const hasSettingSpy = Sinon.spy(EloquentMetadata, <any>'hasSetting')

      expect(EloquentMetadata.hasTimestamps(Test)).toEqual(false)
      expect(hasSettingSpy.calledWith(Test, 'timestamps'))

      const instance = new Test()
      expect(EloquentMetadata.hasTimestamps(instance)).toEqual(false)
      expect(hasSettingSpy.calledWith(instance, 'timestamps')).toBe(true)
      hasSettingSpy.restore()
    })
  })

  describe('.timestamps()', function() {
    it('calls .getSettingProperty() with property = timestamps and defaultValue = ...', function() {
      class Test extends BaseClass {}
      const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata, <any>'getSettingWithTrueValue')

      const defaultValue = {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
      expect(EloquentMetadata.timestamps(Test)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(Test, 'timestamps', defaultValue))

      const instance = new Test()
      expect(EloquentMetadata.timestamps(instance)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(instance, 'timestamps', defaultValue)).toBe(true)
      getSettingWithTrueValueSpy.restore()
    })

    it('can provide custom default value', function() {
      class Test extends BaseClass {}
      const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata, <any>'getSettingWithTrueValue')

      const defaultValue = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
      expect(EloquentMetadata.timestamps(Test, defaultValue)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(Test, 'timestamps', defaultValue)).toBe(true)
      getSettingWithTrueValueSpy.restore()
    })
  })

  describe('.hasSoftDeletes()', function() {
    it('calls .hasSetting() with property = softDeletes', function() {
      class Test extends BaseClass {}
      const hasSettingSpy = Sinon.spy(EloquentMetadata, <any>'hasSetting')

      expect(EloquentMetadata.hasSoftDeletes(Test)).toEqual(false)
      expect(hasSettingSpy.calledWith(Test, 'softDeletes'))

      const instance = new Test()
      expect(EloquentMetadata.hasSoftDeletes(instance)).toEqual(false)
      expect(hasSettingSpy.calledWith(instance, 'softDeletes')).toBe(true)
      hasSettingSpy.restore()
    })
  })

  describe('.softDeletes()', function() {
    it('calls .getSettingWithTrueValue() with property = softDeletes and defaultValue = ...', function() {
      class Test extends BaseClass {}
      const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata, <any>'getSettingWithTrueValue')

      const defaultValue = {
        deletedAt: 'deleted_at',
        overrideMethods: false
      }
      expect(EloquentMetadata.softDeletes(Test)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(Test, 'softDeletes', defaultValue))

      const instance = new Test()
      expect(EloquentMetadata.softDeletes(instance)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(instance, 'softDeletes', defaultValue)).toBe(true)
      getSettingWithTrueValueSpy.restore()
    })

    it('can provide custom default value', function() {
      class Test extends BaseClass {}
      const getSettingWithTrueValueSpy = Sinon.spy(EloquentMetadata, <any>'getSettingWithTrueValue')

      const defaultValue = {
        deletedAt: 'deleted_at',
        overrideMethods: true
      }
      expect(EloquentMetadata.softDeletes(Test, defaultValue)).toEqual(defaultValue)
      expect(getSettingWithTrueValueSpy.calledWith(Test, 'softDeletes', defaultValue)).toBe(true)
      getSettingWithTrueValueSpy.restore()
    })
  })
})
