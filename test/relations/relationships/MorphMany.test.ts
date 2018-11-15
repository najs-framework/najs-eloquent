import 'jest'
import * as Sinon from 'sinon'
import * as Helpers from '../../../lib/util/helpers'
import { MorphMany } from '../../../lib/relations/relationships/MorphMany'
import { HasOneOrMany } from '../../../lib/relations/relationships/HasOneOrMany'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { MorphOneOrManyExecutor } from '../../../lib/relations/relationships/executors/MorphOneOrManyExecutor'
import { HasManyExecutor } from '../../../lib/relations/relationships/executors/HasManyExecutor'
import { make_collection } from '../../../lib/util/factory'
import { RelationUtilities } from '../../../lib/relations/RelationUtilities'

describe('MorphMany', function() {
  it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphMany"', function() {
    const rootModel: any = {}
    const morphMany = new MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
    expect(morphMany).toBeInstanceOf(HasOneOrMany)
    expect(morphMany).toBeInstanceOf(Relationship)
    expect(morphMany.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphMany')
  })

  describe('.getType()', function() {
    it('returns literal string "MorphMany"', function() {
      const rootModel: any = {}
      const morphMany = new MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
      expect(morphMany.getType()).toEqual(RelationshipType.MorphMany)
    })
  })

  describe('.getExecutor()', function() {
    it('returns an cached instance of MorphOneOrManyExecutor which wrap HasManyExecutor in property "executor"', function() {
      const isModelStub = Sinon.stub(Helpers, 'isModel')
      const findMorphTypeSpy = Sinon.spy(Relationship, 'findMorphType')
      isModelStub.returns(true)
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const morphMany = new MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
      morphMany['targetModelInstance'] = {} as any
      const getDataBucketStub = Sinon.stub(morphMany, 'getDataBucket')
      getDataBucketStub.returns({})

      expect(morphMany.getExecutor()).toBeInstanceOf(MorphOneOrManyExecutor)
      expect(morphMany.getExecutor()['executor']).toBeInstanceOf(HasManyExecutor)
      expect(morphMany.getExecutor()['targetMorphTypeName']).toEqual('target_type')
      expect(morphMany.getExecutor()['morphTypeValue']).toEqual('Root')
      expect(morphMany.getExecutor() === morphMany['executor']).toBe(true)
      expect(findMorphTypeSpy.calledWith(rootModel)).toBe(true)
      findMorphTypeSpy.restore()
      isModelStub.restore()
    })
  })

  describe('.associate()', function() {
    it('is chainable, calls RelationUtilities.associateMany() with a setTargetAttributes which sets targetKeyName and targetMorphTypeName to target model', function() {
      const stub = Sinon.stub(MorphMany, 'findMorphType')
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

      const model1: any = {
        setAttribute() {},
        save() {
          return Promise.resolve(true)
        }
      }
      const model2: any = {
        setAttribute() {},
        save() {
          return Promise.resolve(true)
        }
      }
      const model3: any = {
        setAttribute() {},
        save() {
          return Promise.resolve(true)
        }
      }
      const model4: any = {
        setAttribute() {},
        save() {
          return Promise.resolve(true)
        }
      }

      const morphMany = new MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')
      const setAttribute1Spy = Sinon.spy(model1, 'setAttribute')
      const setAttribute2Spy = Sinon.spy(model2, 'setAttribute')
      const setAttribute3Spy = Sinon.spy(model3, 'setAttribute')
      const setAttribute4Spy = Sinon.spy(model4, 'setAttribute')

      const spy = Sinon.spy(RelationUtilities, 'associateMany')

      expect(morphMany.associate(model1, [model2], make_collection<any>([model3, model4])) === morphMany).toBe(true)
      expect(stub.calledWith('ModelName')).toBe(true)
      expect(spy.calledWith([model1, [model2], make_collection<any>([model3, model4])], rootModel, 'id')).toBe(true)
      expect(setAttribute1Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute1Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true)
      expect(setAttribute2Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute2Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true)
      expect(setAttribute3Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute3Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true)
      expect(setAttribute4Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute4Spy.secondCall.calledWith('target_type', 'MorphType')).toBe(true)

      stub.restore()
    })
  })

  describe('.dissociate()', function() {
    it('is chainable, calls RelationUtilities.dissociateMany() with setTargetAttributes which sets the targetKeyName/targetMorphTypeName to EmptyValue via RelationFeature.getEmptyValueForRelationshipForeignKey()', async function() {
      const relationFeature: any = {
        getEmptyValueForRelationshipForeignKey() {
          return 'anything'
        }
      }
      const model1: any = {
        getDriver() {
          return {
            getRelationFeature() {
              return relationFeature
            }
          }
        },
        setAttribute() {
          return undefined
        }
      }

      const model2: any = {
        getDriver() {
          return {
            getRelationFeature() {
              return relationFeature
            }
          }
        },
        setAttribute() {
          return undefined
        }
      }

      const getEmptyValueForRelationshipForeignKeySpy = Sinon.spy(
        relationFeature,
        'getEmptyValueForRelationshipForeignKey'
      )
      const setAttribute1Spy = Sinon.spy(model1, 'setAttribute')
      const setAttribute2Spy = Sinon.spy(model2, 'setAttribute')

      const rootModel: any = {
        getAttribute() {
          return 'id-value'
        },
        once() {}
      }
      const morphMany = new MorphMany(rootModel, 'test', 'Target', 'target_type', 'target_id', 'id')

      const spy = Sinon.spy(RelationUtilities, 'dissociateMany')

      expect(morphMany.dissociate(model1, [model2]) === morphMany).toBe(true)
      expect(spy.calledWith([model1, [model2]], rootModel)).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.callCount).toEqual(4)
      expect(getEmptyValueForRelationshipForeignKeySpy.getCall(0).calledWith(model1, 'target_id')).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.getCall(1).calledWith(model1, 'target_type')).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.getCall(2).calledWith(model2, 'target_id')).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.getCall(3).calledWith(model2, 'target_type')).toBe(true)
      expect(setAttribute1Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute1Spy.secondCall.calledWith('target_type', 'anything')).toBe(true)
      expect(setAttribute2Spy.firstCall.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute2Spy.secondCall.calledWith('target_type', 'anything')).toBe(true)
    })
  })
})
