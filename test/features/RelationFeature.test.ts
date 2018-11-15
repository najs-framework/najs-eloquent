import 'jest'
import * as Sinon from 'sinon'
import { FeatureBase } from '../../lib/features/FeatureBase'
import { RelationFeature } from '../../lib/features/RelationFeature'
import { RelationDataBucket } from '../../lib/relations/RelationDataBucket'
import { RelationPublicApi } from '../../lib/features/mixin/RelationPublicApi'
import { RelationData } from '../../lib/relations/RelationData'
import { RelationUtilities } from '../../lib/relations/RelationUtilities'
import { RelationshipFactory } from '../../lib/relations/RelationshipFactory'
import { RelationNotDefinedError } from '../../lib/errors/RelationNotDefinedError'
import { RelationDefinitionFinder } from '../../lib/relations/RelationDefinitionFinder'
import { RecordDataReader } from '../../lib/drivers/RecordDataReader'

describe('RelationFeature', function() {
  const feature = new RelationFeature()

  it('extends FeatureBase and implements Autoload under name "NajsEloquent.Feature.RelationFeature"', function() {
    expect(feature).toBeInstanceOf(FeatureBase)
    expect(feature.getClassName()).toEqual('NajsEloquent.Feature.RelationFeature')
  })

  describe('.getFeatureName()', function() {
    it('returns literally string "Relation"', function() {
      expect(feature.getFeatureName()).toEqual('Relation')
    })
  })

  describe('.getPublicApi()', function() {
    it('returns an RelationPublicApi object', function() {
      expect(feature.getPublicApi() === RelationPublicApi).toBe(true)
    })
  })

  describe('.makeDataBucket()', function() {
    it('simply returns an instance of RelationDataBucket', function() {
      const model: any = {}
      expect(feature.makeDataBucket(model)).toBeInstanceOf(RelationDataBucket)
    })
  })

  describe('.makeFactory()', function() {
    it('makes and returns an instance of RelationshipFactory', function() {
      const model: any = {}
      const factory = feature.makeFactory(model, 'test')
      expect(factory).toBeInstanceOf(RelationshipFactory)
      expect(factory['rootModel'] === model).toBe(true)
      expect(factory['name'] === 'test').toBe(true)
    })
  })

  describe('.getDataBucket()', function() {
    it('simply returns an property "relationDataBucket" of model', function() {
      const relationDataBucket = {}
      const model: any = {
        internalData: {
          relationDataBucket: relationDataBucket
        }
      }
      expect(feature.getDataBucket(model) === relationDataBucket).toBe(true)
    })
  })

  describe('.setDataBucket()', function() {
    it('simply sets an property "relationDataBucket" of model', function() {
      const relationDataBucket: any = {}
      const model: any = {
        internalData: {}
      }

      feature.setDataBucket(model, relationDataBucket)
      expect(model.internalData.relationDataBucket === relationDataBucket).toBe(true)
    })
  })

  describe('.createKeyForDataBucket()', function() {
    it('returns a record name of the Record via .getRecordName()', function() {
      const model: any = {
        getDriver() {
          return {
            getRecordManager() {
              return {
                getRecordName() {
                  return 'anything'
                }
              }
            }
          }
        }
      }

      expect(feature.createKeyForDataBucket(model)).toEqual('anything')
    })
  })

  describe('.getDataReaderForDataBucket()', function() {
    it('returns RecordDataReader', function() {
      expect(feature.getDataReaderForDataBucket() === RecordDataReader).toBe(true)
    })
  })

  describe('.getRawDataForDataBucket()', function() {
    it('returns a record instance via .getRecord()', function() {
      const model: any = {
        getDriver() {
          return {
            getRecordManager() {
              return {
                getRecord() {
                  return 'anything'
                }
              }
            }
          }
        }
      }

      expect(feature.getRawDataForDataBucket(model)).toEqual('anything')
    })
  })

  describe('.getEmptyValueForRelationshipForeignKey()', function() {
    it('returns null by default', function() {
      const model: any = {}
      expect(feature.getEmptyValueForRelationshipForeignKey(model, 'test')).toBeNull()
    })
  })

  describe('.getEmptyValueForSerializedRelation()', function() {
    it('returns null by default', function() {
      const model: any = {}
      expect(feature.getEmptyValueForSerializedRelation(model, 'test')).toBeNull()
    })
  })

  describe('.getDefinitions()', function() {
    it('simply returns an property sharedMetadata."relationDefinitions" of model', function() {
      const relationDefinitions = {}
      const model: any = {
        sharedMetadata: {
          relationDefinitions: relationDefinitions
        }
      }
      expect(feature.getDefinitions(model) === relationDefinitions).toBe(true)
    })
  })

  describe('.buildDefinitions()', function() {
    it('creates an instance of RelationDefinitionFinder then calls .getDefinitions()', function() {
      const model: any = {}
      const prototype: any = {}
      const bases: any = []
      const stub = Sinon.stub(RelationDefinitionFinder.prototype, 'getDefinitions')
      stub.returns('anything')

      expect(feature.buildDefinitions(model, prototype, bases)).toEqual('anything')
      stub.restore()
    })
  })

  describe('.findByName()', function() {
    it('throws a RelationNotDefinedError if the relationDefinitions of model is not found', function() {
      const model: any = {
        getModelName() {
          return 'Test'
        }
      }

      try {
        feature.findByName(model, 'any')
      } catch (error) {
        expect(error).toBeInstanceOf(RelationNotDefinedError)
        expect(error.message).toEqual('Relation any is not defined in model Test.')
        return
      }
      expect('should not reach here').toEqual('hm')
    })

    it('throws a RelationNotDefinedError if the name is not found in sharedMetadata.relationDefinitions', function() {
      const model: any = {
        sharedMetadata: {
          relationDefinitions: {
            test: true
          }
        },

        getModelName() {
          return 'Test'
        }
      }

      try {
        feature.findByName(model, 'any')
      } catch (error) {
        expect(error).toBeInstanceOf(RelationNotDefinedError)
        expect(error.message).toEqual('Relation any is not defined in model Test.')
        return
      }
      expect('should not reach here').toEqual('hm')
    })

    it('gets definitions in relationDefinition, then trigger the target type "getter"', function() {
      const relation: any = {}
      const model: any = {
        sharedMetadata: {
          relationDefinitions: {
            test: {
              accessor: 'test',
              target: 'relation',
              targetType: 'getter'
            }
          }
        },

        get relation() {
          return relation
        }
      }

      expect(feature.findByName(model, 'test') === relation).toBe(true)
    })

    it('gets definitions in relationDefinition, then trigger the target type "function"', function() {
      const relation: any = {}
      const model: any = {
        sharedMetadata: {
          relationDefinitions: {
            test: {
              accessor: 'test',
              target: 'getRelation',
              targetType: 'function'
            }
          }
        },

        getRelation() {
          return relation
        }
      }

      expect(feature.findByName(model, 'test') === relation).toBe(true)
    })

    it('splits input by dot, and find the relation by first part, then passes the rest to relation.with()', function() {
      const relation: any = {
        with() {}
      }
      const model: any = {
        sharedMetadata: {
          relationDefinitions: {
            test: {
              accessor: 'test',
              target: 'getRelation',
              targetType: 'function'
            }
          }
        },

        getRelation() {
          return relation
        }
      }

      const withSpy = Sinon.spy(relation, 'with')
      expect(feature.findByName(model, 'test.a.b') === relation).toBe(true)
      expect(withSpy.calledWith('a.b')).toBe(true)
    })
  })

  describe('.findDataByName()', function() {
    it('returns an instance if given name is found in "relations" property', function() {
      const data = {}
      const model: any = {
        internalData: {
          relations: {
            test: data
          }
        }
      }

      expect(feature.findDataByName(model, 'test') === data).toBe(true)
    })

    it('create an instance of RelationData, then call defineAccessor if name not found in "relations"', function() {
      const model: any = {
        internalData: {
          relations: {}
        }
      }
      const makeFactorySpy = Sinon.spy(feature, 'makeFactory')
      const defineAccessorSpy = Sinon.spy(feature, 'defineAccessor')

      expect(feature.findDataByName(model, 'test')).toBeInstanceOf(RelationData)
      expect(makeFactorySpy.calledWith(model, 'test')).toBe(true)
      expect(defineAccessorSpy.calledWith(model, 'test')).toBe(true)
      makeFactorySpy.restore()
      defineAccessorSpy.restore()
    })
  })

  describe('.isLoadedRelation()', function() {
    it('calls and returns this.findByName().isLoaded()', function() {
      const relation = {
        isLoaded() {
          return 'anything'
        }
      }
      const stub = Sinon.stub(feature, 'findByName')
      stub.returns(relation)

      const model: any = {}
      expect(feature.isLoadedRelation(model, 'test')).toEqual('anything')
      expect(stub.calledWith(model, 'test')).toBe(true)
      stub.restore()
    })
  })

  describe('.getLoadedRelations()', function() {
    it('get the definition via .getDefinitions(), then loops and returns the loaded relations only and calls RelationUtilities.bundleRelations() to group the relations', function() {
      const definitions = {
        a: {},
        b: {},
        c: {}
      }
      const loadedRelation = {
        isLoaded() {
          return true
        }
      }
      const unloadedRelation = {
        isLoaded() {
          return false
        }
      }
      const stub = Sinon.stub(feature, 'findByName')
      stub.callsFake(function(model: any, name: string) {
        if (name === 'a' || name === 'c') {
          return loadedRelation
        }
        return unloadedRelation
      })

      const model: any = {
        sharedMetadata: {
          relationDefinitions: definitions
        }
      }

      const bundleRelationsStub = Sinon.stub(RelationUtilities, 'bundleRelations')
      bundleRelationsStub.returns('anything')

      expect(feature.getLoadedRelations(model)).toEqual('anything')
      expect(bundleRelationsStub.calledWith([loadedRelation, loadedRelation])).toBe(true)
      expect(stub.calledWith('test'))
      bundleRelationsStub.restore()
      stub.restore()
    })
  })

  describe('.defineAccessor()', function() {
    it('does nothing if the accessor already defined in prototype', function() {
      class A {
        get test() {
          return 'anything'
        }
      }
      const model: any = new A()
      feature.defineAccessor(model, 'test')
      expect(model.test).toEqual('anything')
    })

    it('defines an accessor which call this.getRelation(accessor).getData() in model prototype', function() {
      class B {
        getRelation(name: string) {
          return {
            getData() {
              return name + '-data'
            }
          }
        }
      }
      const model: any = new B()
      feature.defineAccessor(model, 'test')
      expect(model.test).toEqual('test-data')
      expect(model['not-found']).toBeUndefined()
    })
  })
})
