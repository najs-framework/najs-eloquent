import 'jest'
import * as Sinon from 'sinon'
import * as Helpers from '../../../lib/util/helpers'
import { MorphOne } from '../../../lib/relations/relationships/MorphOne'
import { HasOneOrMany } from '../../../lib/relations/relationships/HasOneOrMany'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { MorphOneOrManyExecutor } from '../../../lib/relations/relationships/executors/MorphOneOrManyExecutor'
import { HasOneExecutor } from '../../../lib/relations/relationships/executors/HasOneExecutor'
import { RelationUtilities } from '../../../lib/relations/RelationUtilities'

describe('MorphOne', function() {
  it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphOne"', function() {
    const rootModel: any = {}
    const morphOne = new MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
    expect(morphOne).toBeInstanceOf(HasOneOrMany)
    expect(morphOne).toBeInstanceOf(Relationship)
    expect(morphOne.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphOne')
  })

  describe('.getType()', function() {
    it('returns literal string "MorphOne"', function() {
      const rootModel: any = {}
      const morphOne = new MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
      expect(morphOne.getType()).toEqual(RelationshipType.MorphOne)
    })
  })

  describe('.getExecutor()', function() {
    it('returns an cached instance of MorphOneOrManyExecutor which wrap HasOneExecutor in property "executor"', function() {
      const isModelStub = Sinon.stub(Helpers, 'isModel')
      const findMorphTypeSpy = Sinon.spy(Relationship, 'findMorphType')
      isModelStub.returns(true)
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const morphOne = new MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
      morphOne['targetModelInstance'] = {} as any
      const getDataBucketStub = Sinon.stub(morphOne, 'getDataBucket')
      getDataBucketStub.returns({})

      expect(morphOne.getExecutor()).toBeInstanceOf(MorphOneOrManyExecutor)
      expect(morphOne.getExecutor()['executor']).toBeInstanceOf(HasOneExecutor)
      expect(morphOne.getExecutor()['targetMorphTypeName']).toEqual('target_type')
      expect(morphOne.getExecutor()['morphTypeValue']).toEqual('Root')
      expect(morphOne.getExecutor() === morphOne['executor']).toBe(true)
      expect(findMorphTypeSpy.calledWith(rootModel)).toBe(true)
      findMorphTypeSpy.restore()
      isModelStub.restore()
    })
  })

  describe('.associate()', function() {
    it('calls RelationUtilities.associateOne() with a setTargetAttributes which sets targetKeyName and targetMorphTypeName to target model', function() {
      const stub = Sinon.stub(MorphOne, 'findMorphType')
      stub.returns('MorphType')

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

      const morphOne = new MorphOne(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')

      const setAttributeSpy = Sinon.spy(model, 'setAttribute')
      const spy = Sinon.spy(RelationUtilities, 'associateOne')
      morphOne.associate(model)
      expect(spy.calledWith(model, rootModel, 'id')).toBe(true)

      expect(setAttributeSpy.calledTwice).toBe(true)
      expect(setAttributeSpy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttributeSpy.secondCall.calledWith('target_type', 'MorphType')).toBe(true)
      expect(stub.calledWith('ModelName')).toBe(true)

      stub.restore()
    })
  })
})
