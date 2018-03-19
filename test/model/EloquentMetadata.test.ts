import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/drivers/EloquentDriverProvider'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentMetadata } from '../../lib/model/EloquentMetadata'
import { EloquentAttribute } from '../../lib/model/EloquentAttribute'

EloquentDriverProvider.register(DummyDriver, 'dummy')

class Model extends Eloquent {
  props: string

  get accessor() {
    return ''
  }

  set mutator(value: any) {}

  getClassName() {
    return 'Model'
  }

  modelMethod() {}
}
register(Model)

class ChildModel extends Model {
  child_props: string

  get child_accessor() {
    return ''
  }

  set child_mutator(value: any) {}

  getClassName() {
    return 'ChildModel'
  }

  childModelMethod() {}
}
register(ChildModel)

describe('EloquentMetadata', function() {
  describe('EloquentMetadata.get()', function() {
    it('returns an instance of EloquentMetadata', function() {
      const metadata = EloquentMetadata.get(new Model())
      expect(metadata).toBeInstanceOf(EloquentMetadata)
    })

    it('finds an definition of Model and saves in "definition"', function() {
      const metadata = EloquentMetadata.get(new Model())
      expect(metadata['definition'] === Model).toBe(true)
    })

    it('create new instances of EloquentAttribute and saves in "attribute"', function() {
      const metadata = EloquentMetadata.get(new Model())
      expect(metadata['attribute']).toBeInstanceOf(EloquentAttribute)
    })
  })

  describe('.getSettingProperty()', function() {
    it('returns "static" version of property if it exists found', function() {
      class ClassA extends Eloquent {
        static test = 'something'
        getClassName() {
          return 'ClassA'
        }
      }
      register(ClassA)
      const metadata = EloquentMetadata.get(new ClassA())
      expect(metadata.getSettingProperty('test', 'default')).toEqual('something')
    })

    it('returns "member" version of property if static version not found but member version is defined', function() {
      class ClassB extends Eloquent {
        test = 'something'
        getClassName() {
          return 'ClassB'
        }
      }
      register(ClassB)
      const metadata = EloquentMetadata.get(new ClassB())
      expect(metadata.getSettingProperty('test', 'default')).toEqual('something')
    })

    it('returns default value if "static" or "member" setting of property are not found', function() {
      class ClassC extends Eloquent {
        getClassName() {
          return 'ClassC'
        }
      }
      register(ClassC)
      const metadata = EloquentMetadata.get(new ClassC())
      expect(metadata.getSettingProperty('test', 'default')).toEqual('default')
    })

    it('always returns "static" version if the property is presented in both types', function() {
      class ClassD extends Eloquent {
        static test = 'static'
        test = 'member'
        getClassName() {
          return 'ClassD'
        }
      }
      register(ClassD)
      const metadata = EloquentMetadata.get(new ClassD())
      expect(metadata.getSettingProperty('test', 'default')).toEqual('static')
    })
  })

  describe('.hasSetting()', function() {
    class ClassE extends Eloquent {
      getClassName() {
        return 'ClassE'
      }
    }
    register(ClassE)

    it('returns false if the setting is not found', function() {
      const metadata = EloquentMetadata.get(new ClassE())
      expect(metadata.hasSetting('test')).toBe(false)
    })

    it('also returns false if the setting found but has falsy values', function() {
      const falsyValues = ['', 0, false, undefined]
      for (const value of falsyValues) {
        ClassE['test'] = value
        expect(EloquentMetadata.get(new ClassE(), false).hasSetting('test')).toBe(false)
      }
    })

    it('also returns true if the setting found and has truly values', function() {
      const trulyValues = ['a', 1, {}, [], true]
      for (const value of trulyValues) {
        ClassE['test'] = value
        expect(EloquentMetadata.get(new ClassE(), false).hasSetting('test')).toBe(true)
      }
    })
  })

  describe('.getSettingWithDefaultForTrueValue()', function() {
    it('calls .getSettingProperty(), and returns default value if the setting === true', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty')
      getSettingPropertyStub.returns(true)

      expect(metadata.getSettingWithDefaultForTrueValue('test', 'default')).toEqual('default')
      expect(getSettingPropertyStub.calledWith('test', false)).toBe(true)

      getSettingPropertyStub.restore()
    })

    it('calls .getSettingProperty(), and returns default value if the setting not found', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty')
      getSettingPropertyStub.returns(false)

      expect(metadata.getSettingWithDefaultForTrueValue('test', 'default')).toEqual('default')
      expect(getSettingPropertyStub.calledWith('test', false)).toBe(true)

      getSettingPropertyStub.restore()
    })

    it('calls .getSettingProperty(), and returns actually value of the setting', function() {
      const settingValue = {}
      const metadata = EloquentMetadata.get(new Model())
      const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty')
      getSettingPropertyStub.returns(settingValue)

      expect(metadata.getSettingWithDefaultForTrueValue('test', 'default') === settingValue).toBe(true)
      expect(getSettingPropertyStub.calledWith('test', false)).toBe(true)

      getSettingPropertyStub.restore()
    })
  })

  describe('.fillable()', function() {
    it('calls .getSettingProperty() with "fillable" and default value = []', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty')
      getSettingPropertyStub.returns(['test'])

      expect(metadata.fillable()).toEqual(['test'])
      expect(getSettingPropertyStub.calledWith('fillable', [])).toBe(true)

      getSettingPropertyStub.restore()
    })
  })

  describe('.guarded()', function() {
    it('calls .getSettingProperty() with "guarded" and default value = ["*"]', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingPropertyStub = Sinon.stub(metadata, 'getSettingProperty')
      getSettingPropertyStub.returns(['*'])

      expect(metadata.guarded()).toEqual(['*'])
      expect(getSettingPropertyStub.calledWith('guarded', ['*'])).toBe(true)

      getSettingPropertyStub.restore()
    })
  })

  describe('.hasTimestamps()', function() {
    it('calls .hasSetting() with key "timestamps" and returns result', function() {
      const metadata = EloquentMetadata.get(new Model())
      const hasSettingStub = Sinon.stub(metadata, 'hasSetting')
      hasSettingStub.returns('test')

      expect(metadata.hasTimestamps()).toEqual('test')
      expect(hasSettingStub.calledWith('timestamps')).toBe(true)

      hasSettingStub.restore()
    })
  })

  describe('.timestamps()', function() {
    it('calls .getSettingWithDefaultForTrueValue() with "timestamps" and defaultValue', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue')
      getSettingWithDefaultForTrueValueStub.returns('test')

      expect(metadata.timestamps()).toEqual('test')
      expect(
        getSettingWithDefaultForTrueValueStub.calledWith('timestamps', {
          createdAt: 'created_at',
          updatedAt: 'updated_at'
        })
      ).toBe(true)

      getSettingWithDefaultForTrueValueStub.restore()
    })

    it('can call with custom defaultValue', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue')
      getSettingWithDefaultForTrueValueStub.returns('test')

      expect(metadata.timestamps(<any>'custom')).toEqual('test')
      expect(getSettingWithDefaultForTrueValueStub.calledWith('timestamps', 'custom')).toBe(true)

      getSettingWithDefaultForTrueValueStub.restore()
    })
  })

  describe('.hasSoftDeletes()', function() {
    it('calls .hasSetting() with key "softDeletes" and returns result', function() {
      const metadata = EloquentMetadata.get(new Model())
      const hasSettingStub = Sinon.stub(metadata, 'hasSetting')
      hasSettingStub.returns('test')

      expect(metadata.hasSoftDeletes()).toEqual('test')
      expect(hasSettingStub.calledWith('softDeletes')).toBe(true)

      hasSettingStub.restore()
    })
  })

  describe('.softDeletes()', function() {
    it('calls .getSettingWithDefaultForTrueValue() with "softDeletes" and defaultValue', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue')
      getSettingWithDefaultForTrueValueStub.returns('test')

      expect(metadata.softDeletes()).toEqual('test')
      expect(
        getSettingWithDefaultForTrueValueStub.calledWith('softDeletes', {
          deletedAt: 'deleted_at',
          overrideMethods: false
        })
      ).toBe(true)

      getSettingWithDefaultForTrueValueStub.restore()
    })

    it('can call with custom defaultValue', function() {
      const metadata = EloquentMetadata.get(new Model())
      const getSettingWithDefaultForTrueValueStub = Sinon.stub(metadata, 'getSettingWithDefaultForTrueValue')
      getSettingWithDefaultForTrueValueStub.returns('test')

      expect(metadata.softDeletes(<any>'custom')).toEqual('test')
      expect(getSettingWithDefaultForTrueValueStub.calledWith('softDeletes', 'custom')).toBe(true)

      getSettingWithDefaultForTrueValueStub.restore()
    })
  })

  describe('.hasAttribute()', function() {
    it('returns false if the name not in "knownAttributes"', function() {
      const metadata = EloquentMetadata.get(new Model())
      metadata['attribute']['known'] = ['test']
      expect(metadata.hasAttribute('test')).toEqual(true)
      expect(metadata.hasAttribute('not-found')).toEqual(false)
    })

    it('always returns true if typeof name is Symbol', function() {
      const metadata = EloquentMetadata.get(new Model())
      metadata['attribute']['known'] = ['test']
      expect(metadata.hasAttribute(Symbol.for('test'))).toEqual(true)
      expect(metadata.hasAttribute(Symbol.for('not-found'))).toEqual(true)
    })
  })
})
