import 'jest'
import '../../lib/providers/DriverManager'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { Eloquent } from '../../lib/model/Eloquent'

EloquentDriverProvider.register(DummyDriver, 'dummy')

describe('EloquentProxy', function() {
  describe('proxy:get', function() {
    class GetProxy extends Eloquent {
      defined_attribute: string
      accessor: string

      get getter_attribute() {
        return this.attributes['getter_attribute']
      }

      getMutatorAttribute(value: string) {
        return this.attributes['accessor']
      }

      getClassName() {
        return 'GetProxy'
      }

      driverProxyMethod(...args: any[]) {
        return 'method in model ' + args.join(',')
      }

      queryProxyMethod(...args: any[]) {
        return 'method in model ' + args.join(',')
      }
    }
    register(GetProxy)

    it('returns an bound function which belongs to driver if the key defined in driver.getDriverProxyMethods()', function() {
      const model = new GetProxy({ defined_attribute: 'test' })
      const fakeDriver = {
        getDriverProxyMethods() {
          return ['driverProxyMethod']
        },
        driverProxyMethod(...args: any[]) {
          return 'method in driver ' + args.join(',')
        }
      }
      model['driver'] = <any>fakeDriver

      expect(model.driverProxyMethod()).toEqual('method in driver ')
      expect(model.driverProxyMethod('a')).toEqual('method in driver a')
      expect(model.driverProxyMethod('a', 'b')).toEqual('method in driver a,b')
      expect(model.driverProxyMethod('a', 'b', 'c')).toEqual('method in driver a,b,c')

      const spy = Sinon.spy(fakeDriver, 'driverProxyMethod')
      expect(model.driverProxyMethod('test')).toEqual('method in driver test')
      expect(spy.lastCall.thisValue === fakeDriver).toBe(true)
      expect(spy.lastCall.calledWith('test')).toBe(true)
    })

    it('returns an bound function which belongs to driver.newQuery() if the key defined in driver.getQueryProxyMethods()', function() {
      const model = new GetProxy({ defined_attribute: 'test' })
      const fakeQuery = {
        queryProxyMethod(...args: any[]) {
          return 'method in query ' + args.join(',')
        }
      }
      const fakeDriver = {
        newQuery() {
          return fakeQuery
        },
        getDriverProxyMethods() {
          return []
        },
        getQueryProxyMethods() {
          return ['queryProxyMethod']
        }
      }
      model['driver'] = <any>fakeDriver

      expect(model.queryProxyMethod()).toEqual('method in query ')
      expect(model.queryProxyMethod('a')).toEqual('method in query a')
      expect(model.queryProxyMethod('a', 'b')).toEqual('method in query a,b')
      expect(model.queryProxyMethod('a', 'b', 'c')).toEqual('method in query a,b,c')

      const spy = Sinon.spy(fakeQuery, 'queryProxyMethod')
      expect(model.queryProxyMethod('test')).toEqual('method in query test')
      expect(spy.lastCall.thisValue === fakeQuery).toBe(true)
      expect(spy.lastCall.calledWith('test')).toBe(true)
    })

    it('calls EloquentAttribute.getAttribute() if the attribute is dynamic, works with defined attribute', function() {
      const model = new GetProxy({ defined_attribute: 'test' })
      expect(model.defined_attribute).toEqual('test')
    })

    it('calls EloquentAttribute.getAttribute() if the attribute is dynamic, works with getter attribute', function() {
      const model = new GetProxy({ getter_attribute: 'test' })
      expect(model.getter_attribute).toEqual('test')
    })

    it('calls EloquentAttribute.getAttribute() if the attribute is dynamic, works with accessor', function() {
      const model = new GetProxy({ accessor: 'test' })
      expect(model.accessor).toEqual('test')
    })

    it('simply returns value if that is a known attribute', function() {
      const model = new GetProxy()
      model['guarded'] = ['test']
      expect(model['guarded']).toEqual(['test'])
      expect(typeof model.getClassName === 'function').toBe(true)
    })
  })

  describe('proxy:set', function() {
    class SetProxy extends Eloquent {
      defined_attribute: string
      mutator: string

      set setter_attribute(value: string) {
        this.attributes['setter_attribute'] = value
      }

      setMutatorAttribute(value: string) {
        this.attributes['mutator'] = value
      }

      getClassName() {
        return 'SetProxy'
      }
    }
    register(SetProxy)

    it('calls EloquentAttribute.setAttribute() if the attribute is dynamic, works with defined attribute', function() {
      const model = new SetProxy()
      model.defined_attribute = 'test'
      expect(model['attributes']).toEqual({ defined_attribute: 'test' })
      expect(model['driver']['attributes']).toEqual({ defined_attribute: 'test' })
    })

    it('calls EloquentAttribute.setAttribute() if the attribute is dynamic, works with setter attribute', function() {
      const model = new SetProxy()
      model.setter_attribute = 'test'
      expect(model['attributes']).toEqual({ setter_attribute: 'test' })
      expect(model['driver']['attributes']).toEqual({ setter_attribute: 'test' })
    })

    it('calls EloquentAttribute.setAttribute() if the attribute is dynamic, works with mutator', function() {
      const model = new SetProxy()
      model.mutator = 'test'
      expect(model['attributes']).toEqual({ mutator: 'test' })
      expect(model['driver']['attributes']).toEqual({ mutator: 'test' })
    })

    it('simply grants value if that is a known attribute', function() {
      const model = new SetProxy()
      model['guarded'] = ['test']
      expect(model['guarded']).toEqual(['test'])
      expect(model['attributes']).toEqual({})
      expect(model['driver']['attributes']).toEqual({})
    })
  })
})
