import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { MorphTo } from '../../../lib/relations/relationships/MorphTo'
import { Relationship } from '../../../lib/relations/Relationship'
import { RelationshipType } from '../../../lib/relations/RelationshipType'
import { DataBuffer } from '../../../lib/data/DataBuffer'
import { isCollection } from '../../../lib/util/helpers'

const reader = {
  getAttribute(data: object, field: string) {
    return data[field]
  },

  pick(data: object, fields: string[]) {
    return data
  },

  toComparable(value: any) {
    return value
  }
}
describe('MorphTo', function() {
  it('extends Relationship and implements Autoload under name "NajsEloquent.Relation.Relationship.MorphTo"', function() {
    const rootModel: any = {}
    const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})
    expect(morphTo).toBeInstanceOf(MorphTo)
    expect(morphTo).toBeInstanceOf(Relationship)
    expect(morphTo.getClassName()).toEqual('NajsEloquent.Relation.Relationship.MorphTo')
  })

  describe('.getType()', function() {
    it('returns literal string "MorphTo"', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})
      expect(morphTo.getType()).toEqual(RelationshipType.MorphTo)
    })
  })

  describe('.makeTargetModel()', function() {
    it('creates targetModel by make() then cache it in "targetModelInstances"', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})

      const model: any = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(model)

      expect(morphTo['targetModelInstances']).toEqual({})
      expect(morphTo.makeTargetModel('ModelName') === model).toBe(true)
      expect(morphTo['targetModelInstances']['ModelName'] === model).toBe(true)
      expect(makeStub.calledWith('ModelName')).toBe(true)
      makeStub.resetHistory()

      expect(morphTo.makeTargetModel('ModelName') === model).toBe(true)
      expect(makeStub.calledWith('ModelName')).toBe(false)
      makeStub.resetHistory()

      makeStub.restore()
    })
  })

  describe('.createQueryForTarget()', function() {
    it('returns a queryBuilder from given targetModel, which also contains the dataBucket of relation', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})
      const queryBuilder: any = {
        handler: {
          setRelationDataBucket() {}
        }
      }
      const targetModel: any = {
        newQuery() {
          return queryBuilder
        },
        getModelName() {
          return 'Target'
        }
      }

      const dataBucket: any = {}
      const getDataBucketStub = Sinon.stub(morphTo, 'getDataBucket')
      getDataBucketStub.returns(dataBucket)

      const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket')
      const newQuerySpy = Sinon.spy(targetModel, 'newQuery')

      expect(morphTo.createQueryForTarget(targetModel) === queryBuilder).toBe(true)
      expect(newQuerySpy.calledWith('MorphTo:Target')).toBe(true)
      expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true)
    })

    it('passes the queryBuilder to .applyCustomQuery() then returns the result', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})
      const queryBuilder: any = {
        handler: {
          setRelationDataBucket() {}
        }
      }
      const targetModel: any = {
        newQuery() {
          return queryBuilder
        },
        getModelName() {
          return 'Target'
        }
      }

      const dataBucket: any = {}
      const getDataBucketStub = Sinon.stub(morphTo, 'getDataBucket')
      getDataBucketStub.returns(dataBucket)

      const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket')
      const newQuerySpy = Sinon.spy(targetModel, 'newQuery')

      const applyCustomQueryStub = Sinon.stub(morphTo, 'applyCustomQuery')
      applyCustomQueryStub.returns('anything')

      expect(morphTo.createQueryForTarget(targetModel)).toEqual('anything')
      expect(newQuerySpy.calledWith('MorphTo:Target')).toBe(true)
      expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true)
      expect(applyCustomQueryStub.calledWith(queryBuilder)).toBe(true)
    })
  })

  describe('.findTargetKeyName()', function() {
    it('returns the value in "targetKeyNameMap" if the modelName is in there', function() {
      const map = {
        modelA: 'custom_id',
        typeA: 'custom_id'
      }
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', map)

      const targetModel: any = {
        getModelName() {
          return 'modelA'
        }
      }
      expect(morphTo.findTargetKeyName(targetModel)).toEqual('custom_id')
    })

    it('returns the value in "targetKeyNameMap" if the morphType get from modelName is in there', function() {
      const map = {
        modelA: 'custom_id',
        typeA: 'custom_type_id'
      }
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', map)

      const findMorphTypeStub = Sinon.stub(Relationship, 'findMorphType')
      findMorphTypeStub.returns('typeA')

      const targetModel: any = {
        getModelName() {
          return 'model'
        }
      }
      expect(morphTo.findTargetKeyName(targetModel)).toEqual('custom_type_id')
      expect(findMorphTypeStub.calledWith('model')).toBe(true)
      findMorphTypeStub.restore()
    })

    it('returns the targetModel.getPrimaryKeyName() if there is no data in "targetKeyNameMap"', function() {
      const map = {
        modelA: 'custom_id',
        typeA: 'custom_type_id'
      }
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', map)

      const findMorphTypeStub = Sinon.stub(Relationship, 'findMorphType')
      findMorphTypeStub.returns('type')

      const targetModel: any = {
        getModelName() {
          return 'not-found'
        },
        getPrimaryKeyName() {
          return 'pk_name'
        }
      }
      expect(morphTo.findTargetKeyName(targetModel)).toEqual('pk_name')
      expect(findMorphTypeStub.calledWith('not-found')).toBe(true)
      findMorphTypeStub.restore()
    })
  })

  describe('.collectDataInBucket()', function() {
    it('collect dataBuffer in dataBucket of Target model', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: 1, target_type: 'User', target_id: 1 })
      dataBuffer.add({ id: 2, target_type: 'User', target_id: 2 })
      dataBuffer.add({ id: 3, target_type: 'Post', target_id: 'a' })
      dataBuffer.add({ id: 4, target_type: 'Post', target_id: 'b' })

      const dataBucket: any = {
        getDataOf() {
          return dataBuffer
        }
      }

      const rootModel: any = {
        getAttribute() {
          return 2
        }
      }
      const targetModel: any = {}

      const morphTo = new MorphTo(rootModel, 'a', 'b', 'c', {})

      const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName')
      findTargetKeyNameStub.returns('target_id')

      const result = morphTo.collectDataInBucket(dataBucket, targetModel)
      expect(result).toEqual([{ id: 2, target_type: 'User', target_id: 2 }])
    })
  })

  describe('.collectData()', function() {
    it('returns undefined if there is no data bucket', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})

      const stub = Sinon.stub(morphTo, 'getDataBucket')
      stub.returns(undefined)

      expect(morphTo.collectData()).toBeUndefined()
    })

    it('finds data via .collectDataInBucket() then returns undefined if the result is empty', function() {
      const findModelNameStub = Sinon.stub(Relationship, 'findModelName')
      findModelNameStub.returns('ModelName')

      const targetModel: any = {}

      const rootModel: any = {
        getAttribute() {
          return 'TargetModelType'
        }
      }
      const morphTo = new MorphTo(rootModel, 'test', 'target_type', 'target_id', {})

      const dataBucket: any = {}
      const stub = Sinon.stub(morphTo, 'getDataBucket')
      stub.returns(dataBucket)

      const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel')
      makeTargetModelStub.returns(targetModel)

      const collectDataInBucketStub = Sinon.stub(morphTo, 'collectDataInBucket')
      collectDataInBucketStub.returns([])

      expect(morphTo.collectData()).toBeUndefined()
      expect(findModelNameStub.calledWith('TargetModelType')).toBe(true)
      expect(collectDataInBucketStub.calledWith(dataBucket, targetModel)).toBe(true)
      expect(makeTargetModelStub.calledWith('ModelName')).toBe(true)

      findModelNameStub.restore()
    })

    it('finds data via .collectDataInBucket() then returns model via dataBucket.makeModel() with the first result', function() {
      const findModelNameStub = Sinon.stub(Relationship, 'findModelName')
      findModelNameStub.returns('ModelName')

      const targetModel: any = {}

      const rootModel: any = {
        getAttribute() {
          return 'TargetModelType'
        }
      }
      const morphTo = new MorphTo(rootModel, 'test', 'target_type', 'target_id', {})

      const firstResult = {}
      const secondResult = {}
      const dataBucket: any = {
        makeModel() {}
      }
      const stub = Sinon.stub(morphTo, 'getDataBucket')
      stub.returns(dataBucket)

      const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel')
      makeTargetModelStub.returns(targetModel)

      const collectDataInBucketStub = Sinon.stub(morphTo, 'collectDataInBucket')
      collectDataInBucketStub.returns([firstResult, secondResult])

      const makeModelStub = Sinon.stub(dataBucket, 'makeModel')
      makeModelStub.returns('anything')

      expect(morphTo.collectData()).toEqual('anything')
      expect(findModelNameStub.calledWith('TargetModelType')).toBe(true)
      expect(collectDataInBucketStub.calledWith(dataBucket, targetModel)).toBe(true)
      expect(makeTargetModelStub.calledWith('ModelName')).toBe(true)
      expect(makeModelStub.calledWith(firstResult)).toBe(true)
      findModelNameStub.restore()
    })
  })

  describe('.getEagerFetchInfo()', function() {
    it('reads all items in dataBuffer of RootModel, then reduce to an object keyed by modelName', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: 1, target_type: 'User', target_id: 1 })
      dataBuffer.add({ id: 2, target_type: 'User', target_id: 2 })
      dataBuffer.add({ id: 3, target_type: 'Post', target_id: 'a' })
      dataBuffer.add({ id: 4, target_type: 'Post', target_id: 'b' })

      const dataBucket: any = {
        getDataOf() {
          return dataBuffer
        }
      }

      const findModelNameStub = Sinon.stub(Relationship, 'findModelName')
      findModelNameStub.callsFake(function(type: string) {
        return type.toLowerCase()
      })

      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'target_type', 'target_id', {})

      expect(morphTo.getEagerFetchInfo(dataBucket)).toEqual({
        user: [1, 2],
        post: ['a', 'b']
      })
      findModelNameStub.restore()
    })
  })

  describe('.eagerFetchData()', function() {
    it('returns an empty collection if there is no data bucket', async function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})

      const stub = Sinon.stub(morphTo, 'getDataBucket')
      stub.returns(undefined)

      const result: any = await morphTo.eagerFetchData()
      expect(isCollection(result)).toBe(true)
      expect(result.all()).toEqual([])
    })

    it('finds modelName by morphType value, then creates query via .createQueryForTarget() and add conditions then returns query.first()', async function() {
      const targetModel: any = {}
      const rootModel: any = {
        data: {
          target_id: '1',
          target_type: 'Type'
        },
        getAttribute(name: string) {
          return this.data[name]
        }
      }

      const query: any = {
        whereIn() {},
        first() {
          return Promise.resolve('anything')
        }
      }

      const whereInSpy = Sinon.spy(query, 'whereIn')

      const morphTo = new MorphTo(rootModel, 'test', 'target_type', 'target_id', {})

      const stub = Sinon.stub(morphTo, 'getDataBucket')
      stub.returns({})

      const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel')
      makeTargetModelStub.returns(targetModel)

      const getEagerFetchInfoStub = Sinon.stub(morphTo, 'getEagerFetchInfo')
      getEagerFetchInfoStub.returns({
        ModelName: [1, 2]
      })

      const createQueryForTargetStub = Sinon.stub(morphTo, 'createQueryForTarget')
      createQueryForTargetStub.returns(query)

      const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName')
      findTargetKeyNameStub.returns('found_id')

      expect(await morphTo.eagerFetchData()).toEqual(['anything'])
      expect(makeTargetModelStub.calledWith('ModelName')).toBe(true)
      expect(createQueryForTargetStub.calledWith(targetModel)).toBe(true)
      expect(findTargetKeyNameStub.calledWith(targetModel)).toBe(true)
      expect(whereInSpy.calledWith('found_id', [1, 2])).toBe(true)
    })
  })

  describe('.fetchData()', function() {
    it('calls and returns .eagerFetchData() if type is "eager"', async function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})

      const stub = Sinon.stub(morphTo, 'eagerFetchData')
      stub.returns(Promise.resolve('anything'))

      expect(await morphTo.fetchData('eager')).toEqual('anything')
    })

    it('finds modelName by morphType value, then creates query via .createQueryForTarget() and add conditions then returns query.first() for "lazy" type', async function() {
      const findModelNameStub = Sinon.stub(Relationship, 'findModelName')
      findModelNameStub.returns('ModelName')

      const targetModel: any = {}
      const rootModel: any = {
        data: {
          target_id: '1',
          target_type: 'Type'
        },
        getAttribute(name: string) {
          return this.data[name]
        }
      }

      const query: any = {
        where() {},
        first() {
          return Promise.resolve('anything')
        }
      }

      const whereSpy = Sinon.spy(query, 'where')

      const morphTo = new MorphTo(rootModel, 'test', 'target_type', 'target_id', {})
      const makeTargetModelStub = Sinon.stub(morphTo, 'makeTargetModel')
      makeTargetModelStub.returns(targetModel)

      const createQueryForTargetStub = Sinon.stub(morphTo, 'createQueryForTarget')
      createQueryForTargetStub.returns(query)

      const findTargetKeyNameStub = Sinon.stub(morphTo, 'findTargetKeyName')
      findTargetKeyNameStub.returns('found_id')

      expect(await morphTo.fetchData('lazy')).toEqual('anything')
      expect(findModelNameStub.calledWith('Type')).toBe(true)
      expect(makeTargetModelStub.calledWith('ModelName')).toBe(true)
      expect(createQueryForTargetStub.calledWith(targetModel)).toBe(true)
      expect(findTargetKeyNameStub.calledWith(targetModel)).toBe(true)
      expect(whereSpy.calledWith('found_id', '1')).toBe(true)
      findModelNameStub.restore()
    })
  })

  describe('.isInverseOf()', function() {
    it('always returns false', function() {
      const rootModel: any = {}
      const morphTo = new MorphTo(rootModel, 'test', 'root_type', 'root_id', {})
      expect(morphTo.isInverseOf({} as any)).toBe(false)
    })
  })
})
