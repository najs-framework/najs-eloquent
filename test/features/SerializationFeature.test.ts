import 'jest'
import * as Sinon from 'sinon'
import * as Helpers from '../../lib/util/helpers'
import { FeatureBase } from '../../lib/features/FeatureBase'
import { SerializationFeature } from '../../lib/features/SerializationFeature'
import { SerializationPublicApi } from '../../lib/features/mixin/SerializationPublicApi'
import { SettingFeature } from '../../lib/features/SettingFeature'
import { make_collection } from '../../lib/util/factory'

describe('SerializationFeature', function() {
  const serializationFeature = new SerializationFeature()

  it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.SerializationFeature', function() {
    expect(serializationFeature).toBeInstanceOf(FeatureBase)
    expect(serializationFeature.getClassName()).toEqual('NajsEloquent.Feature.SerializationFeature')
  })

  describe('.attachPublicApi()', function() {
    it('simply assigns all functions in SerializationPublicApi to the prototype', function() {
      const prototype = {}

      serializationFeature.attachPublicApi(prototype, [{}], <any>{})
      for (const name in SerializationPublicApi) {
        expect(prototype[name] === SerializationPublicApi[name]).toBe(true)
      }
    })
  })

  describe('.getFeatureName()', function() {
    it('returns literally string "Serialization"', function() {
      expect(serializationFeature.getFeatureName()).toEqual('Serialization')
    })
  })

  describe('.getVisible()', function() {
    it('returns "visible" property if the overridden.visible flag is true', function() {
      const model: any = {
        visible: 'overridden-value',

        internalData: { overridden: { visible: true } }
      }

      expect(serializationFeature.getVisible(model)).toEqual('overridden-value')
    })

    it('calls and returns SettingFeature.getArrayUniqueSetting() with property "visible", default value []', function() {
      const settingFeature = {
        getArrayUniqueSetting() {
          return 'result'
        }
      }
      const model: any = {
        internalData: {},
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }
      const stub = Sinon.stub(settingFeature, 'getArrayUniqueSetting')
      stub.returns('anything')

      expect(serializationFeature.getVisible(model)).toEqual('anything')
      expect(stub.calledWith(model, 'visible', [])).toBe(true)
    })
  })

  describe('.setVisible()', function() {
    it('simply init internalData.overridden if needed, then visible = true and assigns given value to "visible"', function() {
      const modelOne: any = {
        internalData: {}
      }

      const value: string[] = ['a', 'b', 'c']
      serializationFeature.setVisible(modelOne, value)
      expect(modelOne['internalData']['overridden']['visible']).toBe(true)
      expect(modelOne['visible'] === value).toBe(true)

      const modelTwo: any = {
        internalData: {
          overridden: { visible: false }
        }
      }

      serializationFeature.setVisible(modelTwo, value)
      expect(modelTwo['internalData']['overridden']['visible']).toBe(true)
      expect(modelTwo['visible'] === value).toBe(true)
    })
  })

  describe('.makeVisible()', function() {
    it('gets hidden and does nothing if the hidden is empty and visible is empty', function() {
      const getHiddenStub = Sinon.stub(serializationFeature, 'getHidden')
      const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
      const setHiddenStub = Sinon.stub(serializationFeature, 'setHidden')
      const addVisibleStub = Sinon.stub(serializationFeature, 'addVisible')

      getHiddenStub.returns([])
      getVisibleStub.returns([])

      const model: any = {}
      serializationFeature.makeVisible(model, ['a', ['b'], 'c'])
      expect(setHiddenStub.called).toBe(false)
      expect(addVisibleStub.called).toBe(false)

      getHiddenStub.restore()
      getVisibleStub.restore()
      setHiddenStub.restore()
      addVisibleStub.restore()
    })

    it('gets hidden and remove given keys in hidden, then calls .setHidden() with filtered values', function() {
      const getHiddenStub = Sinon.stub(serializationFeature, 'getHidden')
      const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
      const setHiddenStub = Sinon.stub(serializationFeature, 'setHidden')
      const addVisibleStub = Sinon.stub(serializationFeature, 'addVisible')

      getHiddenStub.returns(['a', 'b', 'c', 'd', 'e', 'f'])
      getVisibleStub.returns([])

      const model: any = {}
      serializationFeature.makeVisible(model, ['a', 'c', ['b', 'a'], 'c'])

      expect(setHiddenStub.calledWith(model, ['d', 'e', 'f'])).toBe(true)
      expect(addVisibleStub.called).toBe(false)

      getHiddenStub.restore()
      getVisibleStub.restore()
      setHiddenStub.restore()
      addVisibleStub.restore()
    })

    it('calls .addVisible() with given keys in case the visible has value', function() {
      const getHiddenStub = Sinon.stub(serializationFeature, 'getHidden')
      const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
      const setHiddenStub = Sinon.stub(serializationFeature, 'setHidden')
      const addVisibleStub = Sinon.stub(serializationFeature, 'addVisible')

      getHiddenStub.returns([])
      getVisibleStub.returns(['test'])

      const model: any = {}
      serializationFeature.makeVisible(model, ['a', 'c', ['b', 'a'], 'c'])

      expect(setHiddenStub.called).toBe(false)
      expect(addVisibleStub.calledWith(model, ['a', 'c', ['b', 'a'], 'c'])).toBe(true)

      getHiddenStub.restore()
      getVisibleStub.restore()
      setHiddenStub.restore()
      addVisibleStub.restore()
    })
  })

  describe('.addVisible()', function() {
    it('calls and returns SettingFeature.pushToUniqueArraySetting() with property "visible" and passed param', function() {
      const settingFeature = {
        pushToUniqueArraySetting() {
          return 'result'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }
      const stub = Sinon.stub(settingFeature, 'pushToUniqueArraySetting')
      stub.returns('anything')

      const keys: any = ['a', ['b', 'c']]
      expect(serializationFeature.addVisible(model, keys)).toEqual('anything')
      expect(stub.calledWith(model, 'visible', keys)).toBe(true)
    })
  })

  describe('.getHidden()', function() {
    it('returns "hidden" property if the overridden.hidden flag is true', function() {
      const model: any = {
        hidden: 'overridden-value',

        internalData: { overridden: { hidden: true } }
      }

      expect(serializationFeature.getHidden(model)).toEqual('overridden-value')
    })

    it('calls and returns SettingFeature.getArrayUniqueSetting() with property "hidden", default value []', function() {
      const settingFeature = {
        getArrayUniqueSetting() {
          return 'result'
        }
      }
      const model: any = {
        internalData: {},
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }
      const stub = Sinon.stub(settingFeature, 'getArrayUniqueSetting')
      stub.returns('anything')

      expect(serializationFeature.getHidden(model)).toEqual('anything')
      expect(stub.calledWith(model, 'hidden', [])).toBe(true)
    })
  })

  describe('.setHidden()', function() {
    it('simply init internalData.overridden if needed, then hidden = true and assigns given value to "hidden"', function() {
      const modelOne: any = {
        internalData: {}
      }

      const value: string[] = ['a', 'b', 'c']
      serializationFeature.setHidden(modelOne, value)
      expect(modelOne['internalData']['overridden']['hidden']).toBe(true)
      expect(modelOne['hidden'] === value).toBe(true)

      const modelTwo: any = {
        internalData: {
          overridden: { hidden: false }
        }
      }

      serializationFeature.setHidden(modelTwo, value)
      expect(modelTwo['internalData']['overridden']['hidden']).toBe(true)
      expect(modelTwo['hidden'] === value).toBe(true)
    })
  })

  describe('.addHidden()', function() {
    it('calls and returns SettingFeature.pushToUniqueArraySetting() with property "hidden" and passed param', function() {
      const settingFeature = {
        pushToUniqueArraySetting() {
          return 'result'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }
      const stub = Sinon.stub(settingFeature, 'pushToUniqueArraySetting')
      stub.returns('anything')

      const keys: any = ['a', ['b', 'c']]
      expect(serializationFeature.addHidden(model, keys)).toEqual('anything')
      expect(stub.calledWith(model, 'hidden', keys)).toBe(true)
    })
  })

  describe('.makeHidden()', function() {
    it('gets visible and not setVisible() if the visible is empty, but it always calls .addHidden() with given keys', function() {
      const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
      const setVisibleStub = Sinon.stub(serializationFeature, 'setVisible')
      const addHiddenStub = Sinon.stub(serializationFeature, 'addHidden')

      getVisibleStub.returns([])

      const model: any = {}
      serializationFeature.makeHidden(model, ['a', ['b'], 'c'])
      expect(setVisibleStub.called).toBe(false)
      expect(addHiddenStub.calledWith(model, ['a', ['b'], 'c'])).toBe(true)

      getVisibleStub.restore()
      setVisibleStub.restore()
      addHiddenStub.restore()
    })

    it('removes the given keys out of visible, then calls .setVisible() to update new one', function() {
      const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
      const setVisibleStub = Sinon.stub(serializationFeature, 'setVisible')
      const addHiddenStub = Sinon.stub(serializationFeature, 'addHidden')

      getVisibleStub.returns(['a', 'b', 'c', 'd', 'e', 'f'])

      const model: any = {}
      serializationFeature.makeHidden(model, ['a', ['b'], 'c'])
      expect(setVisibleStub.calledWith(model, ['d', 'e', 'f'])).toBe(true)
      expect(addHiddenStub.calledWith(model, ['a', ['b'], 'c'])).toBe(true)

      getVisibleStub.restore()
      setVisibleStub.restore()
      addHiddenStub.restore()
    })
  })

  describe('.isVisible()', function() {
    it('calls and returns SettingFeature.isInWhiteList() with params from .getVisible() and .getHidden()', function() {
      const settingFeature = {
        isInWhiteList() {
          return 'result'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }
      const getFillableResult = {}
      const getFillableStub = Sinon.stub(serializationFeature, 'getVisible')
      getFillableStub.returns(getFillableResult)

      const getGuardedResult = {}
      const getGuardedStub = Sinon.stub(serializationFeature, 'getHidden')
      getGuardedStub.returns(getGuardedResult)

      const stub = Sinon.stub(settingFeature, 'isInWhiteList')
      stub.returns('anything')

      const keys: any = ['a', ['b', 'c']]

      expect(serializationFeature.isVisible(model, keys)).toEqual('anything')
      expect(getFillableStub.calledWith(model)).toBe(true)
      expect(getGuardedStub.calledWith(model)).toBe(true)
      expect(stub.calledWith(model, keys, getFillableResult, getGuardedResult)).toBe(true)

      getFillableStub.restore()
      getGuardedStub.restore()
    })
  })

  describe('.isHidden()', function() {
    it('calls and returns SettingFeature.isInBlackList() with params from and .getHidden()', function() {
      const settingFeature = {
        isInBlackList() {
          return 'result'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getSettingFeature() {
              return settingFeature
            }
          }
        }
      }

      const getGuardedResult = {}
      const getGuardedStub = Sinon.stub(serializationFeature, 'getHidden')
      getGuardedStub.returns(getGuardedResult)

      const stub = Sinon.stub(settingFeature, 'isInBlackList')
      stub.returns('anything')

      const keys: any = ['a', ['b', 'c']]

      expect(serializationFeature.isHidden(model, keys)).toEqual('anything')
      expect(getGuardedStub.calledWith(model)).toBe(true)
      expect(stub.calledWith(model, keys, getGuardedResult)).toBe(true)

      getGuardedStub.restore()
    })
  })

  describe('.attributesToObject()', function() {
    it('calls and returns with data from RecordManager.toObject()', function() {
      const data = {}
      const model: any = {
        getDriver() {
          return {
            getRecordManager() {
              return {
                toObject() {
                  return data
                }
              }
            }
          }
        }
      }

      const stub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      stub.returns('anything')

      expect(serializationFeature.attributesToObject(model, false) === data).toBe(true)
      expect(stub.called).toBe(false)
      stub.restore()
    })

    it('calls and returns .applyVisibleAndHiddenFor() with data from RecordManager.toObject()', function() {
      const data = {}
      const model: any = {
        getDriver() {
          return {
            getRecordManager() {
              return {
                toObject() {
                  return data
                }
              }
            }
          }
        }
      }

      const stub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      stub.returns('anything')

      expect(serializationFeature.attributesToObject(model)).toEqual('anything')
      expect(stub.calledWith(model, data)).toBe(true)
      stub.restore()
    })
  })

  describe('.relationDataToObject()', function() {
    it('calls RelationFeature.getEmptyValueForSerializedRelation() if the data is not model or collection', function() {
      const relationFeature: any = {
        getEmptyValueForSerializedRelation() {
          return 'empty-value'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getRelationFeature() {
              return relationFeature
            }
          }
        }
      }

      const spy = Sinon.spy(relationFeature, 'getEmptyValueForSerializedRelation')
      expect(serializationFeature.relationDataToObject(model, 'data', [], 'name', true)).toEqual('empty-value')
      expect(spy.calledWith(model, 'name')).toBe(true)
    })

    it('calls & returns data.toObject() with data, chains and formatName options', function() {
      const serializationFeatureNextModel: any = {
        toObject() {
          return 'anything'
        }
      }
      const model: any = {
        getDriver() {
          return {
            getSerializationFeature() {
              return serializationFeatureNextModel
            }
          }
        }
      }

      const stub = Sinon.stub(Helpers, 'isModel')
      stub.returns(true)
      const spy = Sinon.spy(serializationFeatureNextModel, 'toObject')

      expect(serializationFeature.relationDataToObject({} as any, model, ['chains', 'x', 'y'], 'name', false)).toEqual(
        'anything'
      )
      expect(spy.calledWith(model, { relations: ['chains', 'x', 'y'], formatRelationName: false })).toBe(true)
      stub.restore()
    })

    it('maps item then calls & returns data.toObject() with data, chains and formatName options if the data is collection', function() {
      const serializationFeatureNextModel: any = {
        toObject() {
          return 'anything'
        }
      }
      const model1: any = {
        getDriver() {
          return {
            getSerializationFeature() {
              return serializationFeatureNextModel
            }
          }
        }
      }
      const model2: any = {
        getDriver() {
          return {
            getSerializationFeature() {
              return serializationFeatureNextModel
            }
          }
        }
      }

      const spy = Sinon.spy(serializationFeatureNextModel, 'toObject')

      expect(
        serializationFeature.relationDataToObject(
          {} as any,
          make_collection([model1, model2]),
          ['chains', 'x', 'y'],
          'name',
          false
        )
      ).toEqual(['anything', 'anything'])
      expect(spy.firstCall.calledWith(model1, { relations: ['chains', 'x', 'y'], formatRelationName: false })).toBe(
        true
      )
      expect(spy.secondCall.calledWith(model2, { relations: ['chains', 'x', 'y'], formatRelationName: false })).toBe(
        true
      )
    })
  })

  describe('.relationsToObject()', function() {
    it('calls model.getLoadedRelations() the reduce with .relationDataToObject() if the given names is undefined', function() {
      const relation1 = {
        getName() {
          return 'relation-1'
        },
        getData() {
          return 'relation-1-data'
        },
        getChains() {
          return 'relation-1-chains'
        }
      }
      const relation2 = {
        getName() {
          return 'relation-2'
        },
        getData() {
          return 'relation-2-data'
        },
        getChains() {
          return 'relation-2-chains'
        }
      }

      const model: any = {
        getLoadedRelations() {
          return [relation1, relation2]
        },
        formatAttributeName(name: string) {
          return 'formatted-' + name
        }
      }
      const stub = Sinon.stub(serializationFeature, 'relationDataToObject')
      stub.returns('relation-data')

      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      applyVisibleAndHiddenForStub.returns('applied-result')

      expect(serializationFeature.relationsToObject(model, undefined, false, false)).toEqual({
        'relation-1': 'relation-data',
        'relation-2': 'relation-data'
      })
      expect(stub.firstCall.calledWith(model, 'relation-1-data', 'relation-1-chains', 'relation-1', false)).toBe(true)
      expect(stub.secondCall.calledWith(model, 'relation-2-data', 'relation-2-chains', 'relation-2', false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.called).toBe(false)
      stub.restore()
      applyVisibleAndHiddenForStub.restore()
    })

    it('calls model.getRelations() the reduce with .relationDataToObject() if the given names is not undefined. Case with option formatName = true', function() {
      const relation1 = {
        getName() {
          return 'relation-1'
        },
        getData() {
          return 'relation-1-data'
        },
        getChains() {
          return 'relation-1-chains'
        }
      }
      const relation2 = {
        getName() {
          return 'relation-2'
        },
        getData() {
          return 'relation-2-data'
        },
        getChains() {
          return 'relation-2-chains'
        }
      }

      const model: any = {
        getRelations() {
          return [relation1, relation2]
        },
        formatAttributeName(name: string) {
          return 'formatted-' + name
        }
      }
      const stub = Sinon.stub(serializationFeature, 'relationDataToObject')
      stub.returns('relation-data')

      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      applyVisibleAndHiddenForStub.returns('applied-result')

      const spy = Sinon.spy(model, 'getRelations')

      expect(serializationFeature.relationsToObject(model, ['a', 'b'], true, false)).toEqual({
        'formatted-relation-1': 'relation-data',
        'formatted-relation-2': 'relation-data'
      })
      expect(stub.firstCall.calledWith(model, 'relation-1-data', 'relation-1-chains', 'relation-1', true)).toBe(true)
      expect(stub.secondCall.calledWith(model, 'relation-2-data', 'relation-2-chains', 'relation-2', true)).toBe(true)
      expect(spy.calledWith(['a', 'b'])).toBe(true)
      expect(applyVisibleAndHiddenForStub.called).toBe(false)
      stub.restore()
      applyVisibleAndHiddenForStub.restore()
    })

    it('calls .applyVisibleAndHiddenForStub() with result if needed', function() {
      const relation1 = {
        getName() {
          return 'relation-1'
        },
        getData() {
          return 'relation-1-data'
        },
        getChains() {
          return 'relation-1-chains'
        }
      }
      const relation2 = {
        getName() {
          return 'relation-2'
        },
        getData() {
          return 'relation-2-data'
        },
        getChains() {
          return 'relation-2-chains'
        }
      }

      const model: any = {
        getRelations() {
          return [relation1, relation2]
        },
        formatAttributeName(name: string) {
          return 'formatted-' + name
        }
      }
      const stub = Sinon.stub(serializationFeature, 'relationDataToObject')
      stub.returns('relation-data')

      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      applyVisibleAndHiddenForStub.returns('applied-result')

      const spy = Sinon.spy(model, 'getRelations')

      expect(serializationFeature.relationsToObject(model, ['a', 'b'], true)).toEqual('applied-result')
      expect(stub.firstCall.calledWith(model, 'relation-1-data', 'relation-1-chains', 'relation-1', true)).toBe(true)
      expect(stub.secondCall.calledWith(model, 'relation-2-data', 'relation-2-chains', 'relation-2', true)).toBe(true)
      expect(spy.calledWith(['a', 'b'])).toBe(true)
      expect(
        applyVisibleAndHiddenForStub.calledWith({
          'formatted-relation-1': 'relation-data',
          'formatted-relation-2': 'relation-data'
        })
      ).toBe(false)
      stub.restore()
      applyVisibleAndHiddenForStub.restore()
    })
  })

  describe('.applyVisibleAndHiddenFor()', function() {
    const dataset = [
      {
        data: { a: 1, b: 2, c: 3, d: 4 },
        visible: [],
        hidden: [],
        result: { a: 1, b: 2, c: 3, d: 4 }
      },
      {
        data: { a: 1, b: 2, c: 3, d: 4 },
        visible: [],
        hidden: ['a'],
        result: { b: 2, c: 3, d: 4 }
      },
      {
        data: { a: 1, b: 2, c: 3, d: 4 },
        visible: ['a', 'b'],
        hidden: [],
        result: { a: 1, b: 2 }
      },
      {
        data: { a: 1, b: 2, c: 3, d: 4 },
        visible: ['a', 'c'],
        hidden: ['b'],
        result: { a: 1, c: 3 }
      }
    ]

    for (const item of dataset) {
      it('filters data if the attribute name matches SettingFeature.isKeyInWhiteList()', function() {
        const model: any = {
          getDriver() {
            return {
              getSettingFeature() {
                return new SettingFeature()
              },
              getRecordManager() {
                return {
                  getKnownAttributes() {
                    return []
                  }
                }
              }
            }
          }
        }

        const getVisibleResult = item.visible
        const getVisibleStub = Sinon.stub(serializationFeature, 'getVisible')
        getVisibleStub.returns(getVisibleResult)

        const getHiddenResult = item.hidden
        const getHiddenStub = Sinon.stub(serializationFeature, 'getHidden')
        getHiddenStub.returns(getHiddenResult)

        expect(serializationFeature.applyVisibleAndHiddenFor(model, item.data)).toEqual(item.result)

        getVisibleStub.restore()
        getHiddenStub.restore()
      })
    }
  })

  describe('.toObject()', function() {
    it('calls .attributesToObject() & .relationsToObject() with option shouldApplyVisibleAndHidden = false then merges together', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      applyVisibleAndHiddenForStub.returns('anything')

      const model: any = {}
      expect(serializationFeature.toObject(model)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, undefined, true, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1, b: 2 })).toBe(true)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('does the same behavior as default options if "relations" = true', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      const options = {
        relations: true
      }
      applyVisibleAndHiddenForStub.returns('anything')

      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, undefined, true, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1, b: 2 })).toBe(true)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('passes option "formatRelationName" to relationsToObject()', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      const options = {
        relations: ['a', 'b'],
        formatRelationName: false
      }
      applyVisibleAndHiddenForStub.returns('anything')

      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, ['a', 'b'], false, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1, b: 2 })).toBe(true)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('does not calls .relationsToObject() if options "relations" = false', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      applyVisibleAndHiddenForStub.returns('anything')

      const options = {
        relations: false
      }
      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.called).toBe(false)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1 })).toBe(true)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('does not calls .applyVisibleAndHiddenFor() if options "applyVisibleAndHidden" = false', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      applyVisibleAndHiddenForStub.returns('anything')

      const options = {
        applyVisibleAndHidden: false
      }
      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual({ a: 1, b: 2 })
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, undefined, true, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.called).toBe(false)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('calls .makeHidden() and pass option "hidden" if exists', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      const options = {
        hidden: ['a', 'b']
      }
      applyVisibleAndHiddenForStub.returns('anything')

      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, undefined, true, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1, b: 2 })).toBe(true)
      expect(makeHiddenForStub.calledWith(model, ['a', 'b'])).toBe(true)
      expect(makeVisibleForStub.called).toBe(false)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })

    it('calls .makeVisible() and pass option "visible" if exists', function() {
      const attributesToObjectStub = Sinon.stub(serializationFeature, 'attributesToObject')
      const relationsToObjectStub = Sinon.stub(serializationFeature, 'relationsToObject')
      const applyVisibleAndHiddenForStub = Sinon.stub(serializationFeature, 'applyVisibleAndHiddenFor')
      const makeHiddenForStub = Sinon.stub(serializationFeature, 'makeHidden')
      const makeVisibleForStub = Sinon.stub(serializationFeature, 'makeVisible')

      attributesToObjectStub.returns({ a: 1 })
      relationsToObjectStub.returns({ b: 2 })

      const options = {
        visible: ['a', 'b']
      }
      applyVisibleAndHiddenForStub.returns('anything')

      const model: any = {}
      expect(serializationFeature.toObject(model, options)).toEqual('anything')
      expect(attributesToObjectStub.calledWith(model, false)).toBe(true)
      expect(relationsToObjectStub.calledWith(model, undefined, true, false)).toBe(true)
      expect(applyVisibleAndHiddenForStub.calledWith(model, { a: 1, b: 2 })).toBe(true)
      expect(makeHiddenForStub.called).toBe(false)
      expect(makeVisibleForStub.calledWith(model, ['a', 'b'])).toBe(true)
      attributesToObjectStub.restore()
      relationsToObjectStub.restore()
      applyVisibleAndHiddenForStub.restore()
      makeHiddenForStub.restore()
      makeVisibleForStub.restore()
    })
  })

  describe('.toJson()', function() {
    it('simply calls JSON.stringify() with the given model instance', function() {
      const stub = Sinon.stub(JSON, 'stringify')
      stub.returns('anything')

      const model: any = {
        toJSON() {
          return 'test'
        }
      }
      expect(serializationFeature.toJson(model, 'replacer' as any, 'space')).toEqual('anything')
      expect(stub.calledWith(model, 'replacer', 'space')).toBe(true)

      stub.restore()
    })
  })
})
