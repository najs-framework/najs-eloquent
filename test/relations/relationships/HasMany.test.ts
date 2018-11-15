import 'jest'
import * as Sinon from 'sinon'
import { HasMany } from '../../../lib/relations/relationships/HasMany'
import { HasOneOrMany } from '../../../lib/relations/relationships/HasOneOrMany'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { HasManyExecutor } from '../../../lib/relations/relationships/executors/HasManyExecutor'
import { make_collection } from '../../../lib/util/factory'
import { RelationUtilities } from '../../../lib/relations/RelationUtilities'

describe('HasMany', function() {
  it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.HasMany"', function() {
    const rootModel: any = {}
    const hasMany = new HasMany(rootModel, 'test', 'Target', 'target_id', 'id')
    expect(hasMany).toBeInstanceOf(HasOneOrMany)
    expect(hasMany).toBeInstanceOf(Relationship)
    expect(hasMany.getClassName()).toEqual('NajsEloquent.Relation.Relationship.HasMany')
  })

  describe('.getType()', function() {
    it('returns literal string "HasMany"', function() {
      const rootModel: any = {}
      const hasMany = new HasMany(rootModel, 'test', 'Target', 'target_id', 'id')
      expect(hasMany.getType()).toEqual(RelationshipType.HasMany)
    })
  })

  describe('.getExecutor()', function() {
    it('returns an cached instance of HasManyExecutor in property "executor"', function() {
      const rootModel: any = {}
      const hasMany = new HasMany(rootModel, 'test', 'Target', 'target_id', 'id')
      hasMany['targetModelInstance'] = {} as any
      const getDataBucketStub = Sinon.stub(hasMany, 'getDataBucket')
      getDataBucketStub.returns({})

      expect(hasMany.getExecutor()).toBeInstanceOf(HasManyExecutor)
      expect(hasMany.getExecutor() === hasMany['executor']).toBe(true)
    })
  })

  describe('.associate()', function() {
    it('is chainable, calls RelationUtilities.associateMany() with a setTargetAttributes which sets targetKeyName to target model', function() {
      const rootModel: any = {
        getAttribute() {
          return 'anything'
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

      const hasMany = new HasMany(rootModel, 'test', 'Target', 'target_id', 'id')
      const setAttribute1Spy = Sinon.spy(model1, 'setAttribute')
      const setAttribute2Spy = Sinon.spy(model2, 'setAttribute')
      const setAttribute3Spy = Sinon.spy(model3, 'setAttribute')
      const setAttribute4Spy = Sinon.spy(model4, 'setAttribute')

      const spy = Sinon.spy(RelationUtilities, 'associateMany')

      expect(hasMany.associate(model1, [model2], make_collection<any>([model3, model4])) === hasMany).toBe(true)
      expect(spy.calledWith([model1, [model2], make_collection<any>([model3, model4])], rootModel, 'id')).toBe(true)
      expect(setAttribute1Spy.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute2Spy.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute3Spy.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute4Spy.calledWith('target_id', 'anything')).toBe(true)
    })
  })

  describe('.dissociate()', function() {
    it('is chainable, calls RelationUtilities.dissociateMany() with setTargetAttributes which sets the targetKeyName to EmptyValue via RelationFeature.getEmptyValueForRelationshipForeignKey()', async function() {
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
      const hasMany = new HasMany(rootModel, 'test', 'Target', 'target_id', 'id')

      const spy = Sinon.spy(RelationUtilities, 'dissociateMany')

      expect(hasMany.dissociate(model1, [model2]) === hasMany).toBe(true)
      expect(spy.calledWith([model1, [model2]], rootModel)).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.calledTwice).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.firstCall.calledWith(model1, 'target_id')).toBe(true)
      expect(getEmptyValueForRelationshipForeignKeySpy.secondCall.calledWith(model2, 'target_id')).toBe(true)
      expect(setAttribute1Spy.calledWith('target_id', 'anything')).toBe(true)
      expect(setAttribute2Spy.calledWith('target_id', 'anything')).toBe(true)
    })
  })
})
