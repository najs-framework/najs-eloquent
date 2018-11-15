import 'jest'
import * as Sinon from 'sinon'
import { TimestampsPublicApi } from '../../../lib/features/mixin/TimestampsPublicApi'

describe('TimestampsPublicApi', function() {
  const timestampsFeature = {
    touch() {
      return 'touch-result'
    }
  }

  const model = {
    driver: {
      getTimestampsFeature() {
        return timestampsFeature
      }
    }
  }

  describe('.touch()', function() {
    it('is chainable, calls TimestampsFeature.touch()', function() {
      const stub = Sinon.stub(timestampsFeature, 'touch')
      stub.returns('anything')

      expect(TimestampsPublicApi.touch.call(model) === model).toBe(true)
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })
})
