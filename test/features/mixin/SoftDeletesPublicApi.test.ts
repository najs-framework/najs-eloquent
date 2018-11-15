import 'jest'
import * as Sinon from 'sinon'
import { SoftDeletesPublicApi } from '../../../lib/features/mixin/SoftDeletesPublicApi'

describe('SoftDeletesPublicApi', function() {
  const softDeletesFeature = {
    trashed() {
      return 'touch-result'
    },
    forceDelete() {
      return 'touch-result'
    },
    restore() {
      return 'touch-result'
    }
  }

  const model = {
    driver: {
      getSoftDeletesFeature() {
        return softDeletesFeature
      }
    }
  }

  describe('.trashed()', function() {
    it('calls and returns SoftDeletesFeature.trashed()', function() {
      const stub = Sinon.stub(softDeletesFeature, 'trashed')
      stub.returns('anything')

      expect(SoftDeletesPublicApi.trashed.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.forceDelete()', function() {
    it('calls and returns SoftDeletesFeature.forceDelete()', function() {
      const stub = Sinon.stub(softDeletesFeature, 'forceDelete')
      stub.returns('anything')

      expect(SoftDeletesPublicApi.forceDelete.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })

  describe('.restore()', function() {
    it('calls and returns SoftDeletesFeature.restore()', function() {
      const stub = Sinon.stub(softDeletesFeature, 'restore')
      stub.returns('anything')

      expect(SoftDeletesPublicApi.restore.call(model)).toEqual('anything')
      expect(stub.calledWith(model)).toBe(true)
      stub.restore()
    })
  })
})
