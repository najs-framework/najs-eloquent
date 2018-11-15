import 'jest'
import * as Sinon from 'sinon'
import * as Helpers from '../../../lib/util/helpers'
import { ManyToMany } from '../../../lib/relations/relationships/ManyToMany'
import { BelongsToMany } from '../../../lib/relations/relationships/BelongsToMany'
import { isPromise } from '../../../lib/util/isPromise'
import { RelationUtilities } from '../../../lib/relations/RelationUtilities'
import { make_collection } from '../../../lib/util/factory'
import { Record } from '../../../lib/drivers/Record'
import { DataBuffer } from '../../../lib/data/DataBuffer'

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

describe('BelongsToMany', function() {
  it('extends ManyToMany class and implements Autoload under name "NajsEloquent.Relation.Relationship.BelongsToMany"', function() {
    const rootModel: any = {}
    const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
    expect(relation).toBeInstanceOf(ManyToMany)
    expect(relation.getClassName()).toEqual('NajsEloquent.Relation.Relationship.BelongsToMany')
  })

  describe('constructor()', function() {
    it('assigns params to respective attributes', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(
        rootModel,
        'test',
        'target',
        'pivot',
        'pivot_a',
        'pivot_b',
        'target_key',
        'root_key'
      )
      expect(relation['targetDefinition']).toEqual('target')
      expect(relation['pivot']).toEqual('pivot')
      expect(relation['pivotTargetKeyName']).toEqual('pivot_a')
      expect(relation['pivotRootKeyName']).toEqual('pivot_b')
      expect(relation['targetKeyName']).toEqual('target_key')
      expect(relation['rootKeyName']).toEqual('root_key')
    })
  })

  describe('.getType()', function() {
    it('returns a literally string "BelongsToMany"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.getType()).toEqual('BelongsToMany')
    })
  })

  describe('.collectPivotData()', function() {
    it('returns an empty object if there is no root primary key', function() {
      const rootModel: any = {
        getAttribute() {
          return undefined
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'Target', 'pivot', 'root_id', 'target_id', 'id', 'id')
      const dataBucket: any = {}
      expect(relation.collectPivotData(dataBucket)).toEqual({})
    })

    it('collects pivotModel in dataBucket which has "pivotRootKeyName" match with current rootPrimaryKey', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: '1', root_id: 1, target_id: 'x' })
      dataBuffer.add({ id: '2', root_id: 2, target_id: 'x' })
      dataBuffer.add({ id: '3', root_id: 1, target_id: 'y' })
      dataBuffer.add({ id: '4', root_id: 2, target_id: 'y' })
      const dataBucket: any = {
        getDataOf() {
          return dataBuffer
        }
      }

      const pivotModel: any = {}
      const rootModel: any = {
        getAttribute() {
          return 2
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'Target', 'pivot', 'target_id', 'root_id', 'id', 'id')

      relation['pivotModelInstance'] = pivotModel
      expect(relation.collectPivotData(dataBucket)).toEqual({
        x: { id: '2', root_id: 2, target_id: 'x' },
        y: { id: '4', root_id: 2, target_id: 'y' }
      })
    })
  })

  describe('.collectData()', function() {
    it('returns an empty collection if there is no dataBucket', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const dataBucketStub = Sinon.stub(relation, 'getDataBucket')
      dataBucketStub.returns(undefined)

      const result = relation.collectData()
      expect(Helpers.isCollection(result)).toBe(true)
      expect(result!.all()).toEqual([])
    })

    it('calls .collectPivotData() first, then collect data of targetModel with "in" operator', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: 'x' })
      dataBuffer.add({ id: 'y' })
      dataBuffer.add({ id: 'z' })

      function makeHidden() {}

      const dataBucket: any = {
        getDataOf() {
          return dataBuffer
        },
        makeModel(model: any, data: any) {
          return { model: model.getModelName(), data: data, makeHidden: makeHidden }
        }
      }

      const pivotModel: any = {
        getModelName() {
          return 'Pivot'
        }
      }
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 2
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'Target', 'pivot', 'target_id', 'root_id', 'id', 'id')
      relation['pivotModelInstance'] = pivotModel
      relation['targetModelInstance'] = targetModel

      const dataBucketStub = Sinon.stub(relation, 'getDataBucket')
      dataBucketStub.returns(dataBucket)

      const collectPivotDataStub = Sinon.stub(relation, 'collectPivotData')
      collectPivotDataStub.returns({
        x: { id: '2', root_id: 2, target_id: 'x' },
        y: { id: '4', root_id: 2, target_id: 'y' }
      })

      expect(relation.collectData()!.all()).toEqual([
        {
          data: { id: 'x' },
          model: 'Target',
          pivot: { data: { id: '2', root_id: 2, target_id: 'x' }, model: 'Pivot', makeHidden: makeHidden },
          makeHidden: makeHidden
        },
        {
          data: { id: 'y' },
          model: 'Target',
          pivot: { data: { id: '4', root_id: 2, target_id: 'y' }, model: 'Pivot', makeHidden: makeHidden },
          makeHidden: makeHidden
        }
      ])
    })

    it('assigns pivot instance to property provided by getPivotAccessor.(), the property also made hidden via instance.makeHidden', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: 'x' })
      dataBuffer.add({ id: 'y' })
      dataBuffer.add({ id: 'z' })

      function makeHidden() {}

      const dataBucket: any = {
        getDataOf() {
          return dataBuffer
        },
        makeModel(model: any, data: any) {
          return { model: model.getModelName(), data: data, makeHidden: makeHidden }
        }
      }

      const pivotModel: any = {
        getModelName() {
          return 'Pivot'
        }
      }
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 2
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'Target', 'pivot', 'target_id', 'root_id', 'id', 'id')
      relation['pivotModelInstance'] = pivotModel
      relation['targetModelInstance'] = targetModel

      const dataBucketStub = Sinon.stub(relation, 'getDataBucket')
      dataBucketStub.returns(dataBucket)

      const collectPivotDataStub = Sinon.stub(relation, 'collectPivotData')
      collectPivotDataStub.returns({
        x: { id: '2', root_id: 2, target_id: 'x' },
        y: { id: '4', root_id: 2, target_id: 'y' }
      })

      relation.as('test')
      expect(relation.collectData()!.all()).toEqual([
        {
          data: { id: 'x' },
          model: 'Target',
          test: { data: { id: '2', root_id: 2, target_id: 'x' }, model: 'Pivot', makeHidden: makeHidden },
          makeHidden: makeHidden
        },
        {
          data: { id: 'y' },
          model: 'Target',
          test: { data: { id: '4', root_id: 2, target_id: 'y' }, model: 'Pivot', makeHidden: makeHidden },
          makeHidden: makeHidden
        }
      ])
    })
  })

  describe('.fetchPivotData()', function() {
    it('simply calls and return .newPivotQuery() with get when the type is "lazy"', async function() {
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'target', 'root', 'd', 'e', 'f', 'g')
      relation['targetModelInstance'] = targetModel

      const query = {
        get() {
          return Promise.resolve('anything')
        }
      }
      const newPivotQueryStub = Sinon.stub(relation, 'newPivotQuery')
      newPivotQueryStub.returns(query)

      const result = await relation.fetchPivotData('lazy')
      expect(result).toEqual('anything')
      expect(newPivotQueryStub.calledWith('BelongsToManyPivot:Target-Root')).toBe(true)
    })

    it('returns an empty collection if type is "eager", but there is not dataBucket', async function() {
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'target', 'root', 'd', 'e', 'f', 'g')
      relation['targetModelInstance'] = targetModel

      const query = {
        get() {
          return Promise.resolve('anything')
        }
      }
      const newPivotQueryStub = Sinon.stub(relation, 'newPivotQuery')
      newPivotQueryStub.returns(query)

      const dataBucketStub = Sinon.stub(relation, 'getDataBucket')
      dataBucketStub.returns(undefined)

      const result = await relation.fetchPivotData('eager')
      expect(Helpers.isCollection(result)).toBe(true)
      expect(result.all()).toEqual([])
    })

    it('calls .newPivotQuery() with raw = true, then use RelationUtilities.getAttributeListInDataBucket() to get a list of id for querying with .whereIn()', async function() {
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'target', 'root', 'd', 'pivot_root_id', 'f', 'root-key')
      relation['targetModelInstance'] = targetModel

      const query = {
        whereIn() {
          return this
        },

        get() {
          return Promise.resolve('anything')
        }
      }
      const newPivotQueryStub = Sinon.stub(relation, 'newPivotQuery')
      newPivotQueryStub.returns(query)

      const dataBucket = {}
      const dataBucketStub = Sinon.stub(relation, 'getDataBucket')
      dataBucketStub.returns(dataBucket)

      const getAttributeListInDataBucketStub = Sinon.stub(RelationUtilities, 'getAttributeListInDataBucket')
      getAttributeListInDataBucketStub.returns([1, 2])

      const whereInSpy = Sinon.spy(query, 'whereIn')

      const result = await relation.fetchPivotData('eager')
      expect(whereInSpy.calledWith('pivot_root_id', [1, 2]))
      expect(getAttributeListInDataBucketStub.calledWith(dataBucket, rootModel, 'root-key')).toBe(true)
      expect(result).toEqual('anything')
    })
  })

  describe('.fetchData()', function() {
    it('calls .fetchPivotData() to get pivot data, then use query from .createTargetQuery() to find targets via .whereIn()', async function() {
      const targetModel: any = {
        getModelName() {
          return 'Target'
        }
      }
      const rootModel: any = {
        getModelName() {
          return 'Root'
        }
      }
      const relation = new BelongsToMany(rootModel, 'name', 'target', 'pivot', 'target_id', 'root_id', 'id', 'id')
      const stub = Sinon.stub(relation, 'fetchPivotData')

      const recordA = new Record({ target_id: 1, root_id: 1 })
      const recordB = new Record({ target_id: 2, root_id: 1 })
      stub.returns(make_collection([recordA, recordB]))

      const query = {
        whereIn() {
          return this
        },
        get() {
          return Promise.resolve('anything')
        }
      }
      const createTargetQueryStub = Sinon.stub(relation, 'createTargetQuery')
      createTargetQueryStub.returns(query)

      relation['targetModelInstance'] = targetModel

      const whereInSpy = Sinon.spy(query, 'whereIn')

      const result = await relation.fetchData('lazy')
      expect(result).toEqual('anything')
      expect(createTargetQueryStub.calledWith('BelongsToMany:Target-Root')).toBe(true)
      expect(whereInSpy.calledWith('id', [1, 2])).toBe(true)
    })
  })

  describe('.attach()', function() {
    it('calls .attachModel() and returns this in case the result is undefined', async function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.returns(undefined)

      expect((await relation.attach('id')) === relation).toBe(true)
      expect(attachModelStub.calledWith('id')).toBe(true)
    })

    it('resolve .attachModel() result and returns this in case the result is a promise', async function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')

      const promiseHandler = Sinon.spy(() => {})
      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.returns(
        new Promise(resolve => {
          setTimeout(function() {
            promiseHandler()
            resolve(true)
          }, 300)
        })
      )

      expect(promiseHandler.called).toBe(false)
      expect((await relation.attach('id')) === relation).toBe(true)
      expect(attachModelStub.calledWith('id')).toBe(true)
      expect(promiseHandler.called).toBe(true)
    })

    it('calls .attachModel() n times and returns this in case the result is undefined', async function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.returns(undefined)

      expect((await relation.attach(['1', '2'])) === relation).toBe(true)
      expect(attachModelStub.firstCall.calledWith('1')).toBe(true)
      expect(attachModelStub.secondCall.calledWith('2')).toBe(true)
      attachModelStub.resetHistory()

      const data = {}
      expect((await relation.attach(['1', '2'], data)) === relation).toBe(true)
      expect(attachModelStub.firstCall.calledWith('1', data)).toBe(true)
      expect(attachModelStub.secondCall.calledWith('2', data)).toBe(true)
    })

    it('resolve .attachModel() results and returns this in case the result is a promise', async function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')

      const promiseHandler = Sinon.spy(() => {})
      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.callsFake(function(value: any) {
        return new Promise(resolve => {
          setTimeout(function() {
            promiseHandler()
            resolve(true)
          }, parseInt(value))
        })
      })

      expect(promiseHandler.called).toBe(false)
      expect((await relation.attach(['100', '200'])) === relation).toBe(true)
      expect(attachModelStub.firstCall.calledWith('100')).toBe(true)
      expect(attachModelStub.secondCall.calledWith('200')).toBe(true)
      expect(promiseHandler.callCount).toBe(2)
    })
  })

  describe('.parseAttachArguments()', function() {
    it('returns an object with key is [arg1] and value is arg2 if arg1 is string', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.parseAttachArguments('test')).toEqual({
        test: undefined
      })

      expect(relation.parseAttachArguments('test', { a: 1, b: 2 })).toEqual({
        test: { a: 1, b: 2 }
      })
    })

    it('returns an object with key reduced from item in arg1 and value is arg2 if arg1 is array', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.parseAttachArguments(['a', 'b'])).toEqual({
        a: undefined,
        b: undefined
      })

      expect(relation.parseAttachArguments(['a', 'b'], { a: 1, b: 2 })).toEqual({
        a: { a: 1, b: 2 },
        b: { a: 1, b: 2 }
      })
    })

    it('returns arg1 for the rest of cases', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.parseAttachArguments({})).toEqual({})
      expect(relation.parseAttachArguments({ 1: 2 })).toEqual({ 1: 2 })
    })
  })

  describe('.attachModel()', function() {
    it('create new pivot via .newPivot(), then set rootPrimaryKey to the pivotRootPrimaryKey & returns promise of Pivot.save()', async function() {
      const pivotModel: any = {
        fill() {},
        setAttribute(name: any, value: any) {
          this[name] = value
        },
        async save() {
          return 'anything'
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')

      const fillSpy = Sinon.spy(pivotModel, 'fill')

      const newPivotStub = Sinon.stub(relation, 'newPivot')
      newPivotStub.returns(pivotModel)

      const result = relation.attachModel('test')
      expect(fillSpy.called).toBe(false)
      expect(pivotModel.pivot_target_id).toEqual('test')
      expect(pivotModel.pivot_root_id).toEqual('id')
      expect(isPromise(result)).toBe(true)
      expect(await result).toBe('anything')
    })

    it('calls pivotModel.fill() if the data is not undefined', async function() {
      const pivotModel: any = {
        fill() {},
        setAttribute(name: any, value: any) {
          this[name] = value
        },
        async save() {
          return 'anything'
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')

      const fillSpy = Sinon.spy(pivotModel, 'fill')

      const newPivotStub = Sinon.stub(relation, 'newPivot')
      newPivotStub.returns(pivotModel)

      const data = {}
      const result = relation.attachModel('test', data)
      expect(fillSpy.calledWith(data)).toBe(true)
      expect(pivotModel.pivot_target_id).toEqual('test')
      expect(pivotModel.pivot_root_id).toEqual('id')
      expect(isPromise(result)).toBe(true)
      expect(await result).toBe('anything')
    })

    it('returns undefined but already register to rootModel.once(saved) event to saved pivot in case rootModel has no id yet', async function() {
      const pivotModel: any = {
        setAttribute(name: any, value: any) {
          this[name] = value
        },
        async save() {
          return 'anything'
        }
      }
      const rootModel: any = {
        id: undefined,
        getAttribute() {
          return this.id
        },
        once() {}
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')

      const newPivotStub = Sinon.stub(relation, 'newPivot')
      newPivotStub.returns(pivotModel)

      const onceSpy = Sinon.spy(rootModel, 'once')
      const saveSpy = Sinon.spy(pivotModel, 'save')

      const result = relation.attachModel('test')
      expect(result).toBeUndefined
      expect(onceSpy.calledWith('saved')).toBe(true)

      expect(pivotModel.pivot_target_id).toEqual('test')
      expect(pivotModel.pivot_root_id).toBeUndefined()

      expect(saveSpy.called).toBe(false)

      rootModel.id = 'new-id'
      const handler = onceSpy.lastCall.args[1]
      await handler()

      expect(pivotModel.pivot_target_id).toEqual('test')
      expect(pivotModel.pivot_root_id).toEqual('new-id')
      expect(saveSpy.called).toBe(true)
    })
  })

  describe('.detach()', function() {
    it('does nothing and print a warning message if the root model has no primary key', async function() {
      const stub = Sinon.stub(console, 'warn')
      stub.returns('anything')
      const rootModel: any = {
        getAttribute() {
          return undefined
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')

      expect((await relation.detach('test')) === relation).toBe(true)
      expect(stub.calledWith('Relation: Could not use .detach() with new Model.')).toBe(true)
      stub.restore()
    })

    it('skips and does nothing if given ids is empty', async function() {
      const query: any = {
        where() {
          return this
        },
        delete() {
          return Promise.resolve(true)
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      const stub = Sinon.stub(relation, 'newPivotQuery')
      stub.returns(query)

      const whereSpy = Sinon.spy(query, 'where')
      const deleteSpy = Sinon.spy(query, 'delete')

      expect((await relation.detach([])) === relation).toBe(true)
      expect(whereSpy.called).toBe(false)
      expect(deleteSpy.called).toBe(false)
    })

    it('loops and creates pivot query with 2 keys, pivotRootKey and pivotTargetKey then .delete()', async function() {
      const query: any = {
        where() {
          return this
        },
        delete() {
          return Promise.resolve(true)
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      const stub = Sinon.stub(relation, 'newPivotQuery')
      stub.returns(query)

      const whereSpy = Sinon.spy(query, 'where')
      const deleteSpy = Sinon.spy(query, 'delete')

      expect((await relation.detach('test')) === relation).toBe(true)
      expect(whereSpy.calledWith('pivot_target_id', 'test')).toBe(true)
      expect(deleteSpy.called).toBe(true)

      whereSpy.resetHistory()
      deleteSpy.resetHistory()

      expect((await relation.detach(['a', 'b'])) === relation).toBe(true)
      expect(whereSpy.callCount).toEqual(2)
      expect(whereSpy.firstCall.calledWith('pivot_target_id', 'a')).toBe(true)
      expect(whereSpy.secondCall.calledWith('pivot_target_id', 'b')).toBe(true)
      expect(deleteSpy.callCount).toEqual(2)
    })
  })

  describe('.parseSyncArguments()', function() {
    const dataset = [
      {
        case: 'case 1: (id: string)',
        input: ['test'],
        output: { data: { test: undefined }, detaching: true }
      },
      {
        case: 'case 2a: (id: string, detaching: boolean)',
        input: ['test', true],
        output: { data: { test: undefined }, detaching: true }
      },
      {
        case: 'case 2b: (id: string, detaching: boolean)',
        input: ['test', false],
        output: { data: { test: undefined }, detaching: false }
      },
      {
        case: 'case 3: (id: string, data: object)',
        input: ['test', { a: 1 }],
        output: { data: { test: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 4a: (id: string, data: object, detaching: boolean)',
        input: ['test', { a: 1 }, true],
        output: { data: { test: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 4b: (id: string, data: object, detaching: boolean)',
        input: ['test', { a: 1 }, false],
        output: { data: { test: { a: 1 } }, detaching: false }
      },

      {
        case: 'case 5: (ids: string[])',
        input: [['a', 'b']],
        output: { data: { a: undefined, b: undefined }, detaching: true }
      },
      {
        case: 'case 6a: (ids: string[], detaching: boolean)',
        input: [['a', 'b'], true],
        output: { data: { a: undefined, b: undefined }, detaching: true }
      },
      {
        case: 'case 6b: (ids: string[], detaching: boolean)',
        input: [['a', 'b'], false],
        output: { data: { a: undefined, b: undefined }, detaching: false }
      },
      {
        case: 'case 7: (ids: string[], data: object)',
        input: [['a', 'b'], { a: 1 }],
        output: { data: { a: { a: 1 }, b: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 8a: (ids: string[], data: object, detaching: boolean)',
        input: [['a', 'b'], { a: 1 }, true],
        output: { data: { a: { a: 1 }, b: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 8b: (ids: string[], data: object, detaching: boolean)',
        input: [['a', 'b'], { a: 1 }, false],
        output: { data: { a: { a: 1 }, b: { a: 1 } }, detaching: false }
      },

      {
        case: 'case 9: (data: object)',
        input: [{ test: { a: 1 } }],
        output: { data: { test: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 10a: (data: object, detaching: boolean)',
        input: [{ test: { a: 1 } }, true],
        output: { data: { test: { a: 1 } }, detaching: true }
      },
      {
        case: 'case 10b: (data: object, detaching: boolean)',
        input: [{ test: { a: 1 } }, false],
        output: { data: { test: { a: 1 } }, detaching: false }
      }
    ]

    for (const data of dataset) {
      it(`parses the arguments of sync(), ${data.case}`, function() {
        const relation = new BelongsToMany({} as any, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
        expect(relation.parseSyncArguments.apply(relation, data.input)).toEqual(data.output)
      })
    }
  })

  describe('.sync()', function() {
    it('does nothing and print a warning message if the root model has no primary key', async function() {
      const stub = Sinon.stub(console, 'warn')
      stub.returns('anything')
      const rootModel: any = {
        getAttribute() {
          return undefined
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')

      expect((await relation.sync('test')) === relation).toBe(true)
      expect(stub.calledWith('Relation: Could not use .sync() with new Model.')).toBe(true)
      stub.restore()
    })

    it('gets current pivots data, then find key which are not in arguments then calls .detach() if the detaching param is true', async function() {
      const pivotQuery: any = {
        get() {
          return Promise.resolve(
            make_collection([
              { id: 1, root_id: 'a', target_id: 1 },
              { id: 2, root_id: 'a', target_id: 2 },
              { id: 3, root_id: 'a', target_id: 3 },
              { id: 4, root_id: 'a', target_id: 4 },
              { id: 5, root_id: 'a', target_id: 5 }
            ])
          )
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const updatePivotQuery: any = {
        where() {
          return this
        },
        update() {
          return Promise.resolve('updated')
        }
      }

      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'target_id', 'root_id', 'id', 'id')
      const newPivotQueryStub = Sinon.stub(relation, 'newPivotQuery')

      let newPivotQueryCall = 0
      newPivotQueryStub.callsFake(function() {
        if (newPivotQueryCall === 0) {
          newPivotQueryCall++
          return pivotQuery
        }
        return updatePivotQuery
      })

      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.returns(Promise.resolve('attached'))

      const detachStub = Sinon.stub(relation, 'detach')
      detachStub.returns(Promise.resolve('detach'))

      const whereSpy = Sinon.spy(updatePivotQuery, 'where')
      const updateSpy = Sinon.spy(updatePivotQuery, 'update')

      expect((await relation.sync([3, 4, 5, 6, 7])) === relation).toBe(true)
      expect(detachStub.calledWith(['1', '2'])).toBe(true)
      expect(attachModelStub.callCount).toEqual(2)
      expect(attachModelStub.firstCall.calledWith('6', undefined)).toBe(true)
      expect(attachModelStub.secondCall.calledWith('7', undefined)).toBe(true)
      expect(newPivotQueryStub.callCount).toEqual(4)
      expect(whereSpy.callCount).toEqual(3)
      expect(whereSpy.firstCall.calledWith('target_id', '3')).toBe(true)
      expect(whereSpy.secondCall.calledWith('target_id', '4')).toBe(true)
      expect(whereSpy.thirdCall.calledWith('target_id', '5')).toBe(true)
      expect(updateSpy.callCount).toEqual(3)
      expect(updateSpy.firstCall.calledWith({})).toBe(true)
      expect(updateSpy.secondCall.calledWith({})).toBe(true)
      expect(updateSpy.secondCall.calledWith({})).toBe(true)
    })

    it('skips .detach() if detaching = false, calls newPivotQuery.update() for updating and .attachModel() for creating', async function() {
      const pivotQuery: any = {
        get() {
          return Promise.resolve(
            make_collection([
              { id: 1, root_id: 'a', target_id: 1 },
              { id: 2, root_id: 'a', target_id: 2 },
              { id: 3, root_id: 'a', target_id: 3 },
              { id: 4, root_id: 'a', target_id: 4 },
              { id: 5, root_id: 'a', target_id: 5 }
            ])
          )
        }
      }
      const rootModel: any = {
        getAttribute() {
          return 'id'
        }
      }
      const updatePivotQuery: any = {
        where() {
          return this
        },
        update() {
          return Promise.resolve('updated')
        }
      }

      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'target_id', 'root_id', 'id', 'id')
      const newPivotQueryStub = Sinon.stub(relation, 'newPivotQuery')

      let newPivotQueryCall = 0
      newPivotQueryStub.callsFake(function() {
        if (newPivotQueryCall === 0) {
          newPivotQueryCall++
          return pivotQuery
        }
        return updatePivotQuery
      })

      const attachModelStub = Sinon.stub(relation, 'attachModel')
      attachModelStub.returns(Promise.resolve('attached'))

      const detachStub = Sinon.stub(relation, 'detach')
      detachStub.returns(Promise.resolve('detach'))

      const whereSpy = Sinon.spy(updatePivotQuery, 'where')
      const updateSpy = Sinon.spy(updatePivotQuery, 'update')

      expect((await relation.sync([3, 4, 5, 6, 7], { a: 1 }, false)) === relation).toBe(true)
      expect(detachStub.called).toBe(false)
      expect(attachModelStub.callCount).toEqual(2)
      expect(attachModelStub.firstCall.calledWith('6', { a: 1 })).toBe(true)
      expect(attachModelStub.secondCall.calledWith('7', { a: 1 })).toBe(true)
      expect(newPivotQueryStub.callCount).toEqual(4)
      expect(whereSpy.callCount).toEqual(3)
      expect(whereSpy.firstCall.calledWith('target_id', '3')).toBe(true)
      expect(whereSpy.secondCall.calledWith('target_id', '4')).toBe(true)
      expect(whereSpy.thirdCall.calledWith('target_id', '5')).toBe(true)
      expect(updateSpy.callCount).toEqual(3)
      expect(updateSpy.firstCall.calledWith({ a: 1 })).toBe(true)
      expect(updateSpy.secondCall.calledWith({ a: 1 })).toBe(true)
      expect(updateSpy.secondCall.calledWith({ a: 1 })).toBe(true)
    })
  })
})
