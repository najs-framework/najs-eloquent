import 'jest'
import * as Sinon from 'sinon'
import { FeatureBase } from '../../lib/features/FeatureBase'
import { EventFeature } from '../../lib/features/EventFeature'
import { EventPublicApi } from '../../lib/features/mixin/EventPublicApi'

describe('EventFeature', function() {
  const eventFeature = new EventFeature()

  it('extends FeatureBase, implements Najs.Contracts.Autoload under name NajsEloquent.Feature.EventFeature', function() {
    expect(eventFeature).toBeInstanceOf(FeatureBase)
    expect(eventFeature.getClassName()).toEqual('NajsEloquent.Feature.EventFeature')
  })

  describe('.attachPublicApi()', function() {
    it('simply assigns all functions in EventPublicApi to the prototype', function() {
      const prototype = {}

      eventFeature.attachPublicApi(prototype, [{}], <any>{})
      for (const name in EventPublicApi) {
        expect(prototype[name] === EventPublicApi[name]).toBe(true)
      }
    })
  })

  describe('.getFeatureName()', function() {
    it('returns literally string "Event"', function() {
      expect(eventFeature.getFeatureName()).toEqual('Event')
    })
  })

  describe('.fire()', function() {
    it('calls .getEventEmitter().emit() and wait for it finished, then calls and return globalEventEmitter', async function() {
      const eventEmitter = {
        emit() {
          return new Promise(function(resolve: any) {
            resolve('local')
          })
        }
      }
      const globalEventEmitter = {
        emit() {
          return new Promise(function(resolve: any) {
            resolve('global')
          })
        }
      }
      const localEmitSpy = Sinon.spy(eventEmitter, 'emit')
      const globalEmitSpy = Sinon.spy(globalEventEmitter, 'emit')

      const getEventEmitterStub = Sinon.stub(eventFeature, 'getEventEmitter')
      getEventEmitterStub.returns(eventEmitter)

      const getGlobalEventEmitterStub = Sinon.stub(eventFeature, 'getGlobalEventEmitter')
      getGlobalEventEmitterStub.returns(globalEventEmitter)

      const model: any = {}
      expect(await eventFeature.fire(model, 'test', 'args')).toEqual('global')

      expect(getEventEmitterStub.calledWith(model)).toBe(true)
      expect(getGlobalEventEmitterStub.calledWith(model)).toBe(true)
      expect(localEmitSpy.calledWith('test', 'args')).toBe(true)
      expect(globalEmitSpy.calledWith('test', model, 'args')).toBe(true)

      getEventEmitterStub.restore()
      getGlobalEventEmitterStub.restore()
    })
  })

  describe('.getEventEmitter()', function() {
    it('initialize property model.eventEmitter if not exists then returns it', function() {
      const model: any = {
        internalData: {}
      }

      const eventEmitter = eventFeature.getEventEmitter(model)

      expect(eventEmitter === model.internalData['eventEmitter']).toBe(true)
      expect(eventEmitter === eventFeature.getEventEmitter(model)).toBe(true)
    })
  })

  describe('.getGlobalEventEmitter()', function() {
    it('simply calls and returns driver.getGlobalEventEmitter()', function() {
      const globalEventEmitter = {}
      const model: any = {
        getDriver() {
          return {
            getGlobalEventEmitter() {
              return globalEventEmitter
            }
          }
        }
      }

      expect(eventFeature.getGlobalEventEmitter(model) === globalEventEmitter).toBe(true)
    })
  })
})
