import 'jest'
import '../../../lib/providers/BuiltinMongooseProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquentClass } from '../../../lib/constants'
import { MongooseProviderFacade } from '../../../lib/facades/global/MongooseProviderFacade'

describe('MongooseProviderFacade', function() {
  it('calls make() to create new instance of BuiltinMongooseProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    MongooseProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquentClass.MongooseProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
