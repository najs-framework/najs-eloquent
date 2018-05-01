import 'jest'
import * as Sinon from 'sinon'
import { Chance } from 'chance'
import { Facade } from 'najs-facade'
import { Eloquent } from '../../lib/model/Eloquent'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProviderFacade } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { NajsEloquent } from '../../lib/constants'
import { FactoryManager } from '../../lib/factory/FactoryManager'
import { FactoryBuilder } from '../../lib/factory/FactoryBuilder'

describe('FactoryManager', function() {
  it('extends Facade and implements IAutoload', function() {
    const factoryManager = new FactoryManager()
    expect(factoryManager).toBeInstanceOf(Facade)
    expect(factoryManager.getClassName()).toEqual(NajsEloquent.Factory.FactoryManager)
  })

  describe('constructor()', function() {
    it('using chance library and creates faker', function() {
      const factoryManager = new FactoryManager()
      expect(factoryManager['faker']).toBeInstanceOf(Chance)
    })
  })

  describe('protected .parseModelName()', function() {
    it('returns if the param is a string', function() {
      const factoryManager = new FactoryManager()
      expect(factoryManager['parseModelName']('Class')).toEqual('Class')
    })

    it("calls Eloquent.register() and return a class's name if the param is Function", function() {
      class Class {
        static className = 'Class'
      }
      const registerStub = Sinon.stub(Eloquent, 'register')

      const factoryManager = new FactoryManager()
      expect(factoryManager['parseModelName'](<any>Class)).toEqual('Class')
      expect(registerStub.calledWith(Class)).toBe(true)

      registerStub.restore()
    })

    it("calls Eloquent.register() and return a class's name if the param is Eloquent", function() {
      EloquentDriverProviderFacade.register(DummyDriver, 'dummy', true)
      class Class extends Eloquent {
        getClassName() {
          return 'Test'
        }
      }
      const registerStub = Sinon.stub(Eloquent, 'register')

      const factoryManager = new FactoryManager()
      expect(factoryManager['parseModelName'](Class)).toEqual('Test')
      expect(registerStub.calledWith(Class)).toBe(true)

      registerStub.restore()
    })
  })

  describe('.define()', function() {
    it('is chain-able', function() {
      const factoryManager = new FactoryManager()
      expect(factoryManager.define('Test', <any>{}) === factoryManager).toBe(true)
    })

    it('creates definitions object with 2 levels definitions[className][name] = func()', function() {
      const definition = () => {}
      const factoryManager = new FactoryManager()
      expect(factoryManager['definitions']).toEqual({})
      factoryManager.define('Class', <any>definition)
      expect(factoryManager['definitions']).toEqual({
        Class: {
          default: definition
        }
      })
      factoryManager.define('Class', <any>definition, 'test')
      expect(factoryManager['definitions']).toEqual({
        Class: {
          test: definition,
          default: definition
        }
      })
    })

    it('calls Eloquent.register() and return a className if the param is function or Eloquent', function() {
      class Class {
        static className = 'Class'
      }

      const definition = () => {}
      const factoryManager = new FactoryManager()
      expect(factoryManager['definitions']).toEqual({})
      factoryManager.define(<any>Class, <any>definition)
      expect(factoryManager['definitions']).toEqual({
        Class: {
          default: definition
        }
      })
      factoryManager.define(<any>Class, <any>definition, 'test')
      expect(factoryManager['definitions']).toEqual({
        Class: {
          test: definition,
          default: definition
        }
      })
    })
  })

  describe('.defineAs()', function() {
    it('calls .define() and returns result', function() {
      const factoryManager = new FactoryManager()
      const defineStub = Sinon.stub(factoryManager, 'define')
      defineStub.returns('anything')

      const definition = () => {}
      factoryManager.defineAs('Class', 'test', <any>definition)
      expect(defineStub.calledWith('Class', definition, 'test')).toBe(true)
    })
  })

  describe('.state()', function() {
    it('is chain-able', function() {
      const factoryManager = new FactoryManager()
      expect(factoryManager.state('Test', 'test', <any>{}) === factoryManager).toBe(true)
    })

    it('creates states object with 2 levels definitions[className][name] = func()', function() {
      const state = () => {}
      const factoryManager = new FactoryManager()
      expect(factoryManager['states']).toEqual({})
      factoryManager.state('Class', 'test', <any>state)
      expect(factoryManager['states']).toEqual({
        Class: {
          test: state
        }
      })

      factoryManager.state('Class', 'init', <any>state)
      expect(factoryManager['states']).toEqual({
        Class: {
          init: state,
          test: state
        }
      })
    })
  })

  describe('.of()', function() {
    it('creates new instance of FactoryBuilder with all params from FactoryManager', function() {
      const factoryManager = new FactoryManager()

      const firstInstance = factoryManager.of('Class')
      expect(firstInstance).toBeInstanceOf(FactoryBuilder)
      expect(firstInstance['className']).toEqual('Class')
      expect(firstInstance['name']).toEqual('default')
      expect(firstInstance['definitions'] === factoryManager['definitions']).toBe(true)
      expect(firstInstance['definedStates'] === factoryManager['states']).toBe(true)
      expect(firstInstance['faker'] === factoryManager['faker']).toBe(true)

      const secondInstance = factoryManager.of('Class', 'test')
      expect(secondInstance).toBeInstanceOf(FactoryBuilder)
      expect(secondInstance['className']).toEqual('Class')
      expect(secondInstance['name']).toEqual('test')
      expect(secondInstance['definitions'] === factoryManager['definitions']).toBe(true)
      expect(secondInstance['definedStates'] === factoryManager['states']).toBe(true)
      expect(secondInstance['faker'] === factoryManager['faker']).toBe(true)
    })
  })

  const CreateByOfForwardToBuilder = {
    create: 'create',
    createAs: 'create',
    make: 'make',
    makeAs: 'make',
    raw: 'raw',
    rawOf: 'raw'
  }
  for (const name in CreateByOfForwardToBuilder) {
    const hasNameParam = CreateByOfForwardToBuilder[name] !== name
    describe('.' + name + '()', function() {
      it('calls .of() then call .' + CreateByOfForwardToBuilder[name] + '() and returns a result', function() {
        const factoryManager = new FactoryManager()

        const ofStub = Sinon.stub(factoryManager, 'of')
        ofStub.returns({
          [CreateByOfForwardToBuilder[name]]: function(val: any) {
            return 'anything-' + val
          }
        })

        if (hasNameParam) {
          expect(factoryManager[name]('Class', 'name')).toEqual('anything-undefined')
          expect(ofStub.calledWith('Class', 'name')).toBe(true)
          expect(factoryManager[name]('Class', 'name', 'test')).toEqual('anything-test')
          expect(ofStub.calledWith('Class', 'name')).toBe(true)
        } else {
          expect(factoryManager[name]('Class')).toEqual('anything-undefined')
          expect(ofStub.calledWith('Class')).toBe(true)
          expect(factoryManager[name]('Class', 'test')).toEqual('anything-test')
          expect(ofStub.calledWith('Class')).toBe(true)
        }
      })
    })
  }
})
