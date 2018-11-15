import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import * as Helpers from '../../../lib/util/helpers'
import { BelongsToMany } from '../../../lib/relations/relationships/BelongsToMany'
import { PivotModel } from '../../../lib/relations/relationships/pivot/PivotModel'
import { TimestampsFeature } from '../../../lib/features/TimestampsFeature'
import { SoftDeletesFeature } from '../../../lib/features/SoftDeletesFeature'

describe('ManyToMany', function() {
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

  describe('.isInverseOf()', function() {
    it('always returns false', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.isInverseOf({} as any)).toBe(false)
    })
  })

  describe('get pivotModel()', function() {
    it('returns an property "pivotModelInstance" if there is a created instance', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const pivot: any = {}
      relation['pivotModelInstance'] = pivot
      expect(relation['pivotModel'] === pivot).toBe(true)
    })

    it('calls .newPivot() then set the result to property "pivotModelInstance" if there is no created instance', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const newPivotStub = Sinon.stub(relation, 'newPivot')
      newPivotStub.returns('anything')
      expect(newPivotStub.called).toBe(false)
      expect(relation['pivotModelInstance']).toBeUndefined()
      expect(relation['pivotModel']).toEqual('anything')
      expect(newPivotStub.called).toBe(true)
    })
  })

  describe('.newPivot()', function() {
    it('checks class in ClassRegistry, then use make() to makes and returns an instance if it is a Model', function() {
      class A {}
      const stub = Sinon.stub(PivotModel, 'createPivotClass')
      stub.returns(A)

      class ClassInRegistry {}
      register(ClassInRegistry, 'class-in-registry')

      const isModelStub = Sinon.stub(Helpers, 'isModel')
      isModelStub.returns(true)

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'class-in-registry', 'd', 'e', 'f', 'g')

      expect(relation.newPivot()).toBeInstanceOf(ClassInRegistry)
      expect(relation['pivotDefinition'] === ClassInRegistry).toBe(true)
      expect(isModelStub.lastCall.args[0]).toBeInstanceOf(ClassInRegistry)
      expect(stub.called).toBe(false)
      stub.restore()
      isModelStub.restore()
    })

    it('calls PivotModel.createPivotClass() and assigns result to pivotDefinition, then use Reflect.construct() to create an instance if pivot not in ClassRegistry', function() {
      class A {}
      const stub = Sinon.stub(PivotModel, 'createPivotClass')
      stub.returns(A)

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'pivot', 'root_id', 'target_id', 'f', 'g')

      expect(relation.newPivot()).toBeInstanceOf(A)
      expect(relation['pivotDefinition'] === A).toBe(true)
      expect(
        stub.calledWith('pivot', {
          name: 'pivot',
          foreignKeys: ['root_id', 'target_id']
        })
      ).toBe(true)
      stub.restore()
    })

    it('calls PivotModel.createPivotClass() and assigns result to pivotDefinition, then use Reflect.construct() to create an instance if pivot in ClassRegistry but not Model instance', function() {
      class A {}
      const stub = Sinon.stub(PivotModel, 'createPivotClass')
      stub.returns(A)

      class ClassInRegistry {}
      register(ClassInRegistry, 'class-in-registry')

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'class-in-registry', 'target_id', 'root_id', 'f', 'g')
      expect(relation.newPivot()).toBeInstanceOf(A)
      expect(relation['pivotDefinition'] === A).toBe(true)
      expect(
        stub.calledWith('class-in-registry', {
          name: 'class-in-registry',
          foreignKeys: ['root_id', 'target_id']
        })
      ).toBe(true)
      stub.restore()
    })

    it('simply calls and returns Reflect.construct(this.pivot) if the pivot is a Constructor function', function() {
      class A {}

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', A as any, 'd', 'e', 'f', 'g')

      expect(relation.newPivot()).toBeInstanceOf(A)
      expect(relation['pivotDefinition'] === A).toBe(true)
    })

    it('can be created with data and isGuarded params', function() {
      class A {
        constructor(public data: object, public isGuarded: boolean) {}
      }

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', A as any, 'd', 'e', 'f', 'g')

      const data = {}
      const pivot = relation.newPivot(data, false)
      expect(pivot).toBeInstanceOf(A)
      expect(pivot['data'] === data).toBe(true)
      expect(pivot['isGuarded']).toBe(false)
    })
  })

  describe('.newPivotQuery()', function() {
    it('returns a new query of pivot by calls .pivotModel.newQuery(), it also set the relationDataBucket to queryBuilder', function() {
      const queryBuilder: any = {
        handler: {
          setRelationDataBucket() {}
        }
      }
      const pivotModel: any = {
        newQuery() {
          return queryBuilder
        }
      }

      const rootModel: any = {
        getAttribute() {
          return undefined
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const applyPivotCustomQuerySpy = Sinon.spy(relation, 'applyPivotCustomQuery')

      relation['pivotModelInstance'] = pivotModel

      const dataBucket: any = {}
      const getDataBucketStub = Sinon.stub(relation, 'getDataBucket')
      getDataBucketStub.returns(dataBucket)

      const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket')
      const newQuerySpy = Sinon.spy(pivotModel, 'newQuery')

      expect(relation.newPivotQuery('name') === queryBuilder).toBe(true)
      expect(newQuerySpy.calledWith('name')).toBe(true)
      expect(applyPivotCustomQuerySpy.calledWith(queryBuilder)).toBe(true)
      expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true)
    })

    it('link to rootModel if root model has primaryKey', function() {
      const queryBuilder: any = {
        handler: {
          setRelationDataBucket() {}
        },
        where() {
          return this
        }
      }
      const pivotModel: any = {
        newQuery() {
          return queryBuilder
        }
      }

      const whereSpy = Sinon.spy(queryBuilder, 'where')

      const rootModel: any = {
        getAttribute() {
          return 'value'
        }
      }
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'pivot_root_id', 'f', 'root-id')
      const applyPivotCustomQuerySpy = Sinon.spy(relation, 'applyPivotCustomQuery')
      relation['pivotModelInstance'] = pivotModel

      const dataBucket: any = {}
      const getDataBucketStub = Sinon.stub(relation, 'getDataBucket')
      getDataBucketStub.returns(dataBucket)

      const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket')
      const newQuerySpy = Sinon.spy(pivotModel, 'newQuery')

      expect(relation.newPivotQuery('name') === queryBuilder).toBe(true)
      expect(whereSpy.calledWith('pivot_root_id', 'value')).toBe(true)
      expect(newQuerySpy.calledWith('name')).toBe(true)
      expect(applyPivotCustomQuerySpy.calledWith(queryBuilder)).toBe(true)
      expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true)
    })

    it('does not link to rootModel if the second params is true', function() {
      const queryBuilder: any = {
        handler: {
          setRelationDataBucket() {}
        }
      }
      const pivotModel: any = {
        newQuery() {
          return queryBuilder
        }
      }

      const rootModel: any = {
        getAttribute() {
          return undefined
        }
      }
      const getAttributeSpy = Sinon.spy(rootModel, 'getAttribute')

      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const applyPivotCustomQuerySpy = Sinon.spy(relation, 'applyPivotCustomQuery')
      relation['pivotModelInstance'] = pivotModel

      const dataBucket: any = {}
      const getDataBucketStub = Sinon.stub(relation, 'getDataBucket')
      getDataBucketStub.returns(dataBucket)

      const setRelationDataBucketSpy = Sinon.spy(queryBuilder.handler, 'setRelationDataBucket')
      const newQuerySpy = Sinon.spy(pivotModel, 'newQuery')

      expect(relation.newPivotQuery('name', true) === queryBuilder).toBe(true)
      expect(getAttributeSpy.called).toBe(false)
      expect(newQuerySpy.calledWith('name')).toBe(true)
      expect(applyPivotCustomQuerySpy.calledWith(queryBuilder)).toBe(true)
      expect(setRelationDataBucketSpy.calledWith(dataBucket)).toBe(true)
    })
  })

  describe('.withPivot()', function() {
    it('flattens arguments then assign to this.pivotOptions.fields if there is no fields in options', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.getPivotOptions().fields).toBeUndefined()
      relation.withPivot('a', ['b', 'c'])
      expect(relation.getPivotOptions().fields).toEqual(['a', 'b', 'c'])
    })

    it('merges the arguments to this.pivotOptions.fields if there is some fields in options', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.getPivotOptions().fields).toBeUndefined()
      relation.withPivot('a', ['b', 'c'])
      expect(relation.getPivotOptions().fields).toEqual(['a', 'b', 'c'])
      relation.withPivot('x', ['b'], 'y')
      expect(relation.getPivotOptions().fields).toEqual(['a', 'b', 'c', 'x', 'y'])
    })
  })

  describe('protected .getPivotAccessor()', function() {
    it('returns property "pivotAccessor" if has value, otherwise will return literally string "pivot"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['getPivotAccessor']()).toEqual('pivot')
      relation.as('test')
      expect(relation['getPivotAccessor']()).toEqual('test')
      relation.as('')
      expect(relation['getPivotAccessor']()).toEqual('pivot')
    })
  })

  describe('.as()', function() {
    it('simply assigns given attribute to property "pivotAccessor"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['pivotAccessor']).toBeUndefined()
      relation.as('test')
      expect(relation['pivotAccessor']).toEqual('test')
      relation.as('')
      expect(relation['pivotAccessor']).toEqual('')
    })
  })

  describe('.withTimestamps()', function() {
    it('assigns TimestampsFeature.DefaultSetting to "pivotOptions"."timestamps" if there is no arguments', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['pivotOptions']['timestamps']).toBeUndefined()
      expect(relation.withTimestamps() === relation).toBe(true)
      expect(relation['pivotOptions']['timestamps'] === TimestampsFeature.DefaultSetting).toBe(true)
    })

    it('converts and assigns provided arguments to "pivotOptions"."timestamps"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['pivotOptions']['timestamps']).toBeUndefined()
      expect(relation.withTimestamps('created', 'updated') === relation).toBe(true)
      expect(relation['pivotOptions']['timestamps']).toEqual({ createdAt: 'created', updatedAt: 'updated' })
    })
  })

  describe('.withSoftDeletes()', function() {
    it('assigns SoftDeletesFeature.DefaultSetting to "pivotOptions"."softDeletes" if there is no arguments', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['pivotOptions']['softDeletes']).toBeUndefined()
      expect(relation.withSoftDeletes() === relation).toBe(true)
      expect(relation['pivotOptions']['softDeletes'] === SoftDeletesFeature.DefaultSetting).toBe(true)
    })

    it('converts and assigns provided arguments to "pivotOptions"."softDeletes"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation['pivotOptions']['softDeletes']).toBeUndefined()
      expect(relation.withSoftDeletes('deleted') === relation).toBe(true)
      expect(relation['pivotOptions']['softDeletes']).toEqual({ deletedAt: 'deleted', overrideMethods: false })
    })
  })

  describe('.queryPivot()', function() {
    it('is chainable, simply assigns the callback to property "pivotCustomQueryFn"', function() {
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const cb: any = function() {}
      expect(relation.queryPivot(cb) === relation).toBe(true)
      expect(relation['pivotCustomQueryFn'] === cb).toBe(true)

      const anotherCb: any = function() {}
      expect(relation.queryPivot(anotherCb) === relation).toBe(true)
      expect(relation['pivotCustomQueryFn'] === anotherCb).toBe(true)
    })
  })

  describe('.applyPivotCustomQuery()', function() {
    it('returns the given queryBuilder if property "customQueryFn" is not a function', function() {
      const rootModel: any = {}
      const queryBuilder: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      expect(relation.applyPivotCustomQuery(queryBuilder) === queryBuilder).toBe(true)
    })

    it('calls "customQueryFn" if it is a function, then still returns the queryBuilder', function() {
      const queryBuilder: any = {}
      const fn: any = function() {}
      const spy = Sinon.spy(fn)

      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      relation.queryPivot(spy)

      expect(relation.applyPivotCustomQuery(queryBuilder) === queryBuilder).toBe(true)
      expect(spy.calledWith(queryBuilder)).toBe(true)
      expect(spy.lastCall.thisValue === queryBuilder).toBe(true)
    })
  })

  describe('.setPivotDefinition()', function() {
    it('calls .getPivotOptions() to get filled options then pass to pivotDefinition', function() {
      const options: any = {}
      const definition: any = {}
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const stub = Sinon.stub(relation, 'getPivotOptions')
      stub.returns(options)

      relation.setPivotDefinition(definition)
      expect(relation['pivotDefinition'] === definition).toBe(true)
      expect(definition['options'] === options).toBe(true)
    })

    it('merges options.foreignKeys and options.fields to "pivotDefinition"."fillable" options.fields is exists and no "fillable" in "pivotDefinition"', function() {
      const options: any = {
        foreignKeys: ['a', 'b'],
        fields: ['x', 'y', 'a']
      }
      const definition: any = {}
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const stub = Sinon.stub(relation, 'getPivotOptions')
      stub.returns(options)

      relation.setPivotDefinition(definition)
      expect(definition['fillable']).toEqual(['a', 'b', 'x', 'y'])
    })

    it('merges options.foreignKeys and options.fields to current "pivotDefinition"."fillable" options.fields is exists', function() {
      const options: any = {
        foreignKeys: ['a', 'b'],
        fields: ['x', 'y', 'a']
      }
      const definition: any = {
        fillable: ['any']
      }
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const stub = Sinon.stub(relation, 'getPivotOptions')
      stub.returns(options)

      relation.setPivotDefinition(definition)
      expect(definition['fillable']).toEqual(['any', 'a', 'b', 'x', 'y'])
    })

    it('assigns timestamps to "pivotDefinition"."timestamps" if there is a timestamps setting in pivotOptions', function() {
      const options: any = {
        timestamps: 'anything'
      }
      const definition: any = {}
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const stub = Sinon.stub(relation, 'getPivotOptions')
      stub.returns(options)

      relation.setPivotDefinition(definition)
      expect(definition['timestamps']).toEqual('anything')
    })

    it('assigns softDeletes to "pivotDefinition"."softDeletes" if there is a softDeletes setting in pivotOptions', function() {
      const options: any = {
        softDeletes: 'anything'
      }
      const definition: any = {}
      const rootModel: any = {}
      const relation = new BelongsToMany(rootModel, 'a', 'b', 'c', 'd', 'e', 'f', 'g')
      const stub = Sinon.stub(relation, 'getPivotOptions')
      stub.returns(options)

      relation.setPivotDefinition(definition)
      expect(definition['softDeletes']).toEqual('anything')
    })
  })
})
