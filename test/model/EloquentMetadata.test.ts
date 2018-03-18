import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/drivers/EloquentDriverProvider'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentMetadata } from '../../lib/model/EloquentMetadata'
import { GET_FORWARD_TO_DRIVER_FUNCTIONS, GET_QUERY_FUNCTIONS } from '../../lib/model/EloquentProxy'

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
  })

  describe('protected .buildKnownAttributes()', function() {
    it('merges reserved properties defined in .getReservedProperties() of model and driver', function() {
      const metadata = EloquentMetadata.get(new Model())
      const props = new Model()['getReservedProperties']()
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined Eloquent.prototype', function() {
      const metadata = EloquentMetadata.get(new Model())
      const props = Object.getOwnPropertyNames(Model.prototype)
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined in model', function() {
      const metadata = EloquentMetadata.get(new Model())
      const props = ['accessor', 'mutator', 'modelMethod']
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }

      // warning: props defined in model is not included in list
      expect(metadata['knownAttributes'].indexOf('props') === -1).toBe(true)
    })

    it('merges properties defined in child model', function() {
      const metadata = EloquentMetadata.get(new ChildModel())
      const props = ['child_accessor', 'child_mutator', 'childModelMethod']
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }
      // warning: props defined in model is not included in list
      expect(metadata['knownAttributes'].indexOf('child_props') === -1).toBe(true)
    })

    it('merges properties defined GET_FORWARD_TO_DRIVER_FUNCTIONS', function() {
      const metadata = EloquentMetadata.get(new Model())
      const props = GET_FORWARD_TO_DRIVER_FUNCTIONS
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined GET_QUERY_FUNCTIONS', function() {
      const metadata = EloquentMetadata.get(new Model())
      const props = GET_QUERY_FUNCTIONS
      for (const name of props) {
        expect(metadata['knownAttributes'].indexOf(name) !== -1).toBe(true)
      }
    })
  })

  describe('protected .findGettersAndSetters()', function() {
    it('finds all defined getters and put to accessors with type = getter', function() {
      class GetterEmpty extends Eloquent {
        getClassName() {
          return 'GetterEmpty'
        }
      }
      register(GetterEmpty)
      expect(EloquentMetadata.get(new GetterEmpty())['accessors']).toEqual({})

      class GetterA extends Eloquent {
        get a() {
          return ''
        }

        get b() {
          return ''
        }

        getClassName() {
          return 'GetterA'
        }
      }
      register(GetterA)
      const metadata = EloquentMetadata.get(new GetterA())
      expect(metadata['accessors']).toEqual({
        a: { name: 'a', type: 'getter' },
        b: { name: 'b', type: 'getter' }
      })
    })

    it('finds all defined setters and put to mutators with type = setter', function() {
      class SetterEmpty extends Eloquent {
        getClassName() {
          return 'MutatorEmpty'
        }
      }
      register(SetterEmpty)
      expect(EloquentMetadata.get(new SetterEmpty())['mutators']).toEqual({})

      class SetterA extends Eloquent {
        set a(value: any) {}

        set b(value: any) {}

        getClassName() {
          return 'SetterA'
        }
      }
      register(SetterA)
      const metadata = EloquentMetadata.get(new SetterA())
      expect(metadata['mutators']).toEqual({
        a: { name: 'a', type: 'setter' },
        b: { name: 'b', type: 'setter' }
      })
    })
  })

  describe('protected .findAccessorsAndMutators()', function() {
    it('does thing if there is no function with format `get|set...Attribute`', function() {
      class NoAccessorOrMutator extends Eloquent {
        getClassName() {
          return 'NoAccessorOrMutator'
        }
      }
      register(NoAccessorOrMutator)
      expect(EloquentMetadata.get(new NoAccessorOrMutator())['accessors']).toEqual({})
      expect(EloquentMetadata.get(new NoAccessorOrMutator())['mutators']).toEqual({})
    })

    it('puts `get...Attribute` to accessors with type function, but skip if getter of same attribute is defined', function() {
      class AccessorA extends Eloquent {
        get a() {
          return ''
        }

        getAAttribute() {}

        getFirstNameAttribute() {}

        getWrongFormat() {}

        getDoublegetDoubleAttribute() {}

        getClassName() {
          return 'AccessorA'
        }
      }
      register(AccessorA)
      expect(EloquentMetadata.get(new AccessorA())['accessors']).toEqual({
        a: {
          name: 'a',
          type: 'getter'
        },
        first_name: {
          name: 'first_name',
          type: 'function',
          ref: 'getFirstNameAttribute'
        },
        doubleget_double: {
          name: 'doubleget_double',
          type: 'function',
          ref: 'getDoublegetDoubleAttribute'
        }
      })
    })

    it('puts `set...Attribute` to mutators with type function, but skip if setter of same attribute is defined', function() {
      class MutatorA extends Eloquent {
        set a(value: any) {}

        setAAttribute() {}

        setFirstNameAttribute() {}

        setWrongFormat() {}

        setDoublegetDoubleAttribute() {}

        getClassName() {
          return 'MutatorA'
        }
      }
      register(MutatorA)
      expect(EloquentMetadata.get(new MutatorA())['mutators']).toEqual({
        a: {
          name: 'a',
          type: 'setter'
        },
        first_name: {
          name: 'first_name',
          type: 'function',
          ref: 'setFirstNameAttribute'
        },
        doubleget_double: {
          name: 'doubleget_double',
          type: 'function',
          ref: 'setDoublegetDoubleAttribute'
        }
      })
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
      metadata['knownAttributes'] = ['test']
      expect(metadata.hasAttribute('test')).toEqual(true)
      expect(metadata.hasAttribute('not-found')).toEqual(false)
    })

    it('always returns true if typeof name is Symbol', function() {
      const metadata = EloquentMetadata.get(new Model())
      metadata['knownAttributes'] = ['test']
      expect(metadata.hasAttribute(Symbol.for('test'))).toEqual(true)
      expect(metadata.hasAttribute(Symbol.for('not-found'))).toEqual(true)
    })
  })
})
