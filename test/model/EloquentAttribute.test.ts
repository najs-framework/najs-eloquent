import 'jest'
import { register } from 'najs-binding'
import { Eloquent } from '../../lib/model/Eloquent'
import { EloquentAttribute } from '../../lib/model/EloquentAttribute'
import { EloquentDriverProvider } from '../../lib/drivers/EloquentDriverProvider'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
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

const fakeModel = {
  getReservedProperties() {
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
      attribute.findAccessorsAndMutators(Object.getPrototypeOf(new ClassEmpty()))
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
      attribute.findAccessorsAndMutators(Object.getPrototypeOf(new Class()))
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
  })

  describe('protected .buildKnownAttributes()', function() {
    const attribute = new EloquentAttribute(<any>fakeModel, <any>{})
    attribute.buildKnownAttributes(new Model(), Model.prototype)

    it('merges reserved properties defined in .getReservedProperties() of model and driver', function() {
      const props = new Model()['getReservedProperties']()
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
      const props = GET_FORWARD_TO_DRIVER_FUNCTIONS
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })

    it('merges properties defined GET_QUERY_FUNCTIONS', function() {
      const props = GET_QUERY_FUNCTIONS
      for (const name of props) {
        expect(attribute['known'].indexOf(name) !== -1).toBe(true)
      }
    })
  })
})
