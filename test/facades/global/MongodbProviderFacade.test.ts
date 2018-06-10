import 'jest'
import '../../../lib/providers/MongodbProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { MongodbProviderFacade } from '../../../lib/facades/global/MongodbProviderFacade'

describe('MongodbProviderFacade', function() {
  it('calls make() to create new instance of MongodbProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    MongodbProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.MongodbProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
