import 'jest'
import '../../../lib/providers/MomentProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { MomentProviderFacade } from '../../../lib/facades/global/MomentProviderFacade'

describe('MomentProviderFacade', function() {
  it('calls make() to create new instance of MomentFacade as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    MomentProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.MomentProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
