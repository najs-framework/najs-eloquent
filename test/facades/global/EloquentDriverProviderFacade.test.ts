import 'jest'
import '../../../lib/providers/DriverProvider'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { EloquentDriverProviderFacade } from '../../../lib/facades/global/EloquentDriverProviderFacade'

describe('EloquentDriverProviderFacade', function() {
  it('calls make() to create new instance of DriverProvider as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    EloquentDriverProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.DriverProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
