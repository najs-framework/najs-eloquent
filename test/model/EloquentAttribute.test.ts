import 'jest'
import '../../lib/providers/DriverManager'
import { camelCase } from 'lodash'
import { register } from 'najs-binding'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentAttribute } from '../../lib/model/EloquentAttribute'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { DummyDriver } from '../../lib/drivers/DummyDriver'

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

const fakeModel = {
  driver: {
    getDriverProxyMethods() {
      return []
    },
    getQueryProxyMethods() {
      return []
    }
  },
  getReservedNames() {
    return []
  }
}

describe('EloquentAttribute', function() {
  describe('.findGettersAndSetters()', function() {
    it('finds all defined getters and put to accessors with type = getter', function() {
      class ClassEmpty {}
      const attribute = new EloquentAttribute(<any>fakeModel, <any>{})
      attribute.findGettersAndSetters(Object.getPrototypeOf(new ClassEmpty()))
      expect(attribute['dynamic']).toEqual({})

      class Class {
        get a() {
          return ''
        }

        set a(value: any) {}

        get b() {
          return ''
        }
      }
      attribute.findGettersAndSetters(Object.getPrototypeOf(new Class()))
      expect(attribute['dynamic']).toEqual({
        a: { name: 'a', getter: true, setter: true },
        b: { name: 'b', getter: true, setter: false }
      })
    })
  })

  describe('.findAccessorsAndMutators()', function() {
    it('finds all defined getters and put to accessors with type = getter', function() {
      class ClassEmpty {}
      const attribute = new EloquentAttribute(<any>fakeModel, <any>{})
      attribute.findAccessorsAndMutators(new Model(), Object.getPrototypeOf(new ClassEmpty()))
      expect(attribute['dynamic']).toEqual({})

      class Class {
        get a() {
          return ''
        }

        getAAttribute() {}

        getFirstNameAttribute() {}

        getWrongFormat() {}

        set b(value: any) {}

        setBAttribute() {}

        setWrongFormat() {}

        setDoublegetDoubleAttribute() {}

        get c() {
          return ''
        }

        set c(value: any) {}

        getCAttribute() {}

        setCAttribute() {}
      }

      attribute.findGettersAndSetters(Object.getPrototypeOf(new Class()))
      attribute.findAccessorsAndMutators(new Model(), Object.getPrototypeOf(new Class()))
      expect(attribute['dynamic']).toEqual({
        a: { name: 'a', getter: true, setter: false, accessor: 'getAAttribute' },
        b: { name: 'b', getter: false, setter: true, mutator: 'setBAttribute' },
        c: { name: 'c', getter: true, setter: true, accessor: 'getCAttribute', mutator: 'setCAttribute' },
        first_name: { name: 'first_name', getter: false, setter: false, accessor: 'getFirstNameAttribute' },
        doubleget_double: {
          name: 'doubleget_double',
          getter: false,
          setter: false,
          mutator: 'setDoublegetDoubleAttribute'
        }
      })
    })

    it('calls driver.formatAttributeName() to get the name of property', function() {
      class Class {
        getFirstNameAttribute() {}
        setCustomNameConventionAttribute() {}
      }

      const attribute = new EloquentAttribute(<any>fakeModel, <any>{})
      const customConventionModel = {
        driver: {
          getDriverProxyMethods() {
            return []
          },
          getQueryProxyMethods() {
            return []
          },
          formatAttributeName(name: string) {
            return camelCase(name)
          }
        },
        getReservedNames() {
          return []
        }
      }
      attribute.findAccessorsAndMutators(<any>customConventionModel, Object.getPrototypeOf(new Class()))
      expect(attribute['dynamic']).toEqual({
        firstName: { name: 'firstName', getter: false, setter: false, accessor: 'getFirstNameAttribute' },
        customNameConvention: {
          name: 'customNameConvention',
          getter: false,
          setter: false,
          mutator: 'setCustomNameConventionAttribute'
        }
      })
    })
  })

  describe('protected .buildKnownAttributes()', function() {
    const attribute = new EloquentAttribute(<any>fakeModel, <any>{})
    attribute.buildKnownAttributes(new Model(), Model.prototype)

    it('merges reserved properties defined in .getReservedNames() of model and driver', function() {
      const props = new Model()['getReservedNames']()
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined Eloquent.prototype', function() {
      const props = Object.getOwnPropertyNames(Model.prototype)
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined in model', function() {
      const props = ['accessor', 'mutator', 'modelMethod']
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }

      // warning: props defined in model is not included in list
      expect(attribute['known'].indexOf('props') === -1).toBe(true)
    })

    it('merges properties defined in child model', function() {
      const childAttribute = new EloquentAttribute(new ChildModel(), ChildModel.prototype)
      const props = ['child_accessor', 'child_mutator', 'childModelMethod']
      for (const name of props) {
        expect(childAttribute['known'].indexOf(name) !== -1).toBe(true)
      }
      // warning: props defined in model is not included in list
      expect(childAttribute['known'].indexOf('child_props') === -1).toBe(true)
    })

    it('merges properties defined GET_FORWARD_TO_DRIVER_FUNCTIONS', function() {
      const props = new Model()['driver'].getDriverProxyMethods()
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined GET_QUERY_FUNCTIONS', function() {
      const props = new Model()['driver'].getQueryProxyMethods()
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })
  })

  describe('.isKnownAttribute()', function() {
    it('returns false if the name not in "knownAttributes"', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      attribute['known'] = ['test']
      expect(attribute.isKnownAttribute('test')).toEqual(true)
      expect(attribute.isKnownAttribute('not-found')).toEqual(false)
    })

    it('always returns true if typeof name is Symbol', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      attribute['known'] = ['test']
      expect(attribute.isKnownAttribute(Symbol.for('test'))).toEqual(true)
      expect(attribute.isKnownAttribute(Symbol.for('not-found'))).toEqual(true)
    })
  })

  describe('.getAttribute()', function() {
    it('calls target.getAttribute() if the attribute is not dynamic attribute', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        getAttribute(key: any) {
          return 'target-value-' + key
        }
      }
      attribute['known'] = ['something']

      expect(attribute.getAttribute(<any>target, 'something')).toEqual('target-value-something')
    })

    it('calls target.getAttribute() if the attribute is dynamic but there is no getter or accessor', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        getAttribute(key: any) {
          return 'target-value-' + key
        }
      }
      attribute['dynamic'] = {
        something: {
          name: 'something',
          getter: false,
          setter: false
        }
      }

      expect(attribute.getAttribute(<any>target, 'something')).toEqual('target-value-something')
    })

    it('calls and returns getter even accessor is provided', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        get first_name() {
          return 'getter-value'
        },

        getFirstNameAttribute() {
          return 'accessor-value'
        }
      }
      attribute['known'] = []
      attribute['dynamic'] = {
        first_name: {
          name: 'first_name',
          getter: true,
          setter: false,
          accessor: 'getFirstNameAttribute'
        }
      }
      expect(attribute.getAttribute(<any>target, 'first_name')).toEqual('getter-value')
    })

    it('calls accessor if the accessor is defined and getter not found', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        getFirstNameAttribute() {
          return 'accessor-value'
        }
      }
      attribute['known'] = []
      attribute['dynamic'] = {
        first_name: {
          name: 'first_name',
          getter: false,
          setter: false,
          accessor: 'getFirstNameAttribute'
        }
      }
      expect(attribute.getAttribute(<any>target, 'first_name')).toEqual('accessor-value')
    })
  })

  describe('.setAttribute()', function() {
    it('calls target.setAttribute() if the attribute is not dynamic attribute', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        val: '',
        setAttribute(key: any, value: any) {
          this.val = 'target-' + key + '-' + value
          return true
        }
      }
      attribute['known'] = ['something']

      expect(attribute.setAttribute(<any>target, 'something', 'value')).toBe(true)
      expect(target.val).toEqual('target-something-value')
    })

    it('calls target.setAttribute() if the attribute is dynamic but there is no setter or mutator', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        val: '',
        setAttribute(key: any, value: any) {
          this.val = 'target-' + key + '-' + value
          return true
        }
      }
      attribute['dynamic'] = {
        something: {
          name: 'something',
          getter: false,
          setter: false
        }
      }

      expect(attribute.setAttribute(<any>target, 'something', 'value')).toBe(true)
      expect(target.val).toEqual('target-something-value')
    })

    it('calls and returns setter even accessor is provided', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        val: '',

        set first_name(value: any) {
          this.val = 'setter-' + value
        },

        setFirstNameAttribute(value: any) {
          this.val = 'mutator-' + value
        }
      }
      attribute['known'] = []
      attribute['dynamic'] = {
        first_name: {
          name: 'first_name',
          getter: false,
          setter: true,
          mutator: 'setFirstNameAttribute'
        }
      }
      expect(attribute.setAttribute(<any>target, 'first_name', 'value')).toBe(true)
      expect(target.val).toEqual('setter-value')
    })

    it('calls mutator if the mutator is defined and setter not found', function() {
      const attribute = new EloquentAttribute(<any>fakeModel, Model.prototype)
      const target = {
        val: '',
        setFirstNameAttribute(value: any) {
          this.val = 'mutator-' + value
        }
      }
      attribute['known'] = []
      attribute['dynamic'] = {
        first_name: {
          name: 'first_name',
          getter: false,
          setter: false,
          mutator: 'setFirstNameAttribute'
        }
      }
      expect(attribute.setAttribute(<any>target, 'first_name', 'value')).toBe(true)
      expect(target.val).toEqual('mutator-value')
    })
  })
})
