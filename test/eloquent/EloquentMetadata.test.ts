import 'jest'
import * as Sinon from 'sinon'
import { EloquentMetadata } from '../../lib/eloquent/EloquentMetadata'
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
      expect(getSettingPropertySpy.calledWith(Test, 'fillable', []))

      const instance = new Test()
      expect(EloquentMetadata.fillable(instance)).toEqual([])
      expect(getSettingPropertySpy.calledWith(instance, 'fillable', []))
      getSettingPropertySpy.restore()
    })
  })

  describe('.guarded()', function() {
    it('calls .getSettingProperty() with property = guarded and defaultValue = ["*"]', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      expect(EloquentMetadata.guarded(Test)).toEqual(['*'])
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', ['*']))

      const instance = new Test()
      expect(EloquentMetadata.guarded(instance)).toEqual(['*'])
      expect(getSettingPropertySpy.calledWith(instance, 'guarded', ['*']))
      getSettingPropertySpy.restore()
    })
  })

  describe('.timestamps()', function() {
    it('calls .getSettingProperty() with property = timestamps and defaultValue = ...', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      const defaultValue = {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
      expect(EloquentMetadata.timestamps(Test)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue))

      const instance = new Test()
      expect(EloquentMetadata.timestamps(instance)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(instance, 'guarded', defaultValue))
      getSettingPropertySpy.restore()
    })

    it('can provide custom default value', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      const defaultValue = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
      }
      expect(EloquentMetadata.timestamps(Test, defaultValue)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue))
      getSettingPropertySpy.restore()
    })
  })

  describe('.softDeletes()', function() {
    it('calls .getSettingProperty() with property = softDeletes and defaultValue = ...', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      const defaultValue = {
        deletedAt: 'deleted_at',
        overrideMethods: false
      }
      expect(EloquentMetadata.softDeletes(Test)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue))

      const instance = new Test()
      expect(EloquentMetadata.softDeletes(instance)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(instance, 'guarded', defaultValue))
      getSettingPropertySpy.restore()
    })

    it('can provide custom default value', function() {
      class Test extends BaseClass {}
      const getSettingPropertySpy = Sinon.spy(EloquentMetadata, 'getSettingProperty')

      const defaultValue = {
        deletedAt: 'deleted_at',
        overrideMethods: true
      }
      expect(EloquentMetadata.softDeletes(Test, defaultValue)).toEqual(defaultValue)
      expect(getSettingPropertySpy.calledWith(Test, 'guarded', defaultValue))
      getSettingPropertySpy.restore()
    })
  })
})
