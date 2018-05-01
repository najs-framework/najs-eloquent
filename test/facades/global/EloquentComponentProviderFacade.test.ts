import 'jest'
import '../../../lib/providers/ComponentProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { EloquentComponentProviderFacade } from '../../../lib/facades/global/EloquentComponentProviderFacade'

describe('EloquentComponentProviderFacade', function() {
  it('calls make() to create new instance of ComponentProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    EloquentComponentProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.ComponentProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
