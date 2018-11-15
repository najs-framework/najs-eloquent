import 'jest'
import * as Sinon from 'sinon'
import { BelongsTo } from '../../../lib/relations/relationships/BelongsTo'
import { HasOneOrMany } from '../../../lib/relations/relationships/HasOneOrMany'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { HasOneExecutor } from '../../../lib/relations/relationships/executors/HasOneExecutor'

describe('BelongsTo', function() {
  it('extends HasOneOrMany and implements Autoload under name "NajsEloquent.Relation.Relationship.BelongsTo"', function() {
    const rootModel: any = {}
    const belongsTo = new BelongsTo(rootModel, 'test', 'Target', 'target_id', 'id')
    expect(belongsTo).toBeInstanceOf(HasOneOrMany)
    expect(belongsTo).toBeInstanceOf(Relationship)
    expect(belongsTo.getClassName()).toEqual('NajsEloquent.Relation.Relationship.BelongsTo')
  })

  describe('.getType()', function() {
    it('returns literal string "BelongsTo"', function() {
      const rootModel: any = {}
      const belongsTo = new BelongsTo(rootModel, 'test', 'Target', 'target_id', 'id')
      expect(belongsTo.getType()).toEqual(RelationshipType.BelongsTo)
    })
  })

  describe('.getExecutor()', function() {
    it('returns an cached instance of HasOneExecutor in property "executor"', function() {
      const rootModel: any = {}
      const belongsTo = new BelongsTo(rootModel, 'test', 'Target', 'target_id', 'id')
      belongsTo['targetModelInstance'] = {} as any
      const getDataBucketStub = Sinon.stub(belongsTo, 'getDataBucket')
      getDataBucketStub.returns({})

      expect(belongsTo.getExecutor()).toBeInstanceOf(HasOneExecutor)
      expect(belongsTo.getExecutor() === belongsTo['executor']).toBe(true)
    })
  })

  describe('.dissociate()', function() {
    it('is NOT chainable, simply set attributes "rootKey" of rootModel to empty value which get from RelationFeature.getEmptyValueForRelationshipForeignKey()', function() {
      const relationFeature: any = {
        getEmptyValueForRelationshipForeignKey() {
          return 'anything'
        }
      }
      const rootModel: any = {
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
      const setAttributeSpy = Sinon.spy(rootModel, 'setAttribute')

      const belongsTo = new BelongsTo(rootModel, 'test', 'Parent', 'id', 'parent_id')
      expect(belongsTo.dissociate()).toBeUndefined()
      expect(getEmptyValueForRelationshipForeignKeySpy.calledWith(rootModel, 'parent_id')).toBe(true)
      expect(setAttributeSpy.calledWith('parent_id', 'anything')).toBe(true)
    })
  })
})
