import 'jest'
import * as Sinon from 'sinon'
import collect from 'collect.js'
import { register } from 'najs-binding'
import { FactoryBuilder } from '../../lib/factory/FactoryBuilder'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { Eloquent } from '../../lib/model/Eloquent'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

class Model extends Eloquent {
  getClassName() {
    return 'Model'
  }
}
register(Model)

describe('FactoryBuilder', function() {
  describe('constructor()', function() {
    it('simply creates new instance and assign parameters to member variables', function() {
      const faker = {}
      const definitions = {}
      const states = {}
      const builder = new FactoryBuilder('Class', 'name', definitions, states, <any>faker)
      expect(builder['className']).toEqual('Class')
      expect(builder['name']).toEqual('name')
      expect(builder['definitions'] === definitions).toBe(true)
      expect(builder['definedStates'] === states).toBe(true)
      expect(builder['faker'] === faker).toBe(true)
      expect(builder['amount']).toBeUndefined()
      expect(builder['activeStates']).toBeUndefined()
    })
  })

  describe('.times()', function() {
    it('assigns param to "amount"', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      expect(builder['amount']).toBeUndefined()
      builder.times(-1)
      expect(builder['amount']).toEqual(-1)
      builder.times(0)
      expect(builder['amount']).toEqual(0)
      builder.times(1)
      expect(builder['amount']).toEqual(1)
      builder.times(10)
      expect(builder['amount']).toEqual(10)
    })
  })

  describe('.states()', function() {
    it('flatten param to "activeStates"', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      expect(builder['activeStates']).toBeUndefined()
      builder.states('test')
      expect(builder['activeStates']).toEqual(['test'])
      builder.states('a', 'b')
      expect(builder['activeStates']).toEqual(['a', 'b'])
      builder.states(['a', 'b', 'c'])
      expect(builder['activeStates']).toEqual(['a', 'b', 'c'])
      builder.states(['a', 'b'], ['c', 'd'])
      expect(builder['activeStates']).toEqual(['a', 'b', 'c', 'd'])
    })
  })

  describe('.create()', function() {
    it('calls .make() and if the result is instance of Eloquent, it calls .save() and returns result', async function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      const makeStub = Sinon.stub(builder, 'make')
      const model = new Model()
      model['save'] = Sinon.spy(function() {})

      makeStub.returns(model)

      const valueOne = await builder.create()

      expect(valueOne === model).toBe(true)
      expect(makeStub.calledWith()).toBe(true)
      expect(model['save'].callCount).toEqual(1)

      const params = {}
      const valueTwo = await builder.create(params)
      expect(valueTwo === model).toBe(true)
      expect(makeStub.calledWith(params)).toBe(true)
      expect(model['save'].callCount).toEqual(2)
    })

    it('calls .make() and loop all model in Collection, calls .save() and returns result', async function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      const makeStub = Sinon.stub(builder, 'make')
      const model = new Model()
      model['save'] = Sinon.spy(function() {})

      makeStub.returns(collect([model, model]))

      const valueOne = await builder.create()

      expect(valueOne).toEqual({ items: [model, model] })
      expect(makeStub.calledWith()).toBe(true)
      expect(model['save'].callCount).toEqual(2)

      const params = {}
      const valueTwo = await builder.create(params)
      expect(valueTwo).toEqual({ items: [model, model] })
      expect(makeStub.calledWith(params)).toBe(true)
      expect(model['save'].callCount).toEqual(4)
    })
  })

  describe('.make()', function() {
    it('simply calls .makeInstance() and returns result if there is no "amount"', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      const makeInstanceStub = Sinon.stub(builder, <any>'makeInstance')
      makeInstanceStub.returns('anything')

      expect(builder.make()).toEqual('anything')
      expect(makeInstanceStub.calledWith()).toBe(true)

      const params = {}
      expect(builder.make(params)).toEqual('anything')
      expect(makeInstanceStub.calledWith(params)).toBe(true)
    })

    it('calls .make().newCollection() with empty array if "amount" < 1', function() {
      const builder = new FactoryBuilder('Model', 'name', {}, {}, <any>{})
      const newCollectionSpy = Sinon.spy(Model.prototype, 'newCollection')

      builder.times(0)
      expect(builder.make().count()).toEqual(0)
      expect(newCollectionSpy.calledWith([])).toBe(true)
      newCollectionSpy.restore()
    })

    it('calls .make().newCollection() with .makeInstance() result n times', function() {
      const builder = new FactoryBuilder('Model', 'name', {}, {}, <any>{})
      const newCollectionSpy = Sinon.spy(Model.prototype, 'newCollection')

      const makeInstanceStub = Sinon.stub(builder, <any>'makeInstance')
      makeInstanceStub.returns('anything')

      builder.times(3)
      expect(builder.make().count()).toEqual(3)
      expect(makeInstanceStub.callCount).toEqual(3)

      expect(newCollectionSpy.calledWith(['anything', 'anything', 'anything'])).toBe(true)
      newCollectionSpy.restore()
    })
  })

  describe('.raw()', function() {
    it('simply calls .getRawAttributes() and returns result if there is no "amount"', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      const getRawAttributesStub = Sinon.stub(builder, <any>'getRawAttributes')
      getRawAttributesStub.returns('anything')

      expect(builder.raw()).toEqual('anything')
      expect(getRawAttributesStub.calledWith()).toBe(true)

      const params = {}
      expect(builder.raw(params)).toEqual('anything')
      expect(getRawAttributesStub.calledWith(params)).toBe(true)
    })

    it('returns empty collection if "amount" < 1', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      builder.times(0)
      expect(builder.raw().count()).toEqual(0)
    })

    it('returns a Collection which wraps .getRawAttributes() result n times', function() {
      const builder = new FactoryBuilder('Class', 'name', {}, {}, <any>{})
      const getRawAttributesStub = Sinon.stub(builder, <any>'getRawAttributes')
      getRawAttributesStub.returns('anything')
      builder.times(3)
      expect(builder.raw()).toEqual({ items: ['anything', 'anything', 'anything'] })
      expect(getRawAttributesStub.callCount).toEqual(3)
    })
  })

  describe('protected .makeInstance()', function() {
    it('does something', function() {
      const builder = new FactoryBuilder('Model', 'name', {}, {}, <any>{})
      builder['makeInstance']()
    })
  })

  describe('protected .getRawAttributes()', function() {
    it('does something', function() {
      const builder = new FactoryBuilder('Model', 'name', {}, {}, <any>{})
      builder['getRawAttributes']()
    })
  })
})
