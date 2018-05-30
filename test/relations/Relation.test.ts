import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import * as Helper from '../../lib/util/helpers'
import { Relation } from '../../lib/relations/Relation'

describe('Relation', function() {
  describe('constructor()', function() {
    it('needs rootModel and the name of relation', function() {
      const rootModel = {}
      const name = 'test'
      const relation: Relation = Reflect.construct(Relation, [rootModel, name])
      expect(relation['rootModel'] === rootModel).toBe(true)
      expect(relation['name'] === 'test').toBe(true)
    })
  })

  describe('.relationData', function() {
    it('returns rootModel["relations"][this.name]', function() {
      const info = {}
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.relationData === info).toBe(true)
    })
  })

  describe('.with()', function() {
    it('simply flattens and assigns value to "loadChain"', function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(relation['loadChain']).toBeUndefined()
      relation.with('test')
      expect(relation['loadChain']).toEqual(['test'])
      relation.with('a', 'b')
      expect(relation['loadChain']).toEqual(['a', 'b'])
      relation.with('a', ['b', 'c'])
      expect(relation['loadChain']).toEqual(['a', 'b', 'c'])
    })
  })

  describe('.getAttachedPropertyName()', function() {
    it('returns this.name value', function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(relation.getAttachedPropertyName()).toEqual('test')
    })
  })

  describe('.isLoaded()', function() {
    it('returns true if the info data contains property "isLoaded" with value === true', function() {
      const info = {
        isLoaded: true
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isLoaded()).toBe(true)
    })

    it('returns true if the info data contains property "isLoaded" with value === false', function() {
      const info = {
        isLoaded: false
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isLoaded()).toBe(false)
    })

    it('returns false if the info data does not contain property "isLoaded"', function() {
      const info = {}
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isLoaded()).toBe(false)
    })
  })

  describe('.isBuilt()', function() {
    it('returns true if the info data contains property "isBuilt" with value === true', function() {
      const info = {
        isBuilt: true
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isBuilt()).toBe(true)
    })

    it('returns true if the info data contains property "isBuilt" with value === false', function() {
      const info = {
        isBuilt: false
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isBuilt()).toBe(false)
    })

    it('returns false if the info data does not contain property "isBuilt"', function() {
      const info = {}
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.isBuilt()).toBe(false)
    })
  })

  describe('.markLoad()', function() {
    it('set loaded status of the relation, and it is chainable', function() {
      const relation: Relation = Reflect.construct(Relation, [{ relations: { test: {} } }, 'test'])
      expect(relation.markLoad(true) === relation).toBe(true)
      expect(relation.isLoaded()).toBe(true)
      expect(relation.markLoad(false) === relation).toBe(true)
      expect(relation.isLoaded()).toBe(false)
    })
  })

  describe('.markBuild()', function() {
    it('set built status of the relation, and it is chainable', function() {
      const relation: Relation = Reflect.construct(Relation, [{ relations: { test: {} } }, 'test'])
      expect(relation.markBuild(true) === relation).toBe(true)
      expect(relation.isBuilt()).toBe(true)
      expect(relation.markBuild(false) === relation).toBe(true)
      expect(relation.isBuilt()).toBe(false)
    })
  })

  describe('.makeModelOrCollectionFromRecords()', function() {
    it('calls and returns relationDataBucket.makeCollectionFromRecords() if makeCollection is true', function() {
      const relationDataBucket = {
        makeCollectionFromRecords(name: string, records: any[]) {
          return 'anything-' + name + '-' + records.join('-')
        }
      }
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(relation.makeModelOrCollectionFromRecords(<any>relationDataBucket, 'test', true, ['a', 'b'])).toEqual(
        'anything-test-a-b'
      )
    })

    it('returns undefined if makeCollection is false and records is empty', function() {
      const relationDataBucket = {}
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(relation.makeModelOrCollectionFromRecords(<any>relationDataBucket, 'test', false, [])).toBeUndefined()
    })

    it('calls and returns relationDataBucket.makeModelFromRecord() with records[0] if makeCollection is false and records not empty', function() {
      const relationDataBucket = {
        makeModelFromRecord(name: string, record: any) {
          return 'anything-' + name + '-' + record
        }
      }
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(relation.makeModelOrCollectionFromRecords(<any>relationDataBucket, 'test', false, ['a', 'b'])).toEqual(
        'anything-test-a'
      )
    })
  })

  describe('.getDataBucket()', function() {
    it('returns property "relationDataBucket" in this.rootModel', function() {
      const relationDataBucket = {}
      const rootModel = {
        relationDataBucket: relationDataBucket
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.getDataBucket() === relationDataBucket).toBe(true)
    })
  })

  describe('.getModelByName()', function() {
    it('simply uses make() to create new model by model name', function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      expect(relation.getModelByName('Test')).toEqual('anything')
      expect(makeStub.calledWith('Test')).toBe(true)
      makeStub.restore()
    })
  })

  describe('.getKeysInDataBucket()', function() {
    it('returns an empty array if there is no relationDataBucket in rootModel', function() {
      const rootModel = {
        relations: {
          test: {}
        },

        getRelationDataBucket() {
          return undefined
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.getKeysInDataBucket('test', 'attribute')).toEqual([])
    })

    it('calls and returns relationDataBucket.getAttributes() if it is attached to rootModel', function() {
      const relationDataBucket = {
        getAttributes(name: string, attribute: string) {
          return `anything-${name}-${attribute}`
        }
      }
      const rootModel = {
        relations: {
          test: {}
        },

        getRelationDataBucket() {
          return relationDataBucket
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.getKeysInDataBucket('test', 'attribute')).toEqual('anything-test-attribute')
    })
  })

  describe('.getData()', function() {
    it('returns undefined if .isLoaded() returns false', function() {
      const info = {}
      const rootModel = {
        relations: {
          test: info
        }
      }
      const relation: Relation = Reflect.construct(Relation, [rootModel, 'test'])
      expect(relation.getData()).toBeUndefined()
    })

    it('returns .relationData.data if .isLoaded() returns true and .isBuilt() return true', function() {
      const info = {
        isLoaded: true,
        isBuilt: true,
        data: 'anything'
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>{}
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>{}
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      expect(relation.getData()).toEqual('anything')
    })

    it('returns .buildData() if .isLoaded() returns true and .isBuilt() return false', function() {
      const info = {
        isLoaded: true,
        isBuilt: false
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>{}
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>{}
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      expect(relation.getData()).toEqual('build-data')
    })
  })

  describe('.load()', function() {
    it('returns this.relationData.data if .isLoaded() and .isBuilt() returns true', async function() {
      const info = {
        isLoaded: true,
        isBuilt: true,
        data: 'anything'
      }
      const rootModel = {
        relations: {
          test: info
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>{}
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>{}
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      expect(await relation.load()).toEqual('anything')
    })

    it('calls .lazyLoad() if there is no relationDataBucket in rootModel', async function() {
      const rootModel = {
        relations: {
          test: {}
        },

        getRelationDataBucket() {
          return undefined
        },

        isNew() {
          return false
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>'lazyLoad'
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>'eagerLoad'
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      expect(await relation.load()).toEqual('lazyLoad')
    })

    it('throws an Error if there is no relationDataBucket and the rootModel.isNew() returns true', async function() {
      const rootModel = {
        relations: {
          test: {}
        },

        getModelName() {
          return 'Test'
        },

        getRelationDataBucket() {
          return undefined
        },

        isNew() {
          return true
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>'lazyLoad'
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>'eagerLoad'
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      try {
        await relation.load()
      } catch (error) {
        expect(error.message).toEqual('Can not load relation "test" in a new instance of "Test".')
        return
      }
      expect('should not reach this line').toEqual('Hm')
    })

    it('calls .eagerLoad() if there is a relationDataBucket in rootModel', async function() {
      const rootModel = {
        relations: {
          test: {}
        },

        getModelName() {
          return 'Test'
        },

        getRelationDataBucket() {
          return { markRelationLoaded() {} }
        },

        isNew() {
          return false
        }
      }
      class ChildRelation extends Relation {
        getClassName() {
          return 'ChildRelation'
        }

        async lazyLoad<T>(): Promise<T> {
          return <any>'lazyLoad'
        }

        async eagerLoad<T>(): Promise<T> {
          return <any>'eagerLoad'
        }

        buildData<T>(): T | undefined {
          return <any>'build-data'
        }
      }
      const relation: Relation = new ChildRelation(<any>rootModel, 'test')
      expect(await relation.load()).toEqual('eagerLoad')
    })
  })

  describe('.loadChainRelations()', function() {
    it('does nothing and return result (the first param) if loadChain is not found', async function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(await relation.loadChainRelations('test')).toEqual('test')
    })

    it('does nothing and return result (the first param) if loadChain is empty', async function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      relation['loadChain'] = []
      expect(await relation.loadChainRelations('test')).toEqual('test')
    })

    it('does nothing and return result (the first param) if it is null or undefined', async function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      // tslint:disable-next-line
      expect(await relation.loadChainRelations(null)).toBeNull()
      expect(await relation.loadChainRelations(undefined)).toBeUndefined()
    })

    it('does nothing and return result (the first param) if it is not Model or Collection', async function() {
      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      expect(await relation.loadChainRelations(123)).toEqual(123)
      expect(await relation.loadChainRelations('string')).toEqual('string')

      const array: any = []
      expect((await relation.loadChainRelations(array)) === array).toBe(true)

      const object: any = {}
      expect((await relation.loadChainRelations(object)) === object).toBe(true)
    })

    it('calls result.load() and pass loadChain if it is a Model', async function() {
      const isModelStub = Sinon.stub(Helper, 'isModel')
      isModelStub.returns(true)
      const model = {
        load(arg: any) {
          return arg
        }
      }
      const loadSpy = Sinon.spy(model, 'load')

      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      relation['loadChain'] = ['a', 'b']
      expect((await relation.loadChainRelations(model)) === model).toBe(true)
      expect(loadSpy.calledWith(['a', 'b'])).toBe(true)

      isModelStub.restore()
    })

    it('does nothing and return result (the first param) if it is Collection but empty', async function() {
      const isCollectionStub = Sinon.stub(Helper, 'isCollection')
      isCollectionStub.returns(true)
      const model = {
        load(arg: any) {
          return arg
        }
      }
      const collection = {
        isNotEmpty() {
          return false
        },
        first() {
          return model
        }
      }
      const loadSpy = Sinon.spy(model, 'load')

      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      relation['loadChain'] = ['a', 'b']
      expect((await relation.loadChainRelations(collection)) === collection).toBe(true)
      expect(loadSpy.calledWith(['a', 'b'])).toBe(false)

      isCollectionStub.restore()
    })

    it('calls result.first().load() and pass loadChain if result is a Collection and not empty', async function() {
      const isCollectionStub = Sinon.stub(Helper, 'isCollection')
      isCollectionStub.returns(true)
      const model = {
        load(arg: any) {
          return arg
        }
      }
      const collection = {
        isNotEmpty() {
          return true
        },
        first() {
          return model
        }
      }
      const loadSpy = Sinon.spy(model, 'load')

      const relation: Relation = Reflect.construct(Relation, [{}, 'test'])
      relation['loadChain'] = ['a', 'b']
      expect((await relation.loadChainRelations(collection)) === collection).toBe(true)
      expect(loadSpy.calledWith(['a', 'b'])).toBe(true)

      isCollectionStub.restore()
    })
  })
})
