import 'jest'
import '../../../lib/providers/KnexProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { KnexProviderFacade } from '../../../lib/facades/global/KnexProviderFacade'

describe('KnexProviderFacade', function() {
  it('calls make() to create new instance of KnexProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    KnexProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.KnexProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
