import 'jest'
import { FillableFeature } from '../../lib/features/FillableFeature'
import { FeatureBase } from '../../lib/features/FeatureBase'

describe('FeatureBase', function() {
  const featureInstance = new FillableFeature()

  describe('.attachPublicApi()', function() {
    it('assigns to prototype the object get from .getPublicApi()', function() {
      const publicApi = {
        a() {},
        b() {},
        c() {}
      }

      class Any extends FeatureBase {
        getPublicApi() {
          return publicApi
        }
      }
      const instance = new Any()
      const prototype = {}
      instance.attachPublicApi(prototype, [], <any>{})
      for (const name in publicApi) {
        expect(prototype[name] === publicApi[name]).toBe(true)
      }
    })
  })

  describe('.useInternalOf()', function() {
    it('is an helper just returns a definition with internal property/methods', function() {
      const model: any = {}

      expect(featureInstance.useInternalOf(model) === model).toBe(true)
    })
  })

  describe('.useSettingFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns SettingFeature from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getSettingFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useSettingFeatureOf(model) === feature).toBe(true)
    })
  })

  describe('.useRecordManagerOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getRecordManager() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useRecordManagerOf(model) === feature).toBe(true)
    })
  })

  describe('.useFillableFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getFillableFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useFillableFeatureOf(model) === feature).toBe(true)
    })
  })

  describe('.useSerializationFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getSerializationFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useSerializationFeatureOf(model) === feature).toBe(true)
    })
  })

  describe('.useTimestampsFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getTimestampsFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useTimestampsFeatureOf(model) === feature).toBe(true)
    })
  })

  describe('.useSoftDeletesFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getSoftDeletesFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useSoftDeletesFeatureOf(model) === feature).toBe(true)
    })
  })

  describe('.useRelationFeatureOf()', function() {
    it('is an helper to reduce repetition code. It returns RecordManager from a driver', function() {
      const feature = {}
      const model: any = {
        getDriver() {
          return {
            getRelationFeature() {
              return feature
            }
          }
        }
      }

      expect(featureInstance.useRelationFeatureOf(model) === feature).toBe(true)
    })
  })
})
