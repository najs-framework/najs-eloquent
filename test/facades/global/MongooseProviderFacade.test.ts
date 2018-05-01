import 'jest'
import '../../../lib/providers/MongooseProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { MongooseProviderFacade } from '../../../lib/facades/global/MongooseProviderFacade'
import { Schema } from 'mongoose'

describe('MongooseProviderFacade', function() {
  it('calls make() to create new instance of MongooseProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    MongooseProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.MongooseProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })

  describe('.getMongooseInstance()', function() {
    it('returns mongoose instance', function() {
      MongooseProviderFacade.getMongooseInstance()
      MongooseProviderFacade.createModelFromSchema('Test', new Schema({}))
    })
  })
})
