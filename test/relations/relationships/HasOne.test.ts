import 'jest'
import * as Sinon from 'sinon'
import { HasOne } from '../../../lib/relations/relationships/HasOne'
import { HasOneOrMany } from '../../../lib/relations/relationships/HasOneOrMany'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { HasOneExecutor } from '../../../lib/relations/relationships/executors/HasOneExecutor'
import { RelationUtilities } from '../../../lib/relations/RelationUtilities'

describe('HasOne', function() {
  it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.HasOne"', function() {
    const rootModel: any = {}
    const hasOne = new HasOne(rootModel, 'test', 'Target', 'target_id', 'id')
    expect(hasOne).toBeInstanceOf(HasOneOrMany)
    expect(hasOne).toBeInstanceOf(Relationship)
    expect(hasOne.getClassName()).toEqual('NajsEloquent.Relation.Relationship.HasOne')
  })

  describe('.getType()', function() {
    it('returns literal string "HasOne"', function() {
      const rootModel: any = {}
      const hasOne = new HasOne(rootModel, 'test', 'Target', 'target_id', 'id')
      expect(hasOne.getType()).toEqual(RelationshipType.HasOne)
    })
  })

  describe('.getExecutor()', function() {
    it('returns an cached instance of HasOneExecutor in property "executor"', function() {
      const rootModel: any = {}
      const hasOne = new HasOne(rootModel, 'test', 'Target', 'target_id', 'id')
      hasOne['targetModelInstance'] = {} as any
      const getDataBucketStub = Sinon.stub(hasOne, 'getDataBucket')
      getDataBucketStub.returns({})

      expect(hasOne.getExecutor()).toBeInstanceOf(HasOneExecutor)
      expect(hasOne.getExecutor() === hasOne['executor']).toBe(true)
    })
  })

  describe('.associate()', function() {
    it('calls RelationUtilities.associateOne() with a setTargetAttributes which sets targetKeyName to target model', function() {
      const rootModel: any = {
        getAttribute() {
          return 'anything'
        },

        getModelName() {
          return 'ModelName'
        },

        once() {}
      }

      const model: any = {
        setAttribute() {},
        save() {
          return Promise.resolve(true)
        }
      }

      const hasOne = new HasOne(rootModel, 'test', 'Target', 'target_id', 'id')

      const setAttributeSpy = Sinon.spy(model, 'setAttribute')
      const spy = Sinon.spy(RelationUtilities, 'associateOne')
      hasOne.associate(model)
      expect(spy.calledWith(model, rootModel, 'id')).toBe(true)

      expect(setAttributeSpy.calledOnce).toBe(true)
      expect(setAttributeSpy.calledWith('target_id', 'anything')).toBe(true)
    })
  })
})
