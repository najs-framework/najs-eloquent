import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { RelationFactory } from '../../lib/relations/RelationFactory'
import { HasOneOrMany } from '../../lib/relations/HasOneOrMany'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { Eloquent } from '../../lib/model/Eloquent'
import { register } from 'najs-binding'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

class Test extends Eloquent {
  static className = 'Test'
}
register(Test)

describe('RelationFactory', function() {
  describe('.setupRelation', function() {
    it('makes new instance by className and returns if the RelationFactory created with isSample = true', function() {
      const factory = new RelationFactory(<any>{}, 'test', true)
      const setup = function() {}
      const setupSpy = Sinon.spy(setup)
      const makeStub = Sinon.stub(NajsBinding, 'make')

      factory.setupRelation('Test', setupSpy)
      expect(makeStub.calledWith('Test')).toBe(true)
      expect(setupSpy.called).toBe(false)
      makeStub.restore()
    })

    it('calls setup() and assign value to this.relation if isSample = false', function() {
      const factory = new RelationFactory(<any>{}, 'test', false)
      const setup = function() {
        return 'anything'
      }
      const setupSpy = Sinon.spy(setup)

      factory.setupRelation('Test', setupSpy)
      expect(setupSpy.called).toBe(true)
      expect(factory['relation']).toEqual('anything')
    })

    it('return this.relation if the variable already set, never call setup() again', function() {
      const factory = new RelationFactory(<any>{}, 'test', false)
      const setup = function() {
        return 'anything'
      }
      const setupSpy = Sinon.spy(setup)

      factory['relation'] = <any>'already created'
      factory.setupRelation('Test', setupSpy)
      expect(setupSpy.called).toBe(false)
    })
  })

  describe('.getModelByNameOrDefinition', function() {
    it('uses Reflect.construct() to create model if the input is a Function', function() {
      class InputDefinition {}
      const makeStub = Sinon.stub(NajsBinding, 'make')

      const factory = new RelationFactory(<any>{}, 'test', true)
      expect(factory.getModelByNameOrDefinition(InputDefinition)).toBeInstanceOf(InputDefinition)
      expect(makeStub.called).toBe(false)
      makeStub.restore()
    })

    it('uses make() to create model if the input is a string', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      const factory = new RelationFactory(<any>{}, 'test', true)
      expect(factory.getModelByNameOrDefinition('Test')).toEqual('anything')
      expect(makeStub.calledWith('Test')).toBe(true)
      makeStub.restore()
    })
  })

  describe('.setupHasOneOrMany()', function() {
    it('creates a HasOneOrMany instance and call HasOneOrMany.setup()', function() {
      const factory = new RelationFactory(<any>{}, 'test', true)
      const local = {}
      const foreign = {}
      const instance = factory.setupHasOneOrMany(true, <any>local, <any>foreign)
      expect(instance).toBeInstanceOf(HasOneOrMany)
      expect(instance['is1v1']).toBe(true)
      expect(instance['local'] === local).toBe(true)
      expect(instance['foreign'] === foreign).toBe(true)
    })
  })

  describe('.hasOne()', function() {
    class User extends Eloquent {
      static className = 'User'
    }
    register(User)

    it('calls .setupRelation() with class "NajsEloquent.Relation.HasOneOrMany" by default', function() {
      const factory = new RelationFactory(<any>{}, 'test', true)
      const setupRelationStub = Sinon.stub(factory, 'setupRelation')
      factory.hasOne('Test')
      expect(setupRelationStub.calledWith('NajsEloquent.Relation.HasOneOrMany')).toBe(true)
    })

    it('creates an localInfo from rootModel, foreignInfo from model in the first param', function() {
      const factory = new RelationFactory(new User(), 'test', false)
      const setupHasOneOrManyStub = Sinon.stub(factory, 'setupHasOneOrMany')

      factory.hasOne('Test')
      expect(
        setupHasOneOrManyStub.calledWith(
          true,
          {
            model: 'User',
            table: 'users',
            key: 'id'
          },
          {
            model: 'Test',
            table: 'tests',
            key: 'user_id'
          }
        )
      ).toBe(true)
    })
  })
})
